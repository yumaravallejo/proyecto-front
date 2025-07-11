"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

import { DialogClose } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export default function Login() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const formSchema = z.object({
    email: z.string().email("Email no válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  async function handleLogin(values: z.infer<typeof formSchema>) {
    try {
      // const apiUrl = process.env.NEXT_PUBLIC_API;
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // necesario si luego quieres enviar cookies
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        toast.error("Error al iniciar sesión", {
          description: "Las credenciales son incorrectas",
        });
        setCargando(false);
        return;
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Tu sesión ha sido iniciada", {
        description: "Estás siendo redirigido",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Error al iniciar sesión", {
        description: "Inténtelo de nuevo más tarde" + error,
      });
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger>
        <div className="sesion unlogged flex items-center gap-2 font-bold text-white rounded-full border-2 text-center cursor-pointer">
          <Image
            src="/usuario.svg"
            alt="Imagen de usuario"
            width={50}
            height={50}
            className="usuario"
          />
          <u className="font-bold items-center">Iniciar Sesión</u>
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
            Iniciar Sesión
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce tu email"
                      {...field}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.email
                          ? "border-2 border-red-500 focus:ring-red-300"
                          : "border border-gray-300 focus:ring-yellow-300"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Introduce tu contraseña"
                      {...field}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.password
                          ? "border-2 border-red-500 focus:ring-red-300"
                          : "border border-gray-300 focus:ring-yellow-300"
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
                className="bg-[var(--azul)] text-white rounded-full px-6 py-3 font-semibold hover:bg-[var(--azul-oscuro)] transition cursor-pointer"
                onClick={() => setCargando(true)}
              >
                Iniciar Sesión
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
