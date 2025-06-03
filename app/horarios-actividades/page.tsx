'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Footer from '../componentes/Footer';
import HeaderUs from '../componentes/HeaderUs';
import type { Horario } from '../componentes/SchedulePage';

// Import dinámico para deshabilitar SSR
const SchedulePage = dynamic(
  () => import('../componentes/SchedulePage'),
  { ssr: false }
);

export default function Horarios() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function getHorarios() {
      try {
        const URL = process.env.NEXT_PUBLIC_API;
        if (!URL) {
          console.error('NEXT_PUBLIC_API no está definida en .env');
          setCargando(false);
          return;
        }

        const res = await fetch(`${URL}usuarios/horarios`);
        if (!res.ok) {
          alert('No se han podido cargar los horarios');
          setCargando(false);
          return;
        }

        const data: Horario[] = await res.json();
        setHorarios(data);
      } catch (error) {
        console.error('Error al obtener horarios:', error);
      } finally {
        setCargando(false);
      }
    }

    getHorarios();
  }, []);

  return (
    <div>
      <HeaderUs promocion={null} pagina="HORARIO DE ACTIVIDADES" />

      <main id="horarioActividades" className="min-h-[calc(100vh-200px)]">
          <SchedulePage horariosIniciales={horarios} />
      </main>

      <Footer />
    </div>
  );
}
