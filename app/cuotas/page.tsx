"use client";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import CuotasSelec from "../componentes/Cuotas";

export default function Cuotas() {


    return (
        <div className="flex flex-col bg-[var(--gris-oscuro)] items-center">
            <HeaderUs promocion={null} pagina="CUOTAS" />
            <CuotasSelec registro={false} />
            <Footer />
        </div>
    );
}