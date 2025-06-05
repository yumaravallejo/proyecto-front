"use client";
import React from 'react';
import Footer from '../componentes/Footer';
import HeaderUs from '../componentes/HeaderUs';

export default function administracion() {
    return (
        <div>
            <HeaderUs promocion={null} pagina="ADMINISTRACIÓN" />
            <h1 className="sm:hidden w-full text-center pt-4 pb-4 mb-10 text-2xl text-white bg-[var(--gris-oscuro)]">GESTIÓN ADMINISTRATIVA</h1>

            <main className='min-h-screen'>


            </main>
            <Footer />
        </div>
    )
}
