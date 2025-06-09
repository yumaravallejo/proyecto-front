"use client";

import React, { useState } from "react";
import Actividad from "./Actividad";

interface ActividadType {
  nombre: string;
  capacidadMaxima: number;
  tipoClase: string;
  descripcion: string;
  duracion: number;
  exigencia: string;
  imagen: string;
}

export default function FiltrosActividades({
  actividades,
}: {
  actividades: ActividadType[];
}) {
  const [tipoFiltro, setTipoFiltro] = useState("TODAS");

  const actividadesFiltradas =
    tipoFiltro === "TODAS"
      ? actividades
      : actividades.filter((a) => a.tipoClase === tipoFiltro);

  const filtros = [
    { tipo: "TODAS", color: "gray", label: "TODAS" },
    { tipo: "CARDIO", color: "pink", label: "CARDIO" },
    { tipo: "INFANTIL", color: "blue", label: "INFANTIL" },
    { tipo: "RELAJACION", color: "green", label: "CUERPO Y MENTE" },
    { tipo: "FUERZA", color: "red", label: "FUERZA" },
    { tipo: "TONIFICACION", color: "yellow", label: "TONIFICACIÓN" },
    { tipo: "TONO_CARDIO", color: "orange", label: "TONO Y CARDIO" },
  ];

  return (
    <>
      <section className="filtros-actividades w-full flex overflow-x-auto gap-2">
        {filtros.map(({ tipo, color, label }) => (
          <article
            key={tipo}
            className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
            onClick={() => setTipoFiltro(tipo)}
          >
            <span className={`w-5 h-5 bg-${color}-500 border-2`}></span>
            <span
              className={`text-md text-left text-white min-w-max ${
                tipoFiltro === tipo
                  ? "underline underline-offset-4 font-bold"
                  : ""
              }`}
            >
              {label}
            </span>
          </article>
        ))}
      </section>

      <div className="actividades sm:mx-auto flex flex-col sm:flex-row sm:flex-wrap gap-y-15 sm:justify-between p-6 max-w-6xl">
        {actividadesFiltradas.map((actividad, idx) => (
          <Actividad
            key={idx}
            nombre={actividad.nombre}
            capacidad={actividad.capacidadMaxima}
            descripcion={actividad.descripcion}
            duracion={actividad.duracion}
            exigencia={actividad.exigencia}
            imagen={actividad.imagen}
            tipoClase={actividad.tipoClase}
          />
        ))}
      </div>
    </>
  );
}
