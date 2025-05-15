import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "./componentes/Header";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen">
        <Header promocion={"PROMOCIÓN NUEVOS MIEMBROS | PERIODO DE PRUEBA GRATIS"}/>
        
    </div>
  );
}
