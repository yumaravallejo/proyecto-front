import React from "react";
import { Horario, TipoClase } from "./SchedulePage";

const tipoClaseColors: Record<TipoClase, string> = {
  CARDIO: "bg-red-500",
  FUERZA: "bg-blue-400",
  RELAJACION: "bg-green-600",
  TONIFICACION: "bg-yellow-500",
  INFANTIL: "bg-purple-600",
  TONO_CARDIO: "bg-orange-500",
};

interface ClaseItemProps {
  clase: Horario;
  tipoUsuario: string;
  isReservado: boolean;
  isLoadingReservas: boolean;
  onReservar: () => void;
  onCancelar: () => void;
  onEditar: () => void;
  onEliminar: () => void;
}

export default function ClaseItem({
  clase,
  tipoUsuario,
  isReservado,
  isLoadingReservas,
  onReservar,
  onCancelar,
  onEditar,
  onEliminar,
}: ClaseItemProps) {
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
  const now = new Date();
  const isPast = date < now;

  return (
    <div
      className={`rounded-lg p-3 text-white shadow-lg ${color} flex flex-col gap-1 w-[90%] sm:w-full relative`}
    >
      {tipoUsuario === "Entrenador" && (
        <button
          onClick={onEliminar}
          className="absolute top-4 right-3 bg-white rounded-full p-1 cursor-pointer shadow-lg"
        >
          <img src="/bin.svg" alt="Eliminar" className="w-7 h-7" />
        </button>
      )}
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

      {tipoUsuario === "Cliente" && !isLoadingReservas && (
        <button
          onClick={isReservado ? onCancelar : onReservar}
          disabled={isPast}
          className={`transform transition-transform duration-200 py-2 rounded-md font-semibold text-sm transition-all duration-300 active:scale-95 ${
            isPast
              ? "cursor-not-allowed bg-gray-500"
              : isReservado
              ? "bg-red-600 hover:bg-red-700 hover:scale-[1.03]"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.03]"
          }`}
        >
          {isPast
            ? "No disponible"
            : isReservado
            ? "Cancelar Reserva"
            : "Reservar"}
        </button>
      )}

      {tipoUsuario === "Entrenador" && (
        <button
          onClick={onEditar}
          disabled={isPast}
          className={`transform transition-transform duration-200 py-2 rounded-md font-semibold text-sm transition-all duration-300 active:scale-95 ${
            isPast
              ? "cursor-not-allowed bg-gray-500"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.03]"
          }`}
        >
          {isPast ? "No disponible" : "Editar horario"}
        </button>
      )}
    </div>
  );
}