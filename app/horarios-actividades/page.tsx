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
      } catch (error) {
        console.error('Error al obtener horarios:', error);
      }
    };

    getHorarios();
  }, []);

  return (
    <div>
      <HeaderUs promocion={null} pagina="HORARIOS" />

      <main id="horarioActividades" className="min-h-[calc(100vh-200px)] bg-[var(--gris-oscuro)] text-white">
        <SchedulePage horariosIniciales={horarios} cargando={!dataCargada} />
      </main>

      <Footer />
    </div>
  );
}
