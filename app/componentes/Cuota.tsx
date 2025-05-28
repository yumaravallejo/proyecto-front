"use client";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  titulo: String;
  precio: String;
  duracion: String;
  incluye: string[];
  color: number;
  registro: boolean;
  onSelect?: (titulo: String) => void;
};

export default function Cuota(props: Props) {
  const router = useRouter();

  const { titulo, precio, duracion, incluye, color } = props;
  let bgClass = "bg-[var(--dorado)]";
  const shortTitle = duracion == "4 semanas" ? "CUOTA" : "";

  switch (color) {
    case 0:
      bgClass = "bg-red-500";
      break;
    case 1:
      bgClass = "bg-orange-500";
      break;
    case 2:
      bgClass = "bg-yellow-500";
      break;
    case 3:
      bgClass = "bg-green-500";
      break;
    case 4:
      bgClass = "bg-blue-500";
      break;
    case 5:
      bgClass = "bg-purple-500";
      break;
  }

  const selectCuota = (titulo: String) => {
    if (props.registro) {
      if (props.onSelect) {
        props.onSelect(titulo);
      }
    } else {
      router.push("/registro");
    }
  };

  return (
    <div className="cuotas flex flex-col gap-y-3 border-2 border-[var(--gris-oscuro)] bg-white items-center max-w-md">
      <span className={`w-full ${bgClass} h-6`}></span>
      <h2 className="text-2xl h-10 mt-3 items-center flex">
        {shortTitle} {titulo.toUpperCase()}
      </h2>
      <div className="flex flex-col gap-y-2 ">
        <p className="text-3xl text-blue-500 font-extrabold oswald">
          {precio} €
          <span className="text-[1rem] text-black mt-[-.3rem] font-bold">
            {" "}
            / {duracion}
          </span>
        </p>
        <p className="text-lg">{titulo} incluye:</p>
        <ul className="list-disc pl-5">
          {incluye?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={`Seleccionar cuota ${titulo}`}
          onClick={() => selectCuota(titulo)}
          className="rounded-full p-3 oswald text-center border-4 border-[var(--azul)] mt-3 hover:border-[var(--dorado)] cursor-pointer transition-all duration-200"
        >
          SELECCIONA {titulo.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
