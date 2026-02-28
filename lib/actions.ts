'use server';

import { bd } from '@/db';
import { mensajeContacto, propietario, proyecto } from '@/db/esquema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ─────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────
export type EstadoMensaje = {
  ok: boolean;
  mensaje: string;
};

export type EstadoFoto = {
  ok: boolean;
  mensaje: string;
  ruta?: string;
};

// ─────────────────────────────────────────────────────────
// HELPER INTERNO — sube un archivo y devuelve la URL pública
// Usa Vercel Blob en producción, filesystem local en desarrollo
// ─────────────────────────────────────────────────────────
async function subirArchivo(
  archivo: File,
  carpeta: string         // ej: 'perfiles', 'proyectos', 'iconos'
): Promise<string> {
  const extension     = archivo.name.split('.').pop() ?? 'jpg';
  const nombreArchivo = `${carpeta}-${Date.now()}.${extension}`;

  // ── Vercel Blob (producción) ──────────────────────────
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`${carpeta}/${nombreArchivo}`, archivo, {
      access: 'public',
    });
    return blob.url;
  }

  // ── Filesystem local (desarrollo) ─────────────────────
  const { writeFile, mkdir } = await import('fs/promises');
  const path  = await import('path');
  const destino = path.join(process.cwd(), 'public', 'uploads', carpeta);
  await mkdir(destino, { recursive: true });
  const bytes = await archivo.arrayBuffer();
  await writeFile(path.join(destino, nombreArchivo), Buffer.from(bytes));
  return `/uploads/${carpeta}/${nombreArchivo}`;
}

// ─────────────────────────────────────────────────────────
// VALIDAR IMAGEN — devuelve error o null si es válida
// ─────────────────────────────────────────────────────────
function validarImagen(archivo: File | null): string | null {
  if (!archivo || archivo.size === 0) return 'No se seleccionó ningún archivo.';

  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!tiposPermitidos.includes(archivo.type))
    return 'Solo se permiten imágenes JPG, PNG, WebP o SVG.';

  const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB
  if (archivo.size > TAMANO_MAXIMO)
    return 'La imagen no debe superar los 5 MB.';

  return null;
}

// ─────────────────────────────────────────────────────────
// SUBIR FOTO DE PERFIL
// ─────────────────────────────────────────────────────────
export async function subirFotoPerfil(
  estadoAnterior: EstadoFoto,
  formData: FormData
): Promise<EstadoFoto> {
  try {
    const archivo = formData.get('foto') as File | null;
    const error   = validarImagen(archivo);
    if (error) return { ok: false, mensaje: error };

    const rutaPublica = await subirArchivo(archivo!, 'perfiles');

    await bd.update(propietario)
      .set({ fotoRuta: rutaPublica })
      .where(eq(propietario.id, 1));

    revalidatePath('/');
    return { ok: true, mensaje: 'Fotografía actualizada.', ruta: rutaPublica };
  } catch (err) {
    console.error('Error al subir foto de perfil:', err);
    return { ok: false, mensaje: 'Error al subir la imagen. Intenta de nuevo.' };
  }
}

// ─────────────────────────────────────────────────────────
// SUBIR IMAGEN DE PROYECTO — llamada desde el admin
// ─────────────────────────────────────────────────────────
export async function subirImagenProyecto(
  proyectoId: number,
  archivo: File
): Promise<{ ok: boolean; ruta?: string; error?: string }> {
  try {
    const error = validarImagen(archivo);
    if (error) return { ok: false, error };

    const rutaPublica = await subirArchivo(archivo, 'proyectos');

    await bd.update(proyecto)
      .set({ imagenPrincipal: rutaPublica })
      .where(eq(proyecto.id, proyectoId));

    revalidatePath('/');
    return { ok: true, ruta: rutaPublica };
  } catch (err) {
    console.error('Error al subir imagen de proyecto:', err);
    return { ok: false, error: 'Error al subir la imagen del proyecto.' };
  }
}

// ─────────────────────────────────────────────────────────
// SUBIR ICONO DE HABILIDAD
// ─────────────────────────────────────────────────────────
export async function subirIconoHabilidad(
  archivo: File
): Promise<{ ok: boolean; ruta?: string; error?: string }> {
  try {
    const error = validarImagen(archivo);
    if (error) return { ok: false, error };

    const rutaPublica = await subirArchivo(archivo, 'iconos');
    return { ok: true, ruta: rutaPublica };
  } catch (err) {
    console.error('Error al subir ícono:', err);
    return { ok: false, error: 'Error al subir el ícono.' };
  }
}

// ─────────────────────────────────────────────────────────
// ENVIAR MENSAJE DE CONTACTO
// ─────────────────────────────────────────────────────────
export async function enviarMensajeContacto(
  estadoAnterior: EstadoMensaje,
  formData: FormData
): Promise<EstadoMensaje> {
  try {
    const nombre  = (formData.get('nombre') as string)?.trim();
    const correo  = (formData.get('correo') as string)?.trim();
    const asunto  = (formData.get('asunto') as string)?.trim() || null;
    const mensaje = (formData.get('mensaje') as string)?.trim();

    if (!nombre || nombre.length < 2)
      return { ok: false, mensaje: 'El nombre debe tener al menos 2 caracteres.' };
    if (!correo || !correo.includes('@'))
      return { ok: false, mensaje: 'El correo electrónico no es válido.' };
    if (!mensaje || mensaje.length < 10)
      return { ok: false, mensaje: 'El mensaje debe tener al menos 10 caracteres.' };

    await bd.insert(mensajeContacto).values({
      propietarioId:   1,
      nombreRemitente: nombre,
      correoRemitente: correo,
      asunto,
      mensaje,
    });

    return { ok: true, mensaje: '¡Mensaje enviado! Te responderé a la brevedad.' };
  } catch (err) {
    console.error('Error al guardar mensaje:', err);
    return { ok: false, mensaje: 'Ocurrió un error. Intenta de nuevo más tarde.' };
  }
}