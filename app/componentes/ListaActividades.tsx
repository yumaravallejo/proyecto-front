import Actividad from "./Actividad";

type ActividadType = {
  nombre: string;
  capacidadMaxima: number;
  tipoClase: string;
  descripcion: string;
  duracion: number;
  exigencia: string;
  imagen: string;
};

type Props = {
  actividades: ActividadType[];
  cargando: boolean;
};

export default function ListaActividades({ actividades, cargando }: Props) {
  return (
    <div className="actividades flex flex-col gap-y-15 p-6">
      {cargando ? (
        <div className="text-white text-center">Cargando actividades...</div>
      ) : (
        actividades.map((actividad, idx) => (
          <Actividad
            key={idx}
            nombre={actividad.nombre}
            capacidad={actividad.capacidadMaxima}
            descripcion={actividad.descripcion}
            duracion={actividad.duracion}
            exigencia={actividad.exigencia}
            imagen={actividad.imagen}
            tipoClase={actividad.tipoClase}
          />
        ))
      )}
    </div>
  );
}
