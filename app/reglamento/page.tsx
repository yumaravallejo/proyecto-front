import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";


export default function Reglamento() {
    return (
        <div className="flex flex-col">
            <HeaderUs promocion={null} />
            <main className="p-10 text-justify flex gap-y-3 flex-col main-completo">
                <h1 className="text-xl text-left mb-5 underline text-[var(--dorado-oscuro)]">REGLAMENTO INTERNO – CHANGES FC</h1>

                    <p>Bienvenido a <strong>Changes Fitness Club</strong>. Para garantizar un ambiente seguro, respetuoso y enfocado en el bienestar de todos, te pedimos que leas y respetes las siguientes normas de funcionamiento:</p>

                    <h2 className="text-[var(--azul)] text-lg text-left">1. Acceso y Membresía</h2>
                    <ul>
                        <li>El ingreso al gimnasio está reservado exclusivamente a los socios con membresía activa.</li>
                        <li>Es obligatorio presentar tu credencial o identificación al ingresar.</li>
                        <li>Los menores de edad deben contar con autorización y supervisión según las normas vigentes.</li>
                    </ul>

                    <h2 className="text-[var(--azul)] text-lg text-left">2. Horarios</h2>
                    <ul>
                        <li>El gimnasio estará abierto de lunes a viernes de 6:00 a 22:00, sábados de 8:00 a 20:00, y domingos de 9:00 a 14:00.</li>
                        <li>Las actividades grupales y eventos especiales se regirán por el calendario publicado en nuestra web y redes sociales.</li>
                    </ul>

                    <h2 className="text-[var(--azul)] text-lg text-left">3. Uso de Instalaciones</h2>
                    <ul>
                        <li>Se debe usar ropa deportiva y calzado adecuado en todas las áreas de entrenamiento.</li>
                        <li>Limpia y desinfecta el equipo después de cada uso.</li>
                        <li>Guarda el material en su lugar una vez finalices tu sesión.</li>
                    </ul>

                    <h2 className="text-[var(--azul)] text-lg text-left">4. Programas Personalizados y Actividades</h2>
                    <ul>
                        <li>Los planes de dieta y entrenamiento son personalizados y deben ser supervisados por nuestros profesionales.</li>
                        <li>La asistencia a clases grupales requiere inscripción previa, ya que los cupos son limitados.</li>
                        <li>Respeta los horarios y normas específicas de cada clase o actividad.</li>
                    </ul>

                    <h2 className="text-[var(--azul)] text-lg text-left">5. Conducta General</h2>
                    <ul>
                        <li>Mantén una actitud respetuosa hacia el personal y otros usuarios.</li>
                        <li>No se permite el uso de lenguaje ofensivo ni actitudes inapropiadas.</li>
                        <li>Está prohibido grabar o fotografiar sin autorización previa.</li>
                    </ul>

                    <h2 className="text-[var(--azul)] text-lg text-left">6. Salud y Seguridad</h2>
                    <ul>
                        <li>Informa a nuestro equipo sobre cualquier condición médica relevante.</li>
                        <li>En caso de malestar o accidente, comunícalo inmediatamente al personal.</li>
                        <li>No se permite el ingreso con síntomas de enfermedades contagiosas.</li>
                    </ul>

                    <h2 className="text-[var(--azul)] text-lg text-left">7. Eventos y Calendario</h2>
                    <ul>
                        <li>Los eventos especiales están sujetos a inscripción previa y pueden tener requisitos específicos.</li>
                        <li>Consulta el calendario de actividades regularmente para mantenerte informado/a.</li>
                    </ul>

                    <h2 className="text-[var(--azul)] text-lg text-left">8. Suspensiones y Sanciones</h2>
                    <ul>
                        <li>El incumplimiento de estas normas puede derivar en advertencias, suspensión temporal o cancelación de la membresía.</li>
                    </ul>

                    <p><strong>Changes Fitness Club</strong> se reserva el derecho de modificar estas normas para mejorar el funcionamiento del centro y la experiencia de nuestros usuarios.</p>

                    <p>Gracias por formar parte de nuestra comunidad y contribuir a un espacio saludable y respetuoso para todos.</p>
            </main>
            <Footer />
        </div>
    );
}