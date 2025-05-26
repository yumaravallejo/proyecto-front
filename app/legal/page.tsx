import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

export default function legal() {
    return (
        <div className="flex flex-col">
            <HeaderUs promocion={null} />
            <main className="p-10 text-justify flex gap-y-3 flex-col main-completo">
                <h1 className="text-xl text-left mb-5 underline text-[var(--dorado-oscuro)]">DECLARACIÓN DE PRIVACIDAD Y AVISO LEGAL</h1>

                <p>En <strong>Changes Fitness Club</strong> nos tomamos muy en serio tu privacidad y la protección de tus datos personales. A continuación, detallamos cómo tratamos tu información, los términos de seguridad aplicados y el aviso legal correspondiente.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">1. Protección de datos personales</h2>
                <p>Los datos que recopilamos son utilizados exclusivamente para prestar nuestros servicios, mejorar tu experiencia y cumplir con obligaciones legales. En ningún caso serán compartidos con terceros sin tu consentimiento expreso.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">2. Información recopilada</h2>
                <ul>
                    <li>Datos de contacto: nombre, correo electrónico, teléfono.</li>
                    <li>Información de salud (solo si decides participar en programas personalizados).</li>
                    <li>Preferencias y actividad dentro de la plataforma.</li>
                </ul>

                <h2 className="text-[var(--azul)] text-lg text-left">3. Derechos del usuario</h2>
                <p>En cualquier momento puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO) contactando a nuestro equipo de protección de datos.</p>

                <h2 className="text-[var(--azul)] text-lg text-left">4. Términos de seguridad</h2>
                <ul>
                    <li>Implementamos protocolos de seguridad física y digital para proteger tus datos.</li>
                    <li>Utilizamos cifrado y autenticación segura en nuestras plataformas.</li>
                    <li>Solo personal autorizado puede acceder a la información confidencial.</li>
                </ul>

                <h2 className="text-[var(--azul)] text-lg text-left">5. Aviso legal</h2>
                <p>El contenido de este sitio web es propiedad de Changes Fitness Club. Queda prohibida su reproducción, distribución o modificación sin autorización previa.</p>
                <p>No nos hacemos responsables del mal uso de la información ofrecida ni de posibles daños derivados del uso de la plataforma por parte de terceros.</p>

                <p>Al usar nuestros servicios, aceptas esta Declaración de Privacidad, nuestros términos de seguridad y el aviso legal aquí expuesto.</p>

                <p>Para más información, puedes escribirnos a <strong>privacidad@changesfitnessclub.com</strong></p>
            </main>
            <Footer />
        </div>
    );
}
