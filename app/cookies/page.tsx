import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

export default function Cookies() {
    //pagina de cookies easy pisi
    return (
        <div className="flex flex-col">
            <HeaderUs promocion={null} />
            <main className="p-10 text-justify flex gap-y-3 flex-col main-completo">
                <h1 className="text-xl text-left mb-5 underline text-[var(--dorado-oscuro)]">POLÍTICA DE COOKIES</h1>

                <p>En <strong>Changes Fitness Club</strong> utilizamos cookies para mejorar tu experiencia de usuario en nuestro sitio web, analizar el tráfico y personalizar el contenido.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">1. ¿Qué son las cookies?</h2>
                <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo al visitar sitios web. Sirven para recordar tus preferencias y facilitar tu navegación.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">2. Tipos de cookies que utilizamos</h2>
                <ul>
                    <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento del sitio.</li>
                    <li><strong>Cookies de análisis:</strong> nos ayudan a entender cómo interactúan los usuarios con el sitio.</li>
                    <li><strong>Cookies de personalización:</strong> permiten adaptar el contenido a tus preferencias.</li>
                </ul>

                <h2 className="text-[var(--azul)] text-lg text-left">3. ¿Cómo puedes gestionar las cookies?</h2>
                <p>Puedes configurar tu navegador para aceptar, rechazar o eliminar las cookies. Ten en cuenta que deshabilitar algunas puede afectar la funcionalidad del sitio.</p>

                <p>Al continuar navegando en nuestro sitio, aceptas el uso de cookies conforme a esta política.</p>
            </main>
            <Footer />
        </div>
    );
}
