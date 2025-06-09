"use client";
import React, { useState, useEffect } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import Actividad from "../componentes/Actividad";

interface Actividades {
  nombre: string;
  capacidadMaxima: number;
  tipoClase: string;
  descripcion: string;
  duracion: number;
  exigencia: string;
  imagen: string;
}

export default function Actividades() {
  const [user, setUser] = useState(null);
  const [actividades, setActividades] = useState<Actividades[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState("TODAS");
  const [cargando, setCargando] = useState(true); // Estado de carga

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

  useEffect(() => {
    setUser(user);
    fetchActividades();
  }, []);

  function filterByType(tipo: string) {
    setTipoFiltro(tipo);
  }

  const actividadesFiltradas =
    tipoFiltro === "TODAS"
      ? actividades
      : actividades.filter((actividad) => actividad.tipoClase === tipoFiltro);

  return (
    <div>
      <HeaderUs promocion={null} pagina="ACTIVIDADES" />
      <main
        id="actividadesUnlogged"
        className="bg-[var(--gris-oscuro)] min-h-screen"
      >
        <div className="pb-20">
          <section className="filtros-actividades w-full flex overflow-x-auto gap-2 ">
            <article
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => filterByType("TODAS")}
            >
              <span className="w-5 h-5 bg-[#d1d1d1] border-2"></span>
              <span
                className={`text-md text-left text-white min-w-max ${
                  tipoFiltro === "TODAS"
                    ? "underline underline-offset-4 font-bold"
                    : ""
                }`}
              >
                TODAS
              </span>
            </article>
            <article
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => filterByType("CARDIO")}
            >
              <span className="w-5 h-5 bg-pink-500 border-2"></span>
              <span
                className={`text-md text-left text-white min-w-max ${
                  tipoFiltro === "CARDIO"
                    ? "underline underline-offset-4 font-bold"
                    : ""
                }`}
              >
                CARDIO
              </span>
            </article>
            <article
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => filterByType("INFANTIL")}
            >
              <span className="w-5 h-5 bg-blue-500 border-2"></span>
              <span
                className={`text-md text-left text-white min-w-max ${
                  tipoFiltro === "INFANTIL"
                    ? "underline underline-offset-4 font-bold"
                    : ""
                }`}
              >
                INFANTIL
              </span>
            </article>
            <article
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => filterByType("RELAJACION")}
            >
              <span className="w-5 h-5 bg-green-500 border-2"></span>
              <span
                className={`text-md text-left text-white min-w-max ${
                  tipoFiltro === "RELAJACION"
                    ? "underline underline-offset-4 font-bold"
                    : ""
                }`}
              >
                CUERPO Y MENTE
              </span>
            </article>
            <article
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => filterByType("FUERZA")}
            >
              <span className="w-5 h-5 bg-red-500 border-2"></span>
              <span
                className={`text-md text-left text-white min-w-max ${
                  tipoFiltro === "FUERZA"
                    ? "underline underline-offset-4 font-bold"
                    : ""
                }`}
              >
                FUERZA
              </span>
            </article>
            <article
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => filterByType("TONIFICACION")}
            >
              <span className="w-5 h-5 bg-yellow-500 border-2"></span>
              <span
                className={`text-md text-left text-white min-w-max ${
                  tipoFiltro === "TONIFICACION"
                    ? "underline underline-offset-4 font-bold"
                    : ""
                }`}
              >
                TONIFICACIÓN
              </span>
            </article>
            <article
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => filterByType("TONO_CARDIO")}
            >
              <span className="w-5 h-5 bg-orange-500 border-2"></span>
              <span
                className={`text-md text-left text-white min-w-max ${
                  tipoFiltro === "TONO_CARDIO"
                    ? "underline underline-offset-4 font-bold"
                    : ""
                }`}
              >
                TONO Y CARDIO
              </span>
            </article>
          </section>
          <div className="actividades flex flex-col gap-y-15 p-6">
            {cargando ? ( // Mostrar un mensaje de carga
              <div className="text-white text-center">
                Cargando actividades...
              </div>
            ) : (
              actividadesFiltradas.map((actividad, idx) => (
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
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
