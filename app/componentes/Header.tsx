"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Login from "./Login";

type Props = {
  promocion: string
}

export default function Header(props: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);


  const opcionesMenu = [
    {
      estado: "logged", opciones: [
        { nombre: "Dietas", ruta: "/dietas" },
        { nombre: "Reservas", ruta: "/reservas" },
        { nombre: "Actividades", ruta: "/actividades" },
        { nombre: "Calendario", ruta: "/calendario" },
        { nombre: "Contacto", ruta: "/contacto" },
        { nombre: "Perfil", ruta: "/perfil" },
      ]
    },
    {
      estado: "unlogged", opciones: [
        { nombre: "CUOTAS", ruta: "/cuotas" },
        { nombre: "SERVICIOS", ruta: "/servicios" },
        { nombre: "ACTIVIDADES", ruta: "/actividades" },
        { nombre: "PREGUNTAS FRECUENTES", ruta: "/faqs" },
        { nombre: "CONTACTO", ruta: "/contacto" },
        { nombre: "ÚNETE", ruta: "/registro" },
      ]
    },
  ]

  return (
    <>
      <header className="flex items-center justify-between w-full bg-[var(--gris-oscuro)] text-white relative">
        <label className={`${menuAbierto ? "menu-abierto" : "menu-cerrado"} menu-btn cursor-pointer `} onClick={() => setMenuAbierto(!menuAbierto)}>
          <span></span>
          <span></span>
          <span></span>
        </label>

        <Link href="/">
          <Image src="/logo.svg" alt="Logo de Changes" width={100} height={50} className="rounded-full" />
        </Link>

        <nav className={`${menuAbierto ? "abierto" : "cerrado"} general `}>
          {
            opcionesMenu[1].opciones.map((opcion, index) => (
              <Link key={index} href={opcion.ruta} className="text-lg font-bold text-white hover:text-[var(--azul)] transition-colors duration-200">
                {opcion.nombre}
              </Link>
            ))
          }
          <nav id="redes" className="flex gap-4 absolute bottom-30">
            <Image src="/instagram-am.svg" alt="Imagen de Instagram" width={40} height={40} />
            <Image src="/tiktok-am.svg" alt="Imagen de Tiktok" width={40} height={40} />
            <Image src="/whatsapp-am.svg" alt="Imagen de Whatsapp" width={40} height={40} />
            <Image src="/facebook-am.svg" alt="Imagen de Facebook" width={40} height={40} />
          </nav>
        </nav>

        <Login />
      </header>
      <div id="promociones" className="text-xs font-normal w-full text-center text-white bg-[var(--azul-medio)] p-2">{props.promocion}</div>
    </>
  );
}