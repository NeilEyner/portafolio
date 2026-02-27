// lib/actions.ts
// Server Actions de Next.js 14+
// Se llaman directamente desde Client Components sin crear endpoints manualmente.

"use server";

import { revalidatePath } from "next/cache";
import { headers }        from "next/headers";
import { guardarMensaje } from "./queries";
import { db }             from "./db";
import { propietario }    from "./schema.drizzle";
import { eq }             from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/* ════════════════════════════════════════════════════════════
   1. ENVIAR MENSAJE DE CONTACTO
   ════════════════════════════════════════════════════════ */
export type EstadoMensaje = {
  ok:      boolean;
  mensaje: string;
};

export async function enviarMensajeContacto(
  _estado: EstadoMensaje,
  formData: FormData
): Promise<EstadoMensaje> {

  // ── Extraer campos ─────────────────────────────────────
  const nombre  = (formData.get("nombre")  as string)?.trim();
  const correo  = (formData.get("correo")  as string)?.trim();
  const asunto  = (formData.get("asunto")  as string)?.trim();
  const mensaje = (formData.get("mensaje") as string)?.trim();

  // ── Validaciones básicas ──────────────────────────────
  if (!nombre || nombre.length < 2) {
    return { ok: false, mensaje: "El nombre debe tener al menos 2 caracteres." };
  }
  if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return { ok: false, mensaje: "Ingresa un correo electrónico válido." };
  }
  if (!mensaje || mensaje.length < 10) {
    return { ok: false, mensaje: "El mensaje debe tener al menos 10 caracteres." };
  }
  if (mensaje.length > 2000) {
    return { ok: false, mensaje: "El mensaje no puede superar los 2000 caracteres." };
  }

  // ── Obtener IP del visitante ──────────────────────────
  const cabeceras = await headers();
  const ip =
    cabeceras.get("x-forwarded-for")?.split(",")[0] ??
    cabeceras.get("x-real-ip") ??
    "desconocida";

  // ── Guardar en DB ──────────────────────────────────── 
  try {
    await guardarMensaje({ nombre, correo, asunto, mensaje, ip });
    return { ok: true, mensaje: "¡Mensaje enviado con éxito! Te responderé pronto." };
  } catch (error) {
    console.error("[enviarMensajeContacto]", error);
    return { ok: false, mensaje: "Error al enviar el mensaje. Inténtalo nuevamente." };
  }
}

/* ════════════════════════════════════════════════════════════
   2. SUBIR FOTOGRAFÍA DE PERFIL
   ════════════════════════════════════════════════════════ */
export type EstadoFoto = {
  ok:      boolean;
  mensaje: string;
  ruta?:   string;
};

export async function subirFotoPerfil(
  _estado: EstadoFoto,
  formData: FormData
): Promise<EstadoFoto> {

  const archivo = formData.get("foto") as File | null;

  // ── Validaciones ──────────────────────────────────────
  if (!archivo || archivo.size === 0) {
    return { ok: false, mensaje: "No se recibió ningún archivo." };
  }
  if (!["image/jpeg","image/png","image/webp","image/avif"].includes(archivo.type)) {
    return { ok: false, mensaje: "Formato no permitido. Usa JPG, PNG o WEBP." };
  }
  if (archivo.size > 5 * 1024 * 1024) { // 5 MB máx
    return { ok: false, mensaje: "La imagen no puede superar los 5 MB." };
  }

  try {
    // ── Guardar en /public/uploads/ ──────────────────── 
    const extension   = archivo.name.split(".").pop() ?? "jpg";
    const nombreFinal = `perfil-${Date.now()}.${extension}`;
    const dirPublic   = path.join(process.cwd(), "public", "uploads");
    const rutaFinal   = path.join(dirPublic, nombreFinal);

    await mkdir(dirPublic, { recursive: true });

    const buffer = Buffer.from(await archivo.arrayBuffer());
    await writeFile(rutaFinal, buffer);

    const rutaRelativa = `/uploads/${nombreFinal}`;

    // ── Actualizar la ruta en la DB ───────────────────── 
    await db
      .update(propietario)
      .set({ fotoRuta: rutaRelativa })
      .where(eq(propietario.id, 1));

    // Invalidar la caché de la página principal
    revalidatePath("/");

    return { ok: true, mensaje: "Fotografía actualizada con éxito.", ruta: rutaRelativa };

  } catch (error) {
    console.error("[subirFotoPerfil]", error);
    return { ok: false, mensaje: "Error al guardar la fotografía." };
  }
}

/* ════════════════════════════════════════════════════════════
   3. ACTUALIZAR PREFERENCIAS DE TEMA
   (persiste el tema elegido en DB para todos los visitantes)
   ════════════════════════════════════════════════════════ */
export async function guardarPreferenciaTema(
  tema:  "oscuro" | "claro",
  color: string
): Promise<void> {
  try {
    await db
      .update(propietario)
      .set({
        temaOscuro: tema === "oscuro",
        temaColor:  color,
      })
      .where(eq(propietario.id, 1));

    revalidatePath("/");
  } catch (error) {
    console.error("[guardarPreferenciaTema]", error);
  }
}