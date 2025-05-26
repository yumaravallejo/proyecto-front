"use client";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import Cuota from "../componentes/Cuota";

export default function Cuotas() {
    const cuotas = [
        {
            titulo: "Mensual Básica",
            precio: "34.99",
            duracion: "4 semanas",
            incluye: [
                "Acceso completo a todas las instalaciones",
                "Clases grupales ilimitadas",
                "Vestuarios y duchas"
            ]
        },
        {
            titulo: "Premium",
            precio: "49.99",
            duracion: "4 semanas",
            incluye: [
                "Acceso completo a todas las instalaciones",
                "Clases grupales ilimitadas",
                "Plan nutricional personalizado",
                "Sesiones de evaluación física mensuales"
            ]
        },
        {
            titulo: "Familiar",
            precio: "89.99",
            duracion: "4 semanas",
            incluye: [
                "Acceso para 2 adultos e hijos directos",
                "Clases familiares y actividades para niños",
                "Descuento en eventos especiales",
                "Seguimiento nutricional grupal"
            ]
        },
        {
            titulo: "Pase Diario",
            precio: "7.99",
            duracion: "1 día",
            incluye: [
                "Acceso completo durante todo el día",
                "Participación en una clase grupal (según disponibilidad)"
            ]
        },
        {
            titulo: "Bono 10 Entradas",
            precio: "59.99",
            duracion: "Sin caducidad",
            incluye: [
                "10 accesos individuales",
                "Acceso a zona fitness y clases ese día",
                "Ideal para entrenamientos ocasionales"
            ]
        },
        {
            titulo: "Estudiantil",
            precio: "29.99",
            duracion: "4 semanas",
            incluye: [
                "Acceso completo",
                "Clases adaptadas a estudiantes",
                "Horario ampliado en fines de semana"
            ]
        }
    ];

    return (
        <div className="flex flex-col bg-[var(--gris-oscuro)] items-center">
            <HeaderUs promocion={null} />
            <main id="cuotas" className="p-10 text-justify flex gap-y-10 flex-col main-completo  items-center">
            {cuotas.map((cuota, index) => (
                <Cuota registro={false} key={index} titulo={cuota.titulo} precio={cuota.precio} duracion={cuota.duracion} incluye={cuota.incluye} color={index} />
            ))}
            </main>
            <Footer />
        </div>
    );
}