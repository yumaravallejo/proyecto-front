"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderUs from "../componentes/HeaderUs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

interface Reservas {
  nombreClase: string;
  id: number;
  fechaHora: string;
  tipoClase: string;
}

interface BackendData {
  fechaNacimiento?: string;
  detallesUsuario?: DetallesUsuarioDto;
  fechaEntrada?: string;
  tiempoContrato?: string;
  // …otros campos que quieras mostrar (p. ej. email, nombre, etc.)
}

interface LocalUser {
  id: number;
  nombre: string;
  imagen: string;
  tipo: "Cliente" | "Entrenador";
  email: string;
  token: string;
}

export default function UserProfile() {
  const [openEliminar, setOpenEliminar] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [reservas, setReservas] = useState<Reservas[] | []>([]);
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
      return;
    }

    const parsedUser: LocalUser = JSON.parse(storedUser);
    setLocalUser(parsedUser);

    let fetchData;

    if (parsedUser.tipo !== "Entrenador") {
      fetchData = async () => {
        try {
          const URL = process.env.NEXT_PUBLIC_API;
          const res = await fetch(`${URL}usuarios/detalles/${parsedUser.id}`);
          if (!res.ok) {
            const msg = await res.text();
            alert(`Detalles usuario: ${msg}`);
          }
          const data: BackendData = await res.json();
          setBackendData(data);

          const reservas = await fetch(
            `${URL}usuarios/mis-reservas/${parsedUser.id}`
          );
          if (!reservas.ok) {
            const msg = await reservas.text();
            alert(`Mis reservas: ${msg}`);
          }
          const data2 = await reservas.json();
          setReservas(data2);
        } catch (err) {
          console.error("Error al cargar datos:", err);
        }
      };
    } else {
      fetchData = async () => {
        try {
          const URL = process.env.NEXT_PUBLIC_API;
          const res = await fetch(
            `${URL}entrenador/detalles/${parsedUser.id}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${parsedUser.token}`,
              },
            }
          );
          if (!res.ok) {
            const msg = await res.text();
            alert(`Detalles entrenador: ${msg}`);
          }
          const data: BackendData = await res.json();
          setBackendData(data);
        } catch (err) {
          console.error("Error al cargar datos:", err);
        }
      };
    }

    fetchData();
  }, []);

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
        }, 1500);
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
        `${apiUrl}usuarios/${localUser?.id}/editarAvatar`,
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

      setLocalUser((prevUser) => {
        if (!prevUser) return prevUser;
        const updatedUser = { ...prevUser, imagen: data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });
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
        <main className="max-w-3xl mx-auto p-10 bg-white rounded-md sm:shadow-md mt-5 mb-10 sm:mt-10">
          <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
            Perfil Entrenador
          </h1>
          <section className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <article className="flex flex-col items-center gap-5 w-1/3">
              <img
                src={imagen}
                alt={`Imagen de perfil de ${localUser.nombre}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--gris-oscuro)] bg-[var(--gris-oscuro)]"
              />
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="imagen"
                  render={() => (
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
            </article>
            <article className="w-full">
              <div className="bg-blue-50 p-4 rounded-md shadow w-full ">
                <h2 className="text-xl font-semibold">{localUser.nombre}</h2>
                <p className="text-gray-600 mt-2">
                  Email: <span className="font-medium">{localUser.email}</span>
                </p>
                <p className="text-gray-600">
                  Tipo de usuario:{" "}
                  <span className="font-medium">{localUser.tipo}</span>
                </p>
                <p className="text-gray-600">
                  Fecha de Entrada:{" "}
                  <span className="font-medium">
                    {backendData.fechaEntrada}
                  </span>
                </p>
                <p className="text-gray-600">
                  Tiempo en el gimnasio:{" "}
                  <span className="font-medium">
                    {backendData.tiempoContrato}
                  </span>
                </p>
              </div>
            </article>
          </section>

          <div className="rounded-md mt-6 justify-between sm:justify-start sm:gap-4 flex flex-row">
            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
              <DialogTrigger asChild>
                <span className="rounded-full h-12 font-bold bg-red-500 hover:bg-red-600 text-white px-6 flex font-semibold cursor-pointer transition-colors duration-200 items-center">
                  Cerrar Sesión
                </span>
              </DialogTrigger>

              <DialogContent className="max-w-md rounded-xl bg-white shadow-lg p-8 animate-fadeIn">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-semibold text-gray-800 mb-6">
                    ¿Ya estás cansado?
                  </DialogTitle>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Siempre podrás volver a entrenar más tarde
                  </p>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-4 mt-6">
                  <DialogClose asChild>
                    <span className="bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-500 transition cursor-pointer">
                      Cancelar
                    </span>
                  </DialogClose>
                  <button
                    onClick={() => {
                      setOpenLogout(false);
                      handleLogOut();
                    }}
                    className="bg-red-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-red-800 transition cursor-pointer"
                  >
                    Sí, cerrar sesión
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={openEliminar} onOpenChange={setOpenEliminar}>
              <DialogTrigger>
                <span className="flex items-center gap-2 font-bold text-white rounded-full text-center cursor-pointer px-6 py-3 bg-gray-500 hover:bg-gray-600 transition-colors duration-200">
                  Darme de baja
                </span>
              </DialogTrigger>

              <DialogContent className="max-w-md rounded-xl bg-white shadow-lg p-8 animate-fadeIn">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-semibold text-gray-800 mb-6">
                    ¡No te vayas!
                  </DialogTitle>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Esta acción eliminará tu cuenta permanentemente. ¿Deseas
                    continuar?
                  </p>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-4 mt-6">
                  <DialogClose asChild>
                    <span className="bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-500 transition cursor-pointer">
                      Cancelar
                    </span>
                  </DialogClose>
                  <button
                    onClick={() => {
                      setOpenEliminar(false);
                      handleDeleteAccount();
                    }}
                    className="bg-red-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-red-800 transition cursor-pointer"
                  >
                    Sí, eliminar cuenta
                  </button>
                </DialogFooter>
              </DialogContent>
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
        <h1 className="sm:hidden w-full text-center pt-4 pb-4 text-2xl text-white bg-[var(--gris-oscuro)]">
          Seguimiento Personal
        </h1>
        <main className="max-w-3xl mx-auto p-6 bg-white rounded-md sm:shadow-md mb-10 mt-4 sm:mt-10">
          <section className="flex flex-col sm:flex-row items-center gap-12 mb-8">
            <div className="flex flex-col items-center gap-5 w-1/3">
              <img
                src={imagen}
                alt={`Imagen de perfil de ${localUser.nombre}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--gris-oscuro)] bg-[var(--gris-oscuro)]"
              />
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="imagen"
                  render={() => (
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
            <div className="bg-blue-50 p-4 rounded-md shadow w-full sm:bg-white sm:rounded-none">
              <h2 className="text-xl font-semibold">{localUser.nombre}</h2>
              <p className="text-gray-600 mt-2">
                Edad:{" "}
                <span className="font-medium">
                  {backendData.fechaNacimiento
                    ? `${calcularEdad(backendData.fechaNacimiento)} años`
                    : "-"}
                </span>
              </p>
              <p className="text-gray-600">
                Fecha de nacimiento:{" "}
                <span className="font-medium">
                  {backendData.fechaNacimiento}
                </span>
              </p>
              <p className="text-gray-600">
                Género: <span className="font-medium">{detalles?.genero}</span>
              </p>
            </div>
          </section>

          <section>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Peso</h3>
                <p className="text-md ">{detalles?.peso || "-"} Kg</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Altura</h3>
                <p className="text-md ">{detalles?.altura || "-"} cm</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Objetivo</h3>
                <p className="text-md">{detalles?.objetivo || "-"}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md shadow">
                <h3 className="font-semibold text-xl mb-2">Intolerancias</h3>
                <p className="text-md">
                  {detalles?.intolerancias || "Ninguna"}
                </p>
              </div>
            </section>
            <div className="bg-blue-50 p-4 rounded-md shadow mt-6">
              <h3 className="font-semibold text-xl mb-2">Mis Reservas</h3>
              <div className="text-md flex flex-row flex-wrap space-y-2 gap-[1rem]">
                {reservas.length > 0
                  ? reservas.map((reserva) => (
                      <div
                        key={reserva.id}
                        className="p-2 border border-gray-200 rounded bg-white shadow-sm m-1 sm:basis-[calc(50%-1rem)] basis-full"
                      >
                        <p>
                          <strong>Clase:</strong> {reserva.nombreClase || "N/A"}
                        </p>
                        <p>
                          <strong>Horario:</strong>{" "}
                          {new Date(reserva.fechaHora)
                            .toLocaleString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })
                            .replace(",", " a las")}
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
          </section>
          <div className="rounded-md mt-10 mb-10 justify-between sm:justify-start gap-4 flex flex-row">
            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
              <DialogTrigger asChild>
                <span className="basis-1/2 text-center rounded-full h-12 font-bold bg-red-500 hover:bg-red-600 text-white px-6 flex justify-center font-semibold cursor-pointer transition-colors duration-200 items-center">
                  Cerrar Sesión
                </span>
              </DialogTrigger>

              <DialogContent className="max-w-md rounded-xl bg-white shadow-lg p-8 animate-fadeIn">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-semibold text-gray-800 mb-6">
                    ¿Ya estás cansado?
                  </DialogTitle>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Siempre podrás volver a entrenar más tarde
                  </p>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-4 mt-6">
                  <DialogClose asChild>
                    <span className="bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-500 transition cursor-pointer">
                      Cancelar
                    </span>
                  </DialogClose>
                  <button
                    onClick={() => {
                      setOpenLogout(false);
                      handleLogOut();
                    }}
                    className="bg-red-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-red-800 transition cursor-pointer"
                  >
                    Sí, cerrar sesión
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openEliminar} onOpenChange={setOpenEliminar}>
              <DialogTrigger asChild>
                <span className="basis-1/2 text-center bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-500 transition cursor-pointer font-bold">
                  Darme de baja
                </span>
              </DialogTrigger>

              <DialogContent className="max-w-md rounded-xl bg-white shadow-lg p-8 animate-fadeIn">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-semibold text-gray-800 mb-6">
                    ¡No te vayas!
                  </DialogTitle>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Esta acción eliminará tu cuenta permanentemente. ¿Deseas
                    continuar?
                  </p>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-4 mt-6">
                  <DialogClose asChild>
                    <span className="bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-500 transition cursor-pointer">
                      Cancelar
                    </span>
                  </DialogClose>
                  <button
                    onClick={() => {
                      setOpenEliminar(false);
                      handleDeleteAccount();
                    }}
                    className="bg-red-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-red-800 transition cursor-pointer"
                  >
                    Sí, eliminar cuenta
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    );
  }
}
