"use Client";
import ContactForm from "../componentes/ContactForm";
import HeaderUs from "../componentes/HeaderUs";
import Footer from "../componentes/Footer";

export default function Contact() {
  return (
    <div className="bg-[var(--gris-oscuro)] flex flex-col gap-10 items-center ">
      <HeaderUs promocion={null} pagina="CONTACTO" />
      <div className="flex flex-col gap-y-2 text-left w-full items-center ">
        <span className="text-white ">¿AÚN TIENES DUDAS?</span>
        <h1 className="oswald text-[var(--dorado)] text-2xl">
          CONTACTA CON NOSOTROS
        </h1>
      </div>
      <ContactForm />

      <Footer />
    </div>
  );
}
