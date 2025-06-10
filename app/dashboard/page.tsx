"use client";

import { useEffect, useState } from "react";
import { UsuarioDTO } from "../componentes/types";
import HeaderUs from "../componentes/HeaderUs";
import EntrenadorDashboard from "../componentes/EntrenadorDashboard";
import ClienteDashboard, { InfoHoyDTOBackend } from "../componentes/ClienteDashboard";
import Footer from "../componentes/Footer";

export default function DashboardContent() {
  const [infoHoy, setInfoHoy] = useState<InfoHoyDTOBackend | null>(null);
  const [user, setUser] = useState<UsuarioDTO | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    }
  }, []); 

  useEffect(() => {
    fetchInfoHoy(user?.id);
  }, [user?.id]);

  const fetchInfoHoy = async (id: number | undefined) => {
    if (!id) {
      console.warn("No se puede obtener info-hoy: ID de usuario es undefined");
      return; 
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/usuarios/info-hoy/${id}`
    );
    if (!res.ok) return console.error("Error al obtener info-hoy");

    const data = await res.json();
    setInfoHoy(data);

    localStorage.setItem("infoHoy", JSON.stringify({ userId: user?.id, data }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderUs promocion={null} pagina="DASHBOARD" />

      <main className="flex-grow bg-[var(--gris-oscuro)] text-gray-900">
        {infoHoy ? (
          user?.tipo === "Entrenador" ? (
            <EntrenadorDashboard infoHoy={infoHoy} user={user} />
          ) : (
            <ClienteDashboard infoHoy={infoHoy} />
          )
        ) : (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
