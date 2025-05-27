"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

export default function Calendario() {
    const router = useRouter();


    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            router.push("/"); // redirige a login si no está logueado
        }
        
    }, []);


    return (
        <div>
            <HeaderUs promocion={null} pagina="CALENDARIO" />

            <Footer />
        </div>
    );
}
