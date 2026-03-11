# 🎯 OngTec - Sistema de Gestión Integral para ONGs

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)](https://github.com/tu-usuario/OngTec)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg?style=for-the-badge)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18%2B-61dafb.svg?style=for-the-badge)](https://react.dev)

---

## 📋 Descripción

**OngTec** es una plataforma web moderna y escalable diseñada para centralizar y optimizar la gestión administrativa de organizaciones no gubernamentales (ONGs). Proporciona herramientas intuitivas para administrar usuarios, voluntarios, tareas y otras funciones operativas clave.

Actualmente en fase de desarrollo activo con funcionalidades base implementadas y una hoja de ruta ambiciosa para nuevas características.

### 🎯 Público Objetivo
- **ONGs y organizaciones sin ánimo de lucro**
- **Personal administrativo**
- **Coordinadores de voluntarios**
- **Cualquier organización que necesite gestión centralizada**

---

## ✨ Características Principales

### Funcionalidades Implementadas ✅
- ✔️ **Gestión de Usuarios** - Creación, edición y administración de perfiles
- ✔️ **Autenticación Segura** - Sistema de login con contexto Auth
- ✔️ **Panel de Tareas** - Visualización y seguimiento de tareas
- ✔️ **Componentes Reutilizables** - Biblioteca de componentes React modulares
- ✔️ **Interfaz Responsiva** - Diseño adaptable a cualquier dispositivo

### 🚀 Funcionalidades Planeadas
- Gestión avanzada de voluntarios y horarios
- Sistema de reportes y analytics
- Notificaciones y alertas en tiempo real
- Sistema de roles y permisos granular
- Exportación de datos (PDF, Excel)
- Calendario de eventos y actividades

> ⚠️ **Nota:** El proyecto está en desarrollo activo. Nuevas funcionalidades se añaden regularmente.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Propósito |
|-----------|----------|
| **React 18+** | Biblioteca UI moderna |
| **Vite** | Build tool ultrarrápido |
| **JavaScript/JSX** | Lenguaje principal |
| **SCSS/Sass** | Estilización avanzada |

### Herramientas Adicionales
- **Sass-embedded** - Compilador Sass mejorado
- **Toastify** - Notificaciones para el usuario
- **Node.js** - Entorno de desarrollo
- **ESLint** - Linter de código
- **npm/yarn** - Gestor de dependencias

---

## 🚀 Instalación y Uso

### 📋 Requisitos Previos
- **Node.js** v18+ ([Descargar](https://nodejs.org))
- **npm** v9+ o **yarn** v3+ (incluido con Node.js)
- **Git** (para clonar repositorio)

### 📥 Pasos de Instalación

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/David162893/OngTec.git
cd OngTec
```

#### 2. Instalar Dependencias
```bash
npm install
# o si prefieres yarn
yarn install
```

#### 3. Ejecutar en Modo Desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173` (puerto por defecto de Vite).

### 📦 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint

# Ejecutar tests (si están configurados)
npm run test
```

---

## 📁 Estructura del Proyecto

```
OngTec/
├── public/                 # Archivos estáticos (favicon, imágenes)
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Button/
│   │   ├── DrumRoll/
│   │   ├── FormDate/
│   │   ├── FormInput/
│   │   ├── FormModal/
│   │   ├── FormSelect/
│   │   ├── Header/
│   │   ├── Modal/
│   │   ├── PdfView/
│   │   ├── Table/
│   │   ├── ToastToggle/
│   │   └── CoudinaryUpload.jsx
│   ├── context/            # Context API para estado global
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js/
│   │   ├── useAutoSize.js
│   │   ├── useCloseModal.js
│   │   ├── useCountryQueries.js
│   │   ├── useDrumRoll.js
│   │   ├── useGenderQueries.js
│   │   ├── useHideOnScroll.js
│   │   ├── useInfiniteScroll.js
│   │   ├── useKeyboardShortcut.js
│   │   ├── useLocalidadQueries.js
│   │   ├── usePersistedColumns.js
│   │   ├── useProfileMutations.js
│   │   ├── useProfileQueries.js
│   │   ├── useRegionQueries.js
│   │   ├── useRequirementsQueries.js
│   │   ├── useRoleQueries
│   │   ├── useStatusQueries.js
│   │   ├── useTaskMutations.js
│   │   ├── useTaskTypeQueries.js
│   │   ├── useToast.js
│   │   ├── useUserMutations.js
│   │   ├── useUserQueries.js
│   │   └── useValidation.js
│   ├── layout/            # Layouts reutilizables
│   ├── pages/              # Componentes de página
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── NotFound/
│   │   ├── OwnTasks/
│   │   ├── Profile/
│   │   ├── Register/
│   │   ├── Tasks/
│   │   ├── Users/
│   │   └── RegisterPage.jsx
│   ├── routes/             # Configuración de rutas
│   │   ├── BreadcrumbLabels.js
│   │   ├── LinkByRole.js
│   │   └── ProtectedRoute.jsx
│   ├── services/           # Servicios de API
│   ├── styles/             # SCSS global y variables
│   ├── utils/              # Funciones utilitarias
│   ├── websocket/          # Configuración WebSocket
│   ├── assets/             # Imágenes, fuentes, etc.
│   ├── App.jsx             # Componente raíz
│   └── main.jsx            # Punto de entrada
├── eslint.config.js        # Configuración ESLint
├── vite.config.js          # Configuración Vite
├── package.json            # Dependencias del proyecto
├── LICENSE                 # Licencia del proyecto
├── TODO                    # Tareas pendientes por realizar
└── README.md               # Este archivo

```

---

## 🔐 Autenticación y Seguridad

OngTec implementa un sistema de autenticación robusto:

- **Context API** para gestión centralizada del estado de autenticación
- **Protección de rutas** basada en roles de usuario
- **Tokens seguros** para mantener sesiones
- Funcionalidad de login y registro para usuarios nuevos

---

## 🎨 Componentes Principales

### Componentes Disponibles
- **Button** 
Componente de botón reutilizable con soporte para múltiples variantes visuales. Acepta estilos dinámicos mediante props y permite clases CSS adicionales para personalización. Pasa propiedades nativas de HTML button para máxima flexibilidad.

- **DrumRoll**
Componente selector tipo "drum roll" (carrusel vertical) con interacción táctil, rueda de ratón y teclado. Permite seleccionar valores de una lista con efecto visual de escala y opacidad. Incluye gestión de click externo para cerrar, soporte para deshabilitado y label flotante.

- **FormDate**
Componente de entrada de fecha con tres selectores drum roll (día, mes, año). Valida automáticamente días según el mes seleccionado, bloquea campos dependientes y soporta rangos de años personalizables. Retorna un objeto con estructura { day, month, year }

- **FormInput**
Componente de entrada de texto con validación integrada para email, teléfono y contraseña. Soporta auto-dimensionamiento dinámico, mensajes de error contextuales y estados deshabilitados. Genera IDs únicos automáticamente si no se proporciona nombre.

- **FormModal**
Componente de modal con formulario dinámico que genera campos automáticamente según la estructura de datos inicial. Soporta múltiples tipos de entrada (texto, número, fecha, select, multiselect, checkbox), objetos anidados y arrays. Incluye validación, manejo de hooks personalizados para opciones y orden de campos configurable.

- **FormSelect**
Componente de select con búsqueda filtrable integrada. Calcula posición dinámica del dropdown respecto a la ventana, soporta navegación por teclado y cierre al hacer click fuera. Genera IDs únicos automáticamente.

- **Header**
Componente de encabezado con navegación dinámica según rol de usuario. Incluye dropdown de perfil con opciones contextuales, oculta automáticamente al hacer scroll, y muestra sección hero para usuarios no autenticados. Integra autenticación y redirecciones basadas en permisos.

- **Modal**
Componente de diálogo modal renderizado con Portal fuera de la jerarquía del DOM. Soporta cierre con tecla Escape y click fuera mediante hook unificado. Incluye encabezado con título y botón de cierre, cuerpo flexible para cualquier contenido.

- **PdfView**
Componente de visualización de PDF basado en react-pdf. Genera documentos dinámicos con estructura configurable (título, secciones, items). Renderiza PDFs en un visor embebido con dimensiones personalizables. Código actualmente comentado, requiere instalación de dependencias @react-pdf/renderer.

- **Table**
Tabla de datos avanzada con encabezados jerárquicos, filtros dinámicos (texto, multiselect, rango de fechas), ordenamiento multi-columna y selector de columnas persistente. Soporta datos anidados, oculta columnas configurables y acciones por fila (editar y eliminar por ahora).

- **CoudinaryUpload**
Componente de carga de imágenes que obtiene credenciales firmadas del servidor backend y sube archivos a Cloudinary. Muestra preview de la imagen cargada y retorna URL segura. Gestiona autenticación de forma segura sin exponer credenciales en el cliente.


### Custom Hooks
- `useAuth`
Hook personalizado para autenticación que gestiona el estado de carga y errores durante el login. Ejecuta petición al servicio de autenticación, muestra notificación de éxito y maneja errores de forma centralizada.

- `useAutoSize`
Hook que ajusta dinámicamente el ancho de un input según el contenido del texto. Mide el texto usando canvas y respeta límites mínimo y máximo configurables. Retorna ref, ancho actual y handler onChange.

- `useCloseModal`
Hook personalizado que gestiona el cierre automático de modales mediante dos mecanismos: click fuera del elemento modal y presión de la tecla Escape. Añade listeners al documento solo cuando el modal está abierto y se encarga de limpiarlos al desmontar o cerrar, previniendo memory leaks y optimizando el rendimiento.

- `useCountryQueries`
Hook personalizado que obtiene la lista de países desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `useDrumRoll`
Hook personalizado que implementa la lógica de interacción para un selector tipo drum roll (carrusel vertical). Gestiona arrastre táctil/ratón con inercia, rueda de ratón, navegación por teclado y snapping automático a items. Incluye animaciones suaves, cancelación de peticiones y limpieza de recursos para evitar memory leaks.

- `useGenderQueries`
Hook personalizado que obtiene la lista de géneros desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `useHideOnScroll`
Hook personalizado que detecta la dirección del scroll y oculta elementos (como headers) cuando el usuario desplaza hacia abajo. Utiliza acumulación de delta para evitar cambios frecuentes y requiere un desplazamiento mínimo configurable antes de activarse. Retorna estado booleano de visibilidad.

- `useInfiniteScroll`
Hook personalizado que implementa scroll infinito usando IntersectionObserver. Coloca un elemento centinela invisible al final de la lista que detecta cuando el usuario se acerca, disparando la carga de más contenido automáticamente. Se detiene cuando no hay más datos o hay una petición en curso. Retorna referencia para el elemento centinela.

- `useKeyboardShortCut`
Sin implementar todavía

- `useLocalidadQueries`
Hook personalizado que obtiene la lista de localidades desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `usePersistedColumns`
Hook personalizado que gestiona la visibilidad de columnas en tablas con persistencia en localStorage. Mantiene un registro de columnas ocultas, permite alternar su visibilidad y sincroniza los cambios con almacenamiento local. Retorna columnas visibles, ocultas, función para alternar y setter manual.

- `useProfileMutations`
Hook personalizado para actualizar el perfil de usuario que gestiona carga y errores. Ejecuta petición al servicio de perfil, muestra notificaciones de éxito y error, y maneja excepciones de forma centralizada. Retorna función mutate, estado de carga y errores.

- `useProfileQueries`
Hook personalizado que obtiene el perfil de usuario desde localStorage. Parsea los datos almacenados de forma segura y retorna el perfil, estado de carga (siempre false) y errores (siempre null) ya que la lectura es síncrona.

- `useRegionQueries`
Hook personalizado que obtiene la lista de regiones desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `useRequirementsQueries`
Hook personalizado que obtiene la lista de requerimientos desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `useRoleQueries`
Hook personalizado que obtiene la lista de roles desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `useStatusQueries`
Hook personalizado que obtiene la lista de estados desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `useTaskMutations`
Hook personalizado que proporciona funciones para operaciones CRUD de tareas (crear, actualizar, eliminar). Gestiona carga y errores para cada operación, muestra notificaciones de éxito y error, y maneja excepciones centralizadamente. Retorna funciones mutate, estado de carga y errores.

- `useTaskQueries`
Hook personalizado que agrupa consultas de tareas: obtiene tareas de un usuario específico o la lista general con paginación. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna tareas, estado de carga y errores.

- `useTaskTypeQueries`
Hook personalizado que obtiene la lista de tipos de tareas desde el servicio backend al montar el componente. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna datos, estado de carga y errores.

- `useToast`
Hook personalizado que gestiona notificaciones con react-toastify integrado a un contexto. Permite alternar notificaciones globalmente y muestra mensajes solo si están habilitadas. Lanza error si se usa fuera del ToastProvider. Retorna estado de notificaciones, función toggle, y métodos notify y toast.

- `useUserMutations`
Hook personalizado que proporciona funciones para operaciones CRUD de usuarios (crear, actualizar, eliminar). Gestiona carga y errores para cada operación, muestra notificaciones de éxito y error, y maneja excepciones centralizadamente. Retorna funciones mutate, estado de carga y errores.

- `useUserQueries`
Hook personalizado que obtiene la lista de usuarios con paginación. Gestiona estados de carga, error y datos con soporte para cancelación de peticiones mediante AbortController. Muestra notificaciones de error y retorna usuarios, estado de carga y errores.

- `useValidation`
Hook personalizado que valida valores contra patrones regex configurables (email, teléfono, contraseña). Retorna estado booleano de validez que se actualiza automáticamente cuando cambian el valor o tipo. Considera campos vacíos como válidos.

---

## 🔄 Flujo de Datos

La aplicación utiliza:
- **Context API** para estado global (autenticación)
- **Custom Hooks** para lógica de negocio
- **Componentes funcionales** para máxima reutilizabilidad

```
Componente → Custom Hook → API Service → Backend
             ↓
           Context API (Estado Global)
```

---

## 📝 Contribución

¡Las contribuciones son bienvenidas! Quiero hacer OngTec mejor con tu ayuda.

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Directrices de Contribución
- Sigue las [convenciones de código](https://google.github.io/styleguide/jsguide.html)
- Asegúrate de que el linter pase (`npm run lint`)
- Documenta cambios significativos
- Crea issues para discutir cambios mayores **antes** de enviar PR

### Reportar Bugs
- Usa [GitHub Issues](https://github.com/David162893/OngTec/issues)
- Describe el problema con claridad
- Incluye pasos para reproducir
- Especifica tu entorno (SO, Node.js, navegador)

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** - consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

## 👤 Contacto

**David Rodríguez López**

- 📧 Email: [davidrolo2005@gmail.com](mailto:davidrolo2005@gmail.com)
- 🔗 LinkedIn: [David Rodríguez López](https://www.linkedin.com/in/david-rodr%C3%ADguez-l%C3%B3pez-37918630b/)
- 🐙 GitHub: [@David162893](https://github.com/David162893)

---

## 📊 Estado del Proyecto

- **Versión Actual:** 1.0.0
- **Estado:** 🟡 En desarrollo activo
- **Rama principal y en actual desarroyo:** `main`

---

## 🖼️ Capturas de Pantalla

*Captura de pantalla del panel de inicio*
![Dashboard](https://via.placeholder.com/1200x600?text=Dashboard+OngTec)

*Sistema de gestión de tareas*
![Tasks Management](https://via.placeholder.com/1200x600?text=Task+Management)

*Área de administración*
![Admin Panel](https://via.placeholder.com/1200x600?text=Admin+Panel)

---

## ❓ FAQ

**P: ¿OngTec es gratuito?**  
R: Sí, OngTec es un proyecto de código abierto bajo licencia MIT.

**P: ¿Necesito experiencia técnica para usar OngTec?**  
R: La interfaz está diseñada para ser intuitiva, pero recomiendo apoyo técnico para la instalación inicial.

**P: ¿Qué navegadores son soportados?**  
R: Chrome, Firefox, Safari y Edge versiones modernas (últimos 2 años).

**P: ¿Cómo reporto un bug?**  
R: Crea un issue en [GitHub Issues](https://github.com/David162893/OngTec/issues) con detalles claros.

---

**⭐ Si OngTec te resulta útil, considera dejar una estrella en GitHub**

---