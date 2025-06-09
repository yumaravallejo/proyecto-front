import FiltrosActividades from "../componentes/FiltroActividad";
import Footer from "../componentes/Footer";
import HeaderUs from "../componentes/HeaderUs";


interface Actividades {
  nombre: string;
  capacidadMaxima: number;
  tipoClase: string;
  descripcion: string;
  duracion: number;
  exigencia: string;
  imagen: string;
}

async function getActividades(): Promise<Actividades[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/actividades`, {
    next: { revalidate: 60 }, // o "force-cache" si no se actualiza seguido
  });
  if (!res.ok) throw new Error("Error al obtener actividades");
  return res.json();
}

export default async function Page() {
  const actividades = await getActividades();

  return (
    <div>
      <HeaderUs promocion={null} pagina="ACTIVIDADES" />
      <main className="bg-[var(--gris-oscuro)] min-h-screen">
        <div className="pb-20">
          <FiltrosActividades actividades={actividades} />
        </div>
      </main>
      <Footer />
    </div>
  );
}