// lib/queries.ts
import { db }                    from "./db";
import { eq, asc, and, inArray } from "drizzle-orm";
import {
  propietario, contacto, formacionAcademica, institucionEducativa,
  experienciaLaboral, tareaExperiencia, empresa,
  habilidad, categoriaHabilidad, proyecto, categoriaProyecto,
  estadistica, mensajeContacto,
} from "./schema.drizzle";

const ID_PROPIETARIO = 1;

export async function obtenerPropietario() {
  const [r] = await db.select().from(propietario).where(eq(propietario.id, ID_PROPIETARIO)).limit(1);
  return r ?? null;
}

export async function obtenerContactos() {
  return db.select().from(contacto)
    .where(and(eq(contacto.propietarioId, ID_PROPIETARIO), eq(contacto.activo, true)))
    .orderBy(asc(contacto.orden));
}

export async function obtenerFormacion() {
  return db.select({
    id: formacionAcademica.id, titulo: formacionAcademica.titulo, mencion: formacionAcademica.mencion,
    nivel: formacionAcademica.nivel, anioInicio: formacionAcademica.anioInicio, anioFin: formacionAcademica.anioFin,
    estado: formacionAcademica.estado, descripcion: formacionAcademica.descripcion, orden: formacionAcademica.orden,
    institucion: institucionEducativa.nombre, siglas: institucionEducativa.siglas,
  })
  .from(formacionAcademica)
  .innerJoin(institucionEducativa, eq(formacionAcademica.institucionId, institucionEducativa.id))
  .where(eq(formacionAcademica.propietarioId, ID_PROPIETARIO))
  .orderBy(asc(formacionAcademica.orden));
}

export async function obtenerExperiencia() {
  const experiencias = await db.select({
    id: experienciaLaboral.id, cargo: experienciaLaboral.cargo,
    tipoContrato: experienciaLaboral.tipoContrato, fechaInicio: experienciaLaboral.fechaInicio,
    fechaFin: experienciaLaboral.fechaFin, trabajoActual: experienciaLaboral.trabajoActual,
    descripcionGeneral: experienciaLaboral.descripcionGeneral, orden: experienciaLaboral.orden,
    empresa: empresa.nombre, sector: empresa.sector,
  })
  .from(experienciaLaboral)
  .innerJoin(empresa, eq(experienciaLaboral.empresaId, empresa.id))
  .where(eq(experienciaLaboral.propietarioId, ID_PROPIETARIO))
  .orderBy(asc(experienciaLaboral.orden));

  if (experiencias.length === 0) return [];

  const tareas = await db.select().from(tareaExperiencia)
    .where(inArray(tareaExperiencia.experienciaId, experiencias.map(e => e.id)))
    .orderBy(asc(tareaExperiencia.orden));

  return experiencias.map(exp => ({
    ...exp,
    tareas: tareas.filter(t => t.experienciaId === exp.id),
  }));
}

export async function obtenerHabilidades() {
  return db.select({
    id: habilidad.id, nombre: habilidad.nombre, slug: habilidad.slug,
    nivelPorcentaje: habilidad.nivelPorcentaje, nivelTexto: habilidad.nivelTexto,
    colorPrimario: habilidad.colorPrimario, descripcion: habilidad.descripcion, orden: habilidad.orden,
    categoria: categoriaHabilidad.nombre, categoriaSlug: categoriaHabilidad.slug,
  })
  .from(habilidad)
  .innerJoin(categoriaHabilidad, eq(habilidad.categoriaId, categoriaHabilidad.id))
  .where(eq(habilidad.activo, true))
  .orderBy(asc(categoriaHabilidad.orden), asc(habilidad.orden));
}

export async function obtenerCategoriasHabilidades() {
  return db.select().from(categoriaHabilidad).orderBy(asc(categoriaHabilidad.orden));
}

export async function obtenerProyectos() {
  return db.select({
    id: proyecto.id, nombre: proyecto.nombre, slug: proyecto.slug,
    descripcionCorta: proyecto.descripcionCorta, imagenPrincipal: proyecto.imagenPrincipal,
    estado: proyecto.estado, destacado: proyecto.destacado, publicado: proyecto.publicado,
    urlDemo: proyecto.urlDemo, urlRepositorio: proyecto.urlRepositorio, orden: proyecto.orden,
    categoria: categoriaProyecto.nombre, categoriaSlug: categoriaProyecto.slug,
  })
  .from(proyecto)
  .innerJoin(categoriaProyecto, eq(proyecto.categoriaId, categoriaProyecto.id))
  .where(eq(proyecto.propietarioId, ID_PROPIETARIO))
  .orderBy(asc(proyecto.orden));
}

export async function obtenerCategoriasProyectos() {
  return db.select().from(categoriaProyecto).orderBy(asc(categoriaProyecto.orden));
}

export async function obtenerEstadisticas() {
  return db.select().from(estadistica)
    .where(and(eq(estadistica.propietarioId, ID_PROPIETARIO), eq(estadistica.activo, true)))
    .orderBy(asc(estadistica.orden));
}

export async function guardarMensaje(datos: {
  nombre: string; correo: string; asunto?: string; mensaje: string; ip?: string;
}) {
  const [r] = await db.insert(mensajeContacto).values({
    propietarioId: ID_PROPIETARIO, nombreRemitente: datos.nombre,
    correoRemitente: datos.correo, asunto: datos.asunto ?? null,
    mensaje: datos.mensaje, ipOrigen: datos.ip ?? null,
  }).returning({ id: mensajeContacto.id });
  return r;
}

export type DatosPortafolio = {
  propietario:           Awaited<ReturnType<typeof obtenerPropietario>>;
  contactos:             Awaited<ReturnType<typeof obtenerContactos>>;
  formacion:             Awaited<ReturnType<typeof obtenerFormacion>>;
  experiencia:           Awaited<ReturnType<typeof obtenerExperiencia>>;
  habilidades:           Awaited<ReturnType<typeof obtenerHabilidades>>;
  categoriasHabilidades: Awaited<ReturnType<typeof obtenerCategoriasHabilidades>>;
  proyectos:             Awaited<ReturnType<typeof obtenerProyectos>>;
  categoriasProyectos:   Awaited<ReturnType<typeof obtenerCategoriasProyectos>>;
  estadisticas:          Awaited<ReturnType<typeof obtenerEstadisticas>>;
};