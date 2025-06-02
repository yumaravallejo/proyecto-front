"use client";

import React, { useEffect, useState } from "react";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

interface DetallesUsuarioDto {
  peso: string;
  altura: string;
  genero: string;
  intolerancias: string;
  objetivo: string;
}

interface BackendData {
  fechaNacimiento: string;
  detallesUsuario: DetallesUsuarioDto;
  // …otros campos que quieras mostrar (p. ej. email, nombre, etc.)
}

interface LocalUser {
  id: number;
  nombre: string;
  imagen: string;
}

export default function Dashboard() {
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservas, setReservas] = useState([]);

  const calcularEdad = (fecha: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("No se encontró usuario en localStorage");
      setLoading(false);
      return;
    }

    let parsedUser: LocalUser;
    try {
      parsedUser = JSON.parse(storedUser);
      setLocalUser(parsedUser);
    } catch {
      setError("Error al parsear datos de usuario en localStorage");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const URL = process.env.NEXT_PUBLIC_API;
        const res = await fetch(`${URL}usuarios/detalles/${parsedUser.id}`);
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Detalles usuario: ${msg}`);
        }
        const data: BackendData = await res.json();
        setBackendData(data);

        const reservas = await fetch(
          `${URL}usuarios/mis-reservas/${parsedUser.id}`
        );
        if (!reservas.ok) {
          const msg = await reservas.text();
          throw new Error(`Mis reservas: ${msg}`);
        }
        const data2 = await reservas.json();
        setReservas(data2);
      } catch (err: any) {
        console.error("Error al cargar datos:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!localUser || !backendData) return;

  const detalles = backendData.detallesUsuario;

  const imagen =
    localUser.imagen == ""
      ? "/usuario.svg"
      : `${process.env.NEXT_PUBLIC_API}usuarios/obtenerArchivo?imagen=${localUser.imagen}`;

  return (
    <div>
      <HeaderUs promocion={null} pagina="DASHBOARD" />
      <main className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md mt-10 mb-10">
        <h1 className="text-3xl font-bold mb-6">Seguimiento Personal</h1>

        <section className="flex items-center gap-6 mb-8">
          <img
            src={imagen}
            alt={`Imagen de perfil de ${localUser.nombre}`}
            className="w-24 h-24 rounded-full object-cover border-2 border-[var(--gris-oscuro)] bg-[var(--gris-oscuro)]"
          />
          <div>
            <h2 className="text-xl font-semibold">{localUser.nombre}</h2>
            <p className="text-gray-600">
              Edad:{" "}
              <span className="font-medium">
                {calcularEdad(backendData.fechaNacimiento)} años
              </span>
            </p>
            <p className="text-gray-600">
              Fecha de nacimiento:{" "}
              <span className="font-medium">{backendData.fechaNacimiento}</span>
            </p>
            <p className="text-gray-600">
              Género: <span className="font-medium">{detalles.genero}</span>
            </p>
          </div>
        </section>

        <section>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-md shadow">
              <h3 className="font-semibold text-xl mb-2">Peso</h3>
              <p className="text-md ">{detalles.peso || "-"} Kg</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md shadow">
              <h3 className="font-semibold text-xl mb-2">Altura</h3>
              <p className="text-md ">{detalles.altura || "-"} cm</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md shadow">
              <h3 className="font-semibold text-xl mb-2">Objetivo</h3>
              <p className="text-md">{detalles.objetivo || "-"}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md shadow">
              <h3 className="font-semibold text-xl mb-2">Intolerancias</h3>
              <p className="text-md">{detalles.intolerancias || "Ninguna"}</p>
            </div>
          </section>
          <div className="bg-blue-50 p-4 rounded-md shadow mt-6">
            <h3 className="font-semibold text-xl mb-2">Mis Reservas</h3>
            <div className="text-md flex flex-row flex-wrap space-y-2 gap-[1rem]">
              {reservas.length > 0
                ? reservas.map((reserva: any) => (
                    <div
                      key={reserva.id}
                      className="p-2 border rounded bg-white shadow-sm m-1 sm:basis-[calc(50%-1rem)] basis-full"
                    >
                      <p>
                        <strong>Clase:</strong> {reserva.nombreClase || "N/A"}
                      </p>
                      <p>
                        <strong>Fecha Reserva:</strong>{" "}
                        {new Date(reserva.fechaHora).toLocaleString()}
                      </p>
                      <p>
                        <strong>Tipo Clase:</strong>{" "}
                        {reserva.tipoClase || "N/A"}
                      </p>
                    </div>
                  ))
                : "Aún no tienes reservas"}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
