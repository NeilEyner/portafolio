// lib/schema.drizzle.ts
// Schema de Drizzle ORM para PostgreSQL
// Refleja exactamente las tablas del portafolio_neil.sql

import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  date,
  timestamp,
  smallint,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* ════════════════════════════════════════════════════════════
   1. PROPIETARIO
   ════════════════════════════════════════════════════════ */
export const propietario = pgTable("propietario", {
  id:                  serial("id").primaryKey(),
  nombres:             varchar("nombres",           { length: 80  }).notNull(),
  apellidos:           varchar("apellidos",         { length: 80  }).notNull(),
  iniciales:           varchar("iniciales",         { length: 6   }).notNull(),
  fechaNacimiento:     date("fecha_nacimiento"),
  ciudad:              varchar("ciudad",            { length: 80  }).notNull().default("La Paz"),
  departamento:        varchar("departamento",      { length: 80  }).notNull().default("La Paz"),
  pais:                varchar("pais",              { length: 80  }).notNull().default("Bolivia"),
  perfilProfesional:   text("perfil_profesional").notNull(),
  fotoRuta:            varchar("foto_ruta",         { length: 255 }),
  cvRuta:              varchar("cv_ruta",           { length: 255 }),
  temaColor:           varchar("tema_color").notNull().default("violeta"),
  temaOscuro:          boolean("tema_oscuro").notNull().default(true),
  fechaCreacion:       timestamp("fecha_creacion",    { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  fechaActualizacion:  timestamp("fecha_actualizacion",{ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

/* ════════════════════════════════════════════════════════════
   2. CONTACTO
   ════════════════════════════════════════════════════════ */
export const contacto = pgTable("contacto", {
  id:           serial("id").primaryKey(),
  propietarioId:integer("propietario_id").notNull()
                  .references(() => propietario.id, { onDelete: "cascade", onUpdate: "cascade" }),
  tipo:         varchar("tipo",     { length: 40  }).notNull(),
  etiqueta:     varchar("etiqueta", { length: 60  }).notNull(),
  valor:        varchar("valor",    { length: 255 }).notNull(),
  url:          varchar("url",      { length: 512 }),
  esPrincipal:  boolean("es_principal").notNull().default(false),
  orden:        smallint("orden").notNull().default(0),
  activo:       boolean("activo").notNull().default(true),
}, (t) => ({
  idxContactoTipo: index("idx_contacto_tipo").on(t.tipo),
}));

/* ════════════════════════════════════════════════════════════
   3. INSTITUCIÓN EDUCATIVA
   ════════════════════════════════════════════════════════ */
export const institucionEducativa = pgTable("institucion_educativa", {
  id:       serial("id").primaryKey(),
  nombre:   varchar("nombre",   { length: 255 }).notNull(),
  siglas:   varchar("siglas",   { length: 20  }),
  tipo:     varchar("tipo",     { length: 40  }).notNull().default("universidad"),
  ciudad:   varchar("ciudad",   { length: 80  }).default("La Paz"),
  pais:     varchar("pais",     { length: 80  }).default("Bolivia"),
  sitioWeb: varchar("sitio_web",{ length: 255 }),
});

/* ════════════════════════════════════════════════════════════
   4. FORMACIÓN ACADÉMICA
   ════════════════════════════════════════════════════════ */
export const formacionAcademica = pgTable("formacion_academica", {
  id:            serial("id").primaryKey(),
  propietarioId: integer("propietario_id").notNull()
                   .references(() => propietario.id,        { onDelete: "cascade",  onUpdate: "cascade" }),
  institucionId: integer("institucion_id").notNull()
                   .references(() => institucionEducativa.id,{ onDelete: "restrict", onUpdate: "cascade" }),
  titulo:        varchar("titulo",  { length: 255 }).notNull(),
  mencion:       varchar("mencion", { length: 255 }),
  facultad:      varchar("facultad",{ length: 255 }),
  nivel:         varchar("nivel").notNull().default("licenciatura"),
  anioInicio:    smallint("anio_inicio"),
  anioFin:       smallint("anio_fin"),
  estado:        varchar("estado").notNull().default("egresado"),
  descripcion:   text("descripcion"),
  orden:         smallint("orden").notNull().default(0),
}, (t) => ({
  idxFormacionPropietario: index("idx_formacion_propietario").on(t.propietarioId),
}));

/* ════════════════════════════════════════════════════════════
   5. EMPRESA
   ════════════════════════════════════════════════════════ */
export const empresa = pgTable("empresa", {
  id:       serial("id").primaryKey(),
  nombre:   varchar("nombre",   { length: 255 }).notNull(),
  tipo:     varchar("tipo").notNull().default("empresa_privada"),
  sector:   varchar("sector",   { length: 100 }),
  ciudad:   varchar("ciudad",   { length: 80  }).default("La Paz"),
  pais:     varchar("pais",     { length: 80  }).default("Bolivia"),
  sitioWeb: varchar("sitio_web",{ length: 255 }),
  logoRuta: varchar("logo_ruta",{ length: 255 }),
});

/* ════════════════════════════════════════════════════════════
   6. EXPERIENCIA LABORAL
   ════════════════════════════════════════════════════════ */
export const experienciaLaboral = pgTable("experiencia_laboral", {
  id:                  serial("id").primaryKey(),
  propietarioId:       integer("propietario_id").notNull()
                         .references(() => propietario.id, { onDelete: "cascade",  onUpdate: "cascade" }),
  empresaId:           integer("empresa_id").notNull()
                         .references(() => empresa.id,     { onDelete: "restrict", onUpdate: "cascade" }),
  cargo:               varchar("cargo",       { length: 200 }).notNull(),
  tipoContrato:        varchar("tipo_contrato").notNull().default("pasantia"),
  fechaInicio:         date("fecha_inicio").notNull(),
  fechaFin:            date("fecha_fin"),
  trabajoActual:       boolean("trabajo_actual").notNull().default(false),
  descripcionGeneral:  text("descripcion_general"),
  orden:               smallint("orden").notNull().default(0),
}, (t) => ({
  idxExpPropietario: index("idx_experiencia_propietario").on(t.propietarioId),
  idxExpEmpresa:     index("idx_experiencia_empresa").on(t.empresaId),
}));

/* ════════════════════════════════════════════════════════════
   7. TAREA DE EXPERIENCIA
   ════════════════════════════════════════════════════════ */
export const tareaExperiencia = pgTable("tarea_experiencia", {
  id:            serial("id").primaryKey(),
  experienciaId: integer("experiencia_id").notNull()
                   .references(() => experienciaLaboral.id, { onDelete: "cascade", onUpdate: "cascade" }),
  descripcion:   varchar("descripcion", { length: 512 }).notNull(),
  orden:         smallint("orden").notNull().default(0),
});

/* ════════════════════════════════════════════════════════════
   8. CATEGORÍA DE HABILIDAD
   ════════════════════════════════════════════════════════ */
export const categoriaHabilidad = pgTable("categoria_habilidad", {
  id:       serial("id").primaryKey(),
  nombre:   varchar("nombre", { length: 80 }).notNull(),
  slug:     varchar("slug",   { length: 80 }).notNull().unique(),
  iconoSvg: text("icono_svg"),
  orden:    smallint("orden").notNull().default(0),
});

/* ════════════════════════════════════════════════════════════
   9. HABILIDAD
   ════════════════════════════════════════════════════════ */
export const habilidad = pgTable("habilidad", {
  id:              serial("id").primaryKey(),
  categoriaId:     integer("categoria_id").notNull()
                     .references(() => categoriaHabilidad.id, { onDelete: "restrict", onUpdate: "cascade" }),
  nombre:          varchar("nombre", { length: 100 }).notNull(),
  slug:            varchar("slug",   { length: 100 }).notNull().unique(),
  nivelPorcentaje: smallint("nivel_porcentaje").notNull().default(50),
  nivelTexto:      varchar("nivel_texto").notNull().default("intermedio"),
  colorPrimario:   varchar("color_primario", { length: 7 }),
  iconoSvg:        text("icono_svg"),
  descripcion:     varchar("descripcion", { length: 255 }),
  orden:           smallint("orden").notNull().default(0),
  activo:          boolean("activo").notNull().default(true),
}, (t) => ({
  idxHabilidadCat: index("idx_habilidad_categoria").on(t.categoriaId),
}));

/* ════════════════════════════════════════════════════════════
   10. CATEGORÍA DE PROYECTO
   ════════════════════════════════════════════════════════ */
export const categoriaProyecto = pgTable("categoria_proyecto", {
  id:          serial("id").primaryKey(),
  nombre:      varchar("nombre",      { length: 80  }).notNull(),
  slug:        varchar("slug",        { length: 80  }).notNull().unique(),
  descripcion: varchar("descripcion", { length: 255 }),
  iconoSvg:    text("icono_svg"),
  orden:       smallint("orden").notNull().default(0),
});

/* ════════════════════════════════════════════════════════════
   11. PROYECTO
   ════════════════════════════════════════════════════════ */
export const proyecto = pgTable("proyecto", {
  id:               serial("id").primaryKey(),
  propietarioId:    integer("propietario_id").notNull()
                      .references(() => propietario.id,     { onDelete: "cascade",  onUpdate: "cascade" }),
  categoriaId:      integer("categoria_id").notNull()
                      .references(() => categoriaProyecto.id,{ onDelete: "restrict", onUpdate: "cascade" }),
  nombre:           varchar("nombre",           { length: 200 }).notNull(),
  slug:             varchar("slug",             { length: 200 }).notNull().unique(),
  descripcionCorta: varchar("descripcion_corta",{ length: 400 }),
  descripcionLarga: text("descripcion_larga"),
  imagenPrincipal:  varchar("imagen_principal", { length: 255 }),
  urlDemo:          varchar("url_demo",         { length: 512 }),
  urlRepositorio:   varchar("url_repositorio",  { length: 512 }),
  estado:           varchar("estado").notNull().default("completado"),
  destacado:        boolean("destacado").notNull().default(false),
  fechaInicio:      date("fecha_inicio"),
  fechaFin:         date("fecha_fin"),
  orden:            smallint("orden").notNull().default(0),
  publicado:        boolean("publicado").notNull().default(true),
  fechaCreacion:    timestamp("fecha_creacion",    { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  fechaActualizacion:timestamp("fecha_actualizacion",{ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  idxProyPropietario: index("idx_proyecto_propietario").on(t.propietarioId),
  idxProyCat:         index("idx_proyecto_categoria").on(t.categoriaId),
  idxProyEstado:      index("idx_proyecto_estado").on(t.estado),
  idxProyDestacado:   index("idx_proyecto_destacado").on(t.destacado),
}));

/* ════════════════════════════════════════════════════════════
   12. PROYECTO ↔ TECNOLOGÍA (N:M)
   ════════════════════════════════════════════════════════ */
export const proyectoTecnologia = pgTable("proyecto_tecnologia", {
  proyectoId:  integer("proyecto_id").notNull()
                 .references(() => proyecto.id,  { onDelete: "cascade", onUpdate: "cascade" }),
  habilidadId: integer("habilidad_id").notNull()
                 .references(() => habilidad.id, { onDelete: "cascade", onUpdate: "cascade" }),
  rol:         varchar("rol", { length: 100 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.proyectoId, t.habilidadId] }),
}));

/* ════════════════════════════════════════════════════════════
   13. IMAGEN DE PROYECTO
   ════════════════════════════════════════════════════════ */
export const imagenProyecto = pgTable("imagen_proyecto", {
  id:          serial("id").primaryKey(),
  proyectoId:  integer("proyecto_id").notNull()
                 .references(() => proyecto.id, { onDelete: "cascade", onUpdate: "cascade" }),
  ruta:        varchar("ruta",       { length: 255 }).notNull(),
  descripcion: varchar("descripcion",{ length: 200 }),
  orden:       smallint("orden").notNull().default(0),
});

/* ════════════════════════════════════════════════════════════
   14. ESTADÍSTICA
   ════════════════════════════════════════════════════════ */
export const estadistica = pgTable("estadistica", {
  id:            serial("id").primaryKey(),
  propietarioId: integer("propietario_id").notNull()
                   .references(() => propietario.id, { onDelete: "cascade", onUpdate: "cascade" }),
  etiqueta:      varchar("etiqueta", { length: 80  }).notNull(),
  valor:         varchar("valor",    { length: 20  }).notNull(),
  sufijo:        varchar("sufijo",   { length: 10  }),
  iconoSvg:      text("icono_svg"),
  orden:         smallint("orden").notNull().default(0),
  activo:        boolean("activo").notNull().default(true),
});

/* ════════════════════════════════════════════════════════════
   15. TEMA DE COLOR
   ════════════════════════════════════════════════════════ */
export const temaColor = pgTable("tema_color", {
  id:           serial("id").primaryKey(),
  nombre:       varchar("nombre",        { length: 50 }).notNull(),
  slug:         varchar("slug",          { length: 50 }).notNull().unique(),
  colorAcento1: varchar("color_acento_1",{ length: 7  }).notNull(),
  colorAcento2: varchar("color_acento_2",{ length: 7  }).notNull(),
  colorAcento3: varchar("color_acento_3",{ length: 7  }).notNull(),
  gradInicio:   varchar("grad_inicio",   { length: 7  }).notNull(),
  gradFin:      varchar("grad_fin",      { length: 7  }).notNull(),
  esDefault:    boolean("es_default").notNull().default(false),
  orden:        smallint("orden").notNull().default(0),
});

/* ════════════════════════════════════════════════════════════
   16. SECCIÓN DE NAVEGACIÓN
   ════════════════════════════════════════════════════════ */
export const seccionNavegacion = pgTable("seccion_navegacion", {
  id:       serial("id").primaryKey(),
  nombre:   varchar("nombre",  { length: 60 }).notNull(),
  slug:     varchar("slug",    { length: 60 }).notNull().unique(),
  idHtml:   varchar("id_html", { length: 80 }).notNull(),
  iconoSvg: text("icono_svg"),
  orden:    smallint("orden").notNull().default(0),
  activo:   boolean("activo").notNull().default(true),
});

/* ════════════════════════════════════════════════════════════
   17. MENSAJE DE CONTACTO
   ════════════════════════════════════════════════════════ */
export const mensajeContacto = pgTable("mensaje_contacto", {
  id:               serial("id").primaryKey(),
  propietarioId:    integer("propietario_id").notNull()
                      .references(() => propietario.id, { onDelete: "cascade", onUpdate: "cascade" }),
  nombreRemitente:  varchar("nombre_remitente", { length: 120 }).notNull(),
  correoRemitente:  varchar("correo_remitente", { length: 200 }).notNull(),
  asunto:           varchar("asunto",           { length: 255 }),
  mensaje:          text("mensaje").notNull(),
  ipOrigen:         varchar("ip_origen",        { length: 45  }),
  leido:            boolean("leido").notNull().default(false),
  fechaEnvio:       timestamp("fecha_envio", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  fechaLectura:     timestamp("fecha_lectura",{ withTimezone: true }),
}, (t) => ({
  idxMensajeLeido: index("idx_mensaje_leido").on(t.leido),
}));

/* ════════════════════════════════════════════════════════════
   18. VISITA
   ════════════════════════════════════════════════════════ */
export const visita = pgTable("visita", {
  id:            serial("id").primaryKey(),
  propietarioId: integer("propietario_id").notNull()
                   .references(() => propietario.id, { onDelete: "cascade", onUpdate: "cascade" }),
  ipVisitante:   varchar("ip_visitante",  { length: 45  }),
  agenteUsuario: varchar("agente_usuario",{ length: 512 }),
  referencia:    varchar("referencia",    { length: 512 }),
  seccionVista:  varchar("seccion_vista", { length: 80  }),
  duracionSeg:   smallint("duracion_seg"),
  fechaVisita:   timestamp("fecha_visita",{ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  idxVisitaFecha: index("idx_visita_fecha").on(t.fechaVisita),
}));