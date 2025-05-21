"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderUs from "../componentes/HeaderUs";

export default function UserProfile() {
    const [userInfo, setUserInfo] = useState(null);
    const router = useRouter();


    useEffect(() => {
        if (!userInfo) {
            router.push("/"); // redirige a login si no está logueado
        }
        const stored = localStorage.getItem("user");
        setUserInfo(stored ? JSON.parse(stored) : null);
    }, []);

    function handleLogOut() {
        localStorage.removeItem("user");
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    return (
        <div>
            <HeaderUs promocion={null} />
            <main className="p-8 flex flex-col">
                {userInfo ? (
                    <Avatar className="w-11 h-auto">
                        <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_API}usuarios/obtenerArchivo?imagen=${userInfo.imagen}`}
                            alt="Imagen de usuario"
                            className="icono-user rounded-full"
                            title="Ir al perfil"
                        />
                    </Avatar>
                ) : (
                    <>
                        <Image
                            src="/usuario.svg"
                            alt="Imagen de usuario"
                            width={50}
                            height={50}
                            className="usuario"
                            title="Ir al perfil"
                        />
                    </>
                )}

                <button onClick={handleLogOut} className="rounded-full bg-[var(--error)] text-white p-1 pl-4 pr-4 cursor-pointer">Cerrar Sesión</button>

            </main>
        </div>
    );
}
