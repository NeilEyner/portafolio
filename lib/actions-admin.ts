'use server';

import { bd } from '@/db';
import {
  propietario,
  contacto,
  formacionAcademica,
  institucionEducativa,
  experienciaLaboral,
  empresa,
  tareaExperiencia,
  categoriaHabilidad,
  habilidad,
  categoriaProyecto,
  proyecto,
  estadistica,
  mensajeContacto,
} from '@/db/esquema';
import { eq, desc, asc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { esAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

// ─────────────────────────────────────────────────────────
// HELPER — verificar que el usuario es admin
// ─────────────────────────────────────────────────────────
async function verificarAdmin() {
  const autorizado = await esAdmin();
  if (!autorizado) redirect('/admin/login');
}

// Tipo genérico de resultado para todas las operaciones
type Resultado = { ok: boolean; error?: string };

// ═══════════════════════════════════════════════════════════
// SECCIÓN: PROPIETARIO (perfil principal)
// ═══════════════════════════════════════════════════════════

export async function actualizarPerfil(datos: {
  nombres: string;
  apellidos: string;
  iniciales: string;
  perfilProfesional: string;
  ciudad: string;
  departamento: string;
  pais: string;
  temaColor: 'violeta' | 'cielo' | 'esmeralda' | 'amanecer' | 'rosa';
  temaOscuro: boolean;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.update(propietario)
      .set(datos)
      .where(eq(propietario.id, 1));
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al actualizar el perfil.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SECCIÓN: CONTACTOS
// ═══════════════════════════════════════════════════════════

export async function crearContacto(datos: {
  tipo: string;
  etiqueta: string;
  valor: string;
  url: string | null;
  esPrincipal: boolean;
  orden: number;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.insert(contacto).values({
      propietarioId: 1,
      activo:        true,
      tipo:          datos.tipo as any,
      etiqueta:      datos.etiqueta,
      valor:         datos.valor,
      url:           datos.url,
      esPrincipal:   datos.esPrincipal,
      orden:         datos.orden,
    });
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al crear el contacto.' };
  }
}

export async function actualizarContacto(id: number, datos: {
  tipo: string;
  etiqueta: string;
  valor: string;
  url: string | null;
  esPrincipal: boolean;
  orden: number;
  activo: boolean;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.update(contacto)
      .set({ ...datos, tipo: datos.tipo as any })
      .where(eq(contacto.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al actualizar el contacto.' };
  }
}

export async function eliminarContacto(id: number): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.delete(contacto).where(eq(contacto.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al eliminar el contacto.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SECCIÓN: FORMACIÓN ACADÉMICA
// ═══════════════════════════════════════════════════════════

export async function crearInstitucion(datos: {
  nombre: string;
  siglas: string | null;
  tipo: string;
  ciudad: string;
  pais: string;
}): Promise<Resultado & { id?: number }> {
  await verificarAdmin();
  try {
    const [nueva] = await bd.insert(institucionEducativa)
      .values(datos)
      .returning({ id: institucionEducativa.id });
    return { ok: true, id: nueva.id };
  } catch {
    return { ok: false, error: 'Error al crear la institución.' };
  }
}

export async function crearFormacion(datos: {
  institucionId: number;
  titulo: string;
  mencion: string | null;
  facultad: string | null;
  nivel: string;
  anioInicio: number | null;
  anioFin: number | null;
  estado: string;
  descripcion: string | null;
  orden: number;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.insert(formacionAcademica).values({
      propietarioId: 1,
      ...datos,
      nivel:  datos.nivel as any,
      estado: datos.estado as any,
    });
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al crear la formación.' };
  }
}

export async function actualizarFormacion(id: number, datos: {
  titulo: string;
  mencion: string | null;
  nivel: string;
  anioInicio: number | null;
  anioFin: number | null;
  estado: string;
  descripcion: string | null;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.update(formacionAcademica)
      .set({ ...datos, nivel: datos.nivel as any, estado: datos.estado as any })
      .where(eq(formacionAcademica.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al actualizar la formación.' };
  }
}

export async function eliminarFormacion(id: number): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.delete(formacionAcademica).where(eq(formacionAcademica.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al eliminar la formación.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SECCIÓN: EXPERIENCIA LABORAL
// ═══════════════════════════════════════════════════════════

export async function crearEmpresa(datos: {
  nombre: string;
  tipo: string;
  sector: string | null;
  ciudad: string;
  pais: string;
}): Promise<Resultado & { id?: number }> {
  await verificarAdmin();
  try {
    const [nueva] = await bd.insert(empresa)
      .values({ ...datos, tipo: datos.tipo as any })
      .returning({ id: empresa.id });
    return { ok: true, id: nueva.id };
  } catch {
    return { ok: false, error: 'Error al crear la empresa.' };
  }
}

export async function crearExperiencia(datos: {
  empresaId: number;
  cargo: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string | null;
  trabajoActual: boolean;
  descripcionGeneral: string | null;
  orden: number;
  tareas: string[]; // lista de descripciones de tareas
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    const { tareas, ...datosExp } = datos;
    const [nueva] = await bd.insert(experienciaLaboral)
      .values({
        propietarioId: 1,
        ...datosExp,
        tipoContrato: datosExp.tipoContrato as any,
      })
      .returning({ id: experienciaLaboral.id });

    // Insertar tareas asociadas
    if (tareas.length > 0) {
      await bd.insert(tareaExperiencia).values(
        tareas.map((desc, i) => ({
          experienciaId: nueva.id,
          descripcion:   desc,
          orden:         i,
        }))
      );
    }
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al crear la experiencia.' };
  }
}

export async function actualizarExperiencia(id: number, datos: {
  cargo: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string | null;
  trabajoActual: boolean;
  descripcionGeneral: string | null;
  tareas: string[];
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    const { tareas, ...datosExp } = datos;
    await bd.update(experienciaLaboral)
      .set({ ...datosExp, tipoContrato: datosExp.tipoContrato as any })
      .where(eq(experienciaLaboral.id, id));

    // Reemplazar tareas: eliminar las viejas e insertar las nuevas
    await bd.delete(tareaExperiencia).where(eq(tareaExperiencia.experienciaId, id));
    if (tareas.length > 0) {
      await bd.insert(tareaExperiencia).values(
        tareas.map((desc, i) => ({
          experienciaId: id,
          descripcion:   desc,
          orden:         i,
        }))
      );
    }
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al actualizar la experiencia.' };
  }
}

export async function eliminarExperiencia(id: number): Promise<Resultado> {
  await verificarAdmin();
  try {
    // Las tareas se eliminan en cascada por la FK
    await bd.delete(experienciaLaboral).where(eq(experienciaLaboral.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al eliminar la experiencia.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SECCIÓN: HABILIDADES
// ═══════════════════════════════════════════════════════════

export async function crearHabilidad(datos: {
  categoriaId: number;
  nombre: string;
  slug: string;
  nivelPorcentaje: number;
  nivelTexto: string;
  colorPrimario: string | null;
  iconoSvg: string | null;
  descripcion: string | null;
  orden: number;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.insert(habilidad).values({
      ...datos,
      nivelTexto: datos.nivelTexto as any,
    });
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al crear la habilidad.' };
  }
}

export async function actualizarHabilidad(id: number, datos: {
  categoriaId: number;
  nombre: string;
  nivelPorcentaje: number;
  nivelTexto: string;
  colorPrimario: string | null;
  iconoSvg: string | null;
  descripcion: string | null;
  activo: boolean;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.update(habilidad)
      .set({ ...datos, nivelTexto: datos.nivelTexto as any })
      .where(eq(habilidad.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al actualizar la habilidad.' };
  }
}

export async function eliminarHabilidad(id: number): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.delete(habilidad).where(eq(habilidad.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al eliminar la habilidad.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SECCIÓN: PROYECTOS
// ═══════════════════════════════════════════════════════════

export async function crearProyecto(datos: {
  categoriaId: number;
  nombre: string;
  slug: string;
  descripcionCorta: string | null;
  descripcionLarga: string | null;
  urlDemo: string | null;
  urlRepositorio: string | null;
  estado: string;
  destacado: boolean;
  publicado: boolean;
  orden: number;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.insert(proyecto).values({
      propietarioId: 1,
      ...datos,
      estado: datos.estado as any,
    });
    revalidatePath('/');
    return { ok: true };
  } catch (e: any) {
    if (e?.message?.includes('unique')) {
      return { ok: false, error: 'Ya existe un proyecto con ese slug.' };
    }
    return { ok: false, error: 'Error al crear el proyecto.' };
  }
}

export async function actualizarProyecto(id: number, datos: {
  categoriaId: number;
  nombre: string;
  descripcionCorta: string | null;
  descripcionLarga: string | null;
  urlDemo: string | null;
  urlRepositorio: string | null;
  estado: string;
  destacado: boolean;
  publicado: boolean;
  orden: number;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.update(proyecto)
      .set({ ...datos, estado: datos.estado as any })
      .where(eq(proyecto.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al actualizar el proyecto.' };
  }
}

export async function eliminarProyecto(id: number): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.delete(proyecto).where(eq(proyecto.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al eliminar el proyecto.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SECCIÓN: ESTADÍSTICAS
// ═══════════════════════════════════════════════════════════

export async function actualizarEstadistica(id: number, datos: {
  etiqueta: string;
  valor: string;
  sufijo: string | null;
  activo: boolean;
}): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.update(estadistica).set(datos).where(eq(estadistica.id, id));
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al actualizar la estadística.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SECCIÓN: MENSAJES DE CONTACTO
// ═══════════════════════════════════════════════════════════

export async function marcarMensajeLeido(id: number): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.update(mensajeContacto)
      .set({ leido: true, fechaLectura: new Date() as any })
      .where(eq(mensajeContacto.id, id));
    revalidatePath('/admin/dashboard');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al marcar el mensaje.' };
  }
}

export async function eliminarMensaje(id: number): Promise<Resultado> {
  await verificarAdmin();
  try {
    await bd.delete(mensajeContacto).where(eq(mensajeContacto.id, id));
    revalidatePath('/admin/dashboard');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Error al eliminar el mensaje.' };
  }
}

// ═══════════════════════════════════════════════════════════
// OBTENER DATOS PARA EL DASHBOARD — una sola llamada
// ═══════════════════════════════════════════════════════════

export async function obtenerDatosDashboard() {
  await verificarAdmin();

  const [
    datosProp,
    contactos,
    categoriasHab,
    habilidades,
    categoriasProy,
    proyectos,
    formacion,
    instituciones,
    experiencias,
    tareas,
    empresas,
    mensajes,
    estadisticas,
  ] = await Promise.all([
    bd.select().from(propietario).where(eq(propietario.id, 1)),
    bd.select().from(contacto).where(eq(contacto.propietarioId, 1)).orderBy(asc(contacto.orden)),
    bd.select().from(categoriaHabilidad).orderBy(asc(categoriaHabilidad.orden)),
    bd.select().from(habilidad).orderBy(asc(habilidad.orden)),
    bd.select().from(categoriaProyecto).orderBy(asc(categoriaProyecto.orden)),
    bd.select().from(proyecto).where(eq(proyecto.propietarioId, 1)).orderBy(asc(proyecto.orden)),
    bd.select().from(formacionAcademica).where(eq(formacionAcademica.propietarioId, 1)).orderBy(asc(formacionAcademica.orden)),
    bd.select().from(institucionEducativa).orderBy(asc(institucionEducativa.nombre)),
    bd.select().from(experienciaLaboral).where(eq(experienciaLaboral.propietarioId, 1)).orderBy(asc(experienciaLaboral.orden)),
    bd.select().from(tareaExperiencia).orderBy(asc(tareaExperiencia.orden)),
    bd.select().from(empresa).orderBy(asc(empresa.nombre)),
    bd.select().from(mensajeContacto).where(eq(mensajeContacto.propietarioId, 1)).orderBy(desc(mensajeContacto.fechaEnvio)),
    bd.select().from(estadistica).where(eq(estadistica.propietarioId, 1)).orderBy(asc(estadistica.orden)),
  ]);

  return {
    propietario:       datosProp[0],
    contactos,
    categoriasHab,
    habilidades,
    categoriasProy,
    proyectos,
    formacion,
    instituciones,
    experiencias,
    tareas,
    empresas,
    mensajes,
    estadisticas,
  };
}