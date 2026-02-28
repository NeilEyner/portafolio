"use client";

import { useState, useTransition, useRef } from 'react';
import { useRouter } from "next/navigation";
import {
  actualizarPerfil,
  crearContacto,
  actualizarContacto,
  eliminarContacto,
  crearHabilidad,
  actualizarHabilidad,
  eliminarHabilidad,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  crearFormacion,
  actualizarFormacion,
  eliminarFormacion,
  crearExperiencia,
  actualizarExperiencia,
  eliminarExperiencia,
  marcarMensajeLeido,
  eliminarMensaje,
  actualizarEstadistica,
} from "@/lib/actions-admin";
import { subirIconoHabilidad, subirImagenProyecto } from "@/lib/actions";

// ─────────────────────────────────────────────────────────
// TIPO DE SECCIÓN ACTIVA EN EL MENÚ
// ─────────────────────────────────────────────────────────
type SeccionAdmin =
  | "resumen"
  | "perfil"
  | "contactos"
  | "habilidades"
  | "proyectos"
  | "formacion"
  | "experiencia"
  | "mensajes"
  | "estadisticas";

// ─────────────────────────────────────────────────────────
// TIPOS DE NOTIFICACIÓN
// ─────────────────────────────────────────────────────────
type TipoNotif = "exito" | "error";

interface Notificacion {
  tipo: TipoNotif;
  mensaje: string;
}

// ─────────────────────────────────────────────────────────
// PROPS — datos del servidor
// ─────────────────────────────────────────────────────────
interface PropsDashboard {
  datos: Awaited<
    ReturnType<typeof import("@/lib/actions-admin").obtenerDatosDashboard>
  >;
}

// ─────────────────────────────────────────────────────────
// ÍCONOS SVG INLINE
// ─────────────────────────────────────────────────────────
const Ico = {
  cerrar: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  editar: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  borrar: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  agregar: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  check: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#34d399"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  salir: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ojo: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────
// COMPONENTE MODAL REUTILIZABLE
// ─────────────────────────────────────────────────────────
function Modal({
  titulo,
  onCerrar,
  children,
}: {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={estilosModal.fondo} onClick={onCerrar}>
      <div style={estilosModal.caja} onClick={(e) => e.stopPropagation()}>
        <div style={estilosModal.encabezado}>
          <h3
            className="texto-degradado"
            style={{ fontSize: "1.1rem", fontWeight: 800 }}
          >
            {titulo}
          </h3>
          <button
            onClick={onCerrar}
            className="boton-icono"
            style={{ width: 36, height: 36 }}
          >
            <Ico.cerrar />
          </button>
        </div>
        <div style={estilosModal.cuerpo}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL DEL DASHBOARD
// ─────────────────────────────────────────────────────────
export default function DashboardCliente({ datos }: PropsDashboard) {
  const router = useRouter();
  const [seccion, setSeccion] = useState<SeccionAdmin>("resumen");
  const [notif, setNotif] = useState<Notificacion | null>(null);
  const [pending, startTransition] = useTransition();

  // Estado local de datos (para reflejar cambios sin recargar)
  const [contactos, setContactos] = useState(datos.contactos);
  const [habilidades, setHabilidades] = useState(datos.habilidades);
  const [proyectos, setProyectos] = useState(datos.proyectos);
  const [formacion, setFormacion] = useState(datos.formacion);
  const [experiencias, setExperiencias] = useState(datos.experiencias);
  const [mensajes, setMensajes] = useState(datos.mensajes);
  const [estadisticas, setEstadisticas] = useState(datos.estadisticas);
  const [perfil, setPerfil] = useState(datos.propietario);

  // Modales
  const [modalContacto, setModalContacto] = useState<any>(null);
  const [modalHabilidad, setModalHabilidad] = useState<any>(null);
  const [modalProyecto, setModalProyecto] = useState<any>(null);
  const [modalFormacion, setModalFormacion] = useState<any>(null);
  const [modalExperiencia, setModalExperiencia] = useState<any>(null);
  const [confirmarBorrar, setConfirmarBorrar] = useState<{
    fn: () => void;
    label: string;
  } | null>(null);

  // ── Helper: mostrar notificación ──────────────────────
  function notificar(tipo: TipoNotif, mensaje: string) {
    setNotif({ tipo, mensaje });
    setTimeout(() => setNotif(null), 3500);
  }

  // ── Cerrar sesión ─────────────────────────────────────
  async function cerrarSesion() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // ── Recargar datos después de mutación ───────────────
  function recargar() {
    router.refresh();
  }

  // ═══════════════════════════════════════════════════════
  // HANDLERS — PERFIL
  // ═══════════════════════════════════════════════════════
  async function guardarPerfil(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await actualizarPerfil({
        nombres: fd.get("nombres") as string,
        apellidos: fd.get("apellidos") as string,
        iniciales: fd.get("iniciales") as string,
        perfilProfesional: fd.get("perfilProfesional") as string,
        ciudad: fd.get("ciudad") as string,
        departamento: fd.get("departamento") as string,
        pais: fd.get("pais") as string,
        temaColor: fd.get("temaColor") as any,
        temaOscuro: fd.get("temaOscuro") === "true",
      });
      if (res.ok) {
        notificar("exito", "Perfil actualizado con éxito.");
        recargar();
      } else notificar("error", res.error!);
    });
  }

  // ═══════════════════════════════════════════════════════
  // HANDLERS — CONTACTOS
  // ═══════════════════════════════════════════════════════
  async function guardarContacto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const datos = {
      tipo: fd.get("tipo") as string,
      etiqueta: fd.get("etiqueta") as string,
      valor: fd.get("valor") as string,
      url: (fd.get("url") as string) || null,
      esPrincipal: fd.get("esPrincipal") === "true",
      orden: Number(fd.get("orden")) || 0,
    };
    startTransition(async () => {
      const res = modalContacto?.id
        ? await actualizarContacto(modalContacto.id, { ...datos, activo: true })
        : await crearContacto(datos);
      if (res.ok) {
        notificar("exito", "Contacto guardado.");
        setModalContacto(null);
        recargar();
      } else notificar("error", res.error!);
    });
  }

  async function borrarContacto(id: number) {
    setConfirmarBorrar({
      label: "este contacto",
      fn: async () => {
        const res = await eliminarContacto(id);
        if (res.ok) {
          notificar("exito", "Contacto eliminado.");
          recargar();
        } else notificar("error", res.error!);
        setConfirmarBorrar(null);
      },
    });
  }

  // ═══════════════════════════════════════════════════════
  // HANDLERS — HABILIDADES
  // ═══════════════════════════════════════════════════════
  async function guardarHabilidad(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nivel = Number(fd.get("nivelPorcentaje"));
    let nivelTexto = "basico";
    if (nivel >= 85) nivelTexto = "experto";
    else if (nivel >= 70) nivelTexto = "avanzado";
    else if (nivel >= 45) nivelTexto = "intermedio";

    startTransition(async () => {
      const res = modalHabilidad?.id
        ? await actualizarHabilidad(modalHabilidad.id, {
          categoriaId: Number(fd.get("categoriaId")),
          nombre: fd.get("nombre") as string,
          nivelPorcentaje: nivel,
          nivelTexto,
          colorPrimario: (fd.get("colorPrimario") as string) || null,
          descripcion: (fd.get("descripcion") as string) || null,
          activo: true,
          iconoSvg: null
        })
        : await crearHabilidad({
            categoriaId: Number(fd.get("categoriaId")),
            nombre: fd.get("nombre") as string,
            slug: (fd.get("nombre") as string)
              .toLowerCase()
              .replace(/\s+/g, "-"),
            nivelPorcentaje: nivel,
            nivelTexto,
            colorPrimario: (fd.get("colorPrimario") as string) || null,
            iconoSvg: null,
            descripcion: (fd.get("descripcion") as string) || null,
            orden: habilidades.length,
          });
      if (res.ok) {
        notificar("exito", "Habilidad guardada.");
        setModalHabilidad(null);
        recargar();
      } else notificar("error", res.error!);
    });
  }

  async function borrarHabilidad(id: number) {
    setConfirmarBorrar({
      label: "esta habilidad",
      fn: async () => {
        const res = await eliminarHabilidad(id);
        if (res.ok) {
          notificar("exito", "Habilidad eliminada.");
          recargar();
        } else notificar("error", res.error!);
        setConfirmarBorrar(null);
      },
    });
  }

  // ═══════════════════════════════════════════════════════
  // HANDLERS — PROYECTOS
  // ═══════════════════════════════════════════════════════
  async function guardarProyecto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const nombre = fd.get("nombre") as string;
      const res = modalProyecto?.id
        ? await actualizarProyecto(modalProyecto.id, {
            categoriaId: Number(fd.get("categoriaId")),
            nombre,
            descripcionCorta: (fd.get("descripcionCorta") as string) || null,
            descripcionLarga: (fd.get("descripcionLarga") as string) || null,
            urlDemo: (fd.get("urlDemo") as string) || null,
            urlRepositorio: (fd.get("urlRepositorio") as string) || null,
            estado: fd.get("estado") as string,
            destacado: fd.get("destacado") === "true",
            publicado: fd.get("publicado") === "true",
            orden: Number(fd.get("orden")) || 0,
          })
        : await crearProyecto({
            categoriaId: Number(fd.get("categoriaId")),
            nombre,
            slug: nombre
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
            descripcionCorta: (fd.get("descripcionCorta") as string) || null,
            descripcionLarga: (fd.get("descripcionLarga") as string) || null,
            urlDemo: (fd.get("urlDemo") as string) || null,
            urlRepositorio: (fd.get("urlRepositorio") as string) || null,
            estado: fd.get("estado") as string,
            destacado: fd.get("destacado") === "true",
            publicado: fd.get("publicado") === "true",
            orden: proyectos.length,
          });
      if (res.ok) {
        notificar("exito", "Proyecto guardado.");
        setModalProyecto(null);
        recargar();
      } else notificar("error", res.error!);
    });
  }

  async function borrarProyecto(id: number) {
    setConfirmarBorrar({
      label: "este proyecto",
      fn: async () => {
        const res = await eliminarProyecto(id);
        if (res.ok) {
          notificar("exito", "Proyecto eliminado.");
          recargar();
        } else notificar("error", res.error!);
        setConfirmarBorrar(null);
      },
    });
  }

  // ═══════════════════════════════════════════════════════
  // HANDLERS — MENSAJES
  // ═══════════════════════════════════════════════════════
  async function leerMensaje(id: number) {
    await marcarMensajeLeido(id);
    recargar();
  }

  async function borrarMensaje(id: number) {
    setConfirmarBorrar({
      label: "este mensaje",
      fn: async () => {
        const res = await eliminarMensaje(id);
        if (res.ok) {
          notificar("exito", "Mensaje eliminado.");
          recargar();
        } else notificar("error", res.error!);
        setConfirmarBorrar(null);
      },
    });
  }

  // ─────────────────────────────────────────────────────
  // ESTADÍSTICAS DE RESUMEN
  // ─────────────────────────────────────────────────────
  const mensajesSinLeer = mensajes.filter((m) => !m.leido).length;

  const estadSummary = [
    { label: "Habilidades", valor: habilidades.length },
    { label: "Proyectos", valor: proyectos.length },
    { label: "Experiencias", valor: experiencias.length },
    {
      label: "Mensajes",
      valor: mensajes.length,
      alerta: mensajesSinLeer > 0,
      alertaTexto: `${mensajesSinLeer} sin leer`,
    },
  ];

  // ─────────────────────────────────────────────────────
  // MENÚ DE NAVEGACIÓN LATERAL
  // ─────────────────────────────────────────────────────
  const menuItems: { id: SeccionAdmin; label: string }[] = [
    { id: "resumen", label: "📊 Resumen" },
    { id: "perfil", label: "👤 Perfil" },
    { id: "contactos", label: "📞 Contactos" },
    { id: "habilidades", label: "⚡ Habilidades" },
    { id: "proyectos", label: "📁 Proyectos" },
    { id: "formacion", label: "🎓 Formación" },
    { id: "experiencia", label: "💼 Experiencia" },
    {
      id: "mensajes",
      label: `✉️ Mensajes${mensajesSinLeer > 0 ? ` (${mensajesSinLeer})` : ""}`,
    },
    { id: "estadisticas", label: "📈 Estadísticas" },
  ];

  // ═══════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════
  return (
    <div style={estilosD.contenedor}>
      {/* ── BARRA LATERAL ─────────────────────────────── */}
      <aside style={estilosD.sidebar}>
        <div
          className="texto-degradado"
          style={{
            fontSize: "1.1rem",
            fontWeight: 900,
            marginBottom: "var(--espacio-l)",
          }}
        >
          ⚙ Admin Panel
        </div>

        <nav
          style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSeccion(item.id)}
              style={{
                ...estilosD.itemMenu,
                ...(seccion === item.id ? estilosD.itemMenuActivo : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "var(--espacio-m)" }}>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            style={estilosD.enlacePortafolio}
          >
            Ver portafolio →
          </a>
          <button
            onClick={cerrarSesion}
            className="boton-neu"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            <Ico.salir /> Salir
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────── */}
      <main style={estilosD.main}>
        {/* Notificación toast */}
        {notif && (
          <div
            style={{
              ...estilosD.notif,
              background:
                notif.tipo === "exito"
                  ? "rgba(52,211,153,0.15)"
                  : "rgba(239,68,68,0.15)",
              color: notif.tipo === "exito" ? "#34d399" : "#ef4444",
            }}
          >
            {notif.tipo === "exito" ? "✓" : "✗"} {notif.mensaje}
          </div>
        )}

        {/* ── SECCIÓN: RESUMEN ────────────────────────── */}
        {seccion === "resumen" && (
          <div>
            <h2 style={estilosD.tituloSeccion} className="texto-degradado">
              Resumen del Portafolio
            </h2>
            <div style={estilosD.gridStats}>
              {estadSummary.map((s, i) => (
                <div
                  key={i}
                  className="tarjeta"
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{ fontSize: "2.5rem", fontWeight: 900 }}
                    className="texto-degradado"
                  >
                    {s.valor}
                  </div>
                  <div
                    style={{
                      color: "var(--texto-secundario)",
                      fontSize: "0.82rem",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                  {s.alerta && (
                    <div
                      style={{
                        color: "#f59e0b",
                        fontSize: "0.72rem",
                        marginTop: 4,
                      }}
                    >
                      ⚠ {s.alertaTexto}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="tarjeta" style={{ marginTop: "var(--espacio-l)" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "var(--espacio-m)" }}>
                Últimos mensajes
              </h3>
              {mensajes.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--espacio-s) 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    opacity: m.leido ? 0.6 : 1,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      {m.nombreRemitente}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--texto-suave)",
                      }}
                    >
                      {m.correoRemitente}
                    </div>
                  </div>
                  <div
                    style={{ fontSize: "0.7rem", color: "var(--texto-suave)" }}
                  >
                    {new Date(m.fechaEnvio).toLocaleDateString("es-BO")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECCIÓN: PERFIL ─────────────────────────── */}
        {seccion === "perfil" && (
          <div>
            <h2 style={estilosD.tituloSeccion} className="texto-degradado">
              Editar Perfil
            </h2>
            <div className="tarjeta">
              <form onSubmit={guardarPerfil} style={estilosD.formulario}>
                <div style={estilosD.fila2col}>
                  <Campo
                    label="Nombres"
                    name="nombres"
                    defaultValue={perfil.nombres}
                    required
                  />
                  <Campo
                    label="Apellidos"
                    name="apellidos"
                    defaultValue={perfil.apellidos}
                    required
                  />
                </div>
                <div style={estilosD.fila2col}>
                  <Campo
                    label="Iniciales"
                    name="iniciales"
                    defaultValue={perfil.iniciales}
                    required
                  />
                  <Campo
                    label="Ciudad"
                    name="ciudad"
                    defaultValue={perfil.ciudad}
                    required
                  />
                </div>
                <div style={estilosD.fila2col}>
                  <Campo
                    label="Departamento"
                    name="departamento"
                    defaultValue={perfil.departamento ?? ""}
                  />
                  <Campo
                    label="País"
                    name="pais"
                    defaultValue={perfil.pais}
                    required
                  />
                </div>
                <div>
                  <label style={estilosD.etiqueta}>Perfil Profesional</label>
                  <div className="tarjeta-hundida" style={{ padding: 0 }}>
                    <textarea
                      name="perfilProfesional"
                      defaultValue={perfil.perfilProfesional}
                      rows={5}
                      style={{ ...estilosD.input, resize: "vertical" }}
                      required
                    />
                  </div>
                </div>
                <div style={estilosD.fila2col}>
                  <div>
                    <label style={estilosD.etiqueta}>Tema de Color</label>
                    <div className="tarjeta-hundida" style={{ padding: 0 }}>
                      <select
                        name="temaColor"
                        defaultValue={perfil.temaColor}
                        style={estilosD.input}
                      >
                        {[
                          "violeta",
                          "cielo",
                          "esmeralda",
                          "amanecer",
                          "rosa",
                        ].map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={estilosD.etiqueta}>Modo Oscuro</label>
                    <div className="tarjeta-hundida" style={{ padding: 0 }}>
                      <select
                        name="temaOscuro"
                        defaultValue={String(perfil.temaOscuro)}
                        style={estilosD.input}
                      >
                        <option value="true">Activado</option>
                        <option value="false">Desactivado</option>
                      </select>
                    </div>
                  </div>
                </div>
                <BotonGuardar pendiente={pending} />
              </form>
            </div>
          </div>
        )}

        {/* ── SECCIÓN: CONTACTOS ──────────────────────── */}
        {seccion === "contactos" && (
          <div>
            <div style={estilosD.encabezadoSeccion}>
              <h2 className="texto-degradado" style={estilosD.tituloSeccion}>
                Contactos
              </h2>
              <button
                className="boton-neu acento pequeno"
                onClick={() => setModalContacto({})}
              >
                <Ico.agregar /> Nuevo
              </button>
            </div>
            <TablaAdmin
              columnas={["Tipo", "Etiqueta", "Valor", "Acciones"]}
              datos={contactos}
              renderFila={(c) => [
                <span key="t" style={estilosBadge(c.tipo)}>
                  {c.tipo}
                </span>,
                c.etiqueta,
                c.valor,
                <AccionesTabla
                  key="a"
                  onEditar={() => setModalContacto(c)}
                  onBorrar={() => borrarContacto(c.id)}
                />,
              ]}
            />
          </div>
        )}

        {/* ── SECCIÓN: HABILIDADES ────────────────────── */}
        {seccion === "habilidades" && (
          <div>
            <div style={estilosD.encabezadoSeccion}>
              <h2 className="texto-degradado" style={estilosD.tituloSeccion}>
                Habilidades
              </h2>
              <button
                className="boton-neu acento pequeno"
                onClick={() => setModalHabilidad({})}
              >
                <Ico.agregar /> Nueva
              </button>
            </div>
            {datos.categoriasHab.map((cat) => {
              const habsCat = habilidades.filter(
                (h) => h.categoriaId === cat.id,
              );
              if (habsCat.length === 0) return null;
              return (
                <div key={cat.id} style={{ marginBottom: "var(--espacio-l)" }}>
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--texto-secundario)",
                      marginBottom: "var(--espacio-s)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {cat.nombre.toUpperCase()}
                  </h3>
                  <TablaAdmin
                    columnas={[
                      "Nombre",
                      "Nivel",
                      "Color",
                      "Activo",
                      "Acciones",
                    ]}
                    datos={habsCat}
                    renderFila={(h) => [
                      h.nombre,
                      <BarraNivel key="b" nivel={h.nivelPorcentaje} />,
                      <PuntoColor key="c" color={h.colorPrimario} />,
                      h.activo ? "✓" : "✗",
                      <AccionesTabla
                        key="a"
                        onEditar={() => setModalHabilidad(h)}
                        onBorrar={() => borrarHabilidad(h.id)}
                      />,
                    ]}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* ── SECCIÓN: PROYECTOS ──────────────────────── */}
        {seccion === "proyectos" && (
          <div>
            <div style={estilosD.encabezadoSeccion}>
              <h2 className="texto-degradado" style={estilosD.tituloSeccion}>
                Proyectos
              </h2>
              <button
                className="boton-neu acento pequeno"
                onClick={() => setModalProyecto({})}
              >
                <Ico.agregar /> Nuevo
              </button>
            </div>
            <TablaAdmin
              columnas={[
                "Nombre",
                "Categoría",
                "Estado",
                "Publicado",
                "Acciones",
              ]}
              datos={proyectos}
              renderFila={(p) => [
                p.nombre,
                p.categoriaNombre,
                <span key="e" style={estilosBadgeEstado(p.estado)}>
                  {p.estado}
                </span>,
                p.publicado ? "✓ Sí" : "✗ No",
                <AccionesTabla
                  key="a"
                  onEditar={() => setModalProyecto(p)}
                  onBorrar={() => borrarProyecto(p.id)}
                />,
              ]}
            />
          </div>
        )}

        {/* ── SECCIÓN: MENSAJES ───────────────────────── */}
        {seccion === "mensajes" && (
          <div>
            <h2 style={estilosD.tituloSeccion} className="texto-degradado">
              Mensajes de Contacto
              {mensajesSinLeer > 0 && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    marginLeft: 12,
                    color: "#f59e0b",
                  }}
                >
                  {mensajesSinLeer} sin leer
                </span>
              )}
            </h2>
            {mensajes.length === 0 ? (
              <div
                className="tarjeta"
                style={{
                  textAlign: "center",
                  color: "var(--texto-suave)",
                  padding: "var(--espacio-xl)",
                }}
              >
                No hay mensajes aún.
              </div>
            ) : (
              mensajes.map((m) => (
                <div
                  key={m.id}
                  className="tarjeta"
                  style={{
                    marginBottom: "var(--espacio-s)",
                    opacity: m.leido ? 0.65 : 1,
                    borderLeft: m.leido ? "none" : "3px solid var(--acento-1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>
                        {m.nombreRemitente}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--texto-suave)",
                          marginLeft: 8,
                        }}
                      >
                        {m.correoRemitente}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--texto-suave)",
                        }}
                      >
                        {new Date(m.fechaEnvio).toLocaleDateString("es-BO")}
                      </span>
                      {!m.leido && (
                        <button
                          className="boton-neu pequeno"
                          onClick={() => leerMensaje(m.id)}
                          title="Marcar como leído"
                        >
                          <Ico.ojo />
                        </button>
                      )}
                      <button
                        className="boton-neu pequeno"
                        onClick={() => borrarMensaje(m.id)}
                        style={{ color: "#ef4444" }}
                      >
                        <Ico.borrar />
                      </button>
                    </div>
                  </div>
                  {m.asunto && (
                    <div
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      Asunto: {m.asunto}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--texto-secundario)",
                      lineHeight: 1.6,
                    }}
                  >
                    {m.mensaje}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── SECCIÓN: ESTADÍSTICAS ───────────────────── */}
        {seccion === "estadisticas" && (
          <div>
            <h2 style={estilosD.tituloSeccion} className="texto-degradado">
              Estadísticas del Portafolio
            </h2>
            {estadisticas.map((est) => (
              <div
                key={est.id}
                className="tarjeta"
                style={{ marginBottom: "var(--espacio-s)" }}
              >
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const res = await actualizarEstadistica(est.id, {
                      etiqueta: fd.get("etiqueta") as string,
                      valor: fd.get("valor") as string,
                      sufijo: (fd.get("sufijo") as string) || null,
                      activo: fd.get("activo") === "true",
                    });
                    if (res.ok) {
                      notificar("exito", "Estadística actualizada.");
                      recargar();
                    } else notificar("error", res.error!);
                  }}
                >
                  <div style={estilosD.fila2col}>
                    <Campo
                      label="Etiqueta"
                      name="etiqueta"
                      defaultValue={est.etiqueta}
                    />
                    <Campo
                      label="Valor"
                      name="valor"
                      defaultValue={est.valor}
                    />
                  </div>
                  <div
                    style={{
                      ...estilosD.fila2col,
                      marginTop: "var(--espacio-s)",
                    }}
                  >
                    <Campo
                      label="Sufijo (ej: +, %)"
                      name="sufijo"
                      defaultValue={est.sufijo ?? ""}
                    />
                    <div>
                      <label style={estilosD.etiqueta}>Activo</label>
                      <div className="tarjeta-hundida" style={{ padding: 0 }}>
                        <select
                          name="activo"
                          defaultValue={String(est.activo)}
                          style={estilosD.input}
                        >
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="boton-neu acento pequeno"
                    style={{ marginTop: "var(--espacio-s)" }}
                  >
                    Guardar
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* ── SECCIÓN: FORMACIÓN ──────────────────────── */}
        {seccion === "formacion" && (
          <div>
            <div style={estilosD.encabezadoSeccion}>
              <h2 className="texto-degradado" style={estilosD.tituloSeccion}>
                Formación Académica
              </h2>
              <button
                className="boton-neu acento pequeno"
                onClick={() => setModalFormacion({})}
              >
                <Ico.agregar /> Nueva
              </button>
            </div>
            <TablaAdmin
              columnas={[
                "Título",
                "Institución",
                "Nivel",
                "Estado",
                "Acciones",
              ]}
              datos={formacion}
              renderFila={(f) => {
                const inst = datos.instituciones.find(
                  (i) => i.id === f.institucionId,
                );
                return [
                  f.titulo,
                  inst?.nombre ?? "-",
                  f.nivel,
                  f.estado,
                  <AccionesTabla
                    key="a"
                    onEditar={() => setModalFormacion(f)}
                    onBorrar={() =>
                      setConfirmarBorrar({
                        label: "esta formación",
                        fn: async () => {
                          const res = await eliminarFormacion(f.id);
                          if (res.ok) {
                            notificar("exito", "Formación eliminada.");
                            recargar();
                          } else notificar("error", res.error!);
                          setConfirmarBorrar(null);
                        },
                      })
                    }
                  />,
                ];
              }}
            />
          </div>
        )}

        {/* ── SECCIÓN: EXPERIENCIA ────────────────────── */}
        {seccion === "experiencia" && (
          <div>
            <div style={estilosD.encabezadoSeccion}>
              <h2 className="texto-degradado" style={estilosD.tituloSeccion}>
                Experiencia Laboral
              </h2>
              <button
                className="boton-neu acento pequeno"
                onClick={() => setModalExperiencia({})}
              >
                <Ico.agregar /> Nueva
              </button>
            </div>
            <TablaAdmin
              columnas={["Cargo", "Empresa", "Inicio", "Fin", "Acciones"]}
              datos={experiencias}
              renderFila={(exp) => {
                const emp = datos.empresas.find((e) => e.id === exp.empresaId);
                return [
                  exp.cargo,
                  emp?.nombre ?? "-",
                  exp.fechaInicio,
                  exp.fechaFin ?? "Actual",
                  <AccionesTabla
                    key="a"
                    onEditar={() =>
                      setModalExperiencia({
                        ...exp,
                        tareas: datos.tareas.filter(
                          (t) => t.experienciaId === exp.id,
                        ),
                      })
                    }
                    onBorrar={() =>
                      setConfirmarBorrar({
                        label: "esta experiencia",
                        fn: async () => {
                          const res = await eliminarExperiencia(exp.id);
                          if (res.ok) {
                            notificar("exito", "Experiencia eliminada.");
                            recargar();
                          } else notificar("error", res.error!);
                          setConfirmarBorrar(null);
                        },
                      })
                    }
                  />,
                ];
              }}
            />
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════
          MODALES
      ═══════════════════════════════════════════════════ */}

      {/* Modal: Contacto */}
      {modalContacto !== null && (
        <Modal
          titulo={modalContacto.id ? "Editar Contacto" : "Nuevo Contacto"}
          onCerrar={() => setModalContacto(null)}
        >
          <form onSubmit={guardarContacto} style={estilosD.formulario}>
            <div>
              <label style={estilosD.etiqueta}>Tipo</label>
              <div className="tarjeta-hundida" style={{ padding: 0 }}>
                <select
                  name="tipo"
                  defaultValue={modalContacto.tipo ?? "telefono"}
                  style={estilosD.input}
                >
                  {[
                    "telefono",
                    "whatsapp",
                    "correo",
                    "github",
                    "linkedin",
                    "instagram",
                    "facebook",
                    "youtube",
                    "sitio_web",
                    "otro",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Campo
              label="Etiqueta"
              name="etiqueta"
              defaultValue={modalContacto.etiqueta ?? ""}
              required
            />
            <Campo
              label="Valor (número o usuario)"
              name="valor"
              defaultValue={modalContacto.valor ?? ""}
              required
            />
            <Campo
              label="URL completa (opcional)"
              name="url"
              defaultValue={modalContacto.url ?? ""}
            />
            <div style={estilosD.fila2col}>
              <div>
                <label style={estilosD.etiqueta}>Principal</label>
                <div className="tarjeta-hundida" style={{ padding: 0 }}>
                  <select
                    name="esPrincipal"
                    defaultValue={String(modalContacto.esPrincipal ?? false)}
                    style={estilosD.input}
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <Campo
                label="Orden"
                name="orden"
                type="number"
                defaultValue={String(modalContacto.orden ?? 0)}
              />
            </div>
            <BotonGuardar pendiente={pending} />
          </form>
        </Modal>
      )}

      {/* Modal: Habilidad */}
      {modalHabilidad !== null && (
        <Modal
          titulo={modalHabilidad.id ? "Editar Habilidad" : "Nueva Habilidad"}
          onCerrar={() => setModalHabilidad(null)}
        >
          <FormularioHabilidad
            datos={modalHabilidad}
            categorias={datos.categoriasHab}
            pendiente={pending}
            cantidadExistente={habilidades.length}
            onGuardar={async (datosForm) => {
              startTransition(async () => {
                const nivel = datosForm.nivelPorcentaje;
                let nivelTexto = "basico";
                if (nivel >= 85) nivelTexto = "experto";
                else if (nivel >= 70) nivelTexto = "avanzado";
                else if (nivel >= 45) nivelTexto = "intermedio";

                const res = modalHabilidad.id
                  ? await actualizarHabilidad(modalHabilidad.id, {
                      ...datosForm,
                      nivelTexto,
                      activo: true,
                    })
                  : await crearHabilidad({
                      ...datosForm,
                      nivelTexto,
                      slug: datosForm.nombre
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, "-"),
                      orden: habilidades.length,
                    });
                if (res.ok) {
                  notificar("exito", "Habilidad guardada.");
                  setModalHabilidad(null);
                  recargar();
                } else notificar("error", res.error!);
              });
            }}
          />
        </Modal>
      )}

      {/* Modal: Proyecto */}
      {modalProyecto !== null && (
        <Modal
          titulo={modalProyecto.id ? "Editar Proyecto" : "Nuevo Proyecto"}
          onCerrar={() => setModalProyecto(null)}
        >
          <FormularioProyecto
            datos={modalProyecto}
            categorias={datos.categoriasProy}
            pendiente={pending}
            cantidadExistente={proyectos.length}
            onGuardar={async (datosForm) => {
              startTransition(async () => {
                const nombre = datosForm.nombre;
                const res = modalProyecto.id
                  ? await actualizarProyecto(modalProyecto.id, datosForm)
                  : await crearProyecto({
                      ...datosForm,
                      slug: nombre
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9-]/g, "-"),
                      orden: proyectos.length,
                    });
                if (res.ok) {
                  notificar("exito", "Proyecto guardado.");
                  setModalProyecto(null);
                  recargar();
                } else notificar("error", res.error!);
              });
            }}
          />
        </Modal>
      )}

      {/* Modal: Formación */}
      {modalFormacion !== null && (
        <Modal
          titulo={modalFormacion.id ? "Editar Formación" : "Nueva Formación"}
          onCerrar={() => setModalFormacion(null)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              startTransition(async () => {
                const res = modalFormacion.id
                  ? await actualizarFormacion(modalFormacion.id, {
                      titulo: fd.get("titulo") as string,
                      mencion: (fd.get("mencion") as string) || null,
                      nivel: fd.get("nivel") as string,
                      anioInicio: Number(fd.get("anioInicio")) || null,
                      anioFin: Number(fd.get("anioFin")) || null,
                      estado: fd.get("estado") as string,
                      descripcion: (fd.get("descripcion") as string) || null,
                    })
                  : await crearFormacion({
                      institucionId: Number(fd.get("institucionId")),
                      titulo: fd.get("titulo") as string,
                      mencion: (fd.get("mencion") as string) || null,
                      facultad: (fd.get("facultad") as string) || null,
                      nivel: fd.get("nivel") as string,
                      anioInicio: Number(fd.get("anioInicio")) || null,
                      anioFin: Number(fd.get("anioFin")) || null,
                      estado: fd.get("estado") as string,
                      descripcion: (fd.get("descripcion") as string) || null,
                      orden: formacion.length,
                    });
                if (res.ok) {
                  notificar("exito", "Formación guardada.");
                  setModalFormacion(null);
                  recargar();
                } else notificar("error", res.error!);
              });
            }}
            style={estilosD.formulario}
          >
            {!modalFormacion.id && (
              <div>
                <label style={estilosD.etiqueta}>Institución</label>
                <div className="tarjeta-hundida" style={{ padding: 0 }}>
                  <select name="institucionId" style={estilosD.input}>
                    {datos.instituciones.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <Campo
              label="Título"
              name="titulo"
              defaultValue={modalFormacion.titulo ?? ""}
              required
            />
            <Campo
              label="Mención"
              name="mencion"
              defaultValue={modalFormacion.mencion ?? ""}
            />
            {!modalFormacion.id && (
              <Campo label="Facultad" name="facultad" defaultValue={""} />
            )}
            <div style={estilosD.fila2col}>
              <div>
                <label style={estilosD.etiqueta}>Nivel</label>
                <div className="tarjeta-hundida" style={{ padding: 0 }}>
                  <select
                    name="nivel"
                    defaultValue={modalFormacion.nivel ?? "licenciatura"}
                    style={estilosD.input}
                  >
                    {[
                      "basico",
                      "tecnico_basico",
                      "tecnico_auxiliar",
                      "tecnico_medio",
                      "licenciatura",
                      "egresado",
                      "titulado",
                      "maestria",
                      "doctorado",
                      "curso",
                      "certificacion",
                      "otro",
                    ].map((n) => (
                      <option key={n} value={n}>
                        {n.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={estilosD.etiqueta}>Estado</label>
                <div className="tarjeta-hundida" style={{ padding: 0 }}>
                  <select
                    name="estado"
                    defaultValue={modalFormacion.estado ?? "egresado"}
                    style={estilosD.input}
                  >
                    {["cursando", "egresado", "titulado", "abandonado"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div style={estilosD.fila2col}>
              <Campo
                label="Año inicio"
                name="anioInicio"
                type="number"
                defaultValue={String(modalFormacion.anioInicio ?? "")}
              />
              <Campo
                label="Año fin"
                name="anioFin"
                type="number"
                defaultValue={String(modalFormacion.anioFin ?? "")}
              />
            </div>
            <div>
              <label style={estilosD.etiqueta}>Descripción</label>
              <div className="tarjeta-hundida" style={{ padding: 0 }}>
                <textarea
                  name="descripcion"
                  defaultValue={modalFormacion.descripcion ?? ""}
                  rows={3}
                  style={{ ...estilosD.input, resize: "vertical" }}
                />
              </div>
            </div>
            <BotonGuardar pendiente={pending} />
          </form>
        </Modal>
      )}

      {/* Modal: Experiencia */}
      {modalExperiencia !== null && (
        <Modal
          titulo={
            modalExperiencia.id ? "Editar Experiencia" : "Nueva Experiencia"
          }
          onCerrar={() => setModalExperiencia(null)}
        >
          <FormularioExperiencia
            datos={modalExperiencia}
            empresas={datos.empresas}
            pendiente={pending}
            onGuardar={async (datosForm) => {
              startTransition(async () => {
                const res = modalExperiencia.id
                  ? await actualizarExperiencia(modalExperiencia.id, datosForm)
                  : await crearExperiencia({
                      ...datosForm,
                      orden: experiencias.length,
                    });
                if (res.ok) {
                  notificar("exito", "Experiencia guardada.");
                  setModalExperiencia(null);
                  recargar();
                } else notificar("error", res.error!);
              });
            }}
          />
        </Modal>
      )}

      {/* Modal: Confirmar borrado */}
      {confirmarBorrar && (
        <Modal
          titulo="Confirmar eliminación"
          onCerrar={() => setConfirmarBorrar(null)}
        >
          <p
            style={{
              marginBottom: "var(--espacio-l)",
              color: "var(--texto-secundario)",
            }}
          >
            ¿Estás seguro de eliminar {confirmarBorrar.label}? Esta acción no se
            puede deshacer.
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--espacio-s)",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="boton-neu"
              onClick={() => setConfirmarBorrar(null)}
            >
              Cancelar
            </button>
            <button
              className="boton-neu"
              style={{ color: "#ef4444" }}
              onClick={confirmarBorrar.fn}
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUBCOMPONENTES AUXILIARES
// ─────────────────────────────────────────────────────────

function Campo({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label style={estilosD.etiqueta}>{label}</label>
      <div className="tarjeta-hundida" style={{ padding: 0 }}>
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          style={estilosD.input}
        />
      </div>
    </div>
  );
}

function BotonGuardar({ pendiente }: { pendiente: boolean }) {
  return (
    <button
      type="submit"
      disabled={pendiente}
      className="boton-neu acento"
      style={{ opacity: pendiente ? 0.7 : 1, justifyContent: "center" }}
    >
      {pendiente ? "Guardando..." : "Guardar"}
    </button>
  );
}

function TablaAdmin({
  columnas,
  datos,
  renderFila,
}: {
  columnas: string[];
  datos: any[];
  renderFila: (fila: any) => React.ReactNode[];
}) {
  if (datos.length === 0) {
    return (
      <div
        className="tarjeta"
        style={{
          textAlign: "center",
          color: "var(--texto-suave)",
          padding: "var(--espacio-l)",
        }}
      >
        No hay registros aún.
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={estilosD.tabla}>
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col} style={estilosD.thTabla}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, i) => (
            <tr
              key={fila.id ?? i}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              {renderFila(fila).map((celda, j) => (
                <td key={j} style={estilosD.tdTabla}>
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccionesTabla({
  onEditar,
  onBorrar,
}: {
  onEditar: () => void;
  onBorrar: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={onEditar} className="boton-neu pequeno" title="Editar">
        <Ico.editar />
      </button>
      <button
        onClick={onBorrar}
        className="boton-neu pequeno"
        style={{ color: "#ef4444" }}
        title="Eliminar"
      >
        <Ico.borrar />
      </button>
    </div>
  );
}

function BarraNivel({ nivel }: { nivel: number }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 100 }}
    >
      <div
        style={{
          flex: 1,
          height: 4,
          background: "var(--fondo-alt)",
          borderRadius: 99,
        }}
      >
        <div
          style={{
            width: `${nivel}%`,
            height: "100%",
            background: "var(--degradado-principal)",
            borderRadius: 99,
          }}
        />
      </div>
      <span style={{ fontSize: "0.7rem", color: "var(--texto-suave)" }}>
        {nivel}%
      </span>
    </div>
  );
}

function PuntoColor({ color }: { color: string | null }) {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: color ?? "#ccc",
        boxShadow: "var(--sombra-saliente)",
        display: "inline-block",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────
// FORMULARIO DE EXPERIENCIA (con tareas dinámicas)
// ─────────────────────────────────────────────────────────
function FormularioExperiencia({
  datos,
  empresas,
  pendiente,
  onGuardar,
}: {
  datos: any;
  empresas: any[];
  pendiente: boolean;
  onGuardar: (d: any) => void;
}) {
  const [tareas, setTareas] = useState<string[]>(
    datos.tareas?.map((t: any) => t.descripcion) ?? [""],
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onGuardar({
      empresaId: Number(fd.get("empresaId")),
      cargo: fd.get("cargo") as string,
      tipoContrato: fd.get("tipoContrato") as string,
      fechaInicio: fd.get("fechaInicio") as string,
      fechaFin: (fd.get("fechaFin") as string) || null,
      trabajoActual: fd.get("trabajoActual") === "true",
      descripcionGeneral: (fd.get("descripcionGeneral") as string) || null,
      tareas: tareas.filter((t) => t.trim().length > 0),
    });
  }

  return (
    <form onSubmit={handleSubmit} style={estilosD.formulario}>
      <div>
        <label style={estilosD.etiqueta}>Empresa</label>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <select
            name="empresaId"
            defaultValue={datos.empresaId ?? empresas[0]?.id}
            style={estilosD.input}
          >
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Campo
        label="Cargo"
        name="cargo"
        defaultValue={datos.cargo ?? ""}
        required
      />
      <div>
        <label style={estilosD.etiqueta}>Tipo de Contrato</label>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <select
            name="tipoContrato"
            defaultValue={datos.tipoContrato ?? "pasantia"}
            style={estilosD.input}
          >
            {[
              "pasantia",
              "tiempo_completo",
              "medio_tiempo",
              "freelance",
              "voluntariado",
              "otro",
            ].map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={estilosD.fila2col}>
        <Campo
          label="Fecha Inicio"
          name="fechaInicio"
          type="date"
          defaultValue={datos.fechaInicio ?? ""}
          required
        />
        <Campo
          label="Fecha Fin"
          name="fechaFin"
          type="date"
          defaultValue={datos.fechaFin ?? ""}
        />
      </div>
      <div>
        <label style={estilosD.etiqueta}>¿Trabajo Actual?</label>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <select
            name="trabajoActual"
            defaultValue={String(datos.trabajoActual ?? false)}
            style={estilosD.input}
          >
            <option value="false">No</option>
            <option value="true">Sí</option>
          </select>
        </div>
      </div>
      {/* Tareas dinámicas */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <label style={estilosD.etiqueta}>Tareas / Responsabilidades</label>
          <button
            type="button"
            className="boton-neu pequeno"
            onClick={() => setTareas([...tareas, ""])}
          >
            <Ico.agregar /> Agregar
          </button>
        </div>
        {tareas.map((tarea, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <div className="tarjeta-hundida" style={{ padding: 0, flex: 1 }}>
              <input
                value={tarea}
                onChange={(e) => {
                  const nv = [...tareas];
                  nv[i] = e.target.value;
                  setTareas(nv);
                }}
                style={estilosD.input}
                placeholder={`Tarea ${i + 1}`}
              />
            </div>
            {tareas.length > 1 && (
              <button
                type="button"
                className="boton-neu pequeno"
                style={{ color: "#ef4444" }}
                onClick={() => setTareas(tareas.filter((_, j) => j !== i))}
              >
                <Ico.cerrar />
              </button>
            )}
          </div>
        ))}
      </div>
      <BotonGuardar pendiente={pendiente} />
    </form>
  );
}

// ─────────────────────────────────────────────────────────
// HELPERS DE ESTILO
// ─────────────────────────────────────────────────────────
function estilosBadge(tipo: string): React.CSSProperties {
  const colores: Record<string, string> = {
    telefono: "#38bdf8",
    whatsapp: "#34d399",
    correo: "#f472b6",
    github: "#a78bfa",
    linkedin: "#60a5fa",
  };
  return {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 99,
    background: `${colores[tipo] ?? "#6b7394"}22`,
    color: colores[tipo] ?? "#6b7394",
  };
}

function estilosBadgeEstado(estado: string): React.CSSProperties {
  const colores: Record<string, string> = {
    completado: "#34d399",
    en_desarrollo: "#f59e0b",
    pausado: "#94a3b8",
    mantenimiento: "#60a5fa",
    cancelado: "#ef4444",
  };
  return {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 99,
    background: `${colores[estado] ?? "#6b7394"}22`,
    color: colores[estado] ?? "#6b7394",
  };
}
// ─────────────────────────────────────────────────────────
// FORMULARIO DE HABILIDAD CON ÍCONO
// ─────────────────────────────────────────────────────────
function FormularioHabilidad({ datos, categorias, pendiente, cantidadExistente, onGuardar }: {
  datos:              any;
  categorias:         any[];
  pendiente:          boolean;
  cantidadExistente:  number;
  onGuardar:          (d: any) => void;
}) {
  const [nivelActual, setNivelActual] = useState(datos.nivelPorcentaje ?? 50);
  const [iconoUrl,    setIconoUrl]    = useState<string>(datos.iconoSvg ?? '');
  const [subiendoIco, setSubiendoIco] = useState(false);
  const refArchivo = useRef<HTMLInputElement>(null);

  async function manejarIcono(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setSubiendoIco(true);
    try {
      const res = await subirIconoHabilidad(archivo);
      if (res.ok && res.ruta) setIconoUrl(res.ruta);
      else alert(res.error ?? 'Error al subir el ícono.');
    } finally {
      setSubiendoIco(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onGuardar({
      categoriaId:     Number(fd.get('categoriaId')),
      nombre:          fd.get('nombre') as string,
      nivelPorcentaje: Number(fd.get('nivelPorcentaje')),
      colorPrimario:   (fd.get('colorPrimario') as string) || null,
      iconoSvg:        iconoUrl || null,
      descripcion:     (fd.get('descripcion') as string) || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={estilosD.formulario}>
      <div>
        <label style={estilosD.etiqueta}>Categoría</label>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <select name="categoriaId" defaultValue={datos.categoriaId ?? categorias[0]?.id} style={estilosD.input}>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      <Campo label="Nombre" name="nombre" defaultValue={datos.nombre ?? ''} required />

      {/* ── ÍCONO ────────────────────────────────────────── */}
      <div>
        <label style={estilosD.etiqueta}>Ícono (PNG, SVG, WebP)</label>

        {/* Preview actual */}
        {iconoUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <img src={iconoUrl} alt="ícono" width={40} height={40}
              style={{ objectFit: 'contain', borderRadius: 8, background: 'var(--fondo-alt)', padding: 4 }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--texto-suave)', wordBreak: 'break-all' }}>
              {iconoUrl.length > 50 ? '...' + iconoUrl.slice(-40) : iconoUrl}
            </span>
            <button type="button" className="boton-neu pequeno" style={{ color: '#ef4444', flexShrink: 0 }}
              onClick={() => setIconoUrl('')}>✗</button>
          </div>
        )}

        {/* Subir archivo */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <button type="button" className="boton-neu pequeno"
            onClick={() => refArchivo.current?.click()}
            disabled={subiendoIco}
            style={{ flexShrink: 0 }}>
            {subiendoIco ? 'Subiendo...' : '📁 Subir archivo'}
          </button>
          <input ref={refArchivo} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={manejarIcono} />
        </div>

        {/* O pegar URL externa */}
        <div style={{ fontSize: '0.72rem', color: 'var(--texto-suave)', marginBottom: 4 }}>
          — o pega una URL externa (ej: de devicons.github.io):
        </div>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <input
            type="url"
            placeholder="https://cdn.simpleicons.org/react"
            value={iconoUrl}
            onChange={e => setIconoUrl(e.target.value)}
            style={estilosD.input}
          />
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--texto-suave)', marginTop: 4 }}>
          💡 Recursos gratuitos: devicons.github.io · simpleicons.org · svgrepo.com
        </div>
      </div>

      {/* ── NIVEL ────────────────────────────────────────── */}
      <div>
        <label style={estilosD.etiqueta}>Nivel: {nivelActual}%</label>
        <input type="range" name="nivelPorcentaje"
          value={nivelActual}
          onChange={e => setNivelActual(Number(e.target.value))}
          min={0} max={100} step={5}
          style={{ width: '100%', accentColor: 'var(--acento-1)', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--texto-suave)' }}>
          <span>Básico</span><span>Intermedio</span><span>Avanzado</span><span>Experto</span>
        </div>
      </div>

      <div style={estilosD.fila2col}>
        <Campo label="Color (hex, ej: #61dafb)" name="colorPrimario" defaultValue={datos.colorPrimario ?? '#7c6fef'} />
        <Campo label="Descripción corta" name="descripcion" defaultValue={datos.descripcion ?? ''} />
      </div>

      <BotonGuardar pendiente={pendiente} />
    </form>
  );
}

// ─────────────────────────────────────────────────────────
// FORMULARIO DE PROYECTO CON IMAGEN
// ─────────────────────────────────────────────────────────
function FormularioProyecto({ datos, categorias, pendiente, cantidadExistente, onGuardar }: {
  datos:             any;
  categorias:        any[];
  pendiente:         boolean;
  cantidadExistente: number;
  onGuardar:         (d: any) => void;
}) {
  const [imagenUrl,    setImagenUrl]    = useState<string>(datos.imagenPrincipal ?? '');
  const [subiendoImg,  setSubiendoImg]  = useState(false);
  const [proyectoId,   setProyectoId]   = useState<number | null>(datos.id ?? null);
  const refArchivo = useRef<HTMLInputElement>(null);

  async function manejarImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    // Si el proyecto no existe aún, no podemos asociar la imagen al ID
    // La imagen se sube y se guarda la URL. Al crear, el CRUD la asigna.
    setSubiendoImg(true);
    try {
      if (proyectoId) {
        // Proyecto existente: subir y actualizar en BD directamente
        const res = await subirImagenProyecto(proyectoId, archivo);
        if (res.ok && res.ruta) setImagenUrl(res.ruta);
        else alert(res.error ?? 'Error al subir la imagen.');
      } else {
        // Proyecto nuevo: solo guardamos la URL temporal en estado
        // (la guardamos via URL manual abajo, o subimos después de crear)
        alert('Guarda el proyecto primero, luego sube la imagen desde "Editar".');
      }
    } finally {
      setSubiendoImg(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onGuardar({
      categoriaId:      Number(fd.get('categoriaId')),
      nombre:           fd.get('nombre') as string,
      descripcionCorta: (fd.get('descripcionCorta') as string) || null,
      descripcionLarga: (fd.get('descripcionLarga') as string) || null,
      urlDemo:          (fd.get('urlDemo') as string) || null,
      urlRepositorio:   (fd.get('urlRepositorio') as string) || null,
      estado:           fd.get('estado') as string,
      destacado:        fd.get('destacado') === 'true',
      publicado:        fd.get('publicado') === 'true',
      orden:            Number(fd.get('orden')) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={estilosD.formulario}>
      <Campo label="Nombre del proyecto" name="nombre" defaultValue={datos.nombre ?? ''} required />

      <div>
        <label style={estilosD.etiqueta}>Categoría</label>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <select name="categoriaId" defaultValue={datos.categoriaId ?? categorias[0]?.id} style={estilosD.input}>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* ── IMAGEN PRINCIPAL ─────────────────────────────── */}
      <div>
        <label style={estilosD.etiqueta}>Imagen Principal</label>

        {imagenUrl && (
          <div style={{ marginBottom: 8, borderRadius: 12, overflow: 'hidden',
            background: 'var(--fondo-alt)', aspectRatio: '16/9', position: 'relative', maxHeight: 140 }}>
            <img src={imagenUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {proyectoId ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="boton-neu pequeno"
              onClick={() => refArchivo.current?.click()}
              disabled={subiendoImg}>
              {subiendoImg ? 'Subiendo...' : '📁 Subir imagen'}
            </button>
            <input ref={refArchivo} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={manejarImagen} />
          </div>
        ) : (
          <p style={{ fontSize: '0.72rem', color: 'var(--texto-suave)', padding: '8px 0' }}>
            💡 Guarda el proyecto primero, luego edítalo para subir la imagen.
          </p>
        )}

        {/* También permite pegar URL */}
        <div style={{ fontSize: '0.72rem', color: 'var(--texto-suave)', margin: '6px 0' }}>
          — o pega una URL de imagen:
        </div>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <input type="url" placeholder="https://..." value={imagenUrl}
            onChange={e => setImagenUrl(e.target.value)} style={estilosD.input} />
        </div>
      </div>

      <Campo label="Descripción corta" name="descripcionCorta" defaultValue={datos.descripcionCorta ?? ''} />

      <div>
        <label style={estilosD.etiqueta}>Descripción larga</label>
        <div className="tarjeta-hundida" style={{ padding: 0 }}>
          <textarea name="descripcionLarga" defaultValue={datos.descripcionLarga ?? ''}
            rows={4} style={{ ...estilosD.input, resize: 'vertical' }} />
        </div>
      </div>

      <div style={estilosD.fila2col}>
        <Campo label="URL Demo" name="urlDemo" defaultValue={datos.urlDemo ?? ''} />
        <Campo label="URL Repositorio" name="urlRepositorio" defaultValue={datos.urlRepositorio ?? ''} />
      </div>

      <div style={estilosD.fila2col}>
        <div>
          <label style={estilosD.etiqueta}>Estado</label>
          <div className="tarjeta-hundida" style={{ padding: 0 }}>
            <select name="estado" defaultValue={datos.estado ?? 'en_desarrollo'} style={estilosD.input}>
              {['en_desarrollo','completado','pausado','mantenimiento','cancelado']
                .map(e => <option key={e} value={e}>{e.replace(/_/g,' ')}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={estilosD.etiqueta}>Publicado</label>
          <div className="tarjeta-hundida" style={{ padding: 0 }}>
            <select name="publicado" defaultValue={String(datos.publicado ?? false)} style={estilosD.input}>
              <option value="true">✓ Visible</option>
              <option value="false">✗ Oculto</option>
            </select>
          </div>
        </div>
      </div>

      <div style={estilosD.fila2col}>
        <div>
          <label style={estilosD.etiqueta}>Destacado</label>
          <div className="tarjeta-hundida" style={{ padding: 0 }}>
            <select name="destacado" defaultValue={String(datos.destacado ?? false)} style={estilosD.input}>
              <option value="true">⭐ Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <Campo label="Orden visual" name="orden" type="number" defaultValue={String(datos.orden ?? cantidadExistente)} />
      </div>

      <BotonGuardar pendiente={pendiente} />
    </form>
  );
}
// ─────────────────────────────────────────────────────────
// ESTILOS DEL DASHBOARD — Variables CSS del globals.css
// ─────────────────────────────────────────────────────────
const estilosD = {
  contenedor: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--fondo)",
  } as React.CSSProperties,

  sidebar: {
    width: 260,
    minHeight: "100vh",
    background: "var(--superficie-vidrio)",
    backdropFilter: "var(--desenfoque-vidrio)",
    borderRight: "var(--borde-vidrio)",
    padding: "var(--espacio-l)",
    display: "flex",
    flexDirection: "column" as const,
    position: "sticky" as const,
    top: 0,
    height: "100vh",
  } as React.CSSProperties,

  itemMenu: {
    width: "100%",
    textAlign: "left" as const,
    padding: "10px 14px",
    borderRadius: "var(--radio-mediano)",
    border: "none",
    background: "transparent",
    color: "var(--texto-secundario)",
    fontSize: "0.84rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--fuente-titulo)",
    transition: "all var(--transicion-rapida)",
  } as React.CSSProperties,

  itemMenuActivo: {
    background: "var(--fondo)",
    boxShadow: "var(--sombra-saliente)",
    color: "var(--texto-primario)",
  } as React.CSSProperties,

  main: {
    flex: 1,
    padding: "var(--espacio-l)",
    maxWidth: 900,
  } as React.CSSProperties,

  tituloSeccion: {
    fontSize: "1.5rem",
    fontWeight: 900,
    marginBottom: "var(--espacio-l)",
  } as React.CSSProperties,

  encabezadoSeccion: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--espacio-l)",
  } as React.CSSProperties,

  formulario: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--espacio-m)",
  } as React.CSSProperties,

  fila2col: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--espacio-m)",
  } as React.CSSProperties,

  etiqueta: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--texto-secundario)",
    marginBottom: 6,
    letterSpacing: "0.04em",
  } as React.CSSProperties,

  input: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    padding: "12px 14px",
    fontSize: "0.86rem",
    color: "var(--texto-primario)",
    fontFamily: "var(--fuente-titulo)",
    borderRadius: "var(--radio-mediano)",
  } as React.CSSProperties,

  tabla: {
    width: "100%",
    borderCollapse: "collapse" as const,
    background: "var(--superficie-vidrio)",
    borderRadius: "var(--radio-grande)",
    overflow: "hidden",
  } as React.CSSProperties,

  thTabla: {
    padding: "12px 16px",
    textAlign: "left" as const,
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "var(--texto-sobre-acento)",
    background: "var(--degradado-principal)",
  } as React.CSSProperties,

  tdTabla: {
    padding: "12px 16px",
    fontSize: "0.82rem",
    color: "var(--texto-primario)",
  } as React.CSSProperties,

  notif: {
    padding: "12px 20px",
    borderRadius: "var(--radio-mediano)",
    marginBottom: "var(--espacio-m)",
    fontSize: "0.84rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,

  gridStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "var(--espacio-m)",
  } as React.CSSProperties,

  enlacePortafolio: {
    display: "block",
    textAlign: "center" as const,
    fontSize: "0.78rem",
    color: "var(--texto-suave)",
    marginBottom: 8,
    textDecoration: "none",
  } as React.CSSProperties,
};

const estilosModal = {
  fondo: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--espacio-m)",
  } as React.CSSProperties,

  caja: {
    width: "100%",
    maxWidth: 580,
    maxHeight: "90vh",
    background: "var(--superficie)",
    borderRadius: "var(--radio-grande)",
    boxShadow: "var(--sombra-saliente-grande)",
    border: "var(--borde-vidrio)",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  } as React.CSSProperties,

  encabezado: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--espacio-m) var(--espacio-l)",
    borderBottom: "var(--borde-vidrio)",
    flexShrink: 0,
  } as React.CSSProperties,

  cuerpo: {
    padding: "var(--espacio-l)",
    overflowY: "auto" as const,
    flex: 1,
  } as React.CSSProperties,
};
