"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Footer from "../componentes/Footer";
import HeaderUs from "../componentes/HeaderUs";
import type { Horario } from "../componentes/SchedulePage";

const SchedulePage = dynamic(() => import("../componentes/SchedulePage"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[300px] text-white">
      Cargando horarios...
    </div>
  ),
});

export default function Horarios() {
  const [horarios, setHorarios] = useState<Horario[]>(() => {
    const hoy = new Date().toISOString().split("T")[0];
    const cache = localStorage.getItem("horariosCache");

    if (cache) {
      try {
        const { fecha, datos } = JSON.parse(cache);
        if (fecha === hoy) {
          return datos;
        }
      } catch (error) {
        console.error("Error al parsear el cache de horarios", error);
      }
    }

    return [];
  });

  const [dataCargada, setDataCargada] = useState(horarios.length > 0);

  useEffect(() => {
    if (dataCargada) return;

    const getHorarios = async () => {
      const hoy = new Date().toISOString().split("T")[0];
      const URL = process.env.NEXT_PUBLIC_API;
      if (!URL) {
        console.error("NEXT_PUBLIC_API no está definida en .env");
        return;
      }

      try {
        const res = await fetch(`${URL}/usuarios/horarios`);
        if (!res.ok) {
          alert("No se han podido cargar los horarios");
          return;
        }

        const data: Horario[] = await res.json();
        setHorarios(data);
        setDataCargada(true);
        localStorage.setItem(
          "horariosCache",
          JSON.stringify({ fecha: hoy, datos: data })
        );
      } catch (error) {
        console.error("Error al obtener horarios:", error);
      }
    };

    getHorarios();
  }, [dataCargada]);

  return (
    <div>
      <HeaderUs promocion={null} pagina="ACTIVIDADES" />
      <main
        id="horarioActividades"
        className="min-h-[calc(100vh-200px)] bg-gray-100 text-white"
      >
        <h1 className="sm:hidden w-full text-center pt-4 pb-4 mb-2 text-2xl text-white bg-[var(--gris-oscuro)]">
          ACTIVIDADES GRUPALES
        </h1>
        <SchedulePage horariosIniciales={horarios} cargando={!dataCargada} />
      </main>
      <Footer />
    </div>
  );
}
