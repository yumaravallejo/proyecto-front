"use client";
import React, { useState, useEffect } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import Actividad from "../componentes/Actividad";

interface Actividades {
  nombre: string,
  capacidadMaxima: number,
  tipoClase: string,
  descripcion: string,
  duracion: number,
  exigencia: string,
  imagen: string
}

export default function Actividades() {
  const [user, setUser ] = useState(null);
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
      setCargando(false); // Cambiar el estado de carga a false al finalizar
    }
  };

  useEffect(() => {
    setUser (user);
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
      <main id="actividadesUnlogged" className="bg-[var(--gris-oscuro)] min-h-screen">
        <div className="pb-20">
          <section className="filtros-actividades w-full flex overflow-x-auto gap-2 ">
            {/* Filtros aquí */}
          </section>
          <div className="actividades flex flex-col gap-y-15 p-6">
            {cargando ? ( // Mostrar un mensaje de carga
              <div className="text-white text-center">Cargando actividades...</div>
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
