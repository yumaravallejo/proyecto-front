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
  fechaHora: string; // ISO string
}

export interface Evento {
  id: number;
  nombre: string;
  detallesEvento: string;
  fechaInicio: string; // ISO string
  fechaFin: string; // ISO string
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
  fecha: string; // ISO string
}

export interface InfoHoyDTO {
  clasesHoy: ClaseHoyItem[];
  eventosHoy: Evento[];
  dietaHoy: Dieta | null;
}
