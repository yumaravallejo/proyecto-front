"use client";
import React, { useEffect, useState } from "react";
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
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

interface Dieta {
  fecha: string;
  descripcion: string; // JSON string con desayuno, comida, cena
  idEntrenador: number;
  idUsuario: number;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export default function Dietas() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [dietas, setDietas] = useState<Record<number, Dieta[]>>({});
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [tipoUser, setTipoUser] = useState<String>("Cliente");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addDieta, setAddDieta] = useState<number | null>(null);

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const parsedUser = localUser ? JSON.parse(localUser) : null;
    const token = parsedUser?.token;

    setTipoUser(parsedUser?.tipo);

    const URL = process.env.NEXT_PUBLIC_API;
    fetch(URL + "usuarios/getClientes")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch(() => setUsuarios([]));
  }, []);

  const formSchema = z.object({
    almuerzo: z.string().min(1, "Este campo es obligatorio"),
    desayuno: z.string().min(1, "Este campo es obligatorio"),
    merienda: z.string().optional(),
    cena: z.string().min(1, "Este campo es obligatorio"),
    picoteo: z.string().optional(),
    fecha: z
      .string()
      .min(1, "La fecha de inicio es obligatoria")
      .refine((value) => !isNaN(new Date(value).getTime()), "Fecha inválida"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desayuno: "",
      almuerzo: "",
      cena: "",
      merienda: "",
      picoteo: "",
      fecha: "",
    },
  });

  const handleSubmit = () => {
    console.log("Hola");
  };

  const handleAddDieta = (usuarioId: number) => {};

  const verDietas = async (usuarioId: number) => {
    setSelectedUser(usuarioId);
    try {
      const res = await fetch(`/api/dietas/${usuarioId}`);
      const data = await res.json();
      setDietas((prev) => ({ ...prev, [usuarioId]: data }));
    } catch {
      setDietas((prev) => ({ ...prev, [usuarioId]: [] }));
    }
  };

  if (tipoUser !== "Entrenador") {
    return (
      <div className="bg-gray-50 min-h-screen">
        <HeaderUs promocion={null} pagina="DIETAS" />
        <main className="min-h-screen"></main>
        <Footer />
      </div>
    );
  } else {
    return (
      <div className="bg-gray-50">
        <HeaderUs promocion={null} pagina="DIETAS" />

        <main className="max-w-6xl mx-auto p-6 min-h-screen flex flex-col gap-10">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Gestión de Dietas
          </h1>

          <div className="flex justify-start">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="border border-gray-300 rounded px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dieta semanal */}
          {selectedUser !== null && (
            <div className=" p-6 bg-white rounded shadow">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Dieta semanal del usuario #{selectedUser}
              </h2>

              {dietas[selectedUser] && dietas[selectedUser].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dietas[selectedUser].map((dieta) => {
                    let json: {
                      desayuno?: string;
                      comida?: string;
                      cena?: string;
                    } = {};
                    try {
                      json = JSON.parse(dieta.descripcion);
                    } catch {
                      json = {};
                    }
                    const diaSemana = new Date(dieta.fecha).toLocaleDateString(
                      "es-ES",
                      {
                        weekday: "long",
                      }
                    );

                    return (
                      <div
                        key={dieta.fecha}
                        className="p-4 bg-gradient-to-br from-white to-gray-50 border rounded-lg shadow-sm hover:shadow-md transition"
                      >
                        <h3 className="text-lg font-bold capitalize mb-2 text-blue-700">
                          {diaSemana}
                        </h3>
                        <ul className="text-gray-700 space-y-1">
                          <li>
                            <span className="font-semibold">Desayuno:</span>{" "}
                            {json.desayuno || "-"}
                          </li>
                          <li>
                            <span className="font-semibold">Comida:</span>{" "}
                            {json.comida || "-"}
                          </li>
                          <li>
                            <span className="font-semibold">Cena:</span>{" "}
                            {json.cena || "-"}
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-red-600 font-medium">
                  No tiene dietas asignadas para esta semana.
                </p>
              )}
            </div>
          )}

          {addDieta !== null && (
            <div className=" p-6 bg-white rounded shadow">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Añadir dieta para el usuario #{addDieta}
              </h2>
              <p className="text-gray-400">
                Intolerancias de este usuario: 
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6 mt-6"
                >
                  <FormField
                    control={form.control}
                    name="desayuno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-lg">
                          Desayuno
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Escribe qué tomará de desayuno"
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
                    name="almuerzo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-lg">
                          Almuerzo
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Escribe qué tomará de almuerzo"
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
                    name="merienda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-lg">
                          Merienda
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Escribe qué tomará de merienda"
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
                    name="cena"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-lg">
                          Cena
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Escribe qué tomará de cena"
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
                    name="picoteo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-lg">
                          Picoteo
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Escribe qué tomará de picoteo, puede no ser nada"
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
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-lg">
                          Fecha
                        </FormLabel>
                        <FormControl>
                          <Input
                            min={new Date().toISOString().split("T")[0]}
                            {...field}
                            type="date"
                            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setAddDieta(null);
                        form.reset();
                      }}
                      type="button"
                      className="px-6 py-3 rounded-full bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Modo mobile */}
          <div className="overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 md:hidden">
              {usuariosFiltrados.map((usuario) => (
                <div
                  key={usuario.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {usuario.nombre}
                  </h3>
                  <p className="text-sm text-gray-500">{usuario.email}</p>
                  <div className="mt-4 flex flex-row gap-2">
                    <button
                      onClick={() => verDietas(usuario.id)}
                      className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    >
                      Ver Dietas
                    </button>
                    <button
                      onClick={() => setAddDieta(usuario.id)}
                      className="cursor-pointer w-full bg-[var(--dorado)] hover:bg-[var(--dorado-oscuro)] text-white px-4 py-2 rounded-md transition"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modo Desktop */}
            <div className="hidden md:block max-h-[500px] overflow-y-auto pr-2">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-left sticky top-0">
                  <tr>
                    <th className="p-4 font-medium">Nombre</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-t hover:bg-gray-50 transition-all duration-150"
                    >
                      <td className="p-4">{usuario.nombre}</td>
                      <td className="p-4">{usuario.email}</td>
                      <td className="p-4 flex justify-center gap-3">
                        <button
                          onClick={() => verDietas(usuario.id)}
                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                        >
                          Ver Dietas
                        </button>
                        <button
                          onClick={() => setAddDieta(usuario.id)}
                          className="cursor-pointer bg-[var(--dorado)] hover:bg-[var(--dorado-oscuro)] text-white px-4 py-2 rounded-md transition"
                        >
                          Añadir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
