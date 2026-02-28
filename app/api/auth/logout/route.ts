import { NextResponse } from 'next/server';
import { destruirSesion } from '@/lib/auth';

export async function POST() {
  try {
    await destruirSesion();
    return NextResponse.json({ exito: true });
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
