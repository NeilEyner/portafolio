import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
  boolean,
  smallint,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core';

// ============ ENUMS ============
export const tipoContacto = pgEnum('contacto_tipo', [
  'telefono',
  'whatsapp',
  'correo',
  'github',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'sitio_web',
  'otro',
]);

export const nivelFormacion = pgEnum('formacion_nivel', [
  'basico',
  'tecnico_basico',
  'tecnico_auxiliar',
  'tecnico_medio',
  'licenciatura',
  'egresado',
  'titulado',
  'maestria',
  'doctorado',
  'curso',
  'certificacion',
  'otro',
]);

export const estadoFormacion = pgEnum('formacion_estado', [
  'cursando',
  'egresado',
  'titulado',
  'abandonado',
]);

export const tipoEmpresa = pgEnum('empresa_tipo', [
  'television',
  'universidad',
  'empresa_privada',
  'empresa_publica',
  'ong',
  'freelance',
  'otro',
]);

export const tipoContrato = pgEnum('contrato_tipo', [
  'pasantia',
  'tiempo_completo',
  'medio_tiempo',
  'freelance',
  'voluntariado',
  'otro',
]);

export const nivelHabilidadTexto = pgEnum('habilidad_nivel_texto', [
  'basico',
  'intermedio',
  'avanzado',
  'experto',
]);

export const estadoProyecto = pgEnum('proyecto_estado', [
  'en_desarrollo',
  'completado',
  'pausado',
  'mantenimiento',
  'cancelado',
]);

export const temaColorPropietario = pgEnum('propietario_tema_color', [
  'violeta',
  'cielo',
  'esmeralda',
  'amanecer',
  'rosa',
]);

// ============ TABLAS ============

export const propietario = pgTable('propietario', {
  id: serial('id').primaryKey(),
  nombres: varchar('nombres', { length: 80 }).notNull(),
  apellidos: varchar('apellidos', { length: 80 }).notNull(),
  iniciales: varchar('iniciales', { length: 6 }).notNull(),
  fechaNacimiento: date('fecha_nacimiento'),
  ciudad: varchar('ciudad', { length: 80 }).notNull().default('La Paz'),
  departamento: varchar('departamento', { length: 80 }).notNull().default('La Paz'),
  pais: varchar('pais', { length: 80 }).notNull().default('Bolivia'),
  perfilProfesional: text('perfil_profesional').notNull(),
  fotoRuta: varchar('foto_ruta', { length: 255 }),
  cvRuta: varchar('cv_ruta', { length: 255 }),
  temaColor: temaColorPropietario('tema_color').notNull().default('violeta'),
  temaOscuro: boolean('tema_oscuro').notNull().default(true),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaActualizacion: timestamp('fecha_actualizacion', { withTimezone: true }).notNull().defaultNow(),
});

export const contacto = pgTable('contacto', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id').notNull().references(() => propietario.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  tipo: tipoContacto('tipo').notNull(),
  etiqueta: varchar('etiqueta', { length: 60 }).notNull(),
  valor: varchar('valor', { length: 255 }).notNull(),
  url: varchar('url', { length: 512 }),
  esPrincipal: boolean('es_principal').notNull().default(false),
  orden: smallint('orden').notNull().default(0),
  activo: boolean('activo').notNull().default(true),
});

export const institucionEducativa = pgTable('institucion_educativa', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  siglas: varchar('siglas', { length: 20 }),
  tipo: varchar('tipo', { length: 40 }).notNull().default('universidad'),
  ciudad: varchar('ciudad', { length: 80 }).default('La Paz'),
  pais: varchar('pais', { length: 80 }).default('Bolivia'),
  sitioWeb: varchar('sitio_web', { length: 255 }),
});

export const formacionAcademica = pgTable('formacion_academica', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id').notNull().references(() => propietario.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  institucionId: integer('institucion_id').notNull().references(() => institucionEducativa.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  mencion: varchar('mencion', { length: 255 }),
  facultad: varchar('facultad', { length: 255 }),
  nivel: nivelFormacion('nivel').notNull().default('licenciatura'),
  anioInicio: smallint('anio_inicio'),
  anioFin: smallint('anio_fin'),
  estado: estadoFormacion('estado').notNull().default('egresado'),
  descripcion: text('descripcion'),
  orden: smallint('orden').notNull().default(0),
});

export const empresa = pgTable('empresa', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  tipo: tipoEmpresa('tipo').notNull().default('empresa_privada'),
  sector: varchar('sector', { length: 100 }),
  ciudad: varchar('ciudad', { length: 80 }).default('La Paz'),
  pais: varchar('pais', { length: 80 }).default('Bolivia'),
  sitioWeb: varchar('sitio_web', { length: 255 }),
  logoRuta: varchar('logo_ruta', { length: 255 }),
});

export const experienciaLaboral = pgTable('experiencia_laboral', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id').notNull().references(() => propietario.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  empresaId: integer('empresa_id').notNull().references(() => empresa.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
  cargo: varchar('cargo', { length: 200 }).notNull(),
  tipoContrato: tipoContrato('tipo_contrato').notNull().default('pasantia'),
  fechaInicio: date('fecha_inicio').notNull(),
  fechaFin: date('fecha_fin'),
  trabajoActual: boolean('trabajo_actual').notNull().default(false),
  descripcionGeneral: text('descripcion_general'),
  orden: smallint('orden').notNull().default(0),
});

export const tareaExperiencia = pgTable('tarea_experiencia', {
  id: serial('id').primaryKey(),
  experienciaId: integer('experiencia_id').notNull().references(() => experienciaLaboral.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  descripcion: varchar('descripcion', { length: 512 }).notNull(),
  orden: smallint('orden').notNull().default(0),
});

export const categoriaHabilidad = pgTable('categoria_habilidad', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 80 }).notNull(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  orden: smallint('orden').notNull().default(0),
});

export const habilidad = pgTable('habilidad', {
  id: serial('id').primaryKey(),
  categoriaId: integer('categoria_id').notNull().references(() => categoriaHabilidad.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
  nombre: varchar('nombre', { length: 80 }).notNull(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  nivelPorcentaje: smallint('nivel_porcentaje').notNull().default(50),
  nivelTexto: nivelHabilidadTexto('nivel_texto').notNull().default('intermedio'),
  colorPrimario: varchar('color_primario', { length: 20 }).default('#7c6fef'),
  descripcion: text('descripcion'),
  iconoSvg: text('icono_svg'),
  orden: smallint('orden').notNull().default(0),
  activo: boolean('activo').notNull().default(true),
});

// También agrega iconoSvg a proyecto (ya tiene imagenPrincipal, no cambia)

export const categoriaProyecto = pgTable('categoria_proyecto', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 80 }).notNull(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  descripcion: text('descripcion'),
  orden: smallint('orden').notNull().default(0),
});

export const proyecto = pgTable('proyecto', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id').notNull().references(() => propietario.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  categoriaId: integer('categoria_id').notNull().references(() => categoriaProyecto.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  descripcionCorta: text('descripcion_corta'),
  descripcionLarga: text('descripcion_larga'),
  imagenPrincipal: varchar('imagen_principal', { length: 255 }),
  urlDemo: varchar('url_demo', { length: 512 }),
  urlRepositorio: varchar('url_repositorio', { length: 512 }),
  estado: estadoProyecto('estado').notNull().default('en_desarrollo'),
  destacado: boolean('destacado').notNull().default(false),
  publicado: boolean('publicado').notNull().default(false),
  orden: smallint('orden').notNull().default(0),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
});

export const proyectoTecnologia = pgTable('proyecto_tecnologia', {
  id: serial('id').primaryKey(),
  proyectoId: integer('proyecto_id').notNull().references(() => proyecto.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  habilidadId: integer('habilidad_id').notNull().references(() => habilidad.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
});

export const estadistica = pgTable('estadistica', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id').notNull().references(() => propietario.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  etiqueta: varchar('etiqueta', { length: 60 }).notNull(),
  valor: varchar('valor', { length: 20 }).notNull(),
  sufijo: varchar('sufijo', { length: 10 }).default(''),
  orden: smallint('orden').notNull().default(0),
  activo: boolean('activo').notNull().default(true),
});

export const temaColor = pgTable('tema_color', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 60 }).notNull(),
  slug: varchar('slug', { length: 60 }).notNull().unique(),
  colorAcento1: varchar('color_acento_1', { length: 20 }).notNull(),
  colorAcento2: varchar('color_acento_2', { length: 20 }).notNull(),
  colorAcento3: varchar('color_acento_3', { length: 20 }).notNull(),
  gradInicio: varchar('grad_inicio', { length: 20 }).notNull(),
  gradFin: varchar('grad_fin', { length: 20 }).notNull(),
  esPorDefecto: boolean('es_default').notNull().default(false),
  orden: smallint('orden').notNull().default(0),
});

export const seccionNavegacion = pgTable('seccion_navegacion', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 60 }).notNull(),
  slug: varchar('slug', { length: 60 }).notNull().unique(),
  idHtml: varchar('id_html', { length: 60 }).notNull(),
  orden: smallint('orden').notNull().default(0),
  activo: boolean('activo').notNull().default(true),
});
// ── TABLAS FALTANTES — agregar al final de esquema.ts ──────

export const imagenProyecto = pgTable('imagen_proyecto', {
  id: serial('id').primaryKey(),
  proyectoId: integer('proyecto_id').notNull().references(() => proyecto.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  ruta: varchar('ruta', { length: 255 }).notNull(),
  descripcion: varchar('descripcion', { length: 200 }),
  orden: smallint('orden').notNull().default(0),
});

export const mensajeContacto = pgTable('mensaje_contacto', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id').notNull().references(() => propietario.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  nombreRemitente: varchar('nombre_remitente', { length: 120 }).notNull(),
  correoRemitente: varchar('correo_remitente', { length: 200 }).notNull(),
  asunto: varchar('asunto', { length: 255 }),
  mensaje: text('mensaje').notNull(),
  ipOrigen: varchar('ip_origen', { length: 45 }),
  leido: boolean('leido').notNull().default(false),
  archivado: boolean('archivado').notNull().default(false),
  fechaEnvio: timestamp('fecha_envio', { withTimezone: true }).notNull().defaultNow(),
  fechaLectura: timestamp('fecha_lectura', { withTimezone: true }),
});

export const visita = pgTable('visita', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id').notNull().references(() => propietario.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  ipVisitante: varchar('ip_visitante', { length: 45 }),
  agenteUsuario: varchar('agente_usuario', { length: 512 }),
  referencia: varchar('referencia', { length: 512 }),
  seccionVista: varchar('seccion_vista', { length: 80 }),
  duracionSeg: smallint('duracion_seg'),
  fechaVisita: timestamp('fecha_visita', { withTimezone: true }).notNull().defaultNow(),
});