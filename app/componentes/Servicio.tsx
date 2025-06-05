"use client";
import React, { useState } from "react";

type Props = {
    nombre: string;
    descripcion: string;
    color: number;
    imagen?: string;
};

export default function Servicio(props: Props) {
    const { nombre, descripcion, color, imagen } = props;
    let bgClass = "bg-[var(--dorado)]";
    let shadowClass = "shadow-lg";
    switch (color) {
        case 0:
            bgClass = "bg-orange-500";
            shadowClass = "shadow-lg drop-shadow-[0_0_16px_orange]";
            break;
        case 1:
            bgClass = "bg-yellow-500";
            shadowClass = "shadow-lg drop-shadow-[0_0_16px_gold]";
            break;
        case 2:
            bgClass = "bg-green-500";
            shadowClass = "shadow-lg drop-shadow-[0_0_16px_limegreen]";
            break;
        case 3:
            bgClass = "bg-blue-500";
            shadowClass = "shadow-lg drop-shadow-[0_0_16px_#3b82f6]";
            break;
        case 4:
            bgClass = "bg-purple-500";
            shadowClass = "shadow-lg drop-shadow-[0_0_16px_purple]";
            break;
        case 5:
            bgClass = "bg-pink-500";
            shadowClass = "shadow-lg drop-shadow-[0_0_16px_#b71791]";
            break;
    }

    const [showDesc, setShowDesc] = useState(false);

    return (
        <div className="servicio flex flex-col gap-y-3 border-2 border-white bg-white items-center w-full ">
            <span className={`w-full ${bgClass} h-6`}></span>
            <h2 className="text-xl h-10 pl-2 pr-2 items-center flex">
                {nombre.toUpperCase()}
            </h2>

            <div
                className="relative w-70 h-80 mb-7 group cursor-pointer perspective-1000 mt-3"
                onClick={() => setShowDesc((v) => !v)}
                onMouseLeave={() => setShowDesc(false)}
            >
                <div
                    className={`
                        w-full h-full transition-transform duration-500
                        ${showDesc ? "rotate-y-180" : ""}
                        group-hover:rotate-y-180
                        [transform-style:preserve-3d]
                    `}
                >
                    {/* Cara frontal: imagen */}
                    <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center w-full">
                        {imagen && (
                            <img
                                src={imagen}
                                alt={nombre}
                                className={`w-full h-full object-cover ${shadowClass} rounded-lg`}
                                width={50}
                                height={50}
                            />
                        )}
                        <div className="absolute bottom-0 bg-black/60 text-white text-xs px-3 py-1 w-full text-center rounded-b-lg">
                            Ver descripción
                        </div>
                    </div>
                    {/* Cara trasera: descripción */}
                    <div className={`absolute inset-0 [backface-visibility:hidden] rotate-y-180 flex items-center justify-center bg-[var(--gris-oscuro)] text-white rounded-lg px-4 py-2 ${shadowClass}`} >
                        <span className="text-sm">{descripcion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

