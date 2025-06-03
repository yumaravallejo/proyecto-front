"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        < div className="flex flex-col items-center justify-center h-screen bg-[var(--gris-oscuro)]" >
            <div className="flex flex-col items-center gap-4 p-20 rounded-xl shadow-xl border-4 border-white bg-[var(--gris-claro)]">
                <span className="text-[var(--azul)] text-7xl font-extrabold animate-bounce oswald">404</span>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--dorado)] text-center">
                    ¡Ups! Página no encontrada
                </h1>
                <p className="text-lg text-center text-white max-w-md">
                    Parece que te has salido del circuito... <br />
                    ¡Vuelve al gimnasio y sigue entrenando con nosotros!
                </p>
                <Link
                    href="/"
                    className="mt-4 px-6 py-2 rounded-full bg-[var(--azul)] text-white font-bold hover:bg-[var(--dorado)] hover:text-[var(--gris-oscuro)] transition-colors duration-200 shadow"
                >
                    Volver al inicio
                </Link>
            </div>
            <div className="mt-10 text-white opacity-60 text-sm">
                Changes Fitness Club
            </div>
        </div >
    );

}