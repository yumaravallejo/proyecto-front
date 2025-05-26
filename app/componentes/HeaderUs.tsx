"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Login from "./Login";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  promocion: string | null;
};

export default function HeaderUs({ promocion }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    }
    return null;
  });

  const login = !!user;
  const imagenUser = user?.imagen ?? "";

  useEffect(() => {
    function actualizarUser() {
      const userString = localStorage.getItem("user");
      if (userString) {
        setUser(JSON.parse(userString));
      } else {
        setUser(null);
      }
    }

    actualizarUser();

    window.addEventListener("icon-updated", actualizarUser);
    return () => window.removeEventListener("icon-updated", actualizarUser);
  }, []);

  useEffect(() => {
    if (menuAbierto) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [menuAbierto]);

  const opcionesMenu = login
    ? [
        { nombre: "DIETAS", ruta: "/dietas" },
        { nombre: "RESERVAS", ruta: "/reservas" },
        { nombre: "ACTIVIDADES", ruta: "/actividades" },
        { nombre: "CALENDARIO", ruta: "/calendario" },
        { nombre: "CONTACTO", ruta: "/contacto" },
      ]
    : [
        { nombre: "CUOTAS", ruta: "/cuotas" },
        { nombre: "SERVICIOS", ruta: "/servicios" },
        { nombre: "ACTIVIDADES", ruta: "/actividades" },
        { nombre: "CONTACTO", ruta: "/contacto" },
        { nombre: "ÚNETE", ruta: "/registro" },
      ];

  return (
    <>
      <header className="flex items-center justify-between gap-x-15 w-full bg-[var(--gris-oscuro)] text-white transition-all duration-300 z-50">
        <label
          className={`${menuAbierto ? "menu-abierto" : "menu-cerrado"} menu-btn cursor-pointer ml-7`}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </label>

        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Logo de Changes"
            width={80}
            height={50}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-white flex flex-col">
            <span className="amarillo oswald">CHANGES</span>
            <span className="azul oswald">FITNESS CLUB</span>
          </span>
        </Link>

        <nav className={`${menuAbierto ? "abierto" : "cerrado"} general`}>
          {opcionesMenu.map((opcion, index) => (
            <Link
              key={index}
              href={opcion.ruta}
              className="text-md font-bold text-white hover:text-[var(--azul)] transition-colors duration-200"
            >
              {opcion.nombre}
            </Link>
          ))}
          <nav id="redes" className="flex gap-4 absolute bottom-30">
            <Image src="/instagram-am.svg" alt="Instagram" width={40} height={40} />
            <Image src="/tiktok-am.svg" alt="Tiktok" width={40} height={40} />
            <Image src="/whatsapp-am.svg" alt="Whatsapp" width={40} height={40} />
            <Image src="/facebook-am.svg" alt="Facebook" width={40} height={40} />
          </nav>
        </nav>

        {login ? (
          <div className="perfil-ic flex justify-end mr-6">
            <Link
              href="/perfil"
              className={`${imagenUser.trim() ? "avatar" : "no-avatar"} sesion logged flex rounded-full`}
              title="Ir al perfil"
            >
              {imagenUser.trim() ? (
                <Avatar className="w-11 h-auto">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API}usuarios/obtenerArchivo?imagen=${imagenUser}`}
                    alt="Imagen de usuario"
                    className="icono-user rounded-full"
                  />
                </Avatar>
              ) : (
                <Image
                  src="/usuario.svg"
                  alt="Usuario"
                  width={50}
                  height={50}
                  className="usuario"
                />
              )}
            </Link>
          </div>
        ) : (
          <div className="perfil-ic flex-25 flex items-center justify-end mr-6">
            <Login />
          </div>
        )}

        {promocion && (
          <div
            id="promociones"
            className="text-xs font-normal w-full text-center text-white flex items-center justify-center bg-[var(--azul-medio)] p-2 z-3"
          >
            {promocion}
          </div>
        )}
      </header>
    </>
  );
}
