"use client";

import React, { useEffect, useState } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

// === DEFINICIÓN DE TIPOS Y MAPEOS DE COLOR ===

export type TipoClase =
  | "CARDIO"
  | "FUERZA"
  | "RELAJACION"
  | "TONIFICACION"
  | "INFANTIL"
  | "TONO_CARDIO";

const tipoClaseColors: Record<TipoClase, string> = {
  CARDIO: "bg-red-500",
  FUERZA: "bg-blue-400",
  RELAJACION: "bg-green-600",
  TONIFICACION: "bg-yellow-500",
  INFANTIL: "bg-purple-600",
  TONO_CARDIO: "bg-orange-500",
};

interface UsuarioDTO {
  id: number;
  nombre: string;
  tipo: string;
}

interface ClaseDTO {
  id: number;
  nombre: string;
  capacidadMaxima: number;
  duracion: number;
  tipoClase: TipoClase;
  descripcion: string;
  imagen: string;
  exigencia: string;
}

interface ClaseHoyItem {
  id: number;
  usuario: UsuarioDTO; // el instructor de esta clase
  clase: ClaseDTO;
  fechaHora: string; // ISO string, ej. "2025-06-03T07:00:00"
}

interface Evento {
  id: number;
  nombre: string;
  detallesEvento: string;
  fechaInicio: string;
  fechaFin: string;
}

interface Dieta {
  idDieta: number;
  descripcion: Descripcion;
  fecha: string;
}
interface InfoHoyDTO {
  clasesHoy: ClaseHoyItem[];
  eventosHoy: Evento[];
  dietaHoy: Dieta | null;
}

interface Descripcion {
  desayuno: string;
  comida: string;
  merienda?: string;
  cena: string;
  picoteo?: string;
}

export default function Dashboard() {
  const [clasesHoy, setClasesHoy] = useState<ClaseHoyItem[]>([]);
  const [eventosHoy, setEventosHoy] = useState<Evento[]>([]);
  const [dietaHoy, setDietaHoy] = useState<Dieta | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipoUser, setTipoUser] = useState<"Cliente" | "Entrenador">("Cliente");
  const [userId, setUserId] = useState<number | null>(null);
  const [infoUser, setInfoUser] = useState<UsuarioDTO | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const fetchInfoHoy = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser: UsuarioDTO & { id: number } = JSON.parse(storedUser);
      setUserId(parsedUser.id);
      setInfoUser(parsedUser);
      if (parsedUser.tipo === "Entrenador") {
        setTipoUser("Entrenador");
      }

      try {
        const res = await fetch(`${API_URL}/usuarios/info-hoy/${parsedUser.id}`);
        if (!res.ok) alert("Error al obtener InfoHoyDTO");
        const data: InfoHoyDTO = await res.json();

        setClasesHoy(Array.isArray(data.clasesHoy) ? data.clasesHoy : []);
        setEventosHoy(Array.isArray(data.eventosHoy) ? data.eventosHoy : []);
        if (data.dietaHoy) {
          const descripcionObj = data.dietaHoy.descripcion;
          if (typeof descripcionObj === "string") {
            const parsedDescripcionObj = JSON.parse(descripcionObj);

            setDietaHoy({
              ...data.dietaHoy,
              descripcion: {
                desayuno: parsedDescripcionObj.desayuno || " - ",
                comida: parsedDescripcionObj.comida || " - ",
                merienda: parsedDescripcionObj.merienda || " - ",
                cena: parsedDescripcionObj.cena || " - ",
                picoteo: parsedDescripcionObj.picoteo || " - ",
              },
            });
          } else {
            setDietaHoy(null);
          }
        }
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
        setClasesHoy([]);
        setEventosHoy([]);
        setDietaHoy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInfoHoy();
  }, []);

  // Ordeno pir fecha para q salga primero la que va primero
  const clasesHoyOrdenadas = [...clasesHoy].sort(
    (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
  );

  // ------ VISTA ENTRENADOR ------
  if (tipoUser === "Entrenador") {
    // Filtramos las clases de hoy por la que item.usuario.id === userId (las clases del entrenador)
    const misClasesHoy = clasesHoyOrdenadas.filter((item) => item.usuario.id === userId);
    const nombre = infoUser && infoUser.nombre ? infoUser.nombre : "Entrenador";
    const titulo = `PLANNING DE ${nombre.toUpperCase()}`;

    return (
      <div className="flex flex-col min-h-screen">
        <HeaderUs promocion={null} pagina="DASHBOARD" />

        <main className="flex-grow bg-[var(--gris-oscuro)] text-gray-900">
          {/* Encabezado entrenador */}
          <div className="w-full flex flex-row items-center justify-center mb-10 mt-5">
            <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
            <h1 className="text-3xl font-extrabold text-center text-white bg-[var(--gris-oscuro)] px-5 sm:px-20 whitespace-nowrap">
              {titulo}
            </h1>
            <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
          </div>

          <div className="px-4 py-6 max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ===== MIS CLASES DE HOY ===== */}
              <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 bg-gradient-to-r from-[var(--dorado)] to-[var(--azul)]">
                  <h3 className="text-xl font-semibold text-white">
                    MIS CLASES HOY
                  </h3>
                </div>
                <div className="p-4 flex-grow flex flex-col text-gray-900">
                  {Array.isArray(misClasesHoy) && misClasesHoy.length > 0 ? (
                    <ul className="space-y-4 overflow-y-auto">
                      {misClasesHoy.map((item) => {
                        const horaLocal = new Date(
                          item.fechaHora
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const stripeClass =
                          tipoClaseColors[item.clase.tipoClase];
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
                      No tienes clases asignadas hoy
                    </p>
                  )}
                </div>
              </section>

              {/* ===== EVENTOS DE HOY ===== */}
              <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 bg-gradient-to-r from-[var(--azul)] to-[var(--dorado)]">
                  <h3 className="text-xl font-semibold text-white">
                    EVENTOS HOY
                  </h3>
                </div>
                <div className="p-4 flex-grow flex flex-col text-gray-900">
                  {loading ? (
                    <p className="text-gray-600 text-center">
                      Cargando eventos...
                    </p>
                  ) : Array.isArray(eventosHoy) && eventosHoy.length > 0 ? (
                    <ul className="space-y-4 overflow-y-auto">
                      {eventosHoy.map((evento) => {
                        const inicio = new Date(
                          evento.fechaInicio
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const fin = new Date(
                          evento.fechaFin
                        ).toLocaleTimeString([], {
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
                              <span className="font-semibold">Horario:</span>{" "}
                              {inicio} – {fin}
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
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderUs promocion={null} pagina="DASHBOARD" />

        <main className="flex-grow bg-[var(--gris-oscuro)] text-gray-900">
          {/* Encabezado */}
          <div className="w-full flex flex-row items-center justify-center mb-10 lg:mt-10 mt-5">
            <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
            <h1 className="text-3xl font-extrabold text-center text-white bg-[var(--gris-oscuro)] px-5 sm:px-20 whitespace-nowrap">
              PLANNING DE HOY
            </h1>
            <span className="bg-[var(--azul)] h-3 rounded-full flex-grow"></span>
          </div>

          {/* Contenedor principal */}
          <div className="px-4 py-6 max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ===== SECCIÓN: Eventos de hoy ===== */}
              <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 bg-[var(--dorado)] ">
                  <h3 className="text-xl font-semibold text-white">
                    EVENTOS DE HOY
                  </h3>
                </div>
                <div className="p-4 flex-grow flex flex-col text-gray-900">
                  {Array.isArray(eventosHoy) && eventosHoy.length > 0 ? (
                    <ul className="space-y-4 overflow-y-auto">
                      {eventosHoy.map((evento) => {
                        const inicio = new Date(
                          evento.fechaInicio
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const fin = new Date(
                          evento.fechaFin
                        ).toLocaleTimeString([], {
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
                              <span className="font-semibold">Horario:</span>{" "}
                              {inicio} – {fin}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-center flex-grow flex items-center justify-center">
                      No hay eventos programados para hoy
                    </p>
                  )}
                </div>
              </section>

              {/* ===== SECCIÓN: Dieta de hoy ===== */}
              <section className="col-span-1 bg-white rounded-lg shadoaw-lg overflow-hidden flex flex-col">
                <div className="p-4 bg-gradient-to-r from-[var(--dorado)] to-[var(--azul)]">
                  <h3 className="text-xl font-semibold text-white">
                    COMIDAS DE HOY
                  </h3>
                </div>
                <div className="p-4 flex-grow flex flex-col text-gray-900">
                  {!dietaHoy ? (
                    <p className="text-gray-600 text-center flex-grow flex items-center justify-center">
                      No tienes ninguna dieta asignada
                    </p>
                  ) : (
                    <section className="prose prose-sm max-w-none overflow-auto text-gray-700 flex flex-col gap-y-5">
                      <article className="rounded-lg shadow-lg w-full bg-gray-100  p-4 flex flex-col gap-y-2">
                        <h4>Desayuno</h4>
                        <p className="text-sm">
                          {dietaHoy.descripcion.desayuno}
                        </p>
                      </article>
                      <article className="rounded-lg shadow-lg w-full bg-gray-100  p-4 flex flex-col gap-y-5">
                        <h4>Almuerzo</h4>
                        <p className="text-sm">{dietaHoy.descripcion.comida}</p>
                      </article>
                      <article className="rounded-lg shadow-lg w-full bg-gray-100  p-4 flex flex-col gap-y-5">
                        <h4>Merienda</h4>
                        <p className="text-sm">
                          {dietaHoy.descripcion.merienda || " - "}
                        </p>
                      </article>
                      <article className="rounded-lg shadow-lg w-full bg-gray-100  p-4 flex flex-col gap-y-5">
                        <h4>Cena</h4>
                        <p className="text-sm">{dietaHoy.descripcion.cena}</p>
                      </article>
                      <article className="rounded-lg shadow-lg w-full bg-gray-100  p-4 flex flex-col gap-y-5">
                        <h4>Picoteo</h4>
                        <p className="text-sm">
                          {dietaHoy.descripcion.picoteo || " - "}
                        </p>
                      </article>
                      <article></article>
                    </section>
                  )}
                </div>
              </section>

              {/* ===== SECCIÓN: Clases de hoy  ===== */}
              <section className="col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 bg-[var(--azul)]">
                  <h3 className="text-xl font-semibold text-white">
                    CLASES DE HOY
                  </h3>
                </div>
                <div className="p-4 flex-grow flex flex-col text-gray-900">
                  {Array.isArray(clasesHoy) && clasesHoy.length > 0 ? (
                    <ul className="space-y-4 overflow-y-auto">
                      {clasesHoyOrdenadas.map((item) => {
                        const horaLocal = new Date(
                          item.fechaHora
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        // Sacamos la clase de color según item.clase.tipoClase
                        const stripeClass =
                          tipoClaseColors[item.clase.tipoClase];
                        return (
                          <li
                            key={item.id}
                            className="bg-gray-100 rounded-md flex overflow-hidden"
                            aria-label={`Clase ${item.clase.nombre} a las ${horaLocal}`}
                          >
                            {/* Raya lateral */}
                            <div className={`${stripeClass} w-2`} />
                            {/* Contenido de la tarjeta */}
                            <div className="p-3 flex flex-col flex-grow">
                              <p className="font-bold text-lg truncate text-gray-800">
                                {item.clase.nombre}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Hora: {horaLocal}
                              </p>
                              <p className="text-gray-600 text-sm truncate">
                                Entrenador: {item.usuario.nombre}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-center flex-grow flex items-center justify-center">
                      No hay clases programadas para hoy
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }
}
