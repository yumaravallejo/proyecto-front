"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  fetchData: () => Promise<void>;
}

export default function AddEntrenador({ fetchData }: Props) {
  const [open, setOpen] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Definimos el esquema de validación con Zod
  const formSchema = z.object({
    nombre: z.string().min(1, "El nombre no puede estar vacío"),
    dni: z
      .string()
      .regex(
        /^[0-9]{8}[A-Z]$/,
        "El DNI debe tener 8 dígitos seguidos de una letra mayúscula"
      ),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    imagen: z.string().optional(),
    email: z
      .string()
      .email("El email no es válido")
      .min(1, "El email no puede estar vacío"),
    sueldo: z.number().min(0, "El sueldo debe ser un número positivo"),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Configuramos React Hook Form con la validación Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      dni: "",
      password: "",
      imagen: "",
      email: "",
      sueldo: 0,
    },
  });

  async function handleSubmitForm(values: FormValues) {
    setCargando(true);
    values.sueldo = parseFloat(values.sueldo.toString());

    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token;
      const URL = process.env.NEXT_PUBLIC_API;
      const response = await fetch(URL + "/entrenador/registrarEntrenador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el entrenador");
      }

      toast.success("Entrenador registrado con éxito", {
        description: "El entrenador ha sido añadido",
      });

      form.reset();
      setOpen(false);
      await fetchData();
    } catch (error) {
      toast.error("Error al registrar el entrenador", {
        description: "Intenta de nuevo más tarde " + error,
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="shadow-lg text-lg rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-2xl transition-all bg-blue-500 text-white font-bold hover:bg-blue-700 cursor-pointer">
          REGISTRAR ENTRENADOR
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl bg-white shadow-lg p-8 animate-fadeIn">
        {cargando && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-800 mb-6">
            Registrar Entrenador
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmitForm)}
          >
            {/* Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce el nombre del entrenador"
                      {...field}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.nombre
                          ? "border-2 border-red-500"
                          : "border border-gray-300"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            {/* DNI */}
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce el DNI del entrenador"
                      {...field}
                      maxLength={9}
                      minLength={9}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.dni
                          ? "border-2 border-red-500"
                          : "border border-gray-300"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce el email del entrenador"
                      {...field}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.email
                          ? "border-2 border-red-500"
                          : "border border-gray-300"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            {/* Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Introduce la contraseña del entrenador"
                      {...field}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.password
                          ? "border-2 border-red-500"
                          : "border border-gray-300"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            {/* Sueldo */}
            <FormField
              control={form.control}
              name="sueldo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sueldo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Introduce el sueldo"
                      {...field}
                      // Manejamos el cambio, permitiendo un valor vacío
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "" : Number(e.target.value);
                        field.onChange(value);
                      }}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.sueldo
                          ? "border-2 border-red-500"
                          : "border border-gray-300"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-4 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Registrar Entrenador
              </button>
              <DialogClose className="bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-500 transition cursor-pointer">
                Cerrar
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
