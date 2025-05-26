import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

export default function TerminosCondiciones() {
    return (
        <div className="flex flex-col">
            <HeaderUs promocion={null} />
            <main className="p-10 text-justify flex gap-y-3 flex-col main-completo">
                <h1 className="text-xl text-left mb-5 underline text-[var(--dorado-oscuro)]">TÉRMINOS Y CONDICIONES DE USO</h1>

                <p>Este documento establece los términos y condiciones que regulan el acceso y uso del sitio web de <strong>Changes Fitness Club</strong>, así como los servicios digitales ofrecidos.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">1. Aceptación de los términos</h2>
                <p>Al acceder a nuestro sitio o utilizar nuestros servicios, aceptas quedar vinculado por los presentes términos y condiciones. Si no estás de acuerdo, por favor, abstente de utilizar esta plataforma.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">2. Modificaciones</h2>
                <p>Nos reservamos el derecho a modificar estos términos en cualquier momento. Te notificaremos cualquier cambio importante a través del sitio web o por medios electrónicos.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">3. Uso del sitio y los servicios</h2>
                <ul>
                    <li>Debes utilizar el sitio de forma lícita y respetuosa con otros usuarios.</li>
                    <li>No está permitido hacer un uso indebido de nuestros servicios ni realizar actividades que puedan dañarlos.</li>
                    <li>El contenido, incluyendo planes, clases y programas, es solo para uso personal.</li>
                </ul>

                <h2 className="text-[var(--azul)] text-lg text-left">4. Propiedad intelectual</h2>
                <p>Todos los contenidos publicados son propiedad de Changes Fitness Club o sus licenciantes. No se permite su reproducción sin autorización escrita.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">5. Responsabilidad</h2>
                <ul>
                    <li>No garantizamos la disponibilidad continua del sitio ni la ausencia de errores.</li>
                    <li>Changes FC no se responsabiliza de daños derivados del uso inadecuado de la plataforma.</li>
                </ul>

                <h2 className="text-[var(--azul)] text-lg text-left">6. Cancelación y suspensión de cuentas</h2>
                <p>Nos reservamos el derecho de suspender o cancelar el acceso de cualquier usuario que incumpla estos términos sin previo aviso.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">7. Legislación aplicable</h2>
                <p>Estos términos se rigen por la legislación vigente en España. Cualquier controversia será resuelta por los tribunales competentes del país.</p>

                <p>Si tienes preguntas o inquietudes sobre estos términos, puedes contactarnos a <strong>legal@changesfitnessclub.com</strong>.</p>
            </main>
            <Footer />
        </div>
    );
}
