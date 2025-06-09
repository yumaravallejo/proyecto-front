"use client";
import React, { useState, useEffect } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import FiltroActividades from "../componentes/FiltroActividades";
import ListaActividades from "../componentes/ListaActividades";

interface ActividadesType {
  nombre: string;
  capacidadMaxima: number;
  tipoClase: string;
  descripcion: string;
  duracion: number;
  exigencia: string;
  imagen: string;
}

export default function Actividades() {
  const [actividades, setActividades] = useState<ActividadesType[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState("TODAS");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API;
        const res = await fetch(`${apiUrl}/actividades`);
        if (!res.ok) throw new Error("No se pudieron obtener las actividades");
        const data = await res.json();
        setActividades(data);
      } catch (err) {
        console.log(err);
        setActividades([]);
      } finally {
        setCargando(false);
      }
    };
    fetchActividades();
  }, []);

  const actividadesFiltradas =
    tipoFiltro === "TODAS"
      ? actividades
      : actividades.filter((actividad) => actividad.tipoClase === tipoFiltro);

  return (
    <div>
      <HeaderUs promocion={null} pagina="ACTIVIDADES" />
      <main id="actividadesUnlogged" className="bg-[var(--gris-oscuro)] min-h-screen">
        <div className="pb-20">
          <FiltroActividades tipoFiltro={tipoFiltro} onChangeFiltro={setTipoFiltro} />
          <ListaActividades actividades={actividadesFiltradas} cargando={cargando} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
