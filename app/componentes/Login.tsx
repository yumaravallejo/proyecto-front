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
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"




const formSchema = z.object({
    email: z.string().email("Email no válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

async function handleLogin(values: z.infer<typeof formSchema>) {
    try {
        const response = await fetch("http://localhost:8080/login", {
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
            throw new Error(data.message || "Error en el login");
        }

        // Crear la sesión con el token y los datos del usuario
        localStorage.setItem("user", JSON.stringify(data));


    } catch (error) {
        console.log("Error en login:", error);
    }
}

export default function Login() {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                form.reset(); // Limpia campos y errores
            }
        }}>
            <DialogTrigger className="flex-20 flex items-center justify-end">
                <div className="sesion bg-[var(--gris-oscuro)] rounded-full flex items-center gap-2 font-bold text-white rounded-full border-2 text-center cursor-pointer">
                    <Image src="/usuario.svg" alt="Imagen de usuario" width={50} height={50} className="usuario" />
                    <u>Iniciar Sesión</u>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-left">Iniciar Sesión</DialogTitle>
                </DialogHeader>
        
                

                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Introduce tu email" {...field} className={form.formState.errors.email ? "border-2 border-red-500 focus:ring-red-200" : "focus:ring-yellow-200"} />
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
                                    <Input type="password" placeholder="Introduce tu contraseña" {...field} className={form.formState.errors.password ? "border-2 border-red-500 focus:ring-red-200" : "focus:ring-yellow-200"} />
                                </FormControl>
                                <FormMessage className="text-red-500 text-sm " />
                            </FormItem>
                        )}
                    />

                    <Link href="/recuperar" className="text-[var(--azul)] text-sm underline hover:text-[var(--azul-oscuro)] transition-colors duration-200">
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