"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import EditarHorario from "./EditarHorario";
import NuevoHorarioDialog from "./NuevoHorario";
import DeleteHorarioDialog from "./DeleteHorario";
import ClaseItem from "./ClaseItem";

export type TipoClase =
  | "CARDIO"
  | "FUERZA"
  | "RELAJACION"
  | "TONIFICACION"
  | "INFANTIL"
  | "TONO_CARDIO";

export interface Horario {
  idHorario: number;
  nombreClase: string;
  nombreEntrenador: string;
  fechaHora: string;
  capacidadMaxima: number;
  tipoClase: TipoClase;
  duracion: number;
  numReservas: number;
}

export interface NuevoHorario {
  fechaHora: string;
  idUsuario: number;
  idClase: number;
}

const tipoClaseColors: Record<TipoClase, string> = {
  CARDIO: "bg-red-500",
  FUERZA: "bg-blue-400",
  RELAJACION: "bg-green-600",
  TONIFICACION: "bg-yellow-500",
  INFANTIL: "bg-purple-600",
  TONO_CARDIO: "bg-orange-500",
};

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = Array.from({ length: 15 }, (_, i) => 7 + i);

interface SchedulePageProps {
  horariosIniciales: Horario[];
  cargando?: boolean;
}

export default function SchedulePage({ horariosIniciales, cargando }: SchedulePageProps) {

  const getValueDia = () => {
    const dia = new Date().getDay();
    return dia === 0 || dia === 6 ? 0 : dia - 1;
  }

  let indexHoy = getValueDia();

  const [userReservations, setUserReservations] = useState<number[]>([]);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>(horariosIniciales);
  const [isLoadingReservas, setIsLoadingReservas] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState<TipoClase | "TODAS">("TODAS");
  const [tipoUsuario, setTipoUsuario] = useState<string>("Cliente");
  const [horarioEdit, setHorarioEdit] = useState<Horario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [horarioAEliminar, setHorarioAEliminar] = useState<number | null>(null);
  const [idEntrenador, setIdEntrenador] = useState<number>(0);

  const URL = process.env.NEXT_PUBLIC_API;

  const getDayIndex = (fechaHora: string): number => {
    const day = new Date(fechaHora).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getClasesPara = (dia: number, hora: number) => {
    return horarios.filter((clase) => {
      const claseDate = new Date(clase.fechaHora);
      return (
        getDayIndex(clase.fechaHora) === dia &&
        claseDate.getHours() === hora &&
        (tipoFiltro === "TODAS" || clase.tipoClase === tipoFiltro)
      );
    });
  };

  const fetchUsuarioYReservas = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setTipoUsuario(parsedUser?.tipo || "Cliente");
    if (parsedUser?.tipo === "Entrenador") {
      setIdEntrenador(parsedUser.id);
    }

    if (parsedUser?.tipo === "Cliente" && parsedUser?.id) {
      setIdUsuario(parsedUser.id);
      try {
        const res = await fetch(`${URL}/usuarios/mis-reservas/${parsedUser.id}`);
        const data = await res.json();
        setUserReservations(data.map((r: { idHorario: number }) => r.idHorario));
      } catch (err) {
        toast.error("Error llamando a reservas reservas " + err);
      } finally {
        setIsLoadingReservas(false);
      }
    }
  };

  const fetchHorarios = async () => {
    try {
      const res = await fetch(`${URL}/usuarios/horarios`);
      const data = await res.json();
      setHorarios(data);
    } catch (error) {
      toast.error("Error al cargar horarios " + error);
    }
  };

  useEffect(() => {
    fetchHorarios();
    fetchUsuarioYReservas();
  }, []);

  const handleEditar = (horario: Horario) => {
    setHorarioEdit(horario);
    setDialogOpen(true);
  };

  const handleEliminarHorario = async (idHorario: number) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user?.token;

      const res = await fetch(`${URL}/entrenador/borrarHorario/${idHorario}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setHorarios((prev) => prev.filter((h) => h.idHorario !== idHorario));
      toast.success("Horario eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el horario");
    }
  };

  const handleGuardarEdicion = async (
    idHorario: number,
    cambios: { fechaHora?: string; idEntrenador?: number }
  ) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").token;

      const res = await fetch(`${URL}/entrenador/editarHorario/${idHorario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      if (!res.ok) throw new Error();

      const horarioActualizado = await res.json();
      setHorarios((prev) =>
        prev.map((h) => (h.idHorario === idHorario ? horarioActualizado : h))
      );
      fetchUsuarioYReservas();
    } catch {
      toast.error("Error al editar horario");
    }
  };

  const handleReservar = async (idHorario: number) => {
    if (!idUsuario) return toast.error("Usuario no identificado");

    try {
      await fetch(
        `${URL}/usuarios/reservar?idHorario=${idHorario}&idCliente=${idUsuario}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      setUserReservations((prev) => [...prev, idHorario]);
      setHorarios((prev) =>
        prev.map((c) =>
          c.idHorario === idHorario
            ? { ...c, numReservas: c.numReservas + 1 }
            : c
        )
      );
      toast.success("Reserva realizada");
    } catch {
      toast.error("Error al reservar");
    }
  };

  const handleCancelar = async (idHorario: number) => {
    if (!idUsuario) return toast.error("Usuario no identificado");

    try {
      await fetch(
        `${URL}/usuarios/cancelarReserva?idHorario=${idHorario}&idUsuario=${idUsuario}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      setUserReservations((prev) => prev.filter((id) => id !== idHorario));
      setHorarios((prev) =>
        prev.map((c) =>
          c.idHorario === idHorario
            ? { ...c, numReservas: c.numReservas - 1 }
            : c
        )
      );
      toast.success("Reserva cancelada");
    } catch {
      toast.error("Error al cancelar");
    }
  };

  const renderClase = (clase: Horario) => (
    <ClaseItem
      key={clase.idHorario}
      clase={clase}
      tipoUsuario={tipoUsuario}
      isReservado={userReservations.includes(clase.idHorario)}
      isLoadingReservas={isLoadingReservas}
      onReservar={() => handleReservar(clase.idHorario)}
      onCancelar={() => handleCancelar(clase.idHorario)}
      onEditar={() => handleEditar(clase)}
      onEliminar={() => {
        setHorarioAEliminar(clase.idHorario);
        setIsDeleteDialogOpen(true);
      }}
    />
  );

  if (cargando) {
    return <div className="text-center p-10 bg-[var(--gris-oscuro)]">Cargando horarios...</div>;
  }

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <Toaster position="bottom-right" theme="dark" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Horarios</h1>
        {tipoUsuario === "Entrenador" && (
          <button onClick={() => setIsDialogOpen(true)} className="btn btn-primary">
            Nuevo Horario
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["TODAS", ...Object.keys(tipoClaseColors)] as (TipoClase | "TODAS")[]).map((tipo) => (
          <button
            key={tipo}
            onClick={() => setTipoFiltro(tipo)}
            className={`px-3 py-1 rounded-full text-sm ${
              tipoFiltro === tipo ? "bg-white text-black" : "bg-gray-700 text-white"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 border">Hora</th>
              {diasSemana.map((dia, i) => (
                <th
                  key={i}
                  className={`p-2 border ${
                    i === indexHoy ? "bg-[var(--morado)] text-white" : ""
                  }`}
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora) => (
              <tr key={hora}>
                <td className="p-2 border font-bold">{hora}:00</td>
                {diasSemana.map((_, diaIdx) => (
                  <td key={diaIdx} className="p-2 border min-w-[150px]">
                    {getClasesPara(diaIdx, hora).map(renderClase)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditarHorario
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        horario={
          horarioEdit
            ? {
                idHorario: horarioEdit.idHorario,
                fechaHora: horarioEdit.fechaHora,
                idEntrenador,
                nombreEntrenador: horarioEdit.nombreEntrenador,
              }
            : null
        }
        onSave={handleGuardarEdicion}
      />

      <NuevoHorarioDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={fetchHorarios}
      />

      <DeleteHorarioDialog
        open={isDeleteDialogOpen}
        id={horarioAEliminar}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setHorarioAEliminar(null);
        }}
        onConfirm={handleEliminarHorario}
      />
    </div>
  );
}