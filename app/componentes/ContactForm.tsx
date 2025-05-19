"use client";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
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
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import PersAlert from "../componentes/PersAlert";


export default function ContactForm() {
    const objetivos = [
        { value: 'subir', label: 'Subir de peso' },
        { value: 'bajar', label: 'Bajar de peso' },
        { value: 'salud', label: 'Mejorar la Salud' },
        { value: 'rendimientoDeportivo', label: 'Mejorar mi Rendimiento deportivo' },
        { value: 'tonificar', label: 'Tonificar' },
        { value: 'powerlifter', label: 'Competidor Powerlifter' },
        { value: 'otro', label: 'Otro' }
    ];

    const [alert, setAlert] = useState<{
        message: string;
        title: string;
        variant: "default" | "destructive" | "success";
    } | null>(null);

    const formSchema = z.object({
        nombre: z.string(),
        email: z.string().email("Email no válido"),
        telefono: z.string().optional(),
        objetivo: z.string()
    });

    function handleForm(values: z.infer<typeof formSchema>) {
        setAlert({
            title: "¡Muchas Gracias " + values.nombre + "!",
            message: "Tu solicitud ha sido enviada",
            variant: "success",
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
        }
    });

    return (
        <div className="flex flex-col gap-y-[4rem] contact-form">
            <Form {...form}>

                <div className="flex flex-col gap-y-2 text-left w-[17rem]">
                    <span className="text-white ">¿AÚN TIENES DUDAS?</span>
                    <h2 className="oswald text-[var(--dorado)] text-2xl">CONTACTA CON NOSOTROS</h2>
                </div>
                {alert && (
                    <div className="w-[17rem] mt-[-3rem]">
                        <PersAlert
                            title={alert.title}
                            message={alert.message}
                            variant={alert.variant}
                            spinner={false}
                        />
                    </div>
                )}

                <form className="flex flex-col gap-y-5 w-[17rem] pb-10 mt-[-3rem] w-full">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md mb-[-.5rem]">Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Introduce tu nombre"
                                        {...field}
                                        className={
                                            form.formState.errors.email
                                                ? "border-2 border-red-500 focus:ring-red-200 bg-white rounded-none"
                                                : "focus:ring-yellow-200 bg-white rounded-none"
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 text-sm " />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md mb-[-.5rem]">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Introduce tu email"
                                        {...field}
                                        className={
                                            form.formState.errors.email
                                                ? "border-2 border-red-500 focus:ring-red-200 bg-white rounded-none"
                                                : "focus:ring-yellow-200 bg-white rounded-none"
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 text-sm " />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md mb-[-.5rem]">Teléfono</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Introduce tu teléfono"
                                        {...field}
                                        className={"focus:ring-yellow-200 bg-white rounded-none"}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 text-sm " />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="objetivo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-md mb-[-.5rem]">Objetivo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white w-full focus:ring-yellow-200 rounded-none">
                                            <SelectValue placeholder="Selecciona un objetivo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white">
                                        {objetivos.map(e => (
                                            <SelectItem value={e.value} key={e.value}>{e.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />
                    <button onClick={form.handleSubmit(handleForm)} className="bg-dorado text-white font-bold p-2 mt-6">Enviar Solicitud</button>
                </form>
            </Form>
        </div>
    );
}