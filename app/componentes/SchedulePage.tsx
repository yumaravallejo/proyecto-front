'use client';
import React from 'react';

// Tipos permitidos para el enum de tipoClase
export type TipoClase = 
  | 'CARDIO'
  | 'FUERZA'
  | 'RELAJACION'
  | 'TONIFICACION'
  | 'INFANTIL'
  | 'TONO_CARDIO';

// Interfaz que describe un objeto “Horario”
export interface Horario {
  idHorario: number;           // identificador único
  nombreClase: string;         // nombre de la clase
  nombreEntrenador: string;    // nombre del entrenador
  fechaHora: string;           // fecha y hora en formato ISO 8601
  capacidadMaxima: number;     // cupo máximo
  tipoClase: TipoClase;        // uno de los valores del enum de tipoClase
  duracion: number;            // duración en minutos
}

// Mapa de colores para cada tipo de clase (clases de Tailwind)
const tipoClaseColors: Record<TipoClase, string> = {
  CARDIO: 'bg-red-500',
  FUERZA: 'bg-blue-500',
  RELAJACION: 'bg-green-500',
  TONIFICACION: 'bg-yellow-500',
  INFANTIL: 'bg-purple-500',
  TONO_CARDIO: 'bg-orange-500',
};

// Días de la semana en español
const daysOfWeek: string[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

// Horas del día (de 6:00 a 22:00)
const hours: number[] = Array.from({ length: 17 }, (_, i) => 6 + i); // [6, 7, ..., 22]

// Props del componente
interface SchedulePageProps {
  horarios: Horario[];
}

/**
 * SchedulePage
 * Muestra un horario semanal de clases de gimnasio,
 * coloreando cada bloque según el tipo de clase.
 */
const SchedulePage: React.FC<SchedulePageProps> = ({ horarios }) => {
  // Devuelve el índice de día (0 = Lunes, …, 6 = Domingo)
  const getDayIndex = (fechaHora: string): number => {
    const date = new Date(fechaHora);
    const day = date.getDay(); // JS: 0 = Domingo, 1 = Lunes, …, 6 = Sábado
    if (day === 0) return 6;   // Domingo → índice 6
    return day - 1;            // Lunes (1) → 0, Martes (2) → 1, …, Sábado (6) → 5
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Horario Semanal de Clases de Gimnasio</h1>
      <div className="grid grid-cols-7 border border-gray-200">
        {/* Encabezados: días de la semana */}
        {daysOfWeek.map((day) => (
          <div key={day} className="border-b border-gray-200 p-2 text-center font-semibold">
            {day}
          </div>
        ))}

        {/* Columnas por día */}
        {daysOfWeek.map((_, dayIdx) => (
          <div key={dayIdx} className="relative h-[680px] border-r border-gray-200">
            {/* Líneas de hora de fondo (opcional) */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ top: `${((hour - 6) / 16) * 100}%` }}
              >
                <span className="text-xs text-gray-400">{hour}:00</span>
              </div>
            ))}

            {/* Renderiza todas las clases correspondientes a este día */}
            {horarios
              .filter((clase) => getDayIndex(clase.fechaHora) === dayIdx)
              .map((clase) => {
                const date = new Date(clase.fechaHora);

                // Hora de inicio en formato decimal (por ejemplo, 8.5 para 8:30)
                const startHour: number = date.getHours() + date.getMinutes() / 60;
                // % relativo a la ventana 6:00–22:00 → posición “top”
                const topPercent: number = ((startHour - 6) / 16) * 100;
                // Duración en horas
                const durationHours: number = clase.duracion / 60;
                // Altura en % relativa a la ventana de 16h
                const heightPercent: number = (durationHours / 16) * 100;
                // Clase de color según tipoClase
                const colorClass: string = tipoClaseColors[clase.tipoClase];

                // Calcular hora-fin para mostrar texto en el bloque
                const endDate = new Date(date.getTime() + clase.duracion * 60000);
                const startTimeText: string = `${date.getHours()
                  .toString()
                  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                const endTimeText: string = `${endDate.getHours()
                  .toString()
                  .padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                return (
                  <div
                    key={clase.idHorario}
                    className={`absolute left-1 right-1 rounded-md p-1 text-white overflow-hidden ${colorClass}`}
                    style={{ top: `${topPercent}%`, height: `${heightPercent}%` }}
                  >
                    <div className="text-sm font-semibold truncate">{clase.nombreClase}</div>
                    <div className="text-xs">Entrenador: {clase.nombreEntrenador}</div>
                    <div className="text-xs">
                      {startTimeText} – {endTimeText}
                    </div>
                    <div className="text-xs">Cupo: {clase.capacidadMaxima}</div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
