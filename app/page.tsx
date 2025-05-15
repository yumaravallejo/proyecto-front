
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "./componentes/Header";
import Video from "./componentes/Video";
import Footer from "./componentes/Footer";

export default function Home() {
  
  const texto = <div className="text-white flex flex-col text-center gap-5 items-center">
                  <u>EL CAMBIO LO ELIGES TÚ</u>
                  <h1 className="oswald text-3xl font-bold">CHANGES FITNESS CLUB</h1>
                  <Link className="boton" href={"/registro"}>ÚNETE</Link>
                </div>

  return (
    <div className="items-center justify-items-center min-h-screen">
        <Header promocion={"PROMOCIÓN NUEVOS MIEMBROS | PERIODO DE PRUEBA GRATIS"}  />
        <Video videoUrl="/videos/chica-fitness.mp4" texto={texto} />
        <Footer />
    </div>
  );
}
