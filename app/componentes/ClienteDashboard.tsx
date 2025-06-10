"use client";

import React, { useState, useEffect } from "react";
import { ClaseHoyItem, Descripcion, Evento, TipoClase } from "./types";

const tipoClaseColors: Record<TipoClase, string> = {
  CARDIO: "bg-red-500",
  FUERZA: "bg-blue-400",
  RELAJACION: "bg-green-600",
  TONIFICACION: "bg-yellow-500",
  INFANTIL: "bg-purple-600",
  TONO_CARDIO: "bg-orange-500",
};

interface DietaBackend {
  idDieta: number;
  descripcion: string; 
  fecha: string; 
}

export interface InfoHoyDTOBackend {
  clasesHoy: ClaseHoyItem[]; 
  eventosHoy: Evento[]; 
  dietaHoy: DietaBackend | null;
}

interface Props {
  infoHoy: InfoHoyDTOBackend;
}

export default function ClienteView({ infoHoy }: Props) {
  const [descripcionDieta, setDescripcionDieta] = useState<Descripcion | null>(null);
  const clasesOrdenadas = [...infoHoy.clasesHoy].sort(
    (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
  );

  useEffect(() => {
    if (infoHoy.dietaHoy?.descripcion) {
      try {
        const parsed = JSON.parse(infoHoy.dietaHoy.descripcion);
        setDescripcionDieta(parsed);
      } catch (error) {
        console.error("Error parsing dieta description:", error);
        setDescripcionDieta({
          desayuno: "-",
          comida: "-",
          merienda: "-",
          cena: "-",
          picoteo: "-"
        });
      }
    }
  }, [infoHoy.dietaHoy]);

  return (
    <div className="px-4 py-6 mx-auto min-h-screen">
      <div className="w-full flex flex-row items-center justify-center mb-15 mt-5">
        <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
        <h1 className="text-3xl font-extrabold text-center text-white bg-[var(--gris-oscuro)] px-5 sm:px-20 whitespace-nowrap">
          PLANNING DE HOY
        </h1>
        <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:max-w-7xl mx-auto">
        {/* Eventos */}
        <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:min-h-[700px]">
          <div className="p-4 bg-[var(--dorado)] ">
            <h3 className="text-xl font-semibold text-white">EVENTOS HOY</h3>
          </div>
          <div className="p-4 flex-grow flex flex-col text-gray-900 max-h-[700px] overflow-y-auto ">
            {infoHoy.eventosHoy.length > 0 ? (
              <ul className="space-y-4">
                {infoHoy.eventosHoy.map((evento) => {
                  const inicio = new Date(
                    evento.fechaInicio
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const fin = new Date(evento.fechaFin).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <li
                      key={evento.id}
                      className="bg-gray-100 rounded-md p-3 flex flex-col"
                      aria-label={`Evento ${evento.nombre} desde las ${inicio} hasta las ${fin}`}
                    >
                      <p className="font-bold text-lg truncate">
                        {evento.nombre}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {evento.detallesEvento}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-semibold">Horario:</span> {inicio}{" "}
                        – {fin}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600 text-center flex-grow flex items-center justify-center">
                No hay eventos hoy
              </p>
            )}
          </div>
        </section>

        {/* Dieta del día */}
        <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-[var(--dorado)] to-[var(--azul)]">
            <h3 className="text-xl font-semibold text-white">COMIDAS DE HOY</h3>
          </div>
          <div className="p-4 flex-grow flex flex-col text-gray-900">
            {!infoHoy.dietaHoy || !descripcionDieta ? (
              <p className="text-gray-600 text-center flex-grow flex items-center justify-center">
                No tienes ninguna dieta asignada
              </p>
            ) : (
              <section className="prose prose-sm max-w-none overflow-auto text-gray-700 flex flex-col gap-y-5">
                <article className="rounded-lg w-full bg-gray-100 p-4 flex flex-col gap-y-2">
                  <span className="font-bold text-lg truncate text-black">Desayuno</span>
                  <p className="text-sm">
                    {descripcionDieta.desayuno || " - "}
                  </p>
                </article>
                <article className="rounded-lg  w-full bg-gray-100 p-4 flex flex-col gap-y-5">
                  <span className="font-bold text-lg truncate text-black">Almuerzo</span>
                  <p className="text-sm">
                    {descripcionDieta.comida || " - "}
                  </p>
                </article>
                <article className="rounded-lg w-full bg-gray-100 p-4 flex flex-col gap-y-5">
                 <span className="font-bold text-lg truncate text-black">Merienda</span>
                  <p className="text-sm">
                    {descripcionDieta.merienda || " - "}
                  </p>
                </article>
                <article className="rounded-lg w-full bg-gray-100 p-4 flex flex-col gap-y-5">
                  <span className="font-bold text-lg truncate text-black">Cena</span>
                  <p className="text-sm">
                    {descripcionDieta.cena || " - "}
                  </p>
                </article>
                <article className="rounded-lg  w-full bg-gray-100 p-4 flex flex-col gap-y-5">
                  <span className="font-bold text-lg truncate text-black">Picoteo</span>
                  <p className="text-sm">
                    {descripcionDieta.picoteo || " - "}
                  </p>
                </article>
              </section>
            )}
          </div>
        </section>

        {/* Clases */}
        <section className=" bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:min-h-[700px]">
          <div className="p-4 bg-[var(--azul)]">
            <h3 className="text-xl font-semibold text-white">CLASES HOY</h3>
          </div>
          <div className="p-4 flex-grow flex flex-col text-gray-900 sm:max-h-[700px] max-h-[500px] overflow-y-auto ">
            {clasesOrdenadas.length > 0 ? (
              <ul className="space-y-4">
                {clasesOrdenadas.map((item) => {
                  const horaLocal = new Date(item.fechaHora).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );
                  const stripeClass = tipoClaseColors[item.clase.tipoClase];
                  return (
                    <li
                      key={item.id}
                      className="bg-gray-100 rounded-md flex overflow-hidden"
                      aria-label={`Clase ${item.clase.nombre} a las ${horaLocal}`}
                    >
                      <div className={`${stripeClass} w-2`} />
                      <div className="p-3 flex flex-col flex-grow">
                        <p className="font-bold text-lg truncate text-gray-800">
                          {item.clase.nombre}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Hora: {horaLocal}
                        </p>
                        <p className="text-gray-600 text-sm truncate">
                          Tipo: {item.clase.tipoClase}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600 text-center flex-grow flex items-center justify-center">
                No tienes clases hoy
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}