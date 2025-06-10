"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import EditarHorario from "./EditarHorario";
import NuevoHorarioDialog from "./NuevoHorario";
import DeleteHorarioDialog from "./DeleteHorario";
import ClaseItem from "./ClaseItem";

// React.Fragment --> Componente especial de React que te permite agrupar varios elementos hijos sin añadir un nodo extra al DOM.

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

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const hours = Array.from({ length: 15 }, (_, i) => 7 + i);

interface SchedulePageProps {
  horariosIniciales: Horario[];
}

export default function SchedulePage({ horariosIniciales }: SchedulePageProps) {
  const diaBaseIndex = () => {
    const today = new Date();
    const diaSemana = today.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      // Si es sábado (6) o domingo (0), cambaimos a lunes (índice 0) ya que no hay clases esos días
      return 0;
    }
    return diaSemana - 1;
  };

  const [indexHoy, setIndexHoy] = useState(diaBaseIndex());
  const [userReservations, setUserReservations] = useState<number[]>([]);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>(horariosIniciales || []);
  const [isLoadingReservas, setIsLoadingReservas] = useState(true);
  const URL = process.env.NEXT_PUBLIC_API;
  const [tipoFiltro, setTipoFiltro] = useState<TipoClase | "TODAS">("TODAS");
  const [tipoUsuario, setTipoUsuario] = useState<string | "Cliente">("Cliente");
  const [horarioEdit, setHorarioEdit] = useState<Horario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [horarioAEliminar, setHorarioAEliminar] = useState<number | null>(null);
  const [idEntrenador, setIdEntrenador] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function cambioLunes(today = new Date()) {
    const diaSemana = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const lunes = new Date(today);
    if (diaSemana > 4) {
      lunes.setDate(today.getDate() + (7 - diaSemana));
    } else {
      lunes.setDate(today.getDate() - diaSemana);
    }
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  }

  const handleEditar = (horario: Horario) => {
    setHorarioEdit(horario);
    setDialogOpen(true);
  };

  const handleEliminarHorario = async (idHorario: number) => {
    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token;

      const res = await fetch(`${URL}/entrenador/borrarHorario/${idHorario}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el horario");
      }

      setHorarios((prev) => prev.filter((h) => h.idHorario !== idHorario));
      toast.success("Horario eliminado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el horario");
    }
  };

  const handleGuardarEdicion = async (
    idHorario: number,
    cambios: { fechaHora?: string; idEntrenador?: number }
  ) => {
    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token;
      const URL = process.env.NEXT_PUBLIC_API;

      const res = await fetch(`${URL}/entrenador/editarHorario/${idHorario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      if (!res.ok) alert("Error al editar horario");

      const horarioActualizado = await res.json();

      // Actualiza el estado local
      setHorarios((prev) =>
        prev.map((h) => (h.idHorario === idHorario ? horarioActualizado : h))
      );

      const horariosActualizados = horarios.map((h) =>
        h.idHorario === idHorario ? horarioActualizado : h
      );
      localStorage.setItem("horarios", JSON.stringify(horariosActualizados));

      fetchHorarios();
      fetchUsuarioYReservas();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el horario");
    }
  };

  const getDayIndex = (fechaHora: string): number => {
    const day = new Date(fechaHora).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getClassesFor = (dayIdx: number, hour: number) => {
    if (dayIdx < 0 || dayIdx > 4) return [];

    return horarios.filter((clase) => {
      const date = new Date(clase.fechaHora);
      const claseDayIdx = getDayIndex(clase.fechaHora);
      if (claseDayIdx !== dayIdx) return false;

      const claseHour = date.getHours();

      if (tipoFiltro !== "TODAS" && clase.tipoClase !== tipoFiltro)
        return false;

      return claseHour === hour;
    });
  };

  const fetchUsuarioYReservas = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser?.tipo === "Cliente") {
      if (parsedUser?.id) {
        setIdUsuario(parsedUser.id);
        try {
          const res = await fetch(
            `${URL}/usuarios/mis-reservas/${parsedUser.id}`
          );
          const data = await res.json();
          const horariosIds = data.map(
            (reserva: { idHorario: number }) => reserva.idHorario
          );
          setUserReservations(horariosIds);
        } catch (error) {
          console.error("Error fetching reservas:", error);
        } finally {
          setIsLoadingReservas(false);
        }
      } else {
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
      console.error("Error fetching horarios:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchHorarios(), fetchUsuarioYReservas()]);
    })();

    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setTipoUsuario(user.tipo || "Cliente");

      if (user.tipo === "Entrenador" && user.id) {
        setIdEntrenador(user.id);
      }
    }
  }, []);

  const handleReservar = async (idHorario: number) => {
    setIsLoading(true); // Comienza la carga

    try {
      // Si ya está reservado, no hacer nada
      if (userReservations.includes(idHorario)) {
        toast.info("Ya tienes una reserva para esta clase.");
        return;
      }

      // Realizar la reserva en el backend
      const res = await fetch(
        `${URL}/usuarios/reservar?idHorario=${idHorario}&idCliente=${idUsuario}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error("Error al reservar");

      toast.success("Reserva realizada correctamente");

      // Actualiza las reservas del usuario y el estado
      setUserReservations((prev) => [...prev, idHorario]);
      setHorarios((prev) =>
        prev.map((clase) =>
          clase.idHorario === idHorario
            ? { ...clase, numReservas: clase.numReservas + 1 }
            : clase
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Error al hacer la reserva");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = async (idHorario: number) => {
    setIsLoading(true);

    try {
      if (!userReservations.includes(idHorario)) {
        toast.info("No tienes una reserva para esta clase.");
        return;
      }

      const res = await fetch(
        `${URL}/usuarios/cancelarReserva?idHorario=${idHorario}&idUsuario=${idUsuario}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error("Error al cancelar la reserva");

      // Actualizar las reservas del usuario y refrescar horarios del servidor
      setUserReservations((prev) => prev.filter((id) => id !== idHorario));

      await fetchHorarios(); 

      toast.success("Reserva cancelada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al cancelar la reserva");
    } finally {
      setIsLoading(false);
    }
  };

  const renderClase = (clase: Horario) => (
    <ClaseItem
      key={clase.idHorario + clase.fechaHora}
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

  const isLoadingAll = isLoadingReservas || horarios.length === 0 || isLoading;

  return (
    <div className="p-6 max-w-8xl mx-auto ">
      <Toaster position="bottom-right" theme="dark" />
      {isLoadingAll && tipoUsuario !== "Entrenador" && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center pt-90 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4 top-0 "></div>
        </div>
      )}
      {tipoUsuario === "Entrenador" ? (
        <div className="text-center text-white mt-4 mb-6 w-full items-center flex flex-row justify-center gap-4">
          <button
            onClick={() => {
              setIsDialogOpen(!isDialogOpen);
            }}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors active:scale-95 flex items-center gap-2"
          >
            <img
              src={"/addHorario.svg"}
              title="Añadir Horario"
              className="w-7 h-7"
            />{" "}
            <span>Añadir Horario</span>
          </button>
        </div>
      ) : (
        ""
      )}

      <section className="filtros-actividades w-full flex overflow-x-auto gap-2 text-black">
        <article
          className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
          onClick={() => setTipoFiltro("TODAS")}
        >
          <span className="w-5 h-5 bg-gray-400 border-2"></span>
          <span
            className={`text-md text-left min-w-max ${
              tipoFiltro === "TODAS" ? "underline font-bold" : ""
            }`}
          >
            TODAS
          </span>
        </article>

        {Object.entries(tipoClaseColors).map(([tipo, color]) => {
          const label =
            tipo === "RELAJACION"
              ? "CUERPO Y MENTE"
              : tipo === "TONIFICACION"
              ? "TONIFICACIÓN"
              : tipo === "TONO_CARDIO"
              ? "TONO Y CARDIO"
              : tipo;

          return (
            <article
              key={tipo}
              className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
              onClick={() => setTipoFiltro(tipo as TipoClase)}
            >
              <span className={`w-5 h-5 ${color} border-2`}></span>
              <span
                className={`text-md text-left min-w-max ${
                  tipoFiltro === tipo ? "underline font-bold" : ""
                }`}
              >
                {label}
              </span>
            </article>
          );
        })}
      </section>

      {/* Vista móvil */}
      <div className="lg:hidden p-4 rounded-lg shadow-lg border border-gray-300 bg-white max-w-2xl mx-auto border-3">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIndexHoy((prev) => (prev > 0 ? prev - 1 : prev))}
            disabled={indexHoy === 0}
            className="text-2xl px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 transition-colors active:scale-95"
            aria-label="Día anterior"
          >
            ◀
          </button>
          {(() => {
            const baselunes = cambioLunes();
            baselunes.setDate(baselunes.getDate() + indexHoy);
            const formatted = baselunes.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return (
              <div>
                <div className="text-lg font-bold font-inter text-gray-700 select-none flex items-center gap-1">
                  {daysOfWeek[indexHoy]} - {formatted}
                </div>
              </div>
            );
          })()}
          <button
            onClick={() => setIndexHoy((prev) => (prev < 4 ? prev + 1 : prev))}
            disabled={indexHoy === 4}
            className="text-2xl px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 transition-colors active:scale-95"
            aria-label="Día siguiente"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-[70px_1fr] gap-4">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="text-sm font-bold text-gray-800 w-[70px] text-center select-none flex items-center justify-center bg-gray-100 rounded-md shadow-inner">
                {hour}:00
              </div>
              <div className="flex flex-col gap-3">
                {getClassesFor(indexHoy, hour).length > 0 ? (
                  getClassesFor(indexHoy, hour).map(renderClase)
                ) : (
                  <div className="text-gray-400 text-center italic py-2 select-none min-h-[56px] "></div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Vista escritorio */}
      <div className="hidden lg:block overflow-auto rounded-lg shadow-lg border border-gray-300">
        <div
          className="grid"
          style={{
            gridTemplateColumns: "70px repeat(5, minmax(0, 1fr))",
            gap: "12px",
            padding: "12px",
            backgroundColor: "#fafafa",
          }}
        >
          <div className="font-semibold text-gray-700 flex items-center justify-center select-none">
            Hora
          </div>
          {daysOfWeek.map((day, index) => {
            const baselunes = cambioLunes();
            baselunes.setDate(baselunes.getDate() + index);
            const formatted = baselunes.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return (
              <div
                key={day}
                className="flex flex-row items-center justify-between font-semibold text-gray-700 text-sm select-none p-2 bg-white rounded-lg shadow-sm"
                style={{ minHeight: "52px" }}
              >
                <div className="flex flex-col items-center basis-2/2">
                  <div>{day}</div>
                  <div className="text-xs text-gray-500">{formatted}</div>
                </div>
              </div>
            );
          })}

          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-500 bg-gray-100 flex items-center justify-center rounded-md select-none">
                {hour}:00
              </div>
              {daysOfWeek.map((_, dayIdx) => (
                <div
                  key={`${hour}-${dayIdx}`}
                  className="p-2 bg-white rounded-lg shadow-inner min-h-[56px] flex flex-col gap-2"
                >
                  {getClassesFor(dayIdx, hour).map(renderClase)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <EditarHorario
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        horario={
          horarioEdit
            ? {
                idHorario: horarioEdit.idHorario,
                fechaHora: horarioEdit.fechaHora,
                idEntrenador: idEntrenador,
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
