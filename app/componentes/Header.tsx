"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Login from "./Login";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  promocion: string | null;
  pagina?: string;
};

interface Usuario {
  id: number,
  token: string,
  tipo: string,
  imagen: string,
  email: string,
  nombre: string
}

export default function Header(props: Props) {
  const HEADER_HEIGHT = 70;
  const PROMO_HEIGHT = 30;

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    setIsClient(true);

    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuAbierto);
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [menuAbierto]);

  if (!isClient) return null;

  const login = !!user;
  const imagenUser = user?.imagen ?? "";

  const opcionesMenu = login ? (
    user.tipo !== "Entrenador" ? [
      { nombre: "DIETAS", ruta: "/dietas" },
      { nombre: "RESERVAS", ruta: "/reservas" },
      { nombre: "CALENDARIO", ruta: "/calendario" },
      { nombre: "ACTIVIDADES", ruta: "/horarios-actividades" },
      { nombre: "CONTACTO", ruta: "/contacto" },
    ] : [
      { nombre: "DIETAS", ruta: "/dietas" },
      { nombre: "RESERVAS", ruta: "/reservas" },
      { nombre: "CALENDARIO", ruta: "/calendario" },
      { nombre: "ACTIVIDADES", ruta: "/horarios-actividades" },
      { nombre: "ADMINISTRACIÓN", ruta: "/administracion" },
    ]) : [
    { nombre: "CUOTAS", ruta: "/cuotas" },
    { nombre: "SERVICIOS", ruta: "/servicios" },
    { nombre: "ACTIVIDADES", ruta: "/actividades" },
    { nombre: "CONTACTO", ruta: "/contacto" },
    { nombre: "ÚNETE", ruta: "/registro" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 gap-x-15 transition-all duration-300 z-50 ${isScrolled ? "shadow-lg bg-[var(--gris-oscuro)]" : "bg-[var(--gris-oscuro)]"
          }`}
        style={{ height: HEADER_HEIGHT }}
      >
        {/* Botón menú */}
        <label
          className={`menu-btn cursor-pointer ${menuAbierto ? "menu-abierto" : "menu-cerrado"}`}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </label>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <img src="/logo.svg" alt="Logo de Changes" width={80} height={50} className="rounded-full" />
          <span className="text-xl font-bold text-white flex flex-col">
            <span className="amarillo font-oswald">CHANGES</span>
            <span className="azul oswald">FITNESS CLUB</span>
          </span>
        </Link>

        {/* Navegación */}
        <nav className={`${menuAbierto ? "abierto" : "cerrado"} general`}>
          {opcionesMenu.map((opcion, index) => (
            <Link
              key={index}
              href={opcion.ruta}
              className={`text-md font-bold text-white hover:text-[var(--azul)] transition-colors duration-200
                ${opcion.nombre === (props.pagina ?? "").toUpperCase() ? "border-b-4 border-[var(--azul)]" : ""}`}
            >
              {opcion.nombre}
            </Link>
          ))}
          {/* Redes sociales */}
          <nav id="redes" className="flex gap-4 absolute bottom-30">
            <img src="/instagram-am.svg" alt="Instagram" width={40} height={40} />
            <img src="/tiktok-am.svg" alt="Tiktok" width={40} height={40} />
            <img src="/whatsapp-am.svg" alt="Whatsapp" width={40} height={40} />
            <img src="/facebook-am.svg" alt="Facebook" width={40} height={40} />
          </nav>
        </nav>

        {/* Perfil o Login */}
        {login ? (
          <div className="perfil-ic flex justify-end mr-6">
            <Link
              href="/perfil"
              className={`${imagenUser?.trim() ? "avatar" : "no-avatar"} sesion logged flex rounded-full`}
              title="Ir al perfil"
            >
              {imagenUser?.trim() ? (
                <Avatar className="w-11 h-auto">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API}/usuarios/obtenerArchivo?imagen=${imagenUser}`}
                    alt="Imagen de usuario"
                    className="icono-user rounded-full"
                  />
                </Avatar>
              ) : (
                <img src="/usuario.svg" alt="Usuario" width={50} height={50} className="usuario" />
              )}
            </Link>
          </div>
        ) : (
          <div className="perfil-ic flex-25 flex items-center justify-end mr-6">
            <Login />
          </div>
        )}
      </header>

      {/* Promoción */}
      {props.promocion && (
        <div
          className="fixed top-[70px] left-0 w-full text-xs text-white text-center bg-[var(--azul-medio)] p-2 z-40"
          style={{ height: PROMO_HEIGHT }}
        >
          {props.promocion}
        </div>
      )}
    </>
  );
}
