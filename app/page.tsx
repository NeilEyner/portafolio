// app/page.tsx  ← SERVER COMPONENT (sin "use client")
// Carga todos los datos desde PostgreSQL y los pasa al PortafolioCliente.

import {
  obtenerPropietario,
  obtenerContactos,
  obtenerFormacion,
  obtenerExperiencia,
  obtenerHabilidades,
  obtenerCategoriasHabilidades,
  obtenerProyectos,
  obtenerCategoriasProyectos,
  obtenerEstadisticas,
  type DatosPortafolio,
} from "@/lib/queries";

import PortafolioCliente from "./PortafolioCliente";

// Revalidar la página completa cada 60 segundos (ISR)
// Cámbialo a 0 para SSR puro, o a false para estático
export const revalidate = 60;

export default async function PaginaPortafolio() {

  // ── Cargar todos los datos en paralelo ────────────────
  const [
    datosPropietario,
    datosContactos,
    datosFormacion,
    datosExperiencia,
    datosHabilidades,
    datosCategoriasHab,
    datosProyectos,
    datosCatProy,
    datosEstadisticas,
  ] = await Promise.all([
    obtenerPropietario(),
    obtenerContactos(),
    obtenerFormacion(),
    obtenerExperiencia(),
    obtenerHabilidades(),
    obtenerCategoriasHabilidades(),
    obtenerProyectos(),
    obtenerCategoriasProyectos(),
    obtenerEstadisticas(),
  ]);

  // ── Redirigir si no hay propietario configurado ───────
  if (!datosPropietario) {
    return (
      <main style={{ textAlign:"center", padding:"4rem", fontFamily:"monospace" }}>
        <h1>Portafolio no configurado</h1>
        <p>Ejecuta el script SQL para insertar los datos iniciales.</p>
        <code>psql -d tu_db -f portafolio_neil.sql</code>
      </main>
    );
  }

  const datos: DatosPortafolio = {
    propietario:           datosPropietario,
    contactos:             datosContactos,
    formacion:             datosFormacion,
    experiencia:           datosExperiencia,
    habilidades:           datosHabilidades,
    categoriasHabilidades: datosCategoriasHab,
    proyectos:             datosProyectos,
    categoriasProyectos:   datosCatProy,
    estadisticas:          datosEstadisticas,
  };

  return <PortafolioCliente datos={datos} />;
}