"use client";

import React, { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Evento {
  id: number;
  nombre: string;
  detallesEvento: string;
  fechaInicio: string;
  fechaFin?: string | null;
}

interface EditarEventoProps {
  open: boolean;
  onClose: () => void;
  evento: Evento | null;
  recargarEventos: () => void;
}

const formSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    detallesEvento: z.string().optional(),
    fechaInicio: z
      .string()
      .min(1, "La fecha y hora de inicio es obligatoria")
      .refine(
        (value) => !isNaN(new Date(value).getTime()),
        "Fecha de inicio inválida"
      ),
    fechaFin: z
      .string()
      .optional()
      .refine(
        (value) => !value || !isNaN(new Date(value).getTime()),
        "Fecha de fin inválida"
      ),
  })
  .refine(
    ({ fechaInicio, fechaFin }) => {
      if (!fechaFin) return true;
      return new Date(fechaFin) >= new Date(fechaInicio);
    },
    {
      message: "La fecha de fin debe ser igual o posterior a la fecha de inicio",
      path: ["fechaFin"],
    }
  );

export default function EditarEvento({
  open,
  onClose,
  evento,
  recargarEventos,
}: EditarEventoProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      detallesEvento: "",
      fechaInicio: "",
      fechaFin: "",
    },
  });

  // Cuando cambia el evento o se abre el modal, setea valores en el formulario
  useEffect(() => {
    if (evento && open) {
      form.reset({
        nombre: evento.nombre,
        detallesEvento: evento.detallesEvento || "",
        fechaInicio: evento.fechaInicio
          ? formatoFechaParaInput(evento.fechaInicio)
          : "",
        fechaFin: evento.fechaFin
          ? formatoFechaParaInput(evento.fechaFin)
          : "",
      });
    }
  }, [evento, open]);

  // Helper para formatear fecha ISO a formato datetime-local (YYYY-MM-DDTHH:mm)
  function formatoFechaParaInput(fechaISO: string) {
    const dt = new Date(fechaISO);
    const offset = dt.getTimezoneOffset();
    const dtLocal = new Date(dt.getTime() - offset * 60 * 1000); // Ajusta a local
    return dtLocal.toISOString().slice(0, 16);
  }

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!evento) return;

    const localUser = localStorage.getItem("user");
    const parsedUser = localUser ? JSON.parse(localUser) : null;
    const token = parsedUser?.token;

    fetch(`${process.env.NEXT_PUBLIC_API}entrenador/editarEvento/${evento.id}`, {
      method: "PUT", // o PATCH si usas PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: values.nombre,
        detallesEvento: values.detallesEvento,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin || null,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Error al actualizar el evento");
        } else {
          toast.success("Evento actualizado exitosamente");
          recargarEventos();
          onClose();
        }
      })
      .catch(() => {
        toast.error("No se pudo actualizar el evento");
      });
  };

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
            Editar Evento
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nombre del evento"
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detallesEvento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Detalles del Evento
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Detalles adicionales (opcional)"
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Fecha y Hora de Inicio
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaFin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Fecha y Hora de Fin (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
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
