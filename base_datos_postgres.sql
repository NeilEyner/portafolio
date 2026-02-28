-- ============================================================
-- PORTAFOLIO PROFESIONAL — PostgreSQL (limpio y ordenado)
-- Autor: Neil Eyner Canaviri Huanca
-- ============================================================

-- Eliminar y crear base de datos (requiere permisos de creación)
DROP DATABASE IF EXISTS portafolio;
CREATE DATABASE portafolio WITH ENCODING = 'UTF8';
-- ============================
--  1) Tipos ENUM
-- ============================
CREATE TYPE contacto_tipo AS ENUM (
 'telefono','whatsapp','correo','github','linkedin','instagram','facebook','youtube','sitio_web','otro'
);
CREATE TYPE formacion_nivel AS ENUM (
 'basico','tecnico_basico','tecnico_auxiliar','tecnico_medio','licenciatura','egresado','titulado',
 'maestria','doctorado','curso','certificacion','otro'
);
CREATE TYPE formacion_estado AS ENUM ('cursando','egresado','titulado','abandonado');
CREATE TYPE empresa_tipo AS ENUM (
 'television','universidad','empresa_privada','empresa_publica','ong','freelance','otro'
);
CREATE TYPE contrato_tipo AS ENUM (
 'pasantia','tiempo_completo','medio_tiempo','freelance','voluntariado','otro'
);
CREATE TYPE habilidad_nivel_texto AS ENUM ('basico','intermedio','avanzado','experto');
CREATE TYPE proyecto_estado AS ENUM (
 'en_desarrollo','completado','pausado','mantenimiento','cancelado'
);
CREATE TYPE propietario_tema_color AS ENUM ('violeta','cielo','esmeralda','amanecer','rosa');

-- ============================
--  2) Tablas principales
-- ============================
CREATE TABLE propietario (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 nombres VARCHAR(80) NOT NULL,
 apellidos VARCHAR(80) NOT NULL,
 iniciales VARCHAR(6) NOT NULL,
 fecha_nacimiento DATE DEFAULT NULL,
 ciudad VARCHAR(80) NOT NULL DEFAULT 'La Paz',
 departamento VARCHAR(80) NOT NULL DEFAULT 'La Paz',
 pais VARCHAR(80) NOT NULL DEFAULT 'Bolivia',
 perfil_profesional TEXT NOT NULL,
 foto_ruta VARCHAR(255) DEFAULT NULL,
 cv_ruta VARCHAR(255) DEFAULT NULL,
 tema_color propietario_tema_color NOT NULL DEFAULT 'violeta',
 tema_oscuro BOOLEAN NOT NULL DEFAULT TRUE,
 fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
 fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE contacto (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 propietario_id INTEGER NOT NULL REFERENCES propietario(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 tipo contacto_tipo NOT NULL,
 etiqueta VARCHAR(60) NOT NULL,
 valor VARCHAR(255) NOT NULL,
 url VARCHAR(512) DEFAULT NULL,
 es_principal BOOLEAN NOT NULL DEFAULT FALSE,
 orden SMALLINT NOT NULL DEFAULT 0,
 activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE institucion_educativa (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 nombre VARCHAR(255) NOT NULL,
 siglas VARCHAR(20) DEFAULT NULL,
 tipo VARCHAR(40) NOT NULL DEFAULT 'universidad',
 ciudad VARCHAR(80) DEFAULT 'La Paz',
 pais VARCHAR(80) DEFAULT 'Bolivia',
 sitio_web VARCHAR(255) DEFAULT NULL
);
CREATE TABLE formacion_academica (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 propietario_id INTEGER NOT NULL REFERENCES propietario(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 institucion_id INTEGER NOT NULL REFERENCES institucion_educativa(id) ON
UPDATE CASCADE ON
DELETE RESTRICT,
 titulo VARCHAR(255) NOT NULL,
 mencion VARCHAR(255) DEFAULT NULL,
 facultad VARCHAR(255) DEFAULT NULL,
 nivel formacion_nivel NOT NULL DEFAULT 'licenciatura',
 anio_inicio SMALLINT DEFAULT NULL,
 anio_fin SMALLINT DEFAULT NULL,
 estado formacion_estado NOT NULL DEFAULT 'egresado',
 descripcion TEXT DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0
);
CREATE TABLE empresa (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 nombre VARCHAR(255) NOT NULL,
 tipo empresa_tipo NOT NULL DEFAULT 'empresa_privada',
 sector VARCHAR(100) DEFAULT NULL,
 ciudad VARCHAR(80) DEFAULT 'La Paz',
 pais VARCHAR(80) DEFAULT 'Bolivia',
 sitio_web VARCHAR(255) DEFAULT NULL,
 logo_ruta VARCHAR(255) DEFAULT NULL
);
CREATE TABLE experiencia_laboral (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 propietario_id INTEGER NOT NULL REFERENCES propietario(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 empresa_id INTEGER NOT NULL REFERENCES empresa(id) ON
UPDATE CASCADE ON
DELETE RESTRICT,
 cargo VARCHAR(200) NOT NULL,
 tipo_contrato contrato_tipo NOT NULL DEFAULT 'pasantia',
 fecha_inicio DATE NOT NULL,
 fecha_fin DATE DEFAULT NULL,
 trabajo_actual BOOLEAN NOT NULL DEFAULT FALSE,
 descripcion_general TEXT DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0
);
CREATE TABLE tarea_experiencia (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 experiencia_id INTEGER NOT NULL REFERENCES experiencia_laboral(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 descripcion VARCHAR(512) NOT NULL,
 orden SMALLINT NOT NULL DEFAULT 0
);
CREATE TABLE categoria_habilidad (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 nombre VARCHAR(80) NOT NULL,
 slug VARCHAR(80) NOT NULL UNIQUE,
 icono_svg TEXT DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0
);
CREATE TABLE habilidad (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 categoria_id INTEGER NOT NULL REFERENCES categoria_habilidad(id) ON
UPDATE CASCADE ON
DELETE RESTRICT,
 nombre VARCHAR(100) NOT NULL,
 slug VARCHAR(100) NOT NULL UNIQUE,
 nivel_porcentaje SMALLINT NOT NULL DEFAULT 50 CHECK (nivel_porcentaje BETWEEN 0 AND 100),
 nivel_texto habilidad_nivel_texto NOT NULL DEFAULT 'intermedio',
 color_primario VARCHAR(7) DEFAULT NULL,
 icono_svg TEXT DEFAULT NULL,
 descripcion VARCHAR(255) DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0,
 activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE categoria_proyecto (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 nombre VARCHAR(80) NOT NULL,
 slug VARCHAR(80) NOT NULL UNIQUE,
 descripcion VARCHAR(255) DEFAULT NULL,
 icono_svg TEXT DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0
);
CREATE TABLE proyecto (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 propietario_id INTEGER NOT NULL REFERENCES propietario(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 categoria_id INTEGER NOT NULL REFERENCES categoria_proyecto(id) ON
UPDATE CASCADE ON
DELETE RESTRICT,
 nombre VARCHAR(200) NOT NULL,
 slug VARCHAR(200) NOT NULL UNIQUE,
 descripcion_corta VARCHAR(400) DEFAULT NULL,
 descripcion_larga TEXT DEFAULT NULL,
 imagen_principal VARCHAR(255) DEFAULT NULL,
 url_demo VARCHAR(512) DEFAULT NULL,
 url_repositorio VARCHAR(512) DEFAULT NULL,
 estado proyecto_estado NOT NULL DEFAULT 'completado',
 destacado BOOLEAN NOT NULL DEFAULT FALSE,
 fecha_inicio DATE DEFAULT NULL,
 fecha_fin DATE DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0,
 publicado BOOLEAN NOT NULL DEFAULT TRUE,
 fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
 fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE proyecto_tecnologia (
 proyecto_id INTEGER NOT NULL REFERENCES proyecto(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 habilidad_id INTEGER NOT NULL REFERENCES habilidad(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 rol VARCHAR(100) DEFAULT NULL, PRIMARY KEY (proyecto_id, habilidad_id)
);
CREATE TABLE imagen_proyecto (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 proyecto_id INTEGER NOT NULL REFERENCES proyecto(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 ruta VARCHAR(255) NOT NULL,
 descripcion VARCHAR(200) DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0
);
CREATE TABLE estadistica (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 propietario_id INTEGER NOT NULL REFERENCES propietario(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 etiqueta VARCHAR(80) NOT NULL,
 valor VARCHAR(20) NOT NULL,
 sufijo VARCHAR(10) DEFAULT NULL,
 icono_svg TEXT DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0,
 activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE tema_color (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 nombre VARCHAR(50) NOT NULL,
 slug VARCHAR(50) NOT NULL UNIQUE,
 color_acento_1 VARCHAR(7) NOT NULL,
 color_acento_2 VARCHAR(7) NOT NULL,
 color_acento_3 VARCHAR(7) NOT NULL,
 grad_inicio VARCHAR(7) NOT NULL,
 grad_fin VARCHAR(7) NOT NULL,
 es_default BOOLEAN NOT NULL DEFAULT FALSE,
 orden SMALLINT NOT NULL DEFAULT 0
);
CREATE TABLE seccion_navegacion (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 nombre VARCHAR(60) NOT NULL,
 slug VARCHAR(60) NOT NULL UNIQUE,
 id_html VARCHAR(80) NOT NULL,
 icono_svg TEXT DEFAULT NULL,
 orden SMALLINT NOT NULL DEFAULT 0,
 activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE mensaje_contacto (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 propietario_id INTEGER NOT NULL REFERENCES propietario(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 nombre_remitente VARCHAR(120) NOT NULL,
 correo_remitente VARCHAR(200) NOT NULL,
 asunto VARCHAR(255) DEFAULT NULL,
 mensaje TEXT NOT NULL,
 ip_origen VARCHAR(45) DEFAULT NULL,
 leido BOOLEAN NOT NULL DEFAULT FALSE,
 archivado BOOLEAN NOT NULL DEFAULT FALSE,
 fecha_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
 fecha_lectura TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
CREATE TABLE visita (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 propietario_id INTEGER NOT NULL REFERENCES propietario(id) ON
UPDATE CASCADE ON
DELETE CASCADE,
 ip_visitante VARCHAR(45) DEFAULT NULL,
 agente_usuario VARCHAR(512) DEFAULT NULL,
 referencia VARCHAR(512) DEFAULT NULL,
 seccion_vista VARCHAR(80) DEFAULT NULL,
 duracion_seg SMALLINT DEFAULT NULL,
 fecha_visita TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================
--  3) Índices
-- ============================
CREATE INDEX idx_formacion_propietario ON formacion_academica (propietario_id);
CREATE INDEX idx_experiencia_propietario ON experiencia_laboral (propietario_id);
CREATE INDEX idx_experiencia_empresa ON experiencia_laboral (empresa_id);
CREATE INDEX idx_habilidad_categoria ON habilidad (categoria_id);
CREATE INDEX idx_proyecto_propietario ON proyecto (propietario_id);
CREATE INDEX idx_proyecto_categoria ON proyecto (categoria_id);
CREATE INDEX idx_proyecto_estado ON proyecto (estado);
CREATE INDEX idx_proyecto_destacado ON proyecto (destacado);
CREATE INDEX idx_mensaje_leido ON mensaje_contacto (leido);
CREATE INDEX idx_visita_fecha ON visita (fecha_visita);
CREATE INDEX idx_contacto_tipo ON contacto (tipo);

-- ============================
--  4) Triggers para fecha_actualizacion
-- ============================
CREATE OR
REPLACE FUNCTION fn_update_timestamp() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
 NEW.fecha_actualizacion := CURRENT_TIMESTAMP; RETURN NEW; END;
$$;
CREATE TRIGGER trg_propietario_update_ts BEFORE
UPDATE ON propietario FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_proyecto_update_ts BEFORE
UPDATE ON proyecto FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ============================
--  5) Vistas (edad calculada dinámicamente)
-- ============================
CREATE OR
REPLACE VIEW vista_perfil_completo AS
SELECT
 p.id,
 concat_ws(' ', p.nombres, p.apellidos) AS nombre_completo,
 p.iniciales, CASE WHEN p.fecha_nacimiento IS NOT NULL THEN DATE_PART('year', AGE(CURRENT_DATE, p.fecha_nacimiento))::INT ELSE NULL END AS edad,
 concat_ws(', ', p.ciudad, p.pais) AS ubicacion,
 p.perfil_profesional,
 p.foto_ruta,
 p.cv_ruta,
 p.tema_color,
 p.tema_oscuro,
 string_agg(CASE WHEN c.tipo = 'telefono' AND c.activo THEN 'Tel: ' || c.valor ELSE NULL END, ' | ') FILTER (
WHERE c.tipo = 'telefono' AND c.activo) AS telefonos,
 string_agg(CASE WHEN c.tipo = 'correo' AND c.activo THEN c.valor ELSE NULL END, ' | ') FILTER (
WHERE c.tipo = 'correo' AND c.activo) AS correos
FROM propietario p
LEFT JOIN contacto c ON c.propietario_id = p.id
GROUP BY p.id, p.nombres, p.apellidos, p.iniciales, p.fecha_nacimiento, p.ciudad, p.pais, p.perfil_profesional, p.foto_ruta, p.cv_ruta, p.tema_color, p.tema_oscuro;
CREATE OR
REPLACE VIEW vista_habilidades_completa AS
SELECT
 h.id,
 ch.nombre AS categoria,
 ch.slug AS categoria_slug,
 h.nombre AS habilidad,
 h.slug,
 h.nivel_porcentaje,
 h.nivel_texto,
 h.color_primario,
 h.descripcion,
 h.orden
FROM habilidad h
JOIN categoria_habilidad ch ON ch.id = h.categoria_id
WHERE h.activo = TRUE
ORDER BY ch.orden, h.orden;
CREATE OR
REPLACE VIEW vista_experiencia_detalle AS
SELECT
 el.id,
 el.cargo,
 el.tipo_contrato,
 el.fecha_inicio,
 el.fecha_fin,
 el.trabajo_actual,
 e.nombre AS empresa,
 e.tipo AS tipo_empresa,
 e.sector,
 e.ciudad,
 el.descripcion_general,
 string_agg(te.descripcion, ' | '
ORDER BY te.orden) FILTER (
WHERE te.id IS NOT NULL) AS tareas
FROM experiencia_laboral el
JOIN empresa e ON e.id = el.empresa_id
LEFT JOIN tarea_experiencia te ON te.experiencia_id = el.id
WHERE el.propietario_id = 1
GROUP BY el.id, el.cargo, el.tipo_contrato, el.fecha_inicio, el.fecha_fin, el.trabajo_actual, e.nombre, e.tipo, e.sector, e.ciudad, el.descripcion_general
ORDER BY el.fecha_inicio DESC;
CREATE OR
REPLACE VIEW vista_formacion_detalle AS
SELECT
 fa.id,
 fa.titulo,
 fa.mencion,
 fa.facultad,
 fa.nivel,
 fa.anio_inicio,
 fa.anio_fin,
 fa.estado,
 fa.descripcion,
 ie.nombre AS institucion,
 ie.siglas,
 ie.tipo AS tipo_institucion,
 ie.ciudad
FROM formacion_academica fa
JOIN institucion_educativa ie ON ie.id = fa.institucion_id
WHERE fa.propietario_id = 1
ORDER BY fa.anio_fin DESC NULLS LAST;
CREATE OR
REPLACE VIEW vista_proyectos_tecnologias AS
SELECT
 pr.id,
 pr.nombre AS proyecto,
 pr.slug,
 pr.descripcion_corta,
 pr.estado,
 pr.destacado,
 pr.publicado,
 cp.nombre AS categoria,
 cp.slug AS categoria_slug,
 pr.url_demo,
 pr.url_repositorio,
 string_agg(h.nombre, ', '
ORDER BY h.nombre) FILTER (
WHERE h.id IS NOT NULL) AS tecnologias
FROM proyecto pr
JOIN categoria_proyecto cp ON cp.id = pr.categoria_id
LEFT JOIN proyecto_tecnologia pt ON pt.proyecto_id = pr.id
LEFT JOIN habilidad h ON h.id = pt.habilidad_id
WHERE pr.propietario_id = 1
GROUP BY pr.id, pr.nombre, pr.slug, pr.descripcion_corta, pr.estado, pr.destacado, pr.publicado, cp.nombre, cp.slug, pr.url_demo, pr.url_repositorio
ORDER BY pr.destacado DESC, pr.orden;

-- ============================
--  6) Funciones / Procedimientos (PL/pgSQL)
-- ============================
CREATE OR
REPLACE FUNCTION sp_habilidades_por_categoria(p_slug_categoria VARCHAR) RETURNS TABLE (
 nombre VARCHAR,
 nivel_porcentaje SMALLINT,
 nivel_texto habilidad_nivel_texto,
 color_primario VARCHAR,
 descripcion VARCHAR
) LANGUAGE SQL AS $$
SELECT h.nombre, h.nivel_porcentaje, h.nivel_texto, h.color_primario, h.descripcion
FROM habilidad h
JOIN categoria_habilidad ch ON ch.id = h.categoria_id
WHERE ch.slug = p_slug_categoria AND h.activo = TRUE
ORDER BY h.orden;
$$;
CREATE OR
REPLACE FUNCTION sp_registrar_mensaje(
 p_nombre VARCHAR,
 p_correo VARCHAR,
 p_asunto VARCHAR,
 p_mensaje TEXT,
 p_ip VARCHAR
) RETURNS TABLE (id_mensaje INTEGER, resultado TEXT) LANGUAGE plpgsql AS $$ DECLARE
 v_id INTEGER; BEGIN
INSERT INTO mensaje_contacto
 (propietario_id, nombre_remitente, correo_remitente, asunto, mensaje, ip_origen) VALUES
 (1, p_nombre, p_correo, p_asunto, p_mensaje, p_ip)
 RETURNING id INTO v_id; RETURN QUERY
SELECT v_id, 'Mensaje registrado con éxito'; END;
$$;
CREATE OR
REPLACE FUNCTION sp_leer_mensaje(p_id_mensaje INTEGER) RETURNS VOID LANGUAGE SQL AS $$
UPDATE mensaje_contacto SET leido = TRUE,
 fecha_lectura = CURRENT_TIMESTAMP
WHERE id = p_id_mensaje;
$$;
CREATE OR
REPLACE FUNCTION sp_registrar_visita(
 p_ip VARCHAR,
 p_agente VARCHAR,
 p_referencia VARCHAR,
 p_seccion VARCHAR
) RETURNS VOID LANGUAGE SQL AS $$
INSERT INTO visita (propietario_id, ip_visitante, agente_usuario, referencia, seccion_vista) VALUES (1, p_ip, p_agente, p_referencia, p_seccion);
$$;
CREATE OR
REPLACE FUNCTION sp_resumen_portafolio() RETURNS TABLE (
 total_visitas BIGINT,
 total_mensajes BIGINT,
 mensajes_sin_leer BIGINT,
 proyectos_publicados BIGINT,
 total_habilidades BIGINT
) LANGUAGE SQL AS $$
SELECT
 (
SELECT COUNT(*)
FROM visita
WHERE propietario_id = 1) AS total_visitas,
 (
SELECT COUNT(*)
FROM mensaje_contacto
WHERE propietario_id = 1) AS total_mensajes,
 (
SELECT COUNT(*)
FROM mensaje_contacto
WHERE propietario_id = 1 AND leido = FALSE) AS mensajes_sin_leer,
 (
SELECT COUNT(*)
FROM proyecto
WHERE propietario_id = 1 AND publicado = TRUE) AS proyectos_publicados,
 (
SELECT COUNT(*)
FROM habilidad
WHERE activo = TRUE) AS total_habilidades;
$$;

-- ============================
--  7) Datos de ejemplo (Inserciones)
-- ============================
-- PROPIETARIO
INSERT INTO propietario (
 nombres, apellidos, iniciales,
 fecha_nacimiento,
 ciudad, departamento, pais,
 perfil_profesional,
 foto_ruta, cv_ruta,
 tema_color, tema_oscuro
) VALUES (
 'Neil Eyner',
 'Canaviri Huanca',
 'NE',
 '1998-04-18',
 'La Paz', 'La Paz', 'Bolivia',
 'Informático con mención en Ingeniería de Sistemas Informáticos, egresado de la Universidad Mayor de San Andrés (UMSA), con sólida formación técnica y experiencia práctica demostrable en entornos reales. He trabajado en desarrollo web, gestión de contenido digital, administración de redes y soporte técnico. Me caracterizo por entregar soluciones eficientes y de calidad, siempre con enfoque en buenas prácticas de desarrollo. Mi objetivo es especializarme en front-end moderno y contribuir con impacto real en equipos de alto rendimiento.', NULL, NULL,
 'violeta', TRUE
);

-- CONTACTOS
INSERT INTO contacto (propietario_id, tipo, etiqueta, valor, url, es_principal, orden, activo) VALUES
(1, 'telefono', 'Teléfono', '74096880', 'tel:+59174096880', TRUE, 1, TRUE),
(1, 'whatsapp', 'WhatsApp', '+59174096880', 'https://wa.me/59174096880', TRUE, 2, TRUE),
(1, 'correo', 'Gmail', 'neileynerc@gmail.com', 'mailto:neileynerc@gmail.com', TRUE, 3, TRUE),
(1, 'github', 'GitHub', 'NeilEyner', 'https://github.com/NeilEyner', TRUE, 4, TRUE),
(1, 'linkedin', 'LinkedIn', 'NeilEyner', 'https://linkedin.com/in/neileyner', FALSE, 5, TRUE);

-- INSTITUCIONES
INSERT INTO institucion_educativa (nombre, siglas, tipo, ciudad, pais, sitio_web) VALUES
('Universidad Mayor de San Andrés', 'UMSA', 'universidad', 'La Paz', 'Bolivia', 'https://www.umsa.bo'),
('Centro de Educación Alternativa Pablo Zárate Willka II', 'CEA PZW II', 'centro_alternativo', 'La Paz', 'Bolivia', NULL),
('Centro de Educación Alternativa Holanda Noche', 'CEA Holanda', 'centro_alternativo', 'La Paz', 'Bolivia', NULL);

-- FORMACIÓN ACADÉMICA
INSERT INTO formacion_academica
(propietario_id, institucion_id, titulo, mencion, facultad, nivel, anio_inicio, anio_fin, estado, descripcion, orden) VALUES
(1, 1, 'Informático', 'Ingeniería de Sistemas Informáticos', 'Facultad de Ciencias Puras y Naturales', 'egresado', 2020, 2026, 'egresado',
 'Carrera enfocada en el análisis, diseño y desarrollo de sistemas informáticos. Formación en programación, bases de datos, redes, ingeniería de software y gestión de proyectos tecnológicos.', 1),
(1, 2, 'Técnico Auxiliar en Sistemas Informáticos', NULL, NULL, 'tecnico_auxiliar', 2022, 2022, 'titulado',
 'Capacitación técnica en mantenimiento de equipos, instalación de software y soporte básico de sistemas informáticos.', 2),
(1, 3, 'Técnico Básico en Electrónica', NULL, NULL, 'tecnico_basico', 2019, 2019, 'titulado',
 'Formación en fundamentos de electrónica analógica y digital, lectura de circuitos y mantenimiento básico de componentes electrónicos.', 3);

-- EMPRESAS
INSERT INTO empresa (nombre, tipo, sector, ciudad, pais, sitio_web) VALUES
('Red Nacional de Televisión F10', 'television', 'Medios de comunicación', 'La Paz', 'Bolivia', NULL),
('Posgrado UPEA', 'universidad', 'Educación superior', 'La Paz', 'Bolivia', 'https://www.upea.edu.bo');

-- EXPERIENCIA LABORAL
INSERT INTO experiencia_laboral (propietario_id, empresa_id, cargo, tipo_contrato, fecha_inicio, fecha_fin, trabajo_actual, descripcion_general, orden) VALUES
(1, 1, 'Pasante de Redes Sociales', 'pasantia', '2024-08-28', '2024-11-28', FALSE,
 'Gestión integral de redes sociales y contenido digital para canal de televisión de cobertura nacional. Trabajo con plataformas como YouTube y WordPress para publicación y distribución de contenido informativo diario.', 1),
(1, 2, 'Pasante de Sistemas', 'pasantia', '2023-01-20', '2024-02-02', FALSE,
 'Soporte técnico integral y gestión de contenido digital para la unidad de posgrado. Trabajo en mantenimiento preventivo/correctivo de equipos y administración de infraestructura de red.', 2);

-- TAREAS POR EXPERIENCIA
INSERT INTO tarea_experiencia (experiencia_id, descripcion, orden) VALUES
(1, 'Monitoreo y gestión de interacciones en redes sociales con seguimiento de métricas de crecimiento y alcance.', 1),
(1, 'Administración del canal de YouTube: subida de videos, optimización SEO de títulos, descripciones y etiquetas.', 2),
(1, 'Publicación diaria de noticias en el sitio web institucional utilizando WordPress como gestor de contenidos.', 3),
(2, 'Diseño y producción de contenido creativo gráfico para las redes sociales institucionales del posgrado.', 1),
(2, 'Mantenimiento correctivo y preventivo de computadoras de escritorio, laptops y periféricos.', 2),
(2, 'Configuración, tendido y documentación de cableado de red estructurado Cat 5e/Cat 6.', 3);

-- CATEGORÍAS DE HABILIDADES
INSERT INTO categoria_habilidad (nombre, slug, orden) VALUES
('Desarrollo Web', 'desarrollo', 1),
('Diseño', 'diseno', 2),
('CMS', 'cms', 3),
('Sistemas', 'sistemas', 4),
('Marketing', 'marketing', 5);

-- HABILIDADES (varios)
INSERT INTO habilidad (categoria_id, nombre, slug, nivel_porcentaje, nivel_texto, color_primario, descripcion, orden) VALUES
(1, 'HTML5', 'html5', 90, 'avanzado', '#e34f26', 'Lenguaje de marcado para la estructura de páginas web. Uso de etiquetas semánticas, accesibilidad y SEO básico.', 1),
(1, 'CSS3', 'css3', 85, 'avanzado', '#1572b6', 'Estilos visuales, animaciones, flexbox, grid, variables CSS y diseño responsivo con enfoque mobile-first.', 2),
(1, 'JavaScript', 'javascript', 72, 'intermedio', '#f7df1e', 'Programación del lado del cliente: manipulación del DOM, eventos, fetch API, localStorage y lógica de aplicaciones web.', 3),
(1, 'Git', 'git', 68, 'intermedio', '#f05032', 'Control de versiones con Git: commits, branches, merge, pull requests y flujo de trabajo colaborativo.', 4),
(1, 'Python', 'python', 55, 'intermedio', '#3776ab', 'Programación básica/intermedia: scripts de automatización, manejo de archivos y fundamentos de POO.', 5),
(1, 'SQL', 'sql', 60, 'intermedio', '#336791', 'Consultas SELECT, INSERT, UPDATE, DELETE. Joins, subconsultas, índices y diseño básico de bases de datos relacionales.', 6),
(2, 'Photoshop', 'photoshop', 70, 'intermedio', '#31a8ff', 'Edición y retoque fotográfico, composición de imágenes, diseño de banners y material gráfico para redes sociales.', 1),
(2, 'Figma', 'figma', 58, 'intermedio', '#f24e1e', 'Diseño de interfaces UI/UX: wireframes, prototipos interactivos y sistemas de diseño básicos.', 2),
(2, 'Canva', 'canva', 82, 'avanzado', '#7d2ae8', 'Diseño gráfico para redes sociales, presentaciones, infografías y material de marketing digital.', 3),
(2, 'UI / UX', 'ui-ux', 62, 'intermedio', '#f472b6', 'Principios de diseño centrado en el usuario, jerarquía visual, accesibilidad y experiencia de usuario.', 4),
(3, 'WordPress', 'wordpress', 80, 'avanzado', '#21759b', 'Instalación, configuración, personalización de temas, plugins, publicación de contenido y mantenimiento de sitios web.', 1),
(3, 'YouTube', 'youtube', 75, 'intermedio', '#ff0000', 'Gestión de canal: subida de videos, optimización SEO, configuración de playlists y análisis de métricas básicas.', 2),
(3, 'Elementor', 'elementor', 65, 'intermedio', '#92003b', 'Constructor visual para WordPress: maquetación de páginas con bloques, diseño responsivo y widgets personalizados.', 3),
(4, 'Redes LAN', 'redes-lan', 75, 'intermedio', '#38bdf8', 'Diseño, tendido y configuración de redes de área local. Cableado estructurado Cat 5e/6, configuración de switches y routers básicos.', 1),
(4, 'Windows', 'windows', 65, 'intermedio', '#00adef', 'Administración de sistemas Windows: instalación, configuración, gestión de usuarios, Active Directory básico y resolución de problemas.', 2),
(4, 'Linux', 'linux', 55, 'intermedio', '#f59e0b', 'Uso básico/intermedio de distribuciones Linux: comandos de terminal, gestión de archivos, permisos y scripts bash elementales.', 3),
(4, 'Soporte TI', 'soporte-ti', 85, 'avanzado', '#34d399', 'Diagnóstico y reparación de hardware y software. Mantenimiento preventivo y correctivo de equipos de cómputo.', 4),
(5, 'Instagram', 'instagram', 85, 'avanzado', '#e1306c', 'Gestión de perfil institucional: publicaciones, Stories, Reels, interacción con la audiencia y crecimiento orgánico.', 1),
(5, 'Facebook', 'facebook', 78, 'intermedio', '#1877f2', 'Administración de páginas de empresa, programación de publicaciones y respuesta a comentarios e interacciones.', 2),
(5, 'Gestión de RRSS', 'gestion-rrss', 82, 'avanzado', '#7c6fef', 'Planificación de contenido, calendario editorial, monitoreo de métricas y estrategia de comunicación digital.', 3),
(5, 'SEO Básico', 'seo-basico', 60, 'intermedio', '#f97316', 'Optimización de palabras clave, metaetiquetas, estructura de URLs, velocidad de carga y posicionamiento orgánico básico.', 4);

-- CATEGORÍAS DE PROYECTOS
INSERT INTO categoria_proyecto (nombre, slug, descripcion, orden) VALUES
('Todos', 'todos', 'Todos los proyectos del portafolio', 0),
('Web', 'web', 'Sitios web, landing pages y aplicaciones web', 1),
('App', 'app', 'Aplicaciones móviles y de escritorio', 2),
('Juegos', 'juegos', 'Videojuegos y experiencias interactivas', 3),
('Otros', 'otros', 'Otros proyectos: scripts, automatizaciones, diseño gráfico', 4);

-- PROYECTOS (placeholders)
INSERT INTO proyecto (propietario_id, categoria_id, nombre, slug, descripcion_corta, estado, destacado, publicado, orden) VALUES
(1, 2, 'Proyecto Web 01', 'proyecto-web-01', 'Descripción del primer proyecto web.', 'en_desarrollo', FALSE, FALSE, 1),
(1, 2, 'Proyecto Web 02', 'proyecto-web-02', 'Descripción del segundo proyecto web.', 'en_desarrollo', FALSE, FALSE, 2),
(1, 3, 'Proyecto App 01', 'proyecto-app-01', 'Descripción del primer proyecto app.', 'en_desarrollo', FALSE, FALSE, 3),
(1, 4, 'Proyecto Juego 01', 'proyecto-juego-01', 'Descripción del primer videojuego.', 'en_desarrollo', FALSE, FALSE, 4),
(1, 5, 'Proyecto Otro 01', 'proyecto-otro-01', 'Descripción de otro tipo de proyecto.', 'en_desarrollo', FALSE, FALSE, 5),
(1, 3, 'Proyecto App 02', 'proyecto-app-02', 'Descripción del segundo proyecto app.', 'en_desarrollo', FALSE, FALSE, 6);

-- ESTADÍSTICAS
INSERT INTO estadistica (propietario_id, etiqueta, valor, sufijo, orden, activo) VALUES
(1, 'AÑOS EXP.', '3', '+', 1, TRUE),
(1, 'PASANTÍAS', '2', '', 2, TRUE),
(1, 'TECNOLOGÍAS', '8', '+', 3, TRUE);

-- TEMAS DE COLOR
INSERT INTO tema_color (nombre, slug, color_acento_1, color_acento_2, color_acento_3, grad_inicio, grad_fin, es_default, orden) VALUES
('Violeta', 'violeta', '#7c6fef', '#f472b6', '#38bdf8', '#7c6fef', '#f472b6', TRUE, 1),
('Cielo', 'cielo', '#0ea5e9', '#6366f1', '#22d3ee', '#0ea5e9', '#6366f1', FALSE, 2),
('Esmeralda', 'esmeralda', '#10b981', '#0ea5e9', '#34d399', '#10b981', '#0ea5e9', FALSE, 3),
('Amanecer', 'amanecer', '#f97316', '#ef4444', '#fbbf24', '#f97316', '#ef4444', FALSE, 4),
('Rosa', 'rosa', '#ec4899', '#a855f7', '#f472b6', '#ec4899', '#a855f7', FALSE, 5);

-- SECCIONES DE NAVEGACIÓN
INSERT INTO seccion_navegacion (nombre, slug, id_html, orden, activo) VALUES
('Inicio', 'inicio', 'pagina-inicio', 1, TRUE),
('Exp.', 'formacion', 'pagina-formacion', 2, TRUE),
('Skills', 'habilidades', 'pagina-habilidades', 3, TRUE),
('Proyectos', 'proyectos', 'pagina-proyectos', 4, TRUE),
('Contacto', 'contacto', 'pagina-contacto', 5, TRUE);

-- ============================
--  8) Consultas de verificación (opcional)
-- ============================
-- Para comprobar que todo se creó bien, puedes ejecutar estas SELECTs manualmente:
-- SELECT * FROM vista_perfil_completo;
-- SELECT * FROM vista_proyectos_tecnologias LIMIT 10;
-- SELECT * FROM vista_habilidades_completa LIMIT 20;

-- Fin del script