import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  const publicRoutes = ['/', '/login', '/registro', '/cuotas', '/servicios', '/actividades'];
  const privateRoutes = ['/dashboard', '/perfil', '/dietas', '/calendario', '/reservas', '/horarios-actividades', '/administracion'];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!token && isPrivate) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/registro',
    '/cuotas',
    '/servicios',
    '/actividades',
    '/dashboard/:path*',
    '/perfil',
    '/dietas',
    '/calendario',
    '/reservas',
    '/horarios-actividades',
    '/administracion',
  ],
};
