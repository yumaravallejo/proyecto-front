// app/componentes/DashboardContent.tsx
"use client";

import { useEffect, useState } from "react";
import HeaderUs from "./HeaderUs";
import Footer from "./Footer";
import EntrenadorDashboard from "./EntrenadorDashboard";
import ClienteDashboard from "./ClienteDashboard";
import { InfoHoyDTO, UsuarioDTO } from "./types";


export default function DashboardContent({ user }: { user: UsuarioDTO }) {
  const [infoHoy, setInfoHoy] = useState<InfoHoyDTO | null>(null);
  const tipoUser = user.tipo === "Entrenador" ? "Entrenador" : "Cliente";

  useEffect(() => {
    const fetchInfoHoy = async () => {
      const cache = localStorage.getItem("infoHoy");
      if (cache) {
        try {
          const parsed = JSON.parse(cache);
          if (parsed?.userId === user.id) {
            setInfoHoy(parsed.data);
            return;
          }
        } catch {}
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/usuarios/info-hoy/${user.id}`
      );
      if (!res.ok) return console.error("Error al obtener info-hoy");

      const data = await res.json();
      setInfoHoy(data);

      localStorage.setItem(
        "infoHoy",
        JSON.stringify({ userId: user.id, data })
      );
    };

    fetchInfoHoy();
  }, [user.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderUs promocion={null} pagina="DASHBOARD" />

      <main className="flex-grow bg-[var(--gris-oscuro)] text-gray-900">
        {infoHoy ? (
          tipoUser === "Entrenador" ? (
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
