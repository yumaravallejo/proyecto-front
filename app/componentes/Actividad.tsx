"use client";
import React from "react";

type Props = {
    nombre: string;
    descripcion: string;
    duracion: number;
    tipoClase: string;
    exigencia: string;
    imagen: string;
    capacidad: number;
}

export default function Actividad(props: Props) {
    let bgClass = "bg-[var(--dorado)]";
    let borderClass = "border-yellow-500";

    switch (props.tipoClase) {
        case "CARDIO":
            bgClass = "bg-pink-500";
            borderClass = "border-pink-500";
            break;
        case "FUERZA":
            bgClass = "bg-red-500";
            borderClass = "border-red-500";
            break;
        case "RELAJACION":
            bgClass = "bg-green-500";
            borderClass = "border-green-500";
            break;
        case "TONIFICACION":
            bgClass = "bg-yellow-500";
            borderClass = "border-yellow-500";
            break;
        case "INFANTIL":
            bgClass = "bg-blue-500";
            borderClass = "border-blue-500";
            break;
        case "TONO_CARDIO":
            bgClass = "bg-orange-500";
            borderClass = "border-orange-500";
            break;
    }

    return (
        <div className={`actividad flex flex-col border-3 ${borderClass} bg-white items-center w-full rounded-xl`}>
            <h2 className={`text-white ${bgClass} w-full text-center text-2xl p-2 rounded-t-lg`}>{props.nombre}</h2>
            <img src={'/img/' + props.imagen} alt={props.nombre} className="w-[18.5rem] mt-5 h-50 object-cover" />
            <section className="p-5">
                <p>{props.descripcion}</p>
                <p>Duración: {props.duracion} minutos</p>
                <p>Tipo de clase: {props.tipoClase}</p>
                <p>Exigencia: {props.exigencia}</p>
                <p>Capacidad: {props.capacidad} personas</p>
            </section>

        </div>
    );
}