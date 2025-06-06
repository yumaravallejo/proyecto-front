import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  let pathname = req.nextUrl.pathname;
  console.log("Middleware - Pathname:", pathname);
  console.log("Middleware - Token cookie:", token);

  // quitar slash final para evitar problemas
  pathname = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  const publicRoutes = ["/", "/login", "/registro", "/cuotas", "/servicios", "/actividades"];
  const privateRoutes = ["/dashboard", "/perfil", "/dietas", "/calendario", "/reservas", "/horarios-actividades", "/administracion"];

  if (token && publicRoutes.includes(pathname)) {
    console.log("Redirigiendo a /dashboard porque ya está autenticado");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && privateRoutes.includes(pathname)) {
    console.log("Redirigiendo a / porque no está autenticado");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
