import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/login", "/registro", "/cuotas", "/servicios", "/actividades"];
  const privateRoutes = ["/dashboard", "/perfil", "/dietas", "/calendario", "/reservas", "horarios-actividades"];

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && privateRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}