"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

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

const tipoClaseColors: Record<TipoClase, string> = {
  CARDIO: "bg-red-500",
  FUERZA: "bg-blue-600",
  RELAJACION: "bg-green-600",
  TONIFICACION: "bg-yellow-500",
  INFANTIL: "bg-purple-600",
  TONO_CARDIO: "bg-orange-500",
};

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const hours = Array.from({ length: 16 }, (_, i) => 6 + i);


export default function SchedulePage (horariosIniciales: Horario[]) {
  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  const [userReservations, setUserReservations] = useState<number[]>([]);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>(horariosIniciales || []);
  const [isLoadingReservas, setIsLoadingReservas] = useState(true);
  const URL = process.env.NEXT_PUBLIC_API;

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

      let claseHour = date.getHours();
      const claseMinutes = date.getMinutes();
      if (claseMinutes >= 30) claseHour += 1;

      return claseHour === hour;
    });
  };

  const fetchUsuarioYReservas = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser?.id) {
      setIdUsuario(parsedUser.id);
      try {
        const res = await fetch(`${URL}usuarios/mis-reservas/${parsedUser.id}`);
        const data = await res.json();
        const horariosIds = data.map((reserva: { id: number }) => reserva.id);
        setUserReservations(horariosIds);
      } catch (error) {
        console.error("Error fetching reservas:", error);
      } finally {
        setIsLoadingReservas(false);
      }
    } else {
      setIsLoadingReservas(false);
    }
  };

  const fetchHorarios = async () => {
    try {
      const res = await fetch(`${URL}usuarios/horarios`);
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
  }, []);

  const handleReservar = async (idHorario: number) => {
    if (!idUsuario) return toast.error("Usuario no identificado");
    try {
      setUserReservations((prev) => [...prev, idHorario]);
      setHorarios((prev) =>
        prev.map((clase) =>
          clase.idHorario === idHorario
            ? { ...clase, numReservas: clase.numReservas + 1 }
            : clase
        )
      );

      const res = await fetch(
        `${URL}usuarios/reservar?idHorario=${idHorario}&idCliente=${idUsuario}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error("Error al reservar");

      toast.success("Reserva realizada con éxito");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo realizar la reserva");
    }
  };

  const handleCancelar = async (idHorario: number) => {
    if (!idUsuario) return toast.error("Usuario no identificado");
    try {
      setUserReservations((prev) => prev.filter((id) => id !== idHorario));
      setHorarios((prev) =>
        prev.map((clase) =>
          clase.idHorario === idHorario
            ? { ...clase, numReservas: clase.numReservas - 1 }
            : clase
        )
      );

      const res = await fetch(
        `${URL}usuarios/cancelarReserva?idHorario=${idHorario}&idUsuario=${idUsuario}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error("Error al cancelar");

      toast.success("Reserva cancelada con éxito");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cancelar la reserva");
    }
  };

  const renderClase = (clase: Horario) => {
    const date = new Date(clase.fechaHora);
    const endDate = new Date(date.getTime() + clase.duracion * 60000);
    const startTime = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const color = tipoClaseColors[clase.tipoClase];

    const isReservado = userReservations.includes(clase.idHorario);

    return (
      <div
        key={`${clase.idHorario}-${clase.numReservas}`}
        className={`rounded-lg p-3 text-white shadow-lg ${color} flex flex-col gap-1`}
      >
        <div className="font-bold truncate text-lg">{clase.nombreClase}</div>
        <div className="text-sm">
          {startTime} – {endTime}
        </div>
        <div className="text-sm truncate">
          Entrenador: {clase.nombreEntrenador}
        </div>
        <div className="text-sm mb-3">
          {clase.numReservas} / {clase.capacidadMaxima}
        </div>
        {!isLoadingReservas && (
          <button
            className={`cursor-pointer transform transition-transform duration-200 hover:scale-[1.03] py-2 rounded-md font-semibold text-sm transition-all duration-300
              ${
                isReservado
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700 "
              }
              active:scale-95`}
            onClick={() =>
              isReservado
                ? handleCancelar(clase.idHorario)
                : handleReservar(clase.idHorario)
            }
          >
            {isReservado ? "Cancelar Reserva" : "Reservar"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-8xl mx-auto bg-[var(--gris-oscuro)]">
      <Toaster position="bottom-right" theme="dark" />
      <div className="w-full flex flex-row items-center justify-center mb-10 lg:mt-10 mt-5">
        <span className="bg-[var(--dorado)] h-3 rounded-full flex-grow"></span>
        <h1 className="text-3xl font-extrabold text-center text-white bg-[var(--gris-oscuro)] px-5 sm:px-20 whitespace-nowrap">
          RESERVA DE CLASES
        </h1>
        <span className="bg-[var(--dorado)] h-3 rounded-full flex-grow"></span>
      </div>
      {/* Vista móvil */}
      <div className="lg:hidden p-4 rounded-lg shadow-lg border border-gray-300 bg-white max-w-2xl mx-auto border-3">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() =>
              setCurrentDayIdx((prev) => (prev > 0 ? prev - 1 : prev))
            }
            disabled={currentDayIdx === 0}
            className="text-2xl px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 transition-colors active:scale-95"
            aria-label="Día anterior"
          >
            ◀
          </button>
          {(() => {
            const today = new Date();
            const monday = new Date(today);
            const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
            if (dayOfWeek > 4) monday.setDate(today.getDate() - dayOfWeek + 0);
            else monday.setDate(today.getDate() - dayOfWeek);
            monday.setDate(monday.getDate() + currentDayIdx);
            const formatted = monday.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return (
              <h2 className="text-xl font-semibold text-gray-800 select-none">
                {daysOfWeek[currentDayIdx]} - {formatted}
              </h2>
            );
          })()}
          <button
            onClick={() =>
              setCurrentDayIdx((prev) => (prev < 4 ? prev + 1 : prev))
            }
            disabled={currentDayIdx === 4}
            className="text-2xl px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 transition-colors active:scale-95"
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
                {getClassesFor(currentDayIdx, hour).length > 0 ? (
                  getClassesFor(currentDayIdx, hour).map(renderClase)
                ) : (
                  <div className="text-gray-400 text-center italic py-2 select-none min-h-[56px]"></div>
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
            const today = new Date();
            const monday = new Date(today);
            const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
            if (dayOfWeek > 4) monday.setDate(today.getDate() - dayOfWeek + 0);
            else monday.setDate(today.getDate() - dayOfWeek);
            monday.setDate(monday.getDate() + index);
            const formatted = monday.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return (
              <div
                key={day}
                className="flex flex-col items-center justify-center font-semibold text-gray-700 text-sm select-none p-2 bg-white rounded-lg shadow-sm"
                style={{ minHeight: "52px" }}
              >
                <div>{day}</div>
                <div className="text-xs text-gray-500">{formatted}</div>
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
    </div>
  );
};

