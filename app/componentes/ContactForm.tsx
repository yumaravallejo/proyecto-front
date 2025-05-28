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
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ContactForm() {
  const objetivos = [
    { value: "subir", label: "Subir de peso" },
    { value: "bajar", label: "Bajar de peso" },
    { value: "salud", label: "Mejorar la Salud" },
    {
      value: "rendimientoDeportivo",
      label: "Mejorar mi Rendimiento deportivo",
    },
    { value: "tonificar", label: "Tonificar" },
    { value: "powerlifter", label: "Competidor Powerlifter" },
    { value: "otro", label: "Otro" },
  ];

  const [alert, setAlert] = useState<{
    message: string;
    title: string;
    variant: "default" | "destructive" | "success";
  } | null>(null);

  const formSchema = z.object({
    nombre: z.string().min(1, "Este campo es obligatorio"),
    email: z
      .string()
      .min(1, "Este campo es obligatorio")
      .email("Email no válido"),
    telefono: z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9]+$/.test(val), {
        message: "El teléfono tiene que ser un número",
      }),
    objetivo: z.string().min(1, "Este campo es obligatorio"),
  });

  function handleForm(values: z.infer<typeof formSchema>) {
    toast.success("¡Muchas Gracias " + values.nombre + "!", {
      description: "Tu solicitud ha sido enviada",
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
    },
  });

  return (
    <div className="flex flex-col gap-y-[4rem] contact-form w-70">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleForm)} className="flex flex-col gap-y-5 pb-10 mt-[-3rem] w-full">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-md mb-[-.5rem]">
                  Nombre
                </FormLabel>
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
                <FormLabel className="text-white text-md mb-[-.5rem]">
                  Email
                </FormLabel>
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
                <FormLabel className="text-white text-md mb-[-.5rem]">
                  Teléfono
                </FormLabel>
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
                <FormLabel className="text-white text-md mb-[-.5rem]">
                  Objetivo
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={
                        form.formState.errors.objetivo
                          ? "border-2 border-red-500 focus:ring-red-200 bg-white rounded-none w-full cursor-pointer"
                          : "border-none bg-white w-full focus:ring-yellow-200 rounded-none cursor-pointer"
                      }
                    >
                      <SelectValue placeholder="Selecciona un objetivo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white ">
                    {objetivos.map((e) => (
                      <SelectItem
                        className="cursor-pointer item-select"
                        value={e.value}
                        key={e.value}
                      >
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
          <button
            type="submit"
            className="boton-borde-dorado text-white font-bold p-2 mt-6 cursor-pointer"
          >
            Enviar Solicitud
          </button>
        </form>
      </Form>
    </div>
  );
}
