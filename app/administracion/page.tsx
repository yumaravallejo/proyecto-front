"use client";

import React, { useEffect, useState } from "react";
import Footer from "../componentes/Footer";
import HeaderUs from "../componentes/HeaderUs";
import BaneoUser from "../componentes/BaneoUser";
import AddEntrenador, { FormValues } from "../componentes/AddEntrenador";
import { toast, Toaster } from "sonner";

interface DatosIniciales {
  usuariosRegistrados: number;
  usuariosActivos: number;
  usuariosPendientes: number;
  entrenadoresRegistrados: number;
}

export default function Administracion() {
  const [datosIniciales, setDatosIniciales] = useState<DatosIniciales | null>(
    null
  );
  const [cargando, setCargando] = useState<boolean>(true);

  async function fetchDatos() {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const token = parsedUser?.token;
    const URL = process.env.NEXT_PUBLIC_API;

    try {
      const res = await fetch(`${URL}/entrenador/panel-administracion`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener los datos");
      }

      const data = await res.json();
      setDatosIniciales(data);
      setCargando(false);
    } catch (error) {
      setCargando(false);
      console.error(error);
    }
  }

  async function handleSubmitForm(values: FormValues) {
    setCargando(true);
    values.sueldo = parseFloat(values.sueldo.toString());

    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token;
      const URL = process.env.NEXT_PUBLIC_API;
      const response = await fetch(URL + "/entrenador/registrarEntrenador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el entrenador");
      }

      toast.success("Entrenador registrado con éxito", {
        description: "El entrenador ha sido añadido",
      });

      fetchDatos();
    } catch (error) {
      toast.error("Error al registrar el entrenador", {
        description: "Intenta de nuevo más tarde " + error,
      });
    } finally {
      setCargando(false);
    }
  }
  
  async function handleBanUser({ userId }: { userId: string }) {
  setCargando(true);
  try {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const token = parsedUser?.token;
    const URL = process.env.NEXT_PUBLIC_API;

    const response = await fetch(`${URL}/entrenador/banear-usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
      throw new Error("No se pudo banear el usuario");
    }

    toast.success("Usuario baneado correctamente");
    fetchDatos(); // Actualiza los datos después del baneo
  } catch (error) {
    toast.error("Error al banear el usuario", {
      description: String(error),
    });
  } finally {
    setCargando(false);
  }
}

  useEffect(() => {
    fetchDatos();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <HeaderUs promocion={null} pagina="ADMINISTRACIÓN" />
      <Toaster />
      <main className="min-h-screen sm:max-w-7xl w-full mx-auto ">
        <h1 className="sm:hidden w-full text-center pt-4 pb-4 mb-10 text-2xl text-white bg-[var(--gris-oscuro)]">
          PANEL DE ADMINISTRACIÓN
        </h1>

        <h1 className="hidden sm:block w-full text-center text-3xl text-[var(--gris-oscuro)] pt-10 pb-10">
          PANEL DE ADMINISTRACIÓN
        </h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-4 sm:px-10">
          {cargando && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          )}
          <article className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-semibold text-gray-800">
              USUARIOS REGISTRADOS
            </h2>
            <p className="text-4xl text-blue-600 font-bold">
              {datosIniciales?.usuariosRegistrados}
            </p>
          </article>

          <article className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-semibold text-gray-800">
              USUARIOS ACTIVOS
            </h2>
            <p className="text-4xl text-green-600 font-bold">
              {datosIniciales?.usuariosActivos}
            </p>
          </article>

          <article className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-semibold text-gray-800">
              USUARIOS PENDIENTES DE PAGO
            </h2>
            <p className="text-4xl text-yellow-600 font-bold">
              {datosIniciales?.usuariosPendientes}
            </p>
          </article>

          <article className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-semibold text-gray-800">
              ENTRENADORES REGISTRADOS
            </h2>
            <p className="text-4xl text-purple-600 font-bold">
              {datosIniciales?.entrenadoresRegistrados}
            </p>
          </article>
          <BaneoUser onSubmit={handleBanUser} />
          <AddEntrenador onSubmit={handleSubmitForm} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
