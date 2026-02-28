import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Rutas que requieren autenticación de admin
const RUTAS_PROTEGIDAS = ['/admin/dashboard'];

const SECRETO_JWT = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta necesita protección
  const requiereAuth = RUTAS_PROTEGIDAS.some(ruta => pathname.startsWith(ruta));

  if (!requiereAuth) return NextResponse.next();

  // Verificar token en cookie
  const token = request.cookies.get('sesion_admin')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, SECRETO_JWT);
    return NextResponse.next();
  } catch {
    // Token inválido o expirado
    const respuesta = NextResponse.redirect(new URL('/admin/login', request.url));
    respuesta.cookies.delete('sesion_admin');
    return respuesta;
  }
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};