"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../componentes/Header";
import Video from "../componentes/Video";
import Footer from "../componentes/Footer";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

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
        <div className=" pb-10 w-full bg-[var(--gris-oscuro)] flex flex-col items-center justify-center gap-y-20">
            <Video videoUrl="/videos/chica-fitness.mp4" texto={texto} />
            <div className="flex flex-col items-center justify-center gap-6 pb-4 mt-[-2rem]">
                <h2 className="font-bold text-white oswald text-2xl mb-4">ENCUÉNTRANOS</h2>
                <Image
                    src="/img/localizacion.png"
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
                        infoChanges@gmail.com
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
                <h2 className="font-bold text-white oswald text-2xl mb-4 flex flex-row items-center w-full justify-between">
                    <span className="bg-[var(--azul)] h-2 w-[15%]"></span>
                    <div className="flex flex-col items-center w-[60%]"><span className="oswald">TODAS LAS CLASES</span><span className="oswald font-normal">INCLUIDAS EN TU CUOTA</span></div>
                    <span className="bg-[var(--azul)] h-2 w-[15%]"></span>
                </h2>
                <video
                    src="/videos/chica-yoga.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-80 h-70 object-cover border border-2 border-[var(--azul)] p-1"
                />
            </div>

            <div className="w-full bg-white pt-4">
                <h2 className="oswald font-semibold text-white fondo-dash text-center p-2 text-3xl">EXPERIENCIA CHANGES</h2>
                <p className="p-7 text-justify text-sm">
                    ¡El gimnasio donde entrenar se convierte en un placer! Con equipos de última generación, más de 150 clases a la semana y… <span className="dorado font-bold">¡SIN COMPROMISOS!</span> Sí, sabemos que lo tuyo es vivir al máximo. Y a nosotros nos ENCANTA ser parte de esa energía. Por eso en CHANGES te damos todo lo que necesitas para disfrutar cada entrenamiento.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 pb-4 w-full">
                <h2 className="font-bold text-white oswald text-2xl mb-4 flex flex-row items-center w-full justify-between">
                    <span className="bg-[var(--dorado)] h-2 w-[15%]"></span>
                    <div className="flex flex-col items-center w-[60%]"><span className="oswald">ASESORAMIENTO</span><span className="oswald font-normal">NUTRICIONAL PERSONAL</span></div>
                    <span className="bg-[var(--dorado)] h-2 w-[15%]"></span>
                </h2>
                <video
                    src="/videos/asesoramiento-nutricional.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-80 h-70 object-cover border border-2 border-[var(--dorado)] p-1"
                />
            </div>

            <Link href={"/registro"} className="bg-dorado p-3 w-40 font-bold text-white text-center">ÚNETE YA</Link>

            <div className="bg-white w-full pt-5 pb-5 flex flex-col">
                <p className="text-sm font-light text-center">¿NO NOS CREES A NOSOTROS?</p>
                <h2 className="text-center text-[var(--dorado)] text-3xl font-extrabold oswald">¡CRÉETELOS A ELLOS!</h2>
                <Carousel className="w-full">
                    <CarouselContent className="ml-1">
                        <CarouselItem className=" p-5 pl-14 pr-14 bg-[var(--dorado-claro)] flex flex-col gap-4 basis-full md:basis-1/3">
                            <h3 className="font-bold oswald text-lg uppercase">JAVIER SASTRE</h3>
                            <p className="text-justify text-sm leading-relaxed">
                                Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina, tanto si estás empezando como si llevas tiempo. La comida que te mandan es sana pero super rica, y las clases colectivas se disfrutan mucho. Además, no suele estar masificado, lo cual se agradece. Buena experiencia hasta ahora.
                            </p>
                        </CarouselItem>
                        <CarouselItem className=" p-5 pl-14 pr-14 bg-[var(--dorado-claro)] flex flex-col gap-4 basis-full md:basis-1/3">
                            <h3 className="font-bold oswald text-lg uppercase">SUSANA VALLEJO</h3>
                            <p className="text-justify text-sm leading-relaxed">
                                Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina, tanto si estás empezando como si llevas tiempo. La comida que te mandan es sana pero super rica, y las clases colectivas se disfrutan mucho. Además, no suele estar masificado, lo cual se agradece. Buena experiencia hasta ahora.
                            </p>
                        </CarouselItem>
                        <CarouselItem className=" p-5 pl-14 pr-14 bg-[var(--dorado-claro)] flex flex-col gap-4 basis-full md:basis-1/3">
                            <h3 className="font-bold oswald text-lg uppercase">RAFAEL DÍAZ</h3>
                            <p className="text-justify text-sm leading-relaxed">
                                Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina, tanto si estás empezando como si llevas tiempo. La comida que te mandan es sana pero super rica, y las clases colectivas se disfrutan mucho. Además, no suele estar masificado, lo cual se agradece. Buena experiencia hasta ahora.
                            </p>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div >
    );


    return (
        <div className="items-center justify-items-center min-h-screen">
            <Header promocion={"NUEVOS MIEMBROS | PERIODO DE PRUEBA GRATIS"} />
            {contenido}
            <Footer />
        </div>
    );
}