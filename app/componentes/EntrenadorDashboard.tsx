"use client";

import React from "react";
import { TipoClase, UsuarioDTO } from "./types";
import { InfoHoyDTOBackend } from "./ClienteDashboard";
 // o donde tengas tipos

const tipoClaseColors: Record<TipoClase, string> = {
  CARDIO: "bg-red-500",
  FUERZA: "bg-blue-400",
  RELAJACION: "bg-green-600",
  TONIFICACION: "bg-yellow-500",
  INFANTIL: "bg-purple-600",
  TONO_CARDIO: "bg-orange-500",
};

interface Props {
  infoHoy: InfoHoyDTOBackend;
  user: UsuarioDTO;
}

export default function EntrenadorView({ infoHoy, user }: Props) {
  // Filtrar solo clases del entrenador
  const misClasesHoy = infoHoy.clasesHoy.filter(
    (item) => item.usuario.id === user.id
  );

  const nombre = user.nombre || "Entrenador";
  const titulo = `PLANNING DE ${nombre.toUpperCase()}`;

  // Ordenar por fechaHora
  const clasesOrdenadas = [...misClasesHoy].sort(
    (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
  );

  return (
    <div className="px-4 py-6 space-y-8 sm:space-y-12 min-h-screen">
      <div className="w-full flex flex-row items-center justify-center mb-10 mt-5">
        <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
        <h1 className="text-3xl font-extrabold text-center text-white bg-[var(--gris-oscuro)] px-5 sm:px-20 whitespace-nowrap">
          {titulo}
        </h1>
        <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto h-full">
        {/* Clases del entrenador */}
        <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ">
          <div className="p-4 bg-gradient-to-r from-[var(--dorado)] to-[var(--azul)]">
            <h3 className="text-xl font-semibold text-white">MIS CLASES HOY</h3>
          </div>
          <div className="p-4 flex-grow flex flex-col text-gray-900 min-h-[700px]">
            {clasesOrdenadas.length > 0 ? (
              <ul className="space-y-4 overflow-y-auto max-h-96">
                {clasesOrdenadas.map((item) => {
                  const horaLocal = new Date(item.fechaHora).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
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
                        <p className="text-gray-600 text-sm">Hora: {horaLocal}</p>
                        <p className="text-gray-600 text-sm truncate">
                          Tipo: {item.clase.tipoClase}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600 text-center flex-grow flex items-center justify-center h-full">
                No tienes clases asignadas hoy
              </p>
            )}
          </div>
        </section>

        {/* Eventos */}
        <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-[var(--azul)] to-[var(--dorado)]">
            <h3 className="text-xl font-semibold text-white">EVENTOS HOY</h3>
          </div>
          <div className="p-4 flex-grow flex flex-col text-gray-900 max-h-96 overflow-y-auto min-h-[700px]">
            {infoHoy.eventosHoy.length > 0 ? (
              <ul className="space-y-4">
                {infoHoy.eventosHoy.map((evento) => {
                  const inicio = new Date(evento.fechaInicio).toLocaleTimeString([], {
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
                      <p className="font-bold text-lg truncate">{evento.nombre}</p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {evento.detallesEvento}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-semibold">Horario:</span> {inicio} – {fin}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600 text-center flex-grow flex items-center justify-center h-full">
                No hay eventos hoy
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
