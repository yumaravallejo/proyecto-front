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

interface Entrenador {
  id: number;
  nombre: string;
}

interface EditarHorarioProps {
  open: boolean;
  onClose: () => void;
  horario: {
    idHorario: number;
    fechaHora: string;
    idEntrenador: number;
    nombreEntrenador: string;
  } | null;
  onSave: (
    idHorario: number,
    cambios: { fechaHora?: string; idEntrenador?: number }
  ) => void;
}

const formSchema = z.object({
  fecha: z.string().min(1, "La fecha es obligatoria"),
  hora: z.string().min(1, "La hora es obligatoria"),
  idEntrenador: z.string().min(1, "Selecciona un entrenador"),
});

export default function EditarHorario({
  open,
  onClose,
  horario,
  onSave,
}: EditarHorarioProps) {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: "",
      hora: "",
      idEntrenador: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    async function fetchEntrenadores() {
      try {
        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
        const token = parsedUser?.token;
        if (!token) throw new Error("No token found");

        const URL = process.env.NEXT_PUBLIC_API;

        const res = await fetch(`${URL}entrenador/getEntrenadores`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener entrenadores");

        const data = await res.json();
        setEntrenadores(data.body || []);
      } catch (error) {
        console.error("Error fetching entrenadores:", error);
        toast.error("No se pudo cargar la lista de entrenadores");
      }
    }

    fetchEntrenadores();
  }, [open]);

  // Setear valores cuando cambia el horario
  useEffect(() => {
    if (horario) {
      const dateObj = new Date(horario.fechaHora);
      form.reset({
        fecha: dateObj.toISOString().slice(0, 10),
        hora: dateObj.toTimeString().slice(0, 5),
        idEntrenador: horario.idEntrenador.toString(),
      });
    }
  }, [horario, form]);

  if (!open || !horario) return null;

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const cambios = {
      fechaHora: `${values.fecha}T${values.hora}:00`,
      idEntrenador: parseInt(values.idEntrenador),
    };
    if (horario) {
      onSave(horario.idHorario, cambios);
      toast.success("Horario actualizado");
      onClose();
    }
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
            Editar Horario
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
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
              name="idEntrenador"
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
                      {entrenadores.map((ent) => (
                        <option key={ent.id} value={ent.id.toString()}>
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
                className="px-6 py-3 rounded-full bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition cursor-pointer"
              >
                Cancelar
              </DialogClose>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Guardar
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
