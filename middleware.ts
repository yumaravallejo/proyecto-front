import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  const publicRoutes = ["/", "/login", "/registro", "/cuotas", "/servicios", "/actividades"];
  const privateRoutes = ["/dashboard", "/perfil", "/dietas", "/calendario", "/reservas", "/horarios-actividades", "/administracion"];

  const isPublic = publicRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));
  const isPrivate = privateRoutes.some(r => pathname === r || pathname.startsWith(r + "/"));

  const res = NextResponse.next();
  // Desactivar cache
  res.headers.set("x-middleware-cache", "no-cache");

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && isPrivate) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/", "/login", "/registro", "/cuotas", "/servicios", "/actividades",
    "/dashboard/:path*", "/perfil/:path*", "/dietas/:path*",
    "/calendario/:path*", "/reservas/:path*", "/horarios-actividades/:path*",
    "/administracion/:path*",
  ],
};
