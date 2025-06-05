"use client";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

export default function AtencionCliente() {
    return (
        <div className="flex flex-col">
            <HeaderUs promocion={null} />
            <main className="p-10 text-justify flex gap-y-3 flex-col lg:pl-20 lg:pr-20 main-completo">
                <h1 className="text-xl text-left mb-5 underline text-[var(--dorado-oscuro)]">ATENCIÓN AL CLIENTE</h1>

                <p>En <strong>Changes Fitness Club</strong> valoramos tu experiencia. Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier duda, sugerencia o inconveniente.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">1. Horario de atención</h2>
                <p>De lunes a viernes de 9:00 a 18:00. Los fines de semana atendemos solo por correo electrónico.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">2. Canales de contacto</h2>
                <ul>
                    <li><strong>Teléfono:</strong> +34 123 456 789</li>
                    <li><strong>Email:</strong> contacto@changesfitnessclub.com</li>
                    <li><strong>Formulario web:</strong> disponible en la sección de Contacto.</li>
                </ul>

                <h2 className="text-[var(--azul)] text-lg text-left">3. Tiempo de respuesta</h2>
                <p>Nos comprometemos a responder todas las consultas en un plazo máximo de 48 horas hábiles.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">4. Reclamaciones</h2>
                <p>Si tienes una queja, por favor, comunícala a través de nuestros canales y la gestionaremos con prioridad. Queremos mejorar continuamente y tu opinión es muy valiosa.</p>

                <p>Gracias por confiar en <strong>Changes Fitness Club</strong>. Estamos aquí para ayudarte.</p>
            </main>
            <Footer />
        </div>
    );
}
