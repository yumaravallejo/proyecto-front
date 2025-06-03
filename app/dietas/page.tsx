"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import HorarioDietas from "../componentes/HorarioDietas";

export default function Dietas() {
    const router = useRouter();


    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            router.push("/"); // redirige a login si no está logueado
        }
        
    }, []);


    return (
        <div>
            <HeaderUs promocion={null} pagina="DIETAS" />
            <HorarioDietas />
            <Footer />
        </div>
    );
}
