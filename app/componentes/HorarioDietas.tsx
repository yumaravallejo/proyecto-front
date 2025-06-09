"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Dieta {
    fecha: string;
    descripcion: string; // JSON string con desayuno, comida, cena, ...
    idEntrenador: number;
    idUsuario: number;
}

const momentos = ["desayuno", "comida", "merienda", "cena", "picoteo"];
const nombreCol = ["Desayuno", "Almuerzo", "Merienda", "Cena", "Picoteo"];
const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface Props {
    dietas: Record<number, Dieta[]>;
}

export default function DietaPage({ dietas }: Props) {
    const [porDia, setPorDia] = useState<
        { dia: string; fecha: string; comidas: Record<string, string> }[]
    >([]);

    const getIndiceHoy = () => {
        const dia = new Date().getDay(); // 0=domingo, 1=lunes...
        return dia === 0 ? 6 : dia - 1;
    };

    const [indexHoy, setIndexHoy] = useState(getIndiceHoy());

    useEffect(() => {
        const agrupado = diasSemana.map((dia, idx) => {
            const baseLunes = obtenerLunes();
            const fecha = new Date(baseLunes);
            fecha.setDate(fecha.getDate() + idx);

            const fechaISO = fecha.toISOString().split("T")[0];
            const todasLasDietas = Object.values(dietas).flat();
            const dietaDelDia = todasLasDietas.find((d) => d.fecha.startsWith(fechaISO));

            let comidas: Record<string, string> = {};
            if (dietaDelDia) {
                try {
                    comidas = JSON.parse(dietaDelDia.descripcion);
                } catch (error) {
                    console.warn("Error parsing descripcion:", error);
                }
            }

            return { dia, fecha: fechaISO, comidas };
        });

        setPorDia(agrupado);
    }, [dietas]);

    const obtenerLunes = () => {
        const hoy = new Date();
        const diaSemana = hoy.getDay(); // 0 = domingo
        const lunes = new Date(hoy);
        const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
        lunes.setDate(hoy.getDate() + diff);
        lunes.setHours(0, 0, 0, 0);
        return lunes;
    };

    const diaActual = porDia[indexHoy];

    return (
        <div className="p-4 mx-auto">

            {/* Vista móvil */}
            <div className="lg:hidden p-4 rounded-lg shadow-lg border border-gray-300 bg-white max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setIndexHoy((prev) => (prev > 0 ? prev - 1 : prev))}
                        disabled={indexHoy === 0}
                        className="text-2xl px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 transition-colors active:scale-95"
                        aria-label="Día anterior"
                    >
                        ◀
                    </button>

                    <div className="text-lg font-bold text-gray-700 select-none">
                        {diaActual?.dia} -{" "}
                        {new Date(diaActual?.fecha).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </div>

                    <button
                        onClick={() =>
                            setIndexHoy((prev) => (prev < porDia.length - 1 ? prev + 1 : prev))
                        }
                        disabled={indexHoy === porDia.length - 1}
                        className="text-2xl px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 transition-colors active:scale-95"
                        aria-label="Día siguiente"
                    >
                        ▶
                    </button>
                </div>

                <div className="grid gap-4">
                    {momentos.map((momento, index) => (
                        <div
                            key={`${momento}-${diaActual?.fecha}`}
                            className="flex flex-col gap-4 justify-between items-center pt-5 pb-10 bg-gray-100 rounded-md shadow w-full"
                        >
                            <span className="capitalize font-semibold text-yellow-500 text-xl flex items-center gap-2 select-none ">
                                {momento === "desayuno" && <Image src="/desayuno.svg" alt="Desayuno" width={600} height={400} className="w-6 h-6" />}
                                {momento === "comida" &&  <Image src="/almuerzo.svg" alt="Comida" width={600} height={400} className="w-6 h-6" />}
                                {momento === "merienda" && <Image src="/merienda.svg" alt="Merienda" width={600} height={400} className="w-6 h-6" />}
                                {momento === "cena" && <Image src="/cena.svg" alt="Cena" width={600} height={400} className="w-6 h-6" />}
                                {momento === "picoteo" && <Image src="/picoteo.svg" alt="Picoteo" width={600} height={400} className="w-6 h-6" />}

                                <span className="text-[var(--azul)]">{nombreCol[index]}</span>
                                
                            </span>
                            <p className="text-gray-800 text-md max-w-[60%] text-center">
                                {diaActual?.comidas[momento] || <span className="italic text-gray-400">–</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vista escritorio */}
            <div className="hidden lg:block overflow-auto rounded-lg shadow-lg border border-gray-300 bg-white mx-auto my-6">
                <div
                    className="grid gap-3 p-4"
                    style={{
                        gridTemplateColumns: "120px repeat(7, minmax(0, 1fr))",
                        backgroundColor: "#fafafa",
                    }}
                >
                    {/* Encabezados */}
                    <div className="text-sm font-bold text-gray-700 flex items-center justify-center select-none">

                    </div>
                    {porDia.map(({ dia, fecha }) => (
                        <div
                            key={fecha}
                            className="flex flex-col items-center text-sm font-semibold text-gray-700 bg-white p-2 rounded-md shadow-sm"
                        >
                            <span>{dia}</span>
                            <span className="text-xs text-gray-500">{fecha}</span>
                        </div>
                    ))}

                    {/* Contenido por momento */}
                    {momentos.map((momento, index) => (
                        <React.Fragment key={momento}>
                            <div className="text-sm font-bold text-gray-800 bg-gray-100 rounded-md flex items-center justify-center px-2 py-4 select-none min-h-30">
                                {nombreCol[index]}
                            </div>
                            {porDia.map(({ comidas }, idx) => (
                                <div
                                    key={`${momento}-${idx}`}
                                    className="bg-white rounded-md shadow-inner p-3 min-h-[56px] text-sm text-gray-800"
                                >
                                    {comidas[momento] ? <span className="text-sm">{comidas[momento]}</span> : (
                                        <span className="italic text-gray-400">–</span>
                                    )}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

        </div>
    );
}
