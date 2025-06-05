"use client";

import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import Calendar from "../componentes/Calendar";

export default function Calendario() {

    return (
        <div>
            <HeaderUs promocion={null} pagina="CALENDARIO" />
            <main className="min-h-screen">
            <h1 className="sm:hidden w-full text-center pt-4 pb-4 mb-10 text-2xl text-white bg-[var(--gris-oscuro)]">CALENDARIO DE EVENTOS</h1>
            <Calendar />
            </main>
            <Footer />
        </div>
    );
}
