"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Usuario {
  id: number;
  nombre: string;
}

interface Clase {
  id: number;
  nombre: string;
}

interface NuevoHorarioDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (nuevoHorario: {
    idUsuario: number;
    idClase: number;
    fechaHora: string;
  }) => void;
}

const formSchema = z
  .object({
    fecha: z
      .string()
      .min(1, "La fecha es obligatoria")
      .refine((value) => {
        const today = new Date();
        const selectedDate = new Date(value);
        return selectedDate >= new Date(today.toDateString());
      }, {
        message: "La fecha no puede ser anterior a hoy",
      }),
    hora: z.string().min(1, "La hora es obligatoria"),
    idUsuario: z.string().min(1, "Selecciona un entrenador"),
    idClase: z.string().min(1, "Selecciona una clase"),
  })
  .refine(({ fecha, hora }) => {
    const today = new Date();
    const selectedDate = new Date(fecha);
    const selectedDateIsToday =
      selectedDate.toDateString() === today.toDateString();

    if (!selectedDateIsToday) return true; // Si no es hoy, no validamos hora

    // Si es hoy, validamos que la hora sea futura
    const [h, m] = hora.split(":").map(Number);
    const selectedDateTime = new Date(fecha);
    selectedDateTime.setHours(h, m, 0, 0);

    return selectedDateTime > today;
  }, {
    message: "La hora debe ser futura si la fecha es hoy",
    path: ["hora"], // Aplica el error al campo 'hora'
  });

export default function NuevoHorarioDialog({
  open,
  onClose,
  onCreate,
}: NuevoHorarioDialogProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: "",
      hora: "",
      idUsuario: "",
      idClase: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      try {
        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
        const token = parsedUser?.token;
        if (!token) alert("No token found");

        const URL = process.env.NEXT_PUBLIC_API;

        const [entrenadoresRes, clasesRes] = await Promise.all([
          fetch(`${URL}/entrenador/getEntrenadores`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${URL}/entrenador/getClases`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!entrenadoresRes.ok || !clasesRes.ok) {
          alert("Error al obtener datos");
        }

        const entrenadoresData = await entrenadoresRes.json();
        const clasesData = await clasesRes.json();

        setUsuarios(entrenadoresData || []);
        setClases(clasesData || []);
      } catch (err) {
        console.error("Error al cargar entrenadores o clases", err);
        toast.error("No se pudo cargar la información necesaria");
      }
    }

    fetchData();
  }, [open]);

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const fechaHora = `${values.fecha}T${values.hora}:00`;

    onCreate({
      idUsuario: parseInt(values.idUsuario),
      idClase: parseInt(values.idClase),
      fechaHora,
    });

    const localUser = localStorage.getItem("user");
    const parsedUser = localUser ? JSON.parse(localUser) : null;
    const token = parsedUser?.token;

    const params = new URLSearchParams({
      idEntrenador: values.idUsuario,
      idClase: values.idClase,
      fechaHora,
    }).toString();

    fetch(`${process.env.NEXT_PUBLIC_API}/entrenador/crearHorario?${params}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          toast.error("Error al crear el horario");
        }
      })
      .catch((error) => {
        console.error("Error al crear el horario:", error);
        toast.error("No se pudo crear el horario");
      });

      onCreate({
        idUsuario: parseInt(values.idUsuario),
        idClase: parseInt(values.idClase),
        fechaHora,
      });

    toast.success("Horario creado exitosamente");
    form.reset();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
          form.reset();
        }
      }}
    >
      <DialogContent className="max-w-lg rounded-xl bg-white shadow-lg p-8 animate-fadeIn">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-800">
            Crear Nuevo Horario
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-6"
          >
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Fecha
                  </FormLabel>
                  <FormControl>
                    <Input
                      min={new Date().toISOString().split("T")[0]}
                      type="date"
                      {...field}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Hora
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idClase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Clase
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Selecciona una clase</option>
                      {clases.map((clase) => (
                        <option key={clase.id} value={clase.id}>
                          {clase.nombre}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idUsuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Entrenador
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Selecciona un entrenador</option>
                      {usuarios.map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.nombre}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex justify-end gap-4">
              <DialogClose
                type="button"
                className="px-6 py-3 rounded-full bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition  cursor-pointer"
              >
                Cancelar
              </DialogClose>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Crear
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
