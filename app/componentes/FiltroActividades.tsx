"use client";

type Props = {
  tipoFiltro: string;
  onChangeFiltro: (tipo: string) => void;
};

export default function FiltroActividades({ tipoFiltro, onChangeFiltro }: Props) {
  const tipos = [
    { clave: "TODAS", label: "TODAS", color: "#d1d1d1" },
    { clave: "CARDIO", label: "CARDIO", color: "pink" },
    { clave: "INFANTIL", label: "INFANTIL", color: "blue" },
    { clave: "RELAJACION", label: "CUERPO Y MENTE", color: "green" },
    { clave: "FUERZA", label: "FUERZA", color: "red" },
    { clave: "TONIFICACION", label: "TONIFICACIÓN", color: "yellow" },
    { clave: "TONO_CARDIO", label: "TONO Y CARDIO", color: "orange" },
  ];

  return (
    <section className="filtros-actividades w-full flex overflow-x-auto gap-2 ">
      {tipos.map(({ clave, label, color }) => (
        <article
          key={clave}
          className="flex flex-row items-center justify-center gap-x-2 p-5 cursor-pointer filter-act"
          onClick={() => onChangeFiltro(clave)}
        >
          <span className={`w-5 h-5 border-2`} style={{ backgroundColor: color }}></span>
          <span
            className={`text-md text-left text-white min-w-max ${
              tipoFiltro === clave ? "underline underline-offset-4 font-bold" : ""
            }`}
          >
            {label}
          </span>
        </article>
      ))}
    </section>
  );
}
