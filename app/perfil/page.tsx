"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderUs from "../componentes/HeaderUs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { clear } from "console";

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState({
    id: null,
    email: null,
    estado: null,
    imagen: "",
    nombre: "",
    tipo: "",
    token: null,
    type: null,
  });
  const router = useRouter();

  const formSchema = z.object({
    imagen: z.any(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imagen: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUserInfo(stored ? JSON.parse(stored) : null);

    if (!stored) {
      router.push("/"); // redirige a login si no está logueado
    }
  }, []);

  async function clearCookies() {
    const apiUrl = process.env.NEXT_PUBLIC_API;
    try {
      const response = await fetch(apiUrl + "usuarios/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      toast.error("No se ha podido cerrar la sesion", {
        description: "Inténtalo de nuevo más tarde",
      });
    }
  }

  function handleLogOut() {
    toast.success("Tu sesión ha sido cerrada", {
      description: "¡Hasta pronto!",
    });

    localStorage.removeItem("user");
    clearCookies();

    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  async function editarImagen(file: File) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API;
      const formData = new FormData();
      formData.append("imagen", file);

      const response = await fetch(
        apiUrl + "usuarios/" + userInfo.id + "/editarAvatar",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error("Error al editar la imagen", {
          description: "Inténtalo de nuevo más tarde",
        });
        return;
      }

      const data = await response.text();

      setUserInfo({ ...userInfo, imagen: data });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userInfo, imagen: data })
      );
      window.dispatchEvent(new Event("icon-updated"));
    } catch (error) {
      console.error("Error al editar la imagen. " + error);
    }
  }

  return (
    <div>
      <Toaster />

      <HeaderUs promocion={null} />
      <main id="perfil" className="p-8 flex flex-col main-alto">
        <div id="foto-perfil" className="w-30 flex items-center mb-[-.7rem]">
          {userInfo && userInfo.imagen ? (
            <Avatar className="w-full h-auto">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_API}usuarios/obtenerArchivo?imagen=${userInfo.imagen}`}
                alt="Imagen de usuario"
                className="icono-user-perfil rounded-full border-3"
                title="Foto de perfil"
              />
            </Avatar>
          ) : (
            <Image
              src="/usuario.svg"
              alt="Imagen de usuario"
              width={50}
              height={50}
              className="usuario"
              title="Foto de perfil"
            />
          )}
        </div>

        {/* Editar la imagen */}
        <Form {...form}>
          <FormField
            control={form.control}
            name="imagen"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="file"
                  className="cursor-pointer text-[var(--azul)] hover:text-[var(--azul-oscuro)] text-md underline mt-[-1rem] translate-2s"
                >
                  Editar
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="Introduce tu nombre"
                    className="hidden"
                    id="file"
                    accept="image/*"
                    onChange={(e) => {
                      form.setValue("imagen", e.target.files);
                      if (e.target.files && e.target.files[0]) {
                        editarImagen(e.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>

        <section id="infoUser"></section>

        <button
          onClick={handleLogOut}
          className="rounded-full bg-[var(--error)] text-white p-1 pl-4 pr-4 cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </main>
    </div>
  );
}
