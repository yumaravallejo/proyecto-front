"use client";

import React, { useEffect, useState } from "react";
import Footer from "../componentes/Footer";
import HeaderUs from "../componentes/HeaderUs";
import SchedulePage, { Horario } from "../componentes/SchedulePage";

export default function Horarios() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);

  async function getHorarios() {
    try {
      const cache = localStorage.getItem("horariosCache");

      if (cache) {
        const data = JSON.parse(cache);
        setHorarios(data);
        setCargando(false);
        return;
      }

      const URL = process.env.NEXT_PUBLIC_API;
      const res = await fetch(`${URL}/usuarios/horarios`);

      if (!res.ok) throw new Error(`Error cargando horarios`);

      const data: Horario[] = await res.json();

      localStorage.setItem("horariosCache", JSON.stringify(data));
      setHorarios(data);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      alert("No se han podido cargar los horarios");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    getHorarios();
  }, []);

  return (
    <div>
      <HeaderUs promocion={null} pagina="ACTIVIDADES" />

      <main id="horarioActividades" className="min-h-[calc(100vh-200px)] relative">
        {cargando ? (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : (
          <SchedulePage horariosIniciales={horarios} />
        )}
      </main>

      <Footer />
    </div>
  );
}
