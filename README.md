# 🚀 Portafolio Profesional con Panel de Administración

## ✨ PROYECTO COMPLETADO Y CORREGIDO

Este es un portafolio profesional completo con diseño neumórfico mejorado y panel de administración en **ESPAÑOL**.

### ✅ Correcciones Realizadas

1. **Estructura de Archivos Corregida**
   - Paths ajustados correctamente: `@/*` apunta a la raíz del proyecto
   - Todos los componentes en español
   - Imports corregidos

2. **CSS Globals Mejorado**
   - Neomorfismo avanzado con múltiples variantes
   - Variables CSS personalizadas
   - Clases utilitarias en español
   - Efectos de hover, press, glow mejorados
   - Scrollbars personalizados
   - Animaciones fluidas

3. **Componentes en Español**
   - `Boton` (Button)
   - `Tarjeta` (Card)
   - `Input`
   - `AreaTexto` (TextArea)
   - `Selector` (Select)
   - `Modal`
   - `Tabla` (Table)

4. **Base de Datos y Auth en Español**
   - Esquema con nombres descriptivos
   - Funciones de autenticación en español
   - Middleware en español

## 🎨 Características del Diseño Neumórfico

- **Sombras múltiples** para efecto 3D realista
- **Estados interactivos**: hover, active, pressed
- **Modo oscuro/claro** con transición suave
- **Gradientes personalizados** por tema
- **Efectos de brillo** (glow effects)
- **Scrollbars personalizados**
- **Animaciones fluidas**

## 📦 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
psql -U postgres < base_datos_postgres.sql

# 3. Configurar variables de entorno (.env.local)
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/portafolio
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# 4. Iniciar desarrollo
npm run dev
```

## 🔐 Acceso

- **Portafolio**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Usuario: `admin`
  - Contraseña: `admin123`

## 📁 Estructura

```
portafolio-profesional/
├── app/
│   ├── globals.css              # CSS mejorado con neomorfismo
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Portafolio público
│   ├── admin/
│   │   ├── login/page.tsx       # Login oculto
│   │   └── dashboard/page.tsx   # Dashboard (crear)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       └── proyectos/route.ts
├── components/
│   └── ui/                      # Componentes en español
│       ├── Boton.tsx
│       ├── Tarjeta.tsx
│       ├── Input.tsx
│       ├── AreaTexto.tsx
│       ├── Selector.tsx
│       ├── Modal.tsx
│       └── Tabla.tsx
├── db/
│   ├── esquema.ts               # Schema en español
│   └── index.ts
├── lib/
│   └── auth.ts                  # Auth en español
├── middleware.ts                # Protección de rutas
├── tailwind.config.ts           # Config neomórfica mejorada
└── package.json
```

## 🎨 Uso del CSS Neomórfico

### Botones
```tsx
<button className="btn-neo">Botón Normal</button>
<button className="btn-neo-gradient">Botón con Gradiente</button>
```

### Tarjetas
```tsx
<div className="card-neo">Tarjeta Normal</div>
<div className="card-neo-hover">Tarjeta con Hover</div>
<div className="card-neo-inset">Tarjeta Hundida</div>
```

### Inputs
```tsx
<input className="input-neo" />
```

### Sombras
```tsx
<div className="shadow-neo">Sombra Normal</div>
<div className="shadow-neo-lg">Sombra Grande</div>
<div className="shadow-neo-inset">Sombra Interna</div>
```

### Elevaciones
```tsx
<div className="elevacion-1">Nivel 1</div>
<div className="elevacion-2">Nivel 2</div>
<div className="elevacion-3">Nivel 3</div>
<div className="elevacion-4">Nivel 4</div>
```

### Texto con Gradiente
```tsx
<h1 className="texto-gradiente">Texto con Gradiente</h1>
```

### Animaciones
```tsx
<div className="flotante">Flotando</div>
<div className="pulso-suave">Pulso Suave</div>
<div className="deslizar-arriba">Deslizar Arriba</div>
<div className="aparecer">Aparecer</div>
<div className="shimmer">Shimmer</div>
```

## 🛠️ Componentes UI

### Boton
```tsx
import Boton from '@/components/ui/Boton';

<Boton variante="primario" tamano="lg" cargando={false}>
  Click aquí
</Boton>
```

Variantes: `primario`, `secundario`, `peligro`, `exito`
Tamaños: `sm`, `md`, `lg`

### Tarjeta
```tsx
import Tarjeta from '@/components/ui/Tarjeta';

<Tarjeta hover>
  Contenido de la tarjeta
</Tarjeta>
```

### Input
```tsx
import Input from '@/components/ui/Input';

<Input
  etiqueta="Nombre"
  placeholder="Ingresa tu nombre"
  icono={<User />}
/>
```

### Modal
```tsx
import Modal from '@/components/ui/Modal';

<Modal
  abierto={abierto}
  alCerrar={() => setAbierto(false)}
  titulo="Título del Modal"
  tamano="lg"
>
  Contenido del modal
</Modal>
```

## 🎨 Temas de Color

El proyecto incluye 5 temas predefinidos:
- **Violeta** (por defecto)
- **Cielo**
- **Esmeralda**
- **Amanecer**
- **Rosa**

Cambiar tema en `tailwind.config.ts` y `globals.css`

## 🔒 Seguridad

### Para Producción:
1. Cambiar credenciales en `.env.local`
2. Usar secreto seguro para JWT
3. Implementar bcrypt para hash de contraseñas
4. Habilitar HTTPS
5. Configurar CORS apropiadamente

## 📝 Tareas Pendientes

- [ ] Crear página dashboard completa
- [ ] Crear rutas API para todas las entidades
- [ ] Implementar CRUD completo en UI
- [ ] Agregar validación de formularios
- [ ] Implementar subida de archivos
- [ ] Agregar tests

## 🐛 Solución de Problemas

### Error "Module not found"
- Verificar que `tsconfig.json` tiene `paths` configurado correctamente
- Ejecutar `npm install` de nuevo
- Limpiar caché: `rm -rf .next && npm run dev`

### Error de conexión a BD
- Verificar que PostgreSQL está corriendo
- Verificar `DATABASE_URL` en `.env.local`
- Ejecutar el script SQL: `psql -U postgres < base_datos_postgres.sql`

## 📞 Contacto

Neil Eyner Canaviri Huanca
- Email: neileynerc@gmail.com
- GitHub: [@NeilEyner](https://github.com/NeilEyner)

---

**¡Proyecto listo para desarrollo! 🎉**
