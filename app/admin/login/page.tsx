'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaginaLoginAdmin() {
  const router = useRouter();
  const [usuario,         setUsuario]         = useState('');
  const [contrasena,      setContrasena]      = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando,        setCargando]        = useState(false);
  const [error,           setError]           = useState('');

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const respuesta = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nombreUsuario: usuario, contrasena }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(datos.error || 'Credenciales inválidas.');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.contenedor}>
        {/* Icono de candado */}
        <div style={estilos.iconoCandado}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1 style={estilos.titulo} className="texto-degradado">Panel Admin</h1>
        <p style={estilos.subtitulo}>Ingresa tus credenciales para continuar</p>

        <form onSubmit={manejarEnvio} style={estilos.formulario}>
          {/* Campo usuario */}
          <div>
            <label style={estilos.etiqueta}>Usuario</label>
            <div className="tarjeta-hundida" style={{ padding: 0 }}>
              <input
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                style={estilos.input}
              />
            </div>
          </div>

          {/* Campo contraseña */}
          <div style={{ position: 'relative' }}>
            <label style={estilos.etiqueta}>Contraseña</label>
            <div className="tarjeta-hundida" style={{ padding: 0 }}>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                style={{ ...estilos.input, paddingRight: 48 }}
              />
            </div>
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              style={estilos.botonOjo}
            >
              {mostrarPassword ? (
                // Ojo cerrado
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                // Ojo abierto
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div style={estilos.mensajeError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={cargando}
            className="boton-neu acento"
            style={{ width: '100%', justifyContent: 'center', opacity: cargando ? 0.7 : 1 }}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <a href="/" style={estilos.enlaceVolver}>← Volver al portafolio</a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ESTILOS INLINE — usan las variables CSS del globals.css
// ─────────────────────────────────────────────────────────
const estilos = {
  pagina: {
    minHeight:       '100vh',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         'var(--espacio-m)',
    background:      'var(--fondo)',
  } as React.CSSProperties,

  contenedor: {
    width:        '100%',
    maxWidth:     '420px',
    background:   'var(--superficie-vidrio)',
    backdropFilter: 'var(--desenfoque-vidrio)',
    border:       'var(--borde-vidrio)',
    borderRadius: 'var(--radio-grande)',
    boxShadow:    'var(--sombra-saliente-grande)',
    padding:      'var(--espacio-xl)',
    textAlign:    'center' as const,
  } as React.CSSProperties,

  iconoCandado: {
    width:           80,
    height:          80,
    borderRadius:    '50%',
    background:      'var(--degradado-principal)',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    margin:          '0 auto var(--espacio-m)',
    boxShadow:       'var(--sombra-saliente), 0 4px 20px rgba(124,111,239,0.35)',
  } as React.CSSProperties,

  titulo: {
    fontSize:     '1.8rem',
    fontWeight:   900,
    marginBottom: 'var(--espacio-xs)',
  } as React.CSSProperties,

  subtitulo: {
    fontSize:      '0.85rem',
    color:         'var(--texto-secundario)',
    marginBottom:  'var(--espacio-l)',
  } as React.CSSProperties,

  formulario: {
    display:       'flex',
    flexDirection: 'column' as const,
    gap:           'var(--espacio-m)',
    textAlign:     'left' as const,
  } as React.CSSProperties,

  etiqueta: {
    display:      'block',
    fontSize:     '0.78rem',
    fontWeight:   600,
    color:        'var(--texto-secundario)',
    marginBottom: 'var(--espacio-xs)',
  } as React.CSSProperties,

  input: {
    width:       '100%',
    background:  'transparent',
    border:      'none',
    outline:     'none',
    padding:     '14px 16px',
    fontSize:    '0.88rem',
    color:       'var(--texto-primario)',
    fontFamily:  'var(--fuente-titulo)',
    borderRadius: 'var(--radio-mediano)',
  } as React.CSSProperties,

  botonOjo: {
    position:  'absolute',
    right:     12,
    bottom:    10,
    background: 'transparent',
    border:    'none',
    cursor:    'pointer',
    color:     'var(--texto-suave)',
    display:   'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  mensajeError: {
    display:      'flex',
    alignItems:   'center',
    gap:          8,
    padding:      '10px 16px',
    borderRadius: 'var(--radio-mediano)',
    background:   'rgba(239,68,68,0.1)',
    color:        '#ef4444',
    fontSize:     '0.82rem',
  } as React.CSSProperties,

  enlaceVolver: {
    display:        'block',
    marginTop:      'var(--espacio-l)',
    fontSize:       '0.8rem',
    color:          'var(--texto-suave)',
    textDecoration: 'none',
  } as React.CSSProperties,
};