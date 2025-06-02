import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/login", "/registro", "/cuotas", "/servicios"];
  const privateRoutes = ["/dashboard", "/perfil", "/dietas", "/calendario", "/horarios"];

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && privateRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log("Token en middleware:", req.cookies.get("token")?.value);
  console.log("Ruta actual en middleware:", pathname);

  return NextResponse.next();
}