'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Footer from '../componentes/Footer';
import HeaderUs from '../componentes/HeaderUs';
import type { Horario } from '../componentes/SchedulePage';

// Carga dinámica sin SSR
const SchedulePage = dynamic(() => import('../componentes/SchedulePage'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[300px] text-white">
      Cargando horarios...
    </div>
  ),
});

export default function Horarios() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [dataCargada, setDataCargada] = useState(false);

  // Cargar datos en segundo plano sin bloquear el render
  useEffect(() => {
    const getHorarios = async () => {
      const hoy = new Date().toISOString().split('T')[0]; // '2025-06-05'

      const cache = localStorage.getItem('horariosCache');
      if (cache) {
        const { fecha, datos } = JSON.parse(cache);
        if (fecha === hoy) {
          setHorarios(datos);
          setDataCargada(true);
          return;
        }
      }

      try {
        const URL = process.env.NEXT_PUBLIC_API;
        if (!URL) {
          console.error('NEXT_PUBLIC_API no está definida en .env');
          return;
        }

        const res = await fetch(`${URL}usuarios/horarios`);
        if (!res.ok) {
          alert('No se han podido cargar los horarios');
          return;
        }

        const data: Horario[] = await res.json();
        setHorarios(data);
        setDataCargada(true);

        // Guardar en localStorage con la fecha de hoy
        localStorage.setItem(
          'horariosCache',
          JSON.stringify({ fecha: hoy, datos: data })
        );
      } catch (error) {
        console.error('Error al obtener horarios:', error);
      }
    };

    getHorarios();
  }, []);


  return (
    <div>
      <HeaderUs promocion={null} pagina="ACTIVIDADES" />

      <main id="horarioActividades" className="min-h-[calc(100vh-200px)] bg-gray-100 text-white">
        <h1 className="sm:hidden w-full text-center pt-4 pb-4 mb-2 text-2xl text-white bg-[var(--gris-oscuro)]">ACTIVIDADES GRUPALES</h1>
        <SchedulePage horariosIniciales={horarios} cargando={!dataCargada} />
      </main>

      <Footer />
    </div>
  );
}
