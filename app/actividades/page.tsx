"use client";
import React, { act, useState } from "react";
import { useEffect } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import Actividad from "../componentes/Actividad";

export default function Actividades() {
    const [user, setUser] = useState(localStorage.getItem("user"));
    const [actividades, setActividades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
        setUser(user);

        const fetchActividades = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API;
                const res = await fetch(`${apiUrl}actividades`);
                if (!res.ok) throw new Error("No se pudieron obtener las actividades");
                const data = await res.json();
                setActividades(data);
                setError("");
            } catch (err) {
                setError("No hay actividades en este momento.");
                setActividades([]);
            } finally {
                setLoading(false);
            }
        };
        fetchActividades();
    }, []);

    const contenidoUnlogged = (
        <main id="actividadesUnlogged">
            {loading ? (
                <p>Cargando actividades...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <div>
                        <span className=""></span>
                    </div>
                    {actividades.map((actividad, idx) => (
                        <li key={idx}>{actividad.nombre}</li>
                    ))}
                </div>
            )}
        </main>
    );

    const contenidoLogged = (
        <main id="actividadesLogged">
            {loading ? (
                <p>Cargando actividades...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="flex flex-col gap-y-4 p-5">
                    {actividades.map((actividad, idx) => (
                        <Actividad nombre={actividad.nombre} capacidad={actividad.capacidadMaxima} descripcion={actividad.descripcion} 
                                    duracion={actividad.duracion} exigencia={actividad.exigencia} imagen={actividad.imagen} tipoClase={actividad.tipoClase} />
                    ))}
                </div>
            )}
        </main>
    );

    return (
        <div>
            <HeaderUs promocion={null} />
            {user ? contenidoUnlogged : contenidoLogged}
            <Footer />
        </div>
    );
}
