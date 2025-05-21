"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

import { DialogClose } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PersAlert from "./PersAlert";

type Props = {
  login: () => void;
};

export default function Login(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const [alert, setAlert] = useState<{
    message: string;
    title: string;
    variant: "default" | "destructive" | "success";
  } | null>(null);

  const formSchema = z.object({
    email: z.string().email("Email no válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  async function handleLogin(values: z.infer<typeof formSchema>) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API;
      const response = await fetch(apiUrl + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAlert({
          title: "Error al iniciar sesión",
          message: data?.message || "Las credenciales no coinciden",
          variant: "destructive",
        });
        return;
      }

      // Crear la sesión con el token y los datos del usuario
      localStorage.setItem("user", JSON.stringify(data));

      setAlert({
        title: "Tu sesión ha sido iniciada",
        message: "¡Hola " + data.nombre + "!",
        variant: "success",
      });

      setTimeout(() => {
        props.login;
        setIsOpen(false); // Cierra el modal
        window.location.reload(); // Recarga la página para reflejar el cambio de sesión
      }, 2000); // Espera 2 segundos antes de cerrar el modal
    } catch (error) {
      setAlert({
        title: "Error",
        message: "Error en login: " + (error as Error).message,
        variant: "destructive",
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
          alert && setAlert(null); // Limpia el alert
          form.reset(); // Limpia campos y errores
        }
      }}
    >
      <DialogTrigger >
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left inter">Iniciar Sesión</DialogTitle>
        </DialogHeader>

        {alert && (
          <PersAlert
            title={alert.title}
            message={alert.message}
            variant={alert.variant}
            spinner={alert.variant === "success"}
          />
        )}

        <Form {...form}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Introduce tu email"
                    {...field}
                    className={
                      form.formState.errors.email
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm " />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Introduce tu contraseña"
                    {...field}
                    className={
                      form.formState.errors.password
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm " />
              </FormItem>
            )}
          />

          <Link
            href="/recuperar"
            className="text-[var(--azul)] text-sm underline hover:text-[var(--azul-oscuro)] transition-colors duration-200"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <DialogFooter className="flex flex-row ">
            <button
              onClick={form.handleSubmit(handleLogin)}
              className="bg-[var(--azul)] text-white rounded-full px-4 py-2 font-bold text-center cursor-pointer hover:bg-[var(--azul-oscuro)] transition-colors duration-200"
            >
              Iniciar Sesión
            </button>
            <DialogClose className="bg-[var(--gris-medio)] text-white rounded-full px-4 py-2 font-bold text-center cursor-pointer hover:bg-[var(--gris-alto)] transition-colors duration-200">
              Cerrar
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
