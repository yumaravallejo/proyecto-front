"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PersAlert from "../componentes/PersAlert";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

export default function ContactForm() {
    // formulario de contacto reutilizable, fasilito
    const objetivos = [
        { value: 'subir', label: 'Subir de peso' },
        { value: 'bajar', label: 'Bajar de peso' },
        { value: 'salud', label: 'Mejorar la Salud' },
        { value: 'rendimientoDeportivo', label: 'Mejorar mi Rendimiento deportivo' },
        { value: 'tonificar', label: 'Tonificar' },
        { value: 'powerlifter', label: 'Competidor Powerlifter' },
        { value: 'otro', label: 'Otro' }
    ];

    const formSchema = z.object({
        nombre: z.string().min(1, "Este campo es obligatorio"),
        email: z.string().min(1, "Este campo es obligatorio").email("Email no válido"),
        telefono: z.string()
            .optional()
            .refine(
                val => !val || /^[0-9]+$/.test(val),
                { message: "El teléfono tiene que ser un número" }
            ),
        objetivo: z.string().min(1, "Este campo es obligatorio"),
        detalles: z.string().optional(),
    });

    function handleForm(values: z.infer<typeof formSchema>) {
        toast.success("Solicitud enviada correctamente", {
            duration: 3000,
            position: "top-center",
        });
        form.reset();
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            email: "",
            telefono: "",
            objetivo: "",
            detalles: "",
        }
    });

    return (
        <div className="flex flex-col gap-y-10 contact-form w-3/4 sm:w-full h-full items-center justify-center pb-10">
            <Toaster richColors position="top-center" theme="dark" />
            <Form {...form}>
                <form className="flex flex-col gap-6 w-full max-w-lg rounded-xl ">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md">Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Introduce tu nombre"
                                        {...field}
                                        className={`bg-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all ${
                                            form.formState.errors.nombre
                                                ? "border border-red-500 focus:ring-red-400"
                                                : "border border-gray-300 focus:ring-yellow-400"
                                        }`}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Introduce tu email"
                                        {...field}
                                        className={`bg-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all ${
                                            form.formState.errors.email
                                                ? "border border-red-500 focus:ring-red-400"
                                                : "border border-gray-300 focus:ring-yellow-400"
                                        }`}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md">Teléfono</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Introduce tu teléfono"
                                        {...field}
                                        className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="objetivo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md">Objetivo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger
                                            className={`bg-white px-4 py-2 rounded-md shadow-sm transition-all w-full focus:outline-none focus:ring-2 ${
                                                form.formState.errors.objetivo
                                                    ? "border border-red-500 focus:ring-red-400"
                                                    : "border border-gray-300 focus:ring-yellow-400"
                                            }`}
                                        >
                                            <SelectValue placeholder="Selecciona un objetivo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white">
                                        {objetivos.map(e => (
                                            <SelectItem
                                                className="cursor-pointer text-gray-700 hover:bg-yellow-100"
                                                value={e.value}
                                                key={e.value}
                                            >
                                                {e.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="detalles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md">Cúentanos tu problema</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Cuéntanos qué te ocurre"
                                            {...field}
                                            className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                            rows={4}
                                        />
                                    </FormControl>
                                </Select>
                                <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                        )}
                    />

                    <button
                        onClick={form.handleSubmit(handleForm)}
                        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-all"
                    >
                        Enviar Solicitud
                    </button>
                </form>
            </Form>
        </div>
    );
}
