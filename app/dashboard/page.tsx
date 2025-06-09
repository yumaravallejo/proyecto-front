// app/dashboard/page.tsx
import { cookies } from "next/headers";
import DashboardContent from "../componentes/DashboardContent";
import { UsuarioDTO } from "../componentes/types";


async function getUser(): Promise<UsuarioDTO | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/usuarios/infoToken`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function Dashboard() {
  const user = await getUser();

  if (!user) return <p>No estás logueado</p>;

  return <DashboardContent user={user} />;
}
