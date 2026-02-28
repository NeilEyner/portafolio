import { NextResponse } from 'next/server';
import { verificarCredencialesAdmin, crearSesion } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { nombreUsuario, contrasena } = await request.json();

    if (!nombreUsuario || !contrasena) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const esValido = await verificarCredencialesAdmin(nombreUsuario, contrasena);

    if (!esValido) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    await crearSesion(nombreUsuario);

    return NextResponse.json({ exito: true });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
