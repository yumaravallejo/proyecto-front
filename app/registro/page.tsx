"use client";

import HeaderUs from "../componentes/HeaderUs";
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
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import PaginaDePago from "../componentes/PasarelaPago";
import { useForm } from "react-hook-form";
import CuotasSelec from "../componentes/Cuotas";

export default function Registro() {
  const router = useRouter();
  const [pagina, setPagina] = useState(1);
  const totalPaginas = 4;
  const [cliente, setCliente] = useState<{
    nombre: string | null;
    email: string | null;
    dni: string | null;
    codigoPostal: string | null;
    tarifa: number | null;
    detallesUsuario: string;
    fechaNacimiento: string | null;
    imagen: any | "";
    password: string | null;
  }>({
    nombre: null,
    email: null,
    dni: null,
    codigoPostal: null,
    tarifa: null,
    detallesUsuario: JSON.stringify([]),
    fechaNacimiento: null,
    imagen: "",
    password: null,
  });

  useEffect(() => {
    const values = form.getValues();
    form.reset(values);
  }, [pagina]);

  const formSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Email no válido"),
    dni: z.string().regex(/^\d{8}[A-Za-z]$/, "DNI no válido"),
    codigoPostal: z.string().min(1, "El código postal es obligatorio"),
    tarifa: z
      .number()
      .min(0, "La tarifa es obligatoria")
      .refine((val) => val >= 0 && val <= 5, {
        message: "Selecciona una tarifa válida",
      }),
    peso: z.number().min(1, "El peso es obligatorio"),
    altura: z.number().min(1, "La altura es obligatoria"),
    intolerancias: z.string().optional(),
    genero: z.string().min(1, "El género es obligatorio"),
    objetivo: z.string().min(1, "El objetivo es obligatorio"),
    fechaNacimiento: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine(
        (fecha) => {
          if (!fecha) return false;
          const hoy = new Date();
          const nacimiento = new Date(fecha);
          let edad = hoy.getFullYear() - nacimiento.getFullYear();
          const m = hoy.getMonth() - nacimiento.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
          }
          return edad >= 18;
        },
        {
          message: "Debes ser mayor de edad para registrarte",
        }
      ),
    imagen: z.any().optional(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
      dni: "",
      codigoPostal: "",
      tarifa: -1,
      peso: 0,
      fechaNacimiento: "",
      intolerancias: "",
      genero: "",
      objetivo: "",
      altura: 0,
      imagen: "",
    },
  });

  const numberTarifa = (titulo: String) => {
    switch (titulo) {
      case "Básica":
        return 0;
      case "Premium":
        return 1;
      case "Familiar":
        return 2;
      case "Pase Diario":
        return 3;
      case "Bono 10 Entradas":
        return 4;
      case "Estudiantil":
        return 5;
      default:
        return 0; // Maneja el caso por defecto si es necesario
    }
  };

  const camposPorPagina: Array<Array<keyof z.infer<typeof formSchema>>> = [
    ["nombre", "dni", "fechaNacimiento", "codigoPostal", "email", "password"],
    ["peso", "altura", "intolerancias", "genero", "objetivo"],
    ["tarifa"], // ajusta según tus campos reales
  ];

  const handleNext = async () => {
    const campos = camposPorPagina[pagina - 1];
    const valido = await form.trigger(campos);
    if (valido) {
      const values = form.getValues();
      switch (pagina) {
        case 1:
          setCliente((prev) => ({
            ...prev,
            nombre: values.nombre,
            email: values.email,
            dni: values.dni,
            codigoPostal: values.codigoPostal,
            fechaNacimiento: values.fechaNacimiento,
            imagen: values.imagen,
            password: values.password,
          }));
          break;
        case 2:
          setCliente((prev) => ({
            ...prev,
            detallesUsuario: JSON.stringify([
              values.peso,
              values.altura,
              values.genero,
              values.intolerancias,
              values.objetivo,
            ]),
          }));
          break;
      }

      setPagina((p) => Math.min(totalPaginas, p + 1));
    }
  };

  const handlePrev = () => setPagina((p) => Math.max(1, p - 1));

  const handleCuotaSelect = (titulo: String) => {
    setCliente((prev) => ({
      ...prev,
      tarifa: numberTarifa(titulo),
    }));
    form.setValue("tarifa", numberTarifa(titulo)); // <-- Añade esto
  };

  const handleSubmit = async () => {
    console.log("Datos del cliente:", cliente);
    const apiUrl = process.env.NEXT_PUBLIC_API;
    const response = await fetch(apiUrl + "registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(cliente),
    });

    const data = await response.json();

    console.log("Datos de respuesta:", data);

    if (!response.ok) {
      toast.error("Error en el registro", {
        description: "Inténtelo de nuevo más tarde",
      });
      return;
    }

    localStorage.setItem("user", JSON.stringify(data)); // Guardar los datos del usuario en localStorage

    // Crear la sesión con el token y los datos del usuario
    toast.success("Registro completado", {
      description: "¡Disfruta del proceso del cambio!",
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  const paginas = [
    {
      numero: 1,
      titulo: "Datos Personales",
      contenido: (
        <div className="flex flex-col mt-10 gap-8 w-90 items-center sm:w-2/6">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Introduce tu nombre"
                    {...field}
                    className={
                      form.formState.errors.nombre
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">DNI</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Introduce tu DNI"
                    minLength={9}
                    maxLength={9}
                    {...field}
                    className={
                      form.formState.errors.dni
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">
                  Fecha de Nacimiento
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className={
                      form.formState.errors.fechaNacimiento
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigoPostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">
                  Código Postal
                </FormLabel>
                <FormControl>
                  <Input
                    minLength={5}
                    maxLength={5}
                    type="number"
                    placeholder="Introduce tu código postal"
                    {...field}
                    className={
                      form.formState.errors.codigoPostal
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">Email</FormLabel>
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
                <FormMessage className="text-red-500 text-sm mb-[-2rem] " />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">Contraseña</FormLabel>
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
        </div>
      ),
    },
    {
      numero: 2,
      titulo: "Detalles de Usuario",
      contenido: (
        <div className="flex flex-col mt-10 gap-8 w-90 items-center sm:w-2/7">
          <FormField
            control={form.control}
            name="peso"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">Peso (Kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    maxLength={3}
                    placeholder="Introduce tu peso"
                    {...field}
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                    className={
                      form.formState.errors.peso
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="altura"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">Altura (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    maxLength={3}
                    placeholder="Introduce tu altura"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                    className={
                      form.formState.errors.altura
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intolerancias"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">
                  Intolerancias Alimentarias
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Introduce tus intolerancias (opcional)"
                    {...field}
                    className={
                      form.formState.errors.intolerancias
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200"
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">Género</FormLabel>
                <FormControl>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="hombre"
                        checked={field.value === "hombre"}
                        onChange={() => field.onChange("hombre")}
                        className="accent-[var(--azul)]"
                      />
                      Hombre
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="mujer"
                        checked={field.value === "mujer"}
                        onChange={() => field.onChange("mujer")}
                        className="accent-[var(--azul)]"
                      />
                      Mujer
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="otro"
                        checked={field.value === "otro"}
                        onChange={() => field.onChange("otro")}
                        className="accent-[var(--azul)]"
                      />
                      Otro
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm min-h-[1.5rem]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objetivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-md">Objetivo</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className={
                      "w-full rounded px-3 py-2 border " +
                      (form.formState.errors.objetivo
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-200")
                    }
                  >
                    <option value="" disabled>
                      Selecciona tu objetivo
                    </option>
                    <option value="Perder">Perder peso</option>
                    <option value="Ganar">Ganar músculo</option>
                    <option value="Mantener">Mantenerme</option>
                    <option value="Salud">Mejorar salud</option>
                  </select>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mb-[-2rem]" />
              </FormItem>
            )}
          />
        </div>
      ),
    },
    {
      numero: 3,
      titulo: "Selección de cuota",
      contenido: (
        <div className="w-full">
          <CuotasSelec registro={true} onSelect={handleCuotaSelect} />
        </div>
      ),
    },
    {
      numero: 4,
      titulo: "Datos de Pago",
      contenido: (
        <PaginaDePago tarifa={cliente.tarifa} registro={handleSubmit} />
      ),
    },
  ];

  return (
    <div>
      <HeaderUs promocion={null} pagina="ÚNETE" />
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-3xl mt-10">REGISTRO DE USUARIOS</h1>
        <span className="text-lg text-gray-500 mt-5">
          Paso {pagina}: {paginas[pagina - 1].titulo}
        </span>
        <Progress value={pagina * 25} className="w-[80%]" />
        <Toaster position="top-center" theme="dark" />
        <Form {...form}>
          <div
            id="formRegistro"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 w-full items-center"
          >
            {paginas[pagina - 1].contenido}
            {pagina === 3 ? (
              <div className="w-full items-center flex flex-col gap-4">
                {cliente.tarifa !== null ? (
                  <div className="w-90 sm:w-2/7 flex flex-col items-center ">
                    <p className="text-lg font-bold mb-4">
                      Has seleccionado la cuota:{" "}
                      {
                        [
                          "Básica",
                          "Premium",
                          "Familiar",
                          "Pase Diario",
                          "Bono 10 Entradas",
                          "Estudiantil",
                        ][cliente.tarifa]
                      }
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-bold mb-4">
                    Por favor, selecciona una cuota para continuar.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </Form>
        <Pagination className="my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrev}
                aria-disabled={pagina === 1}
                tabIndex={pagina === 1 ? -1 : 0}
                style={{
                  pointerEvents: pagina === 1 ? "none" : "auto",
                  opacity: pagina === 1 ? 0.5 : 1,
                }}
                href="#"
              />
            </PaginationItem>
            {[1, 2, 3, 4].map((num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  isActive={pagina === num}
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (num === pagina) return; // No hacer nada si ya está en la página

                    if (num < pagina) {
                      // Permite retroceder sin validar
                      setPagina(num);
                    } else {
                      // Valida la página actual antes de avanzar
                      const campos = camposPorPagina[pagina - 1];
                      const valido = await form.trigger(campos);
                      if (valido) setPagina(num);
                    }
                  }}
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                aria-disabled={pagina === totalPaginas}
                tabIndex={pagina === totalPaginas ? -1 : 0}
                style={{
                  pointerEvents: pagina === totalPaginas ? "none" : "auto",
                  opacity: pagina === totalPaginas ? 0.5 : 1,
                }}
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </div>
  );
}
