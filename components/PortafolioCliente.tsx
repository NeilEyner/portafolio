// Asegúrate que estas importaciones estén al inicio del archivo:
"use client";
// PortafolioCliente.tsx
// Recibe los datos del Server Component (app/page.tsx) como props.
// Toda la lógica interactiva vive aquí.
// La única diferencia con el page.tsx anterior es que los DATOS_*
// ya no son constantes hardcodeadas — vienen de la prop `datos`.

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useActionState,
} from "react";
import Image from "next/image";
import { type DatosPortafolio } from "@/lib/queries";
import {
  enviarMensajeContacto,
  subirFotoPerfil,
  type EstadoMensaje,
  type EstadoFoto,
} from "@/lib/actions";

/* ── Tipos auxiliares ────────────────────────────────────── */
type Tema = "oscuro" | "claro";
type Color = "violeta" | "cielo" | "esmeralda" | "amanecer" | "rosa";
type Pagina = "inicio" | "formacion" | "habilidades" | "proyectos" | "contacto";

/* ── Temas de color disponibles ──────────────────────────── */
const TEMAS_COLOR: { slug: Color; label: string; grad: string }[] = [
  {
    slug: "violeta",
    label: "Violeta",
    grad: "linear-gradient(135deg,#7c6fef,#f472b6)",
  },
  {
    slug: "cielo",
    label: "Cielo",
    grad: "linear-gradient(135deg,#0ea5e9,#6366f1)",
  },
  {
    slug: "esmeralda",
    label: "Esmeralda",
    grad: "linear-gradient(135deg,#10b981,#0ea5e9)",
  },
  {
    slug: "amanecer",
    label: "Amanecer",
    grad: "linear-gradient(135deg,#f97316,#ef4444)",
  },
  {
    slug: "rosa",
    label: "Rosa",
    grad: "linear-gradient(135deg,#ec4899,#a855f7)",
  },
];

const CARGOS_ALTERNATIVOS = [
  "// DESARROLLADOR FRONT-END",
  "// SISTEMAS INFORMÁTICOS",
  "// GESTIÓN WEB & CONTENIDO",
  "// REDES & SOPORTE TI",
  "// APRENDIZAJE CONTINUO",
];

/* ============================================================
   ÍCONOS SVG (igual que antes, se omiten por brevedad —
   cópialos desde el page.tsx anterior)
   ============================================================ */
const IcoInicio = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IcoFormacion = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const IcoSkills = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IcoProyectos = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IcoContacto = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IcoDescargar = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IcoPaleta = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);
const IcoSol = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IcoLuna = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IcoCamara = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IcoUbicacion = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoEnviar = () => (
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
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IcoMaleta = () => (
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
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IcoInfo = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IcoCheck = () => (
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
);
const IcoError = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ef4444"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const IcoTelefono = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IcoEmail = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IcoGithub = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function IconoContactoTipo({ tipo }: { tipo: string }) {
  const s = 24;
  switch (tipo) {
    case "telefono":
    case "whatsapp":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "correo":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "github":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

function IconoFormacion({ nivel }: { nivel: string }) {
  if (nivel.includes("tecnico"))
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

/* ── Ripple hook ─────────────────────────────────────────── */
function useRipple() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const span = document.createElement("span");
    span.style.cssText = `position:absolute;border-radius:50%;background:rgba(124,111,239,0.2);width:10px;height:10px;left:${e.clientX - rect.left - 5}px;top:${e.clientY - rect.top - 5}px;pointer-events:none;animation:rizado-neu 0.55s ease-out forwards;z-index:0;`;
    el.style.overflow = "hidden";
    el.appendChild(span);
    setTimeout(() => span.remove(), 600);
  }, []);
}

/* ── ContadorAnimado ─────────────────────────────────────── */
function ContadorAnimado({
  valor,
  sufijo,
}: {
  valor: string;
  sufijo: string | null;
}) {
  const [num, setNum] = useState(0);
  const iniciado = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const objetivo = parseInt(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !iniciado.current) {
          iniciado.current = true;
          const paso = (objetivo / 900) * 16;
          let actual = 0;
          const t = setInterval(() => {
            actual += paso;
            if (actual >= objetivo) {
              actual = objetivo;
              clearInterval(t);
            }
            setNum(Math.floor(actual));
          }, 16);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [objetivo]);

  return (
    <div ref={ref} className="numero-estadistica">
      {num}
      {sufijo ?? ""}
    </div>
  );
}

/* ── ItemTiempo ──────────────────────────────────────────── */
function ItemTiempo({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`item-tiempo${visible ? " visible" : ""}`}>
      {children}
    </div>
  );
}

/* ── BarraHabilidad ──────────────────────────────────────── */
function BarraHabilidad({ nivel, delay }: { nivel: number; delay: number }) {
  const [activo, setActivo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => setActivo(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div ref={ref} className="barra-nivel-mini">
      <div
        className="relleno-nivel"
        style={{
          transform: activo ? `scaleX(${nivel / 100})` : "scaleX(0)",
          transformOrigin: "left",
          transition: activo
            ? `transform 0.9s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`
            : "none",
        }}
      />
    </div>
  );
}

/* ── FormularioContacto ──────────────────────────────────── */
function FormularioContacto() {
  const estadoInicial: EstadoMensaje = { ok: false, mensaje: "" };
  const [estado, accion, pendiente] = useActionState(
    enviarMensajeContacto,
    estadoInicial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Limpiar el formulario al éxito
  useEffect(() => {
    if (estado.ok) formRef.current?.reset();
  }, [estado.ok]);

  return (
    <form
      ref={formRef}
      action={accion}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--espacio-m)",
        marginTop: "var(--espacio-l)",
      }}
    >
      {/* Nombre */}
      <div className="tarjeta-hundida" style={{ padding: "0" }}>
        <input
          name="nombre"
          type="text"
          placeholder="Tu nombre completo"
          required
          minLength={2}
          maxLength={120}
          style={estiloInput}
        />
      </div>

      {/* Correo */}
      <div className="tarjeta-hundida" style={{ padding: "0" }}>
        <input
          name="correo"
          type="email"
          placeholder="Tu correo electrónico"
          required
          maxLength={200}
          style={estiloInput}
        />
      </div>

      {/* Asunto */}
      <div className="tarjeta-hundida" style={{ padding: "0" }}>
        <input
          name="asunto"
          type="text"
          placeholder="Asunto (opcional)"
          maxLength={255}
          style={estiloInput}
        />
      </div>

      {/* Mensaje */}
      <div className="tarjeta-hundida" style={{ padding: "0" }}>
        <textarea
          name="mensaje"
          placeholder="Tu mensaje..."
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          style={{ ...estiloInput, resize: "vertical", minHeight: 100 }}
        />
      </div>

      {/* Respuesta del servidor */}
      {estado.mensaje && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: "var(--radio-mediano)",
            background: estado.ok
              ? "rgba(52,211,153,0.1)"
              : "rgba(239,68,68,0.1)",
            fontSize: "0.82rem",
            color: estado.ok ? "#34d399" : "#ef4444",
          }}
        >
          {estado.ok ? <IcoCheck /> : <IcoError />}
          {estado.mensaje}
        </div>
      )}

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={pendiente}
        className="boton-neu acento"
        style={{
          width: "100%",
          justifyContent: "center",
          opacity: pendiente ? 0.7 : 1,
        }}
      >
        {pendiente ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: "girar-anillo 1s linear infinite",
                display: "inline-block",
              }}
            >
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" opacity=".25" />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            <IcoEnviar /> Enviar mensaje
          </>
        )}
      </button>
    </form>
  );
}

const estiloInput: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  padding: "14px 16px",
  fontFamily: "var(--fuente-titulo)",
  fontSize: "0.88rem",
  color: "var(--texto-primario)",
  borderRadius: "var(--radio-mediano)",
};

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function PortafolioCliente({
  datos,
}: {
  datos: DatosPortafolio;
}) {
  const {
    propietario: datosProp,
    contactos,
    formacion,
    experiencia,
    habilidades,
    categoriasHabilidades,
    proyectos,
    categoriasProyectos,
    estadisticas,
  } = datos;

  /* ── Estado ─────────────────────────────────────────────── */
  const [tema, setTema] = useState<Tema>(
    datosProp.temaOscuro ? "oscuro" : "claro",
  );
  const [colorActivo, setColorActivo] = useState<Color>(
    (datosProp.temaColor as Color) ?? "violeta",
  );
  const [paginaActiva, setPaginaActiva] = useState<Pagina>("inicio");
  const [panelColorAbierto, setPanelColorAbierto] = useState(false);
  const [categoriaHab, setCategoriaHab] = useState(
    categoriasHabilidades[0]?.slug ?? "desarrollo",
  );
  const [filtroProyecto, setFiltroProyecto] = useState("todos");
  const [fotoUrl, setFotoUrl] = useState<string | null>(datosProp.fotoRuta);
  const [cargoIdx, setCargoIdx] = useState(0);
  const [cargoVisible, setCargoVisible] = useState(true);
  const [notifMsg, setNotifMsg] = useState("");
  const [notifVisible, setNotifVisible] = useState(false);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const entradaFotoRef = useRef<HTMLInputElement>(null);
  const inicioToqueX = useRef(0);
  const inicioToqueY = useRef(0);
  const ripple = useRipple();

  const ORDEN_PAGINAS: Pagina[] = [
    "inicio",
    "formacion",
    "habilidades",
    "proyectos",
    "contacto",
  ];

  /* ── Tema y color → DOM + localStorage ─────────────────── */
  useEffect(() => {
    const t = (localStorage.getItem("nec-tema") as Tema) || tema;
    const c = (localStorage.getItem("nec-color") as Color) || colorActivo;
    setTema(t);
    setColorActivo(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
    localStorage.setItem("nec-tema", tema);
  }, [tema]);

  useEffect(() => {
    if (colorActivo === "violeta")
      document.documentElement.removeAttribute("data-color");
    else document.documentElement.setAttribute("data-color", colorActivo);
    localStorage.setItem("nec-color", colorActivo);
  }, [colorActivo]);

  /* ── Cerrar panel al clic fuera ─────────────────────────── */
  useEffect(() => {
    const h = () => setPanelColorAbierto(false);
    if (panelColorAbierto) document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [panelColorAbierto]);

  /* ── Cargo rotativo ─────────────────────────────────────── */
  useEffect(() => {
    const iv = setInterval(() => {
      setCargoVisible(false);
      setTimeout(() => {
        setCargoIdx((i) => (i + 1) % CARGOS_ALTERNATIVOS.length);
        setCargoVisible(true);
      }, 350);
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  /* ── Swipe táctil ───────────────────────────────────────── */
  useEffect(() => {
    const onS = (e: TouchEvent) => {
      inicioToqueX.current = e.changedTouches[0].clientX;
      inicioToqueY.current = e.changedTouches[0].clientY;
    };
    const onE = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - inicioToqueX.current;
      const dy = e.changedTouches[0].clientY - inicioToqueY.current;
      if (Math.abs(dx) < 60 || Math.abs(dy) > 60) return;
      const idx = ORDEN_PAGINAS.indexOf(paginaActiva);
      if (dx < 0 && idx < ORDEN_PAGINAS.length - 1)
        irAPagina(ORDEN_PAGINAS[idx + 1]);
      else if (dx > 0 && idx > 0) irAPagina(ORDEN_PAGINAS[idx - 1]);
    };
    document.addEventListener("touchstart", onS, { passive: true });
    document.addEventListener("touchend", onE, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onS);
      document.removeEventListener("touchend", onE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaActiva]);

  /* ── Toast ──────────────────────────────────────────────── */
  const mostrarNotificacion = useCallback((msg: string) => {
    if (notifTimer.current) clearTimeout(notifTimer.current);
    setNotifMsg(msg);
    setNotifVisible(true);
    notifTimer.current = setTimeout(() => setNotifVisible(false), 2800);
  }, []);

  /* ── Navegación ─────────────────────────────────────────── */
  const irAPagina = useCallback((p: Pagina) => {
    setPaginaActiva(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ── Subir foto con Server Action ───────────────────────── */
  const estadoFotoInicial: EstadoFoto = { ok: false, mensaje: "" };
  const [estadoFoto, accionFoto] = useActionState(
    subirFotoPerfil,
    estadoFotoInicial,
  );

  useEffect(() => {
    if (estadoFoto.ok && estadoFoto.ruta) {
      setFotoUrl(estadoFoto.ruta);
      mostrarNotificacion("Fotografía actualizada con éxito");
    } else if (!estadoFoto.ok && estadoFoto.mensaje) {
      mostrarNotificacion(estadoFoto.mensaje);
    }
  }, [estadoFoto, mostrarNotificacion]);

  /* ── Datos derivados ────────────────────────────────────── */
  const habilidadesFiltradas = habilidades.filter(
    (h) => h.categoriaSlug === categoriaHab,
  );
  const proyectosFiltrados =
    filtroProyecto === "todos"
      ? proyectos
      : proyectos.filter((p) => p.categoriaSlug === filtroProyecto);

  // Obtener nombre completo
  const nombreCompleto = `${datosProp.nombres} ${datosProp.apellidos}`;
  const palabras = nombreCompleto.split(" ");
  const nombreLinea1 = palabras.slice(0, 2).join(" ");
  const nombreLinea2 = palabras.slice(2).join(" ");

  const NAV_ITEMS: { id: Pagina; label: string; Ico: React.FC }[] = [
    { id: "inicio", label: "Inicio", Ico: IcoInicio },
    { id: "formacion", label: "Exp.", Ico: IcoFormacion },
    { id: "habilidades", label: "Skills", Ico: IcoSkills },
    { id: "proyectos", label: "Proyectos", Ico: IcoProyectos },
    { id: "contacto", label: "Contacto", Ico: IcoContacto },
  ];

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <>
      {/* ── BARRA SUPERIOR ──────────────────────────────────── */}
      <nav id="barra-superior">
        <span className="logo-nav texto-degradado">N · E · C</span>
        <div className="controles-nav">
          {datosProp.cvRuta ? (
            <a
              href={datosProp.cvRuta}
              download
              className="boton-icono"
              title="Descargar CV"
            >
              <IcoDescargar />
            </a>
          ) : (
            <button
              className="boton-icono"
              title="CV próximamente"
              onClick={(e) => {
                ripple(e);
                mostrarNotificacion("CV disponible próximamente");
              }}
            >
              <IcoDescargar />
            </button>
          )}
          <button
            id="boton-tema"
            aria-label="Cambiar tema"
            onClick={() =>
              setTema((t) => (t === "oscuro" ? "claro" : "oscuro"))
            }
          >
            <span className="perilla">
              {tema === "claro" ? <IcoSol /> : <IcoLuna />}
            </span>
          </button>
        </div>
      </nav>

      {/* ── SELECTOR DE COLOR ───────────────────────────────── */}
      <div id="selector-color">
        <div
          className={`panel-colores${panelColorAbierto ? " abierto" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="etiqueta-panel">TEMA DE COLOR</span>
          <div className="opciones-color">
            {TEMAS_COLOR.map((t) => (
              <button
                key={t.slug}
                className={`punto-color${colorActivo === t.slug ? " seleccionado" : ""}`}
                style={{ background: t.grad }}
                title={t.label}
                onClick={() => {
                  setColorActivo(t.slug);
                  mostrarNotificacion(`Tema: ${t.label}`);
                }}
              />
            ))}
          </div>
          <div className="fila-tema">
            <span>Modo oscuro</span>
            <button
              id="boton-tema-panel"
              onClick={() =>
                setTema((t) => (t === "oscuro" ? "claro" : "oscuro"))
              }
            >
              <svg width="22" height="12" viewBox="0 0 44 24">
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="24"
                  rx="12"
                  fill="var(--fondo-alt)"
                />
                <circle
                  cx={tema === "oscuro" ? 32 : 12}
                  cy="12"
                  r="9"
                  fill="url(#gradPanelBtn)"
                />
                <defs>
                  <linearGradient id="gradPanelBtn" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--acento-1)" />
                    <stop offset="100%" stopColor="var(--acento-2)" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>
        </div>
        <button
          id="boton-paleta"
          aria-expanded={panelColorAbierto}
          onClick={(e) => {
            e.stopPropagation();
            setPanelColorAbierto((o) => !o);
          }}
        >
          <IcoPaleta />
        </button>
      </div>

      {/* ════════════════════════════════════════════════════
          INICIO
      ════════════════════════════════════════════════════ */}
      <section
        id="pagina-inicio"
        className={`pagina${paginaActiva === "inicio" ? " activa" : ""}`}
      >
        <div id="inicio">
          {/* Foto + formulario de subida via Server Action */}
          <div className="contenedor-foto">
            <div className="pulso-halo" />
            <svg
              className="anillo-giratorio"
              width="140"
              height="140"
              viewBox="0 0 140 140"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            >
              <defs>
                <linearGradient
                  id="gradAnillo"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="var(--acento-1)" />
                  <stop offset="50%" stopColor="var(--acento-2)" />
                  <stop offset="100%" stopColor="var(--acento-3)" />
                </linearGradient>
              </defs>
              <circle
                cx="70"
                cy="70"
                r="65"
                fill="none"
                stroke="url(#gradAnillo)"
                strokeWidth="2.5"
                strokeDasharray="10 7"
                strokeLinecap="round"
                style={{
                  animation: "girar-anillo 18s linear infinite",
                  transformOrigin: "70px 70px",
                }}
              />
              <circle
                cx="70"
                cy="70"
                r="57"
                fill="none"
                stroke="url(#gradAnillo)"
                strokeWidth="1"
                strokeDasharray="3 12"
                strokeLinecap="round"
                style={{
                  animation: "girar-anillo-inverso 12s linear infinite",
                  transformOrigin: "70px 70px",
                  opacity: 0.4,
                }}
              />
            </svg>

            <div className="foto-interna">
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt={nombreCompleto}
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                    zIndex: 2,
                  }}
                />
              ) : (
                <span className="iniciales">{datosProp.iniciales}</span>
              )}
              {/* Opcional: He quitado el icono de cámara ya que ya no es editable */}
            </div>
          </div>

          <h1 className="nombre-hero">
            <span className="texto-degradado">{nombreLinea1}</span>
            <br />
            {nombreLinea2}
          </h1>

          <p
            id="cargo-animado"
            className="cargo-hero"
            style={{
              opacity: cargoVisible ? 1 : 0,
              transform: cargoVisible ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {CARGOS_ALTERNATIVOS[cargoIdx]}
          </p>

          <div className="ubicacion-hero">
            <IcoUbicacion />
            {datosProp.ciudad}, {datosProp.pais}
            {/* {datosProp.fechaNacimiento &&` · ${new Date().getFullYear() - new Date(datosProp.fechaNacimiento).getFullYear()} años`} */}
          </div>

          {/* Chips de contacto (los 3 primeros activos) */}
          <div className="fila-contacto">
            {contactos
              .filter((c) => ["telefono", "correo", "github"].includes(c.tipo))
              .map((c) => (
                <a
                  key={c.tipo}
                  href={c.url ?? "#"}
                  className="chip-contacto"
                  target={
                    ["github", "linkedin"].includes(c.tipo)
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    ["github", "linkedin"].includes(c.tipo)
                      ? "noopener"
                      : undefined
                  }
                  onClick={(e) => ripple(e as React.MouseEvent<HTMLElement>)}
                >
                  {c.tipo === "telefono" && <IcoTelefono />}
                  {c.tipo === "correo" && <IcoEmail />}
                  {c.tipo === "github" && <IcoGithub />}
                  {c.tipo === "telefono" ? c.valor : c.etiqueta}
                </a>
              ))}
          </div>

          {/* Estadísticas */}
          <div className="fila-estadisticas">
            {estadisticas.map((e, i) => (
              <div
                key={i}
                className="pastilla-estadistica"
                onClick={(ev) => ripple(ev)}
              >
                <ContadorAnimado valor={e.valor} sufijo={e.sufijo} />
                <div className="etiqueta-estadistica">{e.etiqueta}</div>
              </div>
            ))}
          </div>

          <div className="acciones-hero">
            <button
              className="boton-neu acento"
              onClick={(e) => {
                ripple(e);
                irAPagina("contacto");
              }}
            >
              <IcoEnviar /> Contáctame
            </button>
            <button
              className="boton-neu"
              onClick={(e) => {
                ripple(e);
                irAPagina("proyectos");
              }}
            >
              <IcoMaleta /> Ver Proyectos
            </button>
          </div>
        </div>

        {/* Perfil profesional */}
        <div className="seccion" style={{ paddingTop: 0 }}>
          <h2 className="titulo-seccion">
            <span className="punto" /> Perfil Profesional
          </h2>
          <div className="tarjeta">
            <svg width="100%" height="3" style={{ marginBottom: 16 }}>
              <defs>
                <linearGradient id="gradLinea" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--acento-1)" />
                  <stop offset="100%" stopColor="var(--acento-2)" />
                </linearGradient>
              </defs>
              <rect width="60" height="3" rx="2" fill="url(#gradLinea)" />
            </svg>
            <p className="texto-perfil" style={{ whiteSpace: "pre-line" }}>
              {datosProp.perfilProfesional}
            </p>
            <div className="divisor" />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 4,
              }}
            >
              {[
                "Orientado a resultados",
                "Trabajo en equipo",
                "Aprendizaje continuo",
                "Soluciones eficientes",
              ].map((t, i) => (
                <span key={i} className={`etiqueta acento-${i + 1}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FORMACIÓN & EXPERIENCIA
      ════════════════════════════════════════════════════ */}
      <section
        id="pagina-formacion"
        className={`pagina${paginaActiva === "formacion" ? " activa" : ""}`}
      >
        <div className="seccion" style={{ paddingTop: "calc(64px + 20px)" }}>
          <h2 className="titulo-seccion">
            <span className="punto" /> Formación Académica
          </h2>
          <div className="linea-tiempo">
            {formacion.map((f, i) => (
              <ItemTiempo key={f.id} delay={i * 140}>
                <div className="icono-tiempo">
                  <IconoFormacion nivel={f.nivel} />
                </div>
                <div className="cuerpo-tiempo">
                  <div className="anio-tiempo">
                    {f.anioInicio} – {f.anioFin}
                  </div>
                  <div className="titulo-tiempo">{f.titulo}</div>
                  <div className="lugar-tiempo">{f.institucion}</div>
                  {f.descripcion && (
                    <p
                      style={{
                        fontSize: "0.77rem",
                        color: "var(--texto-suave)",
                        marginTop: 6,
                        lineHeight: 1.6,
                      }}
                    >
                      {f.descripcion}
                    </p>
                  )}
                  <div className="etiquetas-tiempo">
                    <span className="etiqueta acento-1">
                      {f.estado.charAt(0).toUpperCase() + f.estado.slice(1)}
                    </span>
                    {f.siglas && (
                      <span className="etiqueta acento-3">{f.siglas}</span>
                    )}
                  </div>
                </div>
              </ItemTiempo>
            ))}
          </div>
        </div>

        <div className="seccion" style={{ paddingTop: 0 }}>
          <h2 className="titulo-seccion">
            <span className="punto" /> Experiencia
          </h2>
          <div className="linea-tiempo">
            {experiencia.map((exp, i) => {
              const fi = new Date(exp.fechaInicio);
              const ff = exp.fechaFin ? new Date(exp.fechaFin) : null;
              const fmt = (d: Date) =>
                d
                  .toLocaleDateString("es-BO", { month: "short" })
                  .toUpperCase() +
                " " +
                d.getFullYear();
              return (
                <ItemTiempo key={exp.id} delay={i * 140}>
                  <div
                    className="icono-tiempo"
                    style={{ color: "var(--acento-2)" }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className="cuerpo-tiempo">
                    <div className="anio-tiempo">
                      {fmt(fi)} – {ff ? fmt(ff) : "Actual"}
                    </div>
                    <div className="titulo-tiempo">{exp.cargo}</div>
                    <div className="lugar-tiempo">{exp.empresa}</div>
                    <ul className="tareas-tiempo">
                      {exp.tareas.map((t, ti) => (
                        <li key={ti}>{t.descripcion}</li>
                      ))}
                    </ul>
                    <div className="etiquetas-tiempo">
                      <span className="etiqueta acento-2">
                        {exp.tipoContrato.charAt(0).toUpperCase() +
                          exp.tipoContrato.slice(1)}
                      </span>
                      {exp.sector && (
                        <span className="etiqueta acento-3">{exp.sector}</span>
                      )}
                    </div>
                  </div>
                </ItemTiempo>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HABILIDADES
      ════════════════════════════════════════════════════ */}
      <section
        id="pagina-habilidades"
        className={`pagina${paginaActiva === "habilidades" ? " activa" : ""}`}
      >
        <div className="seccion" style={{ paddingTop: "calc(64px + 20px)" }}>
          <h2 className="titulo-seccion">
            <span className="punto" /> Habilidades
          </h2>

          <div className="pestanias-habilidades" role="tablist">
            {categoriasHabilidades.map((cat) => (
              <button
                key={cat.slug}
                className={`pestania-hab${categoriaHab === cat.slug ? " activo" : ""}`}
                role="tab"
                onClick={(e) => {
                  ripple(e);
                  setCategoriaHab(cat.slug);
                }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div
            className="cuadricula-habilidades grupo-habilidades activo"
            role="tabpanel"
          >
            {habilidadesFiltradas.map((h, i) => (
              <div
                key={h.slug}
                className="tarjeta-habilidad visible"
                style={{
                  opacity: paginaActiva === "habilidades" ? 1 : 0,
                  transform:
                    paginaActiva === "habilidades" ? "scale(1)" : "scale(0.85)",
                  transition: `opacity 0.35s ease ${i * 80}ms, transform 0.35s ease ${i * 80}ms`,
                }}
              >
                <div className="icono-habilidad">
                  {h.iconoSvg ? (
                    // Si tiene ícono guardado: muestra la imagen (PNG, SVG externo, etc.)
                    <img
                      src={h.iconoSvg}
                      alt={h.nombre}
                      width={34}
                      height={34}
                      style={{ objectFit: "contain", width: 34, height: 34 }}
                      onError={(e) => {
                        // Si la imagen falla, mostrar iniciales como fallback
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    // Fallback: círculo coloreado con la inicial del nombre
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: `${h.colorPrimario ?? "var(--acento-1)"}22`,
                        border: `2px solid ${h.colorPrimario ?? "var(--acento-1)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 900,
                        color: h.colorPrimario ?? "var(--acento-1)",
                        fontFamily: "var(--fuente-mono)",
                      }}
                    >
                      {h.nombre.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="nombre-habilidad">{h.nombre}</span>
                <BarraHabilidad
                  nivel={h.nivelPorcentaje}
                  delay={paginaActiva === "habilidades" ? i * 80 + 150 : 0}
                />
                <span className="nivel-habilidad">{h.nivelPorcentaje}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PROYECTOS
      ════════════════════════════════════════════════════ */}
      <section
        id="pagina-proyectos"
        className={`pagina${paginaActiva === "proyectos" ? " activa" : ""}`}
      >
        <div className="seccion" style={{ paddingTop: "calc(64px + 20px)" }}>
          <h2 className="titulo-seccion">
            <span className="punto" /> Proyectos
          </h2>

          <div className="filtros-proyectos">
            {categoriasProyectos.map((cat) => (
              <button
                key={cat.slug}
                className={`filtro-proyecto${filtroProyecto === cat.slug ? " activo" : ""}`}
                onClick={(e) => {
                  ripple(e);
                  setFiltroProyecto(cat.slug);
                }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div className="cuadricula-proyectos">
            {proyectosFiltrados.length === 0 ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "var(--espacio-l)",
                  color: "var(--texto-suave)",
                  fontSize: "0.85rem",
                }}
              >
                No hay proyectos en esta categoría aún.
              </div>
            ) : (
              proyectosFiltrados.map((p) =>
                p.publicado ? (
                  <div
                    key={p.slug}
                    className="tarjeta-proyecto"
                    data-categoria={p.categoriaSlug}
                  >
                    <div className="imagen-proyecto">
                      {p.imagenPrincipal ? (
                        <Image
                          src={p.imagenPrincipal}
                          alt={p.nombre}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      )}
                      <div className="overlay-proyecto">
                        <div style={{ display: "flex", gap: 8 }}>
                          {p.urlDemo && (
                            <a
                              href={p.urlDemo}
                              target="_blank"
                              rel="noopener"
                              style={{
                                color: "#fff",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                padding: "6px 12px",
                                borderRadius: "var(--radio-completo)",
                                border: "1px solid rgba(255,255,255,0.5)",
                              }}
                            >
                              Ver demo
                            </a>
                          )}
                          {p.urlRepositorio && (
                            <a
                              href={p.urlRepositorio}
                              target="_blank"
                              rel="noopener"
                              style={{
                                color: "#fff",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                padding: "6px 12px",
                                borderRadius: "var(--radio-completo)",
                                border: "1px solid rgba(255,255,255,0.5)",
                              }}
                            >
                              Código
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="info-proyecto">
                      <div className="nombre-proyecto">{p.nombre}</div>
                      <div className="tipo-proyecto">{p.categoria}</div>
                      {p.descripcionCorta && (
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--texto-suave)",
                            marginTop: 4,
                            lineHeight: 1.5,
                          }}
                        >
                          {p.descripcionCorta}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    key={p.slug}
                    className="proyecto-vacio"
                    data-categoria={p.categoriaSlug}
                    onClick={() =>
                      mostrarNotificacion(
                        "Proyecto en camino — pronto disponible",
                      )
                    }
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    {p.nombre}
                  </div>
                ),
              )
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CONTACTO — con formulario real
      ════════════════════════════════════════════════════ */}
      <section
        id="pagina-contacto"
        className={`pagina${paginaActiva === "contacto" ? " activa" : ""}`}
      >
        <div className="seccion" style={{ paddingTop: "calc(64px + 20px)" }}>
          <h2 className="titulo-seccion">
            <span className="punto" /> Contacto
          </h2>

          <svg
            width="100%"
            height="44"
            viewBox="0 0 300 44"
            preserveAspectRatio="none"
            style={{ marginBottom: "var(--espacio-l)", display: "block" }}
          >
            <defs>
              <linearGradient id="gradOnda" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--acento-1)" />
                <stop offset="50%" stopColor="var(--acento-2)" />
                <stop offset="100%" stopColor="var(--acento-3)" />
              </linearGradient>
            </defs>
            <path
              d="M0 22 Q50 6 100 22 T200 22 T300 22"
              fill="none"
              stroke="url(#gradOnda)"
              strokeWidth="2.5"
              opacity="0.6"
            />
            <path
              d="M0 32 Q75 18 150 32 T300 32"
              fill="none"
              stroke="url(#gradOnda)"
              strokeWidth="1.5"
              opacity="0.25"
            />
          </svg>

          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--texto-secundario)",
              marginBottom: "var(--espacio-l)",
              lineHeight: 1.8,
            }}
          >
            ¿Tienes un proyecto en mente o buscas un desarrollador comprometido?
            Estoy disponible para{" "}
            <strong>
              colaboraciones, proyectos freelance y oportunidades laborales
            </strong>
            . No dudes en escribirme.
          </p>

          {/* Tarjetas de contacto desde DB */}
          <div className="cuadricula-contacto">
            {contactos.map((c) => (
              <a
                key={c.tipo}
                href={c.url ?? "#"}
                className="tarjeta-contacto"
                target={
                  ["github", "linkedin", "whatsapp"].includes(c.tipo)
                    ? "_blank"
                    : undefined
                }
                rel={
                  ["github", "linkedin", "whatsapp"].includes(c.tipo)
                    ? "noopener"
                    : undefined
                }
                onClick={(e) => ripple(e as React.MouseEvent<HTMLElement>)}
              >
                <div className="icono-contacto">
                  <IconoContactoTipo tipo={c.tipo} />
                </div>
                <span>{c.etiqueta}</span>
                <span className="valor-contacto">{c.valor}</span>
              </a>
            ))}
          </div>

          {/* Formulario de contacto — guarda en DB */}
          <div style={{ marginTop: "var(--espacio-l)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
              Envíame un mensaje
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--texto-suave)" }}>
              Respondo en menos de 24 horas.
            </p>
            <FormularioContacto />
          </div>
        </div>
      </section>

      {/* ── PIE ─────────────────────────────────────────────── */}
      <footer id="pie-pagina">
        <span
          className="texto-degradado"
          style={{ fontFamily: "var(--fuente-mono)", fontSize: "0.75rem" }}
        >
          {nombreCompleto}
        </span>
        <br />
        <span>
          {datosProp.ciudad}, {datosProp.pais} · {new Date().getFullYear()}
        </span>
      </footer>

      {/* ── BARRA INFERIOR ──────────────────────────────────── */}
      <nav id="barra-inferior">
        {NAV_ITEMS.map(({ id, label, Ico }) => (
          <button
            key={id}
            className={`elemento-nav${paginaActiva === id ? " activo" : ""}`}
            aria-label={label}
            onClick={(e) => {
              ripple(e);
              irAPagina(id);
            }}
          >
            <Ico />
            {label}
          </button>
        ))}
      </nav>

      {/* ── TOAST ───────────────────────────────────────────── */}
      <div className={`notificacion${notifVisible ? " visible" : ""}`}>
        <IcoInfo /> {notifMsg}
      </div>
    </>
  );
}
