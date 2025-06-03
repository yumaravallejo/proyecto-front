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
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

interface DetallesUsuarioDto {
  peso: string;
  altura: string;
  genero: string;
  intolerancias: string;
  objetivo: string;
}

interface BackendData {
  fechaNacimiento: string;
  detallesUsuario: DetallesUsuarioDto;
  // …otros campos que quieras mostrar (p. ej. email, nombre, etc.)
}

interface LocalUser {
  id: number;
  nombre: string;
  imagen: string;
  tipo: "Cliente" | "Entrenador";
}

export default function UserProfile() {
  const [openEliminar, setOpenEliminar] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservas, setReservas] = useState([]);
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

  const calcularEdad = (fecha: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("No se encontró usuario en localStorage");
      setLoading(false);
      return;
    }

    let parsedUser: LocalUser;
    try {
      parsedUser = JSON.parse(storedUser);
      setLocalUser(parsedUser);
    } catch {
      setError("Error al parsear datos de usuario en localStorage");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const URL = process.env.NEXT_PUBLIC_API;
        const res = await fetch(`${URL}usuarios/detalles/${parsedUser.id}`);
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Detalles usuario: ${msg}`);
        }
        const data: BackendData = await res.json();
        setBackendData(data);

        const reservas = await fetch(
          `${URL}usuarios/mis-reservas/${parsedUser.id}`
        );
        if (!reservas.ok) {
          const msg = await reservas.text();
          throw new Error(`Mis reservas: ${msg}`);
        }
        const data2 = await reservas.json();
        setReservas(data2);
      } catch (err: any) {
        console.error("Error al cargar datos:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!localUser || !backendData) return;

  const detalles = backendData.detallesUsuario;

  const imagen =
    localUser.imagen == ""
      ? "/usuario.svg"
      : `${process.env.NEXT_PUBLIC_API}usuarios/obtenerArchivo?imagen=${localUser.imagen}`;


  async function handleLogOut() {
    try {
      const URL = process.env.NEXT_PUBLIC_API;
      const res = await fetch(`${URL}usuarios/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Fallo al cerrar sesión:", res.statusText);
        toast.error("No se pudo cerrar sesión");
      } else {
        toast.success("Tu sesión ha sido cerrada", {
          description: "¡Hasta pronto!",
        });

        setTimeout(() => {
          localStorage.removeItem("user");
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Fallo al cerrar sesión: ", error);
      toast.error("No se pudo cerrar sesión");
    }
  }

  async function handleDeleteAccount() {
    try {
      const URL = process.env.NEXT_PUBLIC_API;
      const res = await fetch(`${URL}usuarios/eliminar/${localUser?.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Fallo al eliminar cuenta:", res.statusText);
        toast.error("No se pudo eliminar la cuenta");
      } else {
        toast.success("Tu cuenta ha sido eliminada", {
          description: "¡Hasta pronto!",
        });

        setTimeout(() => {
          localStorage.removeItem("user");
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Fallo al eliminar cuenta: ", error);
      toast.error("No se pudo eliminar la cuenta");
    }
  }

  async function editarImagen(file: File) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API;
      const formData = new FormData();
      formData.append("imagen", file);

      const response = await fetch(
        apiUrl + "usuarios/" + localUser?.id + "/editarAvatar",
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


      localStorage.setItem(
        "user",
        JSON.stringify({ ...localUser, imagen: data })
      );
      window.dispatchEvent(new Event("icon-updated"));
    } catch (error) {
      console.error("Error al editar la imagen. " + error);
    }
  }

  if (localUser.tipo === "Entrenador") {
    return (
      <div>
        <Toaster />
        <HeaderUs promocion={null} />
        <main className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md mt-10 mb-10">
          <h1 className="text-3xl font-bold mb-6">Perfil Entrenador</h1>
          {/* Aquí puedes poner la información y acciones específicas para el entrenador */}
          <p>Bienvenido, {localUser.nombre}. Aquí irá el contenido para entrenadores.</p>
          {/* ...más contenido para entrenadores... */}
          <div className="p-4 rounded-md mt-6 justify-between sm:justify-start sm:gap-4 flex flex-row">
              <Dialog open={openLogout} onOpenChange={setOpenLogout}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Quieres irte?</DialogTitle>
                    <DialogDescription>
                      Recuerda que trabajas aquí eh...
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <button
                      onClick={() => setOpenLogout(false)}
                      className="rounded bg-blue-500 text-white px-4 py-2 mr-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                    >
                      Seguir trabajando
                    </button>
                    <button
                      onClick={() => {
                        setOpenLogout(false);
                        handleLogOut();
                      }}
                      className="rounded bg-red-600 text-white px-4 py-2 cursor-pointer hover:bg-red-800 transition-colors duration-200"
                    >
                      Sí, cerrar sesión
                    </button>
                  </DialogFooter>
                </DialogContent>
                <button
                  onClick={() => setOpenLogout(true)}
                  className="rounded-full bg-red-500 hover:bg-red-700 text-white p-1 pl-4 pr-4 cursor-pointer transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              </Dialog>
            </div>
        </main>
      </div>
    );
  } else {
    return (
      <div>
        <Toaster />

        <HeaderUs promocion={null} />
        <main className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md mt-5 mb-10 sm:mt-10">
          <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Seguimiento Personal</h1>

          <section className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-5">
              <img
                src={imagen}
                alt={`Imagen de perfil de ${localUser.nombre}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--gris-oscuro)] bg-[var(--gris-oscuro)]"
              />
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
            </div>
            <div className="bg-blue-50 p-4 rounded-md shadow w-full sm:w-auto sm:bg-white sm:rounded-none">
              <h2 className="text-xl font-semibold">{localUser.nombre}</h2>
              <p className="text-gray-600 mt-2">
                Edad:{" "}
                <span className="font-medium">
                  {calcularEdad(backendData.fechaNacimiento)} años
                </span>
              </p>
              <p className="text-gray-600">
                Fecha de nacimiento:{" "}
                <span className="font-medium">{backendData.fechaNacimiento}</span>
              </p>
              <p className="text-gray-600">
                Género: <span className="font-medium">{detalles.genero}</span>
              </p>
            </div>
          </section>

          <section>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Peso</h3>
                <p className="text-md ">{detalles.peso || "-"} Kg</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Altura</h3>
                <p className="text-md ">{detalles.altura || "-"} cm</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Objetivo</h3>
                <p className="text-md">{detalles.objetivo || "-"}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Intolerancias</h3>
                <p className="text-md">{detalles.intolerancias || "Ninguna"}</p>
              </div>


            </section>
            <div className="bg-blue-50 p-4 rounded-md shadow mt-6">
              <h3 className="font-semibold text-xl mb-2">Mis Reservas</h3>
              <div className="text-md flex flex-row flex-wrap space-y-2 gap-[1rem]">
                {reservas.length > 0
                  ? reservas.map((reserva: any) => (
                    <div
                      key={reserva.id}
                      className="p-2 border rounded bg-white shadow-sm m-1 sm:basis-[calc(50%-1rem)] basis-full"
                    >
                      <p>
                        <strong>Clase:</strong> {reserva.nombreClase || "N/A"}
                      </p>
                      <p>
                        <strong>Horario:</strong>{" "}
                        {new Date(reserva.fechaHora).toLocaleString().replace(",", " a las")}
                      </p>
                      <p>
                        <strong>Tipo Clase:</strong>{" "}
                        {reserva.tipoClase || "N/A"}
                      </p>
                    </div>
                  ))
                  : "Aún no tienes reservas"}
              </div>
            </div>

            <div className="p-4 rounded-md mt-6 justify-between sm:justify-start sm:gap-4 flex flex-row">
              <Dialog open={openLogout} onOpenChange={setOpenLogout}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¡No te vayas!</DialogTitle>
                    <DialogDescription>
                      Siempre podrás volver a entrenar más tarde pero, ¿estás seguro de que quieres cerrar sesión?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <button
                      onClick={() => setOpenLogout(false)}
                      className="rounded bg-blue-500 text-white px-4 py-2 mr-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                    >
                      Seguir entrenando
                    </button>
                    <button
                      onClick={() => {
                        setOpenLogout(false);
                        handleLogOut();
                      }}
                      className="rounded bg-red-600 text-white px-4 py-2 cursor-pointer hover:bg-red-800 transition-colors duration-200"
                    >
                      Sí, cerrar sesión
                    </button>
                  </DialogFooter>
                </DialogContent>
                <button
                  onClick={() => setOpenLogout(true)}
                  className="rounded-full bg-red-500 hover:bg-red-700 text-white p-1 pl-4 pr-4 cursor-pointer transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              </Dialog>
              <Dialog open={openEliminar} onOpenChange={setOpenEliminar}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogDescription>
                      Esta acción eliminará tu cuenta permanentemente. ¿Deseas continuar?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <button
                      onClick={() => setOpenEliminar(false)}
                      className="rounded bg-blue-500 text-white px-4 py-2 mr-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        setOpenEliminar(false);
                        handleDeleteAccount();
                      }}
                      className="rounded bg-red-600 text-white px-4 py-2 cursor-pointer hover:bg-red-800 transition-colors duration-200"
                    >
                      Sí, eliminar cuenta
                    </button>
                  </DialogFooter>
                </DialogContent>
                <button
                  onClick={() => setOpenEliminar(true)}
                  className="rounded-full bg-[var(--gris-medio)] hover:bg-[var(--gris-oscuro)] text-white p-1 pl-4 pr-4 cursor-pointer transition-colors duration-200"
                >
                  Darme de baja
                </button>
              </Dialog>
            </div>

          </section>

        </main>

      </div>
    );
  }
}
