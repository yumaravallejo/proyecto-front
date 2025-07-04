"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col w-full text-center items-center">
      <div className="bg-[var(--dorado)] w-full text-white flex flex-col gap-2 p-3">
       
        <div className="flex flex-row gap-4 justify-center">
          <Image
            alt="Logo de instagram"
            src={"/Rounded-instagram.svg"}
            width={40}
            height={50}
          />
          <Image
            alt="Logo de tiktok"
            src={"/Tiktok-rounded.svg"}
            width={40}
            height={50}
          />
          <Image
            alt="Logo de whatsapp"
            src={"/Whatsapp-rounded.svg"}
            width={40}
            height={50}
          />
          <Image
            alt="Logo de facebook"
            src={"/Facebook-rounded.svg"}
            width={40}
            height={50}
          />
        </div>
      </div>
      <div className="w-full text-left p-3 pl-10 pr-10 bg-white">
        <h3 className="text-[var(--azul-medio)] font-bold">
          Servicios de información
        </h3>
        <div className="flex flex-row flex-wrap pt-2 pb-2 gap-y-1">
          <Link href={"/atencion"} className="basis-[50%] text-sm">
            Atención al cliente
          </Link>
          <Link href={"/reglamento"} className="basis-[50%] text-sm">
            Horario de apertura
          </Link>
          <Link href={"/reglamento"} className="basis-[50%] text-sm">
            Reglamento interno
          </Link>
          <Link href={"/servicios"} className="basis-[50%] text-sm">
            Servicios del Club
          </Link>
        </div>
        {/* meotdillos de pago */}
        <h3 className="text-[var(--azul-medio)] font-bold">Métodos de pago</h3>
        <div className="flex flex-row pt-2 pb-2 h-12 justify-between">
          <Image alt="Logo de visa" src={"/Visa.png"} width={50} height={20} />
          <Image
            alt="Logo de Mastercard"
            src={"/Mastercard.png"}
            width={50}
            height={50}
          />
          <Image
            alt="Logo de paypal"
            src={"/logos_paypal.png"}
            width={30}
            height={50}
          />
          <Image
            alt="Logo de American Express"
            src={"/American-Express.png"}
            width={40}
            height={50}
          />
          <Image
            alt="Bandera de España"
            src={"/Spain.png"}
            width={60}
            height={0}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-y-3 bg-[var(--gris-oscuro)] w-full p-4 pl-10 pr-10 text-left text-white ">
        <h3 className="text-[var(--azul-medio)] font-bold hidden">
          Información adicional
        </h3>
        <Link href={"/cookies"} className="basis-[50%] text-sm ">
          Declaración de Cookies
        </Link>
        <Link href={"/legal"} className="basis-[50%] text-sm">
          Declaración de privacidad
        </Link>
        <Link href={"/terminos-condiciones"} className="basis-[50%] text-sm">
          Términos y Condiciones
        </Link>
        <Link href={"/legal"} className="basis-[50%] text-sm">
          Aviso Legal
        </Link>
      </div>
      <span className="basis-[100%] text-sm text-center w-full bg-[var(--gris-oscuro)] text-white pb-4 text-xs">
        &copy; {new Date().getFullYear()} Changes Fitness Club. Todos los
        derechos reservados.
      </span>
    </footer>
  );
}
