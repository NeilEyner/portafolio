import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRETO_JWT = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion'
);

export interface DatosSesion {
  nombreUsuario: string;
  esAdmin: boolean;
  iat: number;
  exp: number;
}

// Crear token JWT
export async function crearToken(nombreUsuario: string): Promise<string> {
  const token = await new SignJWT({ nombreUsuario, esAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRETO_JWT);

  return token;
}

// Verificar token JWT
export async function verificarToken(token: string): Promise<DatosSesion | null> {
  try {
    const { payload } = await jwtVerify(token, SECRETO_JWT);
    return payload as DatosSesion;
  } catch (error) {
    return null;
  }
}

// Obtener sesión actual
export async function obtenerSesion(): Promise<DatosSesion | null> {
  const almacenCookies = await cookies();
  const token = almacenCookies.get('sesion_admin')?.value;

  if (!token) return null;

  return await verificarToken(token);
}

// Verificar credenciales de admin
export async function verificarCredencialesAdmin(
  nombreUsuario: string,
  contrasena: string
): Promise<boolean> {
  const usuarioAdmin = process.env.ADMIN_USERNAME || 'admin';
  const contrasenaAdmin = process.env.ADMIN_PASSWORD || 'admin123';

  // Verificar nombre de usuario
  if (nombreUsuario !== usuarioAdmin) return false;

  // Verificar contraseña
  // En producción, deberías usar bcrypt.compare con hash almacenado en BD
  return contrasena === contrasenaAdmin;
}

// Crear sesión
export async function crearSesion(nombreUsuario: string): Promise<void> {
  const token = await crearToken(nombreUsuario);
  const almacenCookies = await cookies();

  almacenCookies.set('sesion_admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 horas
    path: '/',
  });
}

// Destruir sesión
export async function destruirSesion(): Promise<void> {
  const almacenCookies = await cookies();
  almacenCookies.delete('sesion_admin');
}

// Verificar si el usuario es admin
export async function esAdmin(): Promise<boolean> {
  const sesion = await obtenerSesion();
  return sesion?.esAdmin ?? false;
}
