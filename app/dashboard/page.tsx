// app/dashboard/page.tsx (o donde tengas el Dashboard)

import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import EntrenadorDashboard from "../componentes/EntrenadorDashboard";
import ClienteDashboard from "../componentes/ClienteDashboard";
import { cookies } from "next/headers";

export type TipoClase =
  | "CARDIO"
  | "FUERZA"
  | "RELAJACION"
  | "TONIFICACION"
  | "INFANTIL"
  | "TONO_CARDIO";

export interface UsuarioDTO {
  id: number;
  nombre: string;
  tipo: string;
  email: string;
  estado: string;
  imagen: string;
}

export interface ClaseDTO {
  id: number;
  nombre: string;
  capacidadMaxima: number;
  duracion: number;
  tipoClase: TipoClase;
  descripcion: string;
  imagen: string;
  exigencia: string;
}

export interface ClaseHoyItem {
  id: number;
  usuario: UsuarioDTO;
  clase: ClaseDTO;
  fechaHora: string;
}

export interface Evento {
  id: number;
  nombre: string;
  detallesEvento: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface Descripcion {
  desayuno: string;
  comida: string;
  merienda?: string;
  cena: string;
  picoteo?: string;
}

export interface Dieta {
  idDieta: number;
  descripcion: Descripcion;
  fecha: string;
}

export interface InfoHoyDTO {
  clasesHoy: ClaseHoyItem[];
  eventosHoy: Evento[];
  dietaHoy: Dieta | null;
}

async function getUser(): Promise<UsuarioDTO | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log(token);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/usuarios/infoToken`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(res.json());
    return null;
  }

  return res.json();
}

async function getInfoHoy(userId: number): Promise<InfoHoyDTO> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/usuarios/info-hoy/${userId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Error al obtener InfoHoyDTO");
  return res.json();
}

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    return <p>No estás logueado</p>;
  }

  const infoHoy = await getInfoHoy(user.id);
  const tipoUser = user.tipo === "Entrenador" ? "Entrenador" : "Cliente";

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderUs promocion={null} pagina="DASHBOARD" />

      <main className="flex-grow bg-[var(--gris-oscuro)] text-gray-900">
        {tipoUser === "Entrenador" ? (
          <EntrenadorDashboard infoHoy={infoHoy} user={user} />
        ) : (
          <ClienteDashboard infoHoy={infoHoy} />
        )}
      </main>

      <Footer />
    </div>
  );
}
