"use client";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";
import Servicio from "../componentes/Servicio";

export default function Servicios() {
    const servicios = [
        {
            nombre: "Asesoramiento Nutricional",
            descripcion: "Nuestro equipo de expertos en nutrición te guiará para mejorar tu alimentación de forma saludable y sostenible. Aprende a nutrirte según tus objetivos, ya sea perder peso, ganar masa muscular o simplemente sentirte con más energía.",
            imagen: "/img/asesoramiento.webp",
            
        },
         {
            nombre: "Personal Training",
            descripcion: "Resultados reales con atención personalizada. Nuestros entrenadores personales diseñan rutinas exclusivas para ti, adaptadas a tu nivel, metas y ritmo. Entrena con motivación y enfoque, con un profesional a tu lado en cada paso.",
            imagen: "/img/personal-trainer.webp",
            
        },
         {
            nombre: "Dietas Personalizadas",
            descripcion: "Porque cada cuerpo es diferente, creamos planes de alimentación a medida, elaborados por nutricionistas profesionales. Combinamos ciencia y experiencia para que tu dieta sea efectiva, equilibrada y fácil de seguir.",
            imagen: "/img/dieta.webp",
            
        },
         {
            nombre: "Clases Grupales",
            descripcion: "Entrena en equipo, diviértete y mantén la motivación al máximo. Ofrecemos una variedad de clases como yoga, pilates, cycling, y más. Para todos los niveles, con instructores certificados y ambientes energizantes.",
            imagen: "/img/clases_grupales.webp",
            
        },
         {
            nombre: "Eventos Privados",
            descripcion: "¿Quieres celebrar de forma diferente? Organizamos eventos fitness exclusivos para empresas, grupos o celebraciones especiales. Actividades dinámicas, retos en equipo y experiencias saludables fuera de lo común.",
            imagen: "/img/eventos.webp",
            
        },
         {
            nombre: "Zonas Únicas",
            descripcion: "Nuestro gimnasio está diseñado para inspirarte. Disfruta de zonas diferenciadas como áreas funcionales, espacio de peso libre, sala de cardio con tecnología avanzada, y rincones de relajación.",
            imagen: "/img/zonas_unicas.webp",
            
        }
    ];

    return (
        <div className="flex flex-col bg-[var(--gris-oscuro)] items-center ">
            <HeaderUs promocion={null} />
            <main id="servicios" className="p-10 text-justify flex gap-y-10 flex-col main-completo items-center">
            {servicios.map((servicio, index) => (
                <Servicio key={index} nombre={servicio.nombre} descripcion={servicio.descripcion} imagen={servicio.imagen} color={index} />
            ))}
            </main>
            <Footer />
        </div>
    );
}