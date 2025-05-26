"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../componentes/Header";
import Video from "../componentes/Video";
import Footer from "../componentes/Footer";
import { useEffect, useState } from "react";
import Carousel from "../componentes/Carousel";
import ContactForm from "../componentes/ContactForm";

export default function Dashboard() {
    const texto = <div className="text-white flex flex-col text-center gap-5 items-center">
        <u>EL CAMBIO LO ELIGES TÚ</u>
        <h1 className="oswald text-3xl font-bold">CHANGES FITNESS CLUB</h1>
        <Link className="boton" href={"/registro"}>ÚNETE</Link>
    </div>

    const [login, setLogin] = useState(false);

    useEffect(() => {
        localStorage.getItem("user") ? setLogin(true) : setLogin(false);
    }, []);

    const contenido = login ? (
        <div>

        </div>
    ) : (
        <div className="dashboard pb-10 w-full bg-[var(--gris-oscuro)] flex flex-col items-center justify-center">
            <Video videoUrl="/videos/chica-fitness.mp4" texto={texto} />
            <div id="encuentranos" className="flex flex-col items-center justify-center gap-6 pb-4 ">
                <h2 className="font-bold text-white text-2xl mb-4">ENCUÉNTRANOS</h2>
                <Image
                    src="/img/localizacion.webp"
                    alt="Imagen de usuario"
                    width={300}
                    height={50}
                    className="rounded-5"

                />
                <div className="flex flex-col gap-y-5 mt-5 pl-13 pr-13">
                    <span className="flex flex-row gap-5 items-center text-white font-bold">
                        <Image
                            src="/place-icon.svg"
                            alt="Imagen de usuario"
                            width={40}
                            height={50}
                        />
                        Calle Ejemplo, 23, Marbella Málaga
                    </span>
                    <span className="flex flex-row gap-5 items-center text-white font-bold">
                        <Image
                            src="/mail-icon.svg"
                            alt="Imagen de usuario"
                            width={40}
                            height={50}
                        />
                        contacto@changesfitnessclub.com
                    </span>
                    <span className="flex flex-row gap-5 items-center text-white font-bold">
                        <Image
                            src="/phone-icon.svg"
                            alt="Imagen de usuario"
                            width={40}
                            height={50}
                        />
                        +34 999999999
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 pb-4 w-full">
                <div className="title-barras font-bold text-white text-2xl mb-4 flex flex-row items-center w-full justify-between">
                    <span className="bg-[var(--azul)] h-2 w-[15%]"></span>
                    <h2 className="flex flex-col items-center w-[60%]">TODAS LAS CLASES <span>INCLUIDAS EN TU CUOTA</span></h2>
                    <span className="bg-[var(--azul)] h-2 w-[15%]"></span>
                </div>
                <video
                    src="/videos/chica-yoga.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-80 h-70 object-cover border border-2 border-[var(--azul)] p-1"
                />
            </div>

            <div id="experiencia" className="w-full bg-white pt-4">
                <h2 className="oswald font-semibold text-white fondo-dash text-center p-2 text-3xl">EXPERIENCIA CHANGES</h2>
                <div className="flex justify-center">
                    <p className="p-7 text-justify text-sm">
                        ¡El gimnasio donde entrenar se convierte en un placer! Con equipos de última generación, más de 150 clases a la semana y… <strong className="dorado">¡SIN COMPROMISOS!</strong> Sí, sabemos que lo tuyo es vivir al máximo. Y a nosotros nos ENCANTA ser parte de esa energía. Por eso en CHANGES te damos todo lo que necesitas para disfrutar cada entrenamiento.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 pb-4 w-full">
                <div className="title-barras font-bold text-white oswald text-2xl mb-4 flex flex-row items-center w-full justify-between">
                    <span className="bg-[var(--dorado)] h-2 w-[15%]"></span>
                    <h2 className="flex flex-col items-center w-[60%]">ASESORAMIENTO <span>NUTRICIONAL PERSONAL</span></h2>
                    <span className="bg-[var(--dorado)] h-2 w-[15%]"></span>
                </div>
                <video
                    src="/videos/asesoramiento-nutricional.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-80 h-70 object-cover border border-2 border-[var(--dorado)] p-1"
                />
            </div>

            <div className="flex flex-row gap-x-4 items-center m-[-2rem] mt-[-3rem] ">
                <Link href={"/registro"} className="p-3 w-50 font-bold text-white text-center  boton-dorado-shadow">ÚNETE YA</Link>
            </div>

            <div className="bg-white w-full pt-5 pb-5 flex flex-col">
                <p className="text-sm font-light text-center">¿NO NOS CREES A NOSOTROS?</p>
                <h2 className="text-center text-[var(--dorado)] text-3xl font-extrabold oswald">¡CRÉETELOS A ELLOS!</h2>
                <div className="pad-carrusel"><Carousel /></div>
            </div>

            <div className="flex flex-col gap-y-2 text-left w-full items-center">
                <span className="text-white ">¿AÚN TIENES DUDAS?</span>
                <h2 className="oswald text-[var(--dorado)] text-2xl">CONTACTA CON NOSOTROS</h2>
            </div>
            <div id="form-contacto-db" className="flex items-center justify-center mt-[-2.5rem]">
                <ContactForm />
            </div>

            

        </div>
    );


    return (
        <div className="items-center justify-items-center min-h-screen">
            <Header promocion={"NUEVOS MIEMBROS | PERIODO DE PRUEBA GRATIS"} />
            {contenido}
            <Footer />
        </div>
    );
}