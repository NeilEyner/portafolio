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
} from '@/db/esquema';
import { eq, asc, and } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────
// TIPOS EXPORTADOS — usados en el cliente
// ─────────────────────────────────────────────────────────

export type PropietarioPublico = {
  id: number;
  nombres: string;
  apellidos: string;
  iniciales: string;
  fechaNacimiento: string | null;
  ciudad: string;
  pais: string;
  perfilProfesional: string;
  fotoRuta: string | null;
  cvRuta: string | null;
  temaColor: string;
  temaOscuro: boolean;
};

export type ContactoPublico = {
  id: number;
  tipo: string;
  etiqueta: string;
  valor: string;
  url: string | null;
  esPrincipal: boolean;
  orden: number;
};

export type FormacionPublica = {
  id: number;
  titulo: string;
  mencion: string | null;
  facultad: string | null;
  nivel: string;
  anioInicio: number | null;
  anioFin: number | null;
  estado: string;
  descripcion: string | null;
  institucion: string;
  siglas: string | null;
};

export type TareaExperiencia = {
  id: number;
  descripcion: string;
  orden: number;
};

export type ExperienciaPublica = {
  id: number;
  cargo: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string | null;
  trabajoActual: boolean;
  empresa: string;
  sector: string | null;
  tareas: TareaExperiencia[];
};


export type HabilidadPublica = {
  id: number;
  nombre: string;
  slug: string;
  nivelPorcentaje: number;
  nivelTexto: string;
  colorPrimario: string | null;
  iconoSvg: string | null; 
  categoriaSlug: string;
};

export type CategoriaPublica = {
  id: number;
  nombre: string;
  slug: string;
};

export type ProyectoPublico = {
  id: number;
  nombre: string;
  slug: string;
  descripcionCorta: string | null;
  imagenPrincipal: string | null;
  urlDemo: string | null;
  urlRepositorio: string | null;
  estado: string;
  destacado: boolean;
  publicado: boolean;
  categoria: string;
  categoriaSlug: string;
};

export type EstadisticaPublica = {
  id: number;
  etiqueta: string;
  valor: string;
  sufijo: string | null;
};

export type DatosPortafolio = {
  propietario: PropietarioPublico;
  contactos: ContactoPublico[];
  formacion: FormacionPublica[];
  experiencia: ExperienciaPublica[];
  habilidades: HabilidadPublica[];
  categoriasHabilidades: CategoriaPublica[];
  proyectos: ProyectoPublico[];
  categoriasProyectos: CategoriaPublica[];
  estadisticas: EstadisticaPublica[];
};

// ─────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL — obtiene todos los datos del portafolio
// ─────────────────────────────────────────────────────────
export async function obtenerDatosPortafolio(): Promise<DatosPortafolio> {
  // ID fijo del propietario (portafolio personal)
  const ID_PROPIETARIO = 1;

  // 1) Datos del propietario
  const [prop] = await bd
    .select()
    .from(propietario)
    .where(eq(propietario.id, ID_PROPIETARIO));

  if (!prop) throw new Error('No se encontró el propietario del portafolio.');

  // 2) Contactos activos ordenados
  const contactos = await bd
    .select()
    .from(contacto)
    .where(and(eq(contacto.propietarioId, ID_PROPIETARIO), eq(contacto.activo, true)))
    .orderBy(asc(contacto.orden));

  // 3) Formación académica con institución
  const filaFormacion = await bd
    .select({
      id:          formacionAcademica.id,
      titulo:      formacionAcademica.titulo,
      mencion:     formacionAcademica.mencion,
      facultad:    formacionAcademica.facultad,
      nivel:       formacionAcademica.nivel,
      anioInicio:  formacionAcademica.anioInicio,
      anioFin:     formacionAcademica.anioFin,
      estado:      formacionAcademica.estado,
      descripcion: formacionAcademica.descripcion,
      institucion: institucionEducativa.nombre,
      siglas:      institucionEducativa.siglas,
    })
    .from(formacionAcademica)
    .innerJoin(institucionEducativa, eq(formacionAcademica.institucionId, institucionEducativa.id))
    .where(eq(formacionAcademica.propietarioId, ID_PROPIETARIO))
    .orderBy(asc(formacionAcademica.orden));

  // 4) Experiencia laboral con empresa y tareas
  const filasExp = await bd
    .select({
      id:              experienciaLaboral.id,
      cargo:           experienciaLaboral.cargo,
      tipoContrato:    experienciaLaboral.tipoContrato,
      fechaInicio:     experienciaLaboral.fechaInicio,
      fechaFin:        experienciaLaboral.fechaFin,
      trabajoActual:   experienciaLaboral.trabajoActual,
      empresaNombre:   empresa.nombre,
      sector:          empresa.sector,
      tareaId:         tareaExperiencia.id,
      tareaDescripcion: tareaExperiencia.descripcion,
      tareaOrden:      tareaExperiencia.orden,
    })
    .from(experienciaLaboral)
    .innerJoin(empresa, eq(experienciaLaboral.empresaId, empresa.id))
    .leftJoin(tareaExperiencia, eq(tareaExperiencia.experienciaId, experienciaLaboral.id))
    .where(eq(experienciaLaboral.propietarioId, ID_PROPIETARIO))
    .orderBy(asc(experienciaLaboral.orden));

  // Agrupar tareas dentro de cada experiencia
  const mapaExperiencias = new Map<number, ExperienciaPublica>();
  for (const fila of filasExp) {
    if (!mapaExperiencias.has(fila.id)) {
      mapaExperiencias.set(fila.id, {
        id:           fila.id,
        cargo:        fila.cargo,
        tipoContrato: fila.tipoContrato,
        fechaInicio:  fila.fechaInicio,
        fechaFin:     fila.fechaFin,
        trabajoActual: fila.trabajoActual,
        empresa:      fila.empresaNombre,
        sector:       fila.sector,
        tareas:       [],
      });
    }
    if (fila.tareaId) {
      mapaExperiencias.get(fila.id)!.tareas.push({
        id:          fila.tareaId,
        descripcion: fila.tareaDescripcion!,
        orden:       fila.tareaOrden!,
      });
    }
  }
  const experiencia = Array.from(mapaExperiencias.values());

  // 5) Categorías de habilidades
  const categoriasHabilidades = await bd
    .select({
      id:     categoriaHabilidad.id,
      nombre: categoriaHabilidad.nombre,
      slug:   categoriaHabilidad.slug,
    })
    .from(categoriaHabilidad)
    .orderBy(asc(categoriaHabilidad.orden));

  // 6) Habilidades con su categoría
  const habilidades = await bd
    .select({
      id:              habilidad.id,
      nombre:          habilidad.nombre,
      slug:            habilidad.slug,
      nivelPorcentaje: habilidad.nivelPorcentaje,
      nivelTexto:      habilidad.nivelTexto,
      colorPrimario:   habilidad.colorPrimario,
      iconoSvg:        habilidad.iconoSvg,
      categoriaSlug:   categoriaHabilidad.slug,
    })
    .from(habilidad)
    .innerJoin(categoriaHabilidad, eq(habilidad.categoriaId, categoriaHabilidad.id))
    .orderBy(asc(categoriaHabilidad.orden), asc(habilidad.orden));

  // 7) Categorías de proyectos
  const categoriasProyectos = await bd
    .select({
      id:     categoriaProyecto.id,
      nombre: categoriaProyecto.nombre,
      slug:   categoriaProyecto.slug,
    })
    .from(categoriaProyecto)
    .orderBy(asc(categoriaProyecto.orden));

  // 8) Proyectos del propietario
  const proyectos = await bd
    .select({
      id:               proyecto.id,
      nombre:           proyecto.nombre,
      slug:             proyecto.slug,
      descripcionCorta: proyecto.descripcionCorta,
      imagenPrincipal:  proyecto.imagenPrincipal,
      urlDemo:          proyecto.urlDemo,
      urlRepositorio:   proyecto.urlRepositorio,
      estado:           proyecto.estado,
      destacado:        proyecto.destacado,
      publicado:        proyecto.publicado,
      categoria:        categoriaProyecto.nombre,
      categoriaSlug:    categoriaProyecto.slug,
    })
    .from(proyecto)
    .innerJoin(categoriaProyecto, eq(proyecto.categoriaId, categoriaProyecto.id))
    .where(eq(proyecto.propietarioId, ID_PROPIETARIO))
    .orderBy(asc(proyecto.orden));

  // 9) Estadísticas activas
  const estadisticas = await bd
    .select({
      id:       estadistica.id,
      etiqueta: estadistica.etiqueta,
      valor:    estadistica.valor,
      sufijo:   estadistica.sufijo,
    })
    .from(estadistica)
    .where(and(eq(estadistica.propietarioId, ID_PROPIETARIO), eq(estadistica.activo, true)))
    .orderBy(asc(estadistica.orden));

  return {
    propietario: {
      id:                prop.id,
      nombres:           prop.nombres,
      apellidos:         prop.apellidos,
      iniciales:         prop.iniciales,
      fechaNacimiento:   prop.fechaNacimiento,
      ciudad:            prop.ciudad,
      pais:              prop.pais,
      perfilProfesional: prop.perfilProfesional,
      fotoRuta:          prop.fotoRuta,
      cvRuta:            prop.cvRuta,
      temaColor:         prop.temaColor,
      temaOscuro:        prop.temaOscuro,
    },
    contactos: contactos.map(c => ({
      id:          c.id,
      tipo:        c.tipo,
      etiqueta:    c.etiqueta,
      valor:       c.valor,
      url:         c.url,
      esPrincipal: c.esPrincipal,
      orden:       c.orden,
    })),
    formacion:            filaFormacion,
    experiencia,
    habilidades,
    categoriasHabilidades,
    proyectos,
    categoriasProyectos,
    estadisticas,
  };
}