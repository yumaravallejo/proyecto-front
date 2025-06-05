"use client";
import React from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

export default function Reservas() {


    return (
        <div>
            <HeaderUs promocion={null} pagina="RESERVAS" />
            <h1 className="sm:hidden w-full text-center pt-4 pb-4 text-2xl text-white bg-[var(--gris-oscuro)]">
                Mis Reservas
            </h1>
            <main className="min-h-screen">

            </main>
            <Footer />
        </div>
    );
}
