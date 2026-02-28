# 📖 Guía de Uso del Panel de Administración

## 🔐 Acceso al Panel

### 1. Acceder al Login
- URL: `http://localhost:3000/admin/login`
- Esta ruta está oculta y NO aparece en el menú público
- Credenciales por defecto:
  - Usuario: `admin`
  - Contraseña: `admin123`

### 2. Navegación
Una vez autenticado, serás redirigido al Dashboard donde verás:
- Estadísticas generales
- Accesos rápidos a todas las secciones
- Actividad reciente

## 📊 Secciones del Panel

### 🏠 Dashboard
Página principal con:
- Resumen de estadísticas (proyectos, habilidades, experiencias)
- Accesos rápidos a cada sección
- Log de actividad reciente

### 👤 Propietario
Gestiona tu información personal:
- **Datos básicos**: Nombres, apellidos, iniciales
- **Ubicación**: Ciudad, departamento, país
- **Perfil profesional**: Descripción de tu experiencia
- **Imagen de perfil**: Sube tu foto
- **CV**: Adjunta tu currículum en PDF
- **Tema y apariencia**: Elige colores y modo oscuro/claro

**Cómo editar**:
1. Ir a "Propietario" en el menú lateral
2. Click en "Editar"
3. Modificar los campos deseados
4. Guardar cambios

### 📧 Contactos
Administra tus datos de contacto:
- **Tipos disponibles**: Teléfono, WhatsApp, Email, GitHub, LinkedIn, Instagram, Facebook, YouTube, Sitio Web, Otro
- **Campos**: Tipo, Etiqueta, Valor, URL, Principal, Orden
- **Características**:
  - Marcar contactos como principales
  - Ordenar por preferencia
  - Activar/desactivar contactos

**Ejemplo de uso**:
```
Tipo: WhatsApp
Etiqueta: WhatsApp Personal
Valor: +591 74096880
URL: https://wa.me/59174096880
Principal: Sí
Orden: 1
Activo: Sí
```

### 🎓 Formación Académica
Gestiona tu historial educativo:

#### Instituciones Educativas
- Crear universidades, institutos, etc.
- Campos: Nombre, Siglas, Tipo, Ciudad, País, Sitio Web

#### Formación
- **Asociar**: Vincular con instituciones
- **Campos**: Título, Mención, Facultad, Nivel, Años (inicio/fin), Estado
- **Niveles**: Básico, Técnico Básico/Auxiliar/Medio, Licenciatura, Egresado, Titulado, Maestría, Doctorado, Curso, Certificación
- **Estados**: Cursando, Egresado, Titulado, Abandonado

**Flujo**:
1. Crear institución (si no existe)
2. Crear formación académica
3. Asociar con institución
4. Completar datos

### 💼 Experiencia Laboral
Administra tu historial profesional:

#### Empresas
- Crear empresas/organizaciones
- Campos: Nombre, Tipo, Sector, Ciudad, País, Sitio Web, Logo

#### Experiencias
- **Asociar**: Vincular con empresas
- **Campos**: Cargo, Tipo de contrato, Fechas (inicio/fin), Trabajo actual
- **Tipos de contrato**: Pasantía, Tiempo completo, Medio tiempo, Freelance, Voluntariado

#### Tareas por Experiencia
- Agregar lista de responsabilidades y logros
- Ordenar por relevancia
- Editar/eliminar individualmente

**Ejemplo**:
```
Empresa: Red F10
Cargo: Pasante de Redes Sociales
Tipo: Pasantía
Fecha inicio: 28/08/2024
Fecha fin: 28/11/2024
Tareas:
  1. Gestión de redes sociales
  2. Administración de YouTube
  3. Publicación en WordPress
```

### 💡 Habilidades
Gestiona tus skills técnicas:

#### Categorías de Habilidades
- Crear categorías (ej: Desarrollo Web, Diseño, CMS)
- Ordenar por relevancia

#### Habilidades
- **Asociar**: Vincular con categorías
- **Campos**: 
  - Nombre y slug único
  - Nivel en porcentaje (0-100)
  - Nivel en texto (Básico, Intermedio, Avanzado, Experto)
  - Color primario (hex)
  - Descripción detallada
- **Visualización**: Se muestran con barras de progreso en el portafolio

**Tips**:
- Usa colores distintivos para cada habilidad
- El porcentaje debe reflejar tu nivel real
- La descripción ayuda a contextualizar la habilidad

### 📁 Proyectos
Showcase de tu portafolio:

#### Categorías de Proyectos
- Predefinidas: Todos, Web, App, Juegos, Otros
- Crear nuevas categorías según necesites

#### Proyectos
- **Campos principales**:
  - Nombre y slug único
  - Descripción corta y larga
  - Imagen principal
  - URLs (demo y repositorio)
  - Estado (En desarrollo, Completado, Pausado, Mantenimiento, Cancelado)
  - Destacado (aparece primero)
  - Publicado (visible/oculto)

#### Tecnologías del Proyecto
- Asociar habilidades usadas en cada proyecto
- Se mostrarán como badges en el portafolio

**Flujo completo**:
1. Crear proyecto
2. Subir imagen representativa
3. Agregar descripción detallada
4. Asociar tecnologías utilizadas
5. Agregar URLs de demo y repo
6. Marcar como publicado

### 📊 Estadísticas
Métricas destacadas en el home:
- **Campos**: Etiqueta, Valor, Sufijo
- **Ejemplos**:
  - "AÑOS EXP." → "3" → "+"
  - "PROYECTOS" → "12" → ""
  - "CLIENTES" → "8" → "+"
- Se muestran con animación en el portafolio

### 🎨 Temas de Color
Personaliza la paleta visual:
- **5 temas predefinidos**: Violeta, Cielo, Esmeralda, Amanecer, Rosa
- **Campos por tema**:
  - 3 colores de acento
  - Colores de gradiente (inicio y fin)
- Cambiar tema activo desde la configuración del propietario

### ⚙️ Configuración
Ajustes generales:
- Navegación del sitio
- Orden de secciones
- Activar/desactivar secciones
- IDs HTML para anclaje

## 🔄 Operaciones CRUD

Todas las secciones siguen el mismo patrón:

### ➕ Crear
1. Click en botón "Agregar Nuevo" o "+"
2. Completar formulario en modal
3. Click en "Guardar"
4. Confirmación de éxito

### ✏️ Editar
1. Click en el registro que deseas editar
2. Modificar campos en el modal
3. Click en "Guardar Cambios"
4. Confirmación de éxito

### 🗑️ Eliminar
1. Click en el ícono de eliminar (papelera)
2. Confirmar acción en diálogo
3. Confirmación de eliminación

### 👁️ Ver Detalles
1. Click en cualquier fila de la tabla
2. Modal con información completa
3. Opción de editar desde allí

## 💡 Tips y Mejores Prácticas

### Slugs
- Deben ser únicos
- Usar minúsculas
- Separar con guiones
- Ejemplo: `proyecto-web-01`, `html5`, `desarrollo`

### Ordenamiento
- Los números de orden determinan la posición
- Menor número = aparece primero
- Actualizar orden si reorganizas

### Imágenes
- Formatos recomendados: JPG, PNG, WebP
- Tamaño máximo: 5MB
- Resoluciones óptimas:
  - Foto perfil: 400x400px
  - Proyecto: 1200x630px (16:9)
  - Logo empresa: 300x300px

### SEO
- Usar descripciones claras y descriptivas
- Slugs legibles y descriptivos
- Completar todos los campos opcionales
- Mantener contenido actualizado

### Seguridad
- Cambiar credenciales por defecto
- No compartir acceso al admin
- Cerrar sesión al terminar
- Usar contraseñas fuertes

## 🆘 Solución de Problemas

### No puedo guardar cambios
- Verificar que todos los campos requeridos están completos
- Revisar que los slugs son únicos
- Verificar conexión a internet/DB

### Imágenes no se cargan
- Verificar tamaño de archivo
- Verificar formato de imagen
- Comprobar permisos de la carpeta /public

### Cambios no se reflejan en el portafolio
- Refrescar la página del portafolio (F5)
- Limpiar caché del navegador
- Verificar que el registro está marcado como "activo/publicado"

### Error al eliminar
- Verificar que no hay relaciones dependientes
- Algunos registros no se pueden eliminar si están siendo usados
- Revisar consola del navegador para más detalles

## 📱 Responsive Design

El panel admin está optimizado para:
- 💻 Desktop (recomendado)
- 📱 Tablet
- 📱 Móvil (funcionalidad limitada)

Para mejor experiencia, usar en desktop con resolución mínima de 1280x720px.

## 🔄 Actualizaciones Futuras

Funcionalidades planificadas:
- [ ] Subida de archivos integrada
- [ ] Editor WYSIWYG para descripciones
- [ ] Analíticas y métricas
- [ ] Exportación de datos
- [ ] Múltiples usuarios admin
- [ ] Logs de auditoría
- [ ] Papelera de reciclaje
- [ ] Búsqueda y filtros avanzados

---

¿Preguntas? Contacta a neileynerc@gmail.com
