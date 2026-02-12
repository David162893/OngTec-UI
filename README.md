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
│   │   ├── Header/
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── CoudinaryUpload.jsx
│   ├── context/            # Context API para estado global
│   │   └── AuthContext.jsx
│   ├── hooks/              # Custom hooks
│   │   ├── useClickOutside.js
│   │   ├── useHideOnScroll.js
│   │   ├── usePersistedColumns.js
│   │   ├── useTaskMutations.js
│   │   ├── useTaskQueries.js
│   │   └── useUserTasks.js
│   ├── pages/              # Componentes de página
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Tasks/
│   │   └── RegisterPage.jsx
│   ├── layouts/            # Layouts reutilizables
│   ├── routes/             # Configuración de rutas
│   │   ├── BreadcrumbLabels.js
│   │   ├── LinkByRole.js
│   │   └── ...
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
- **Button** - Botones reutilizables con variantes
- **Header** - Encabezado navegable
- **Modal** - Diálogos modulares (en desarroyo)
- **Table** - Tablas de datos interactivas
- **CoudinaryUpload** - Carga de imágenes en la nube

### Custom Hooks
- `useHideOnScroll` - Ocultar/mostrar elementos al desplazarse
- `useClickOutside` - Detectar clicks fuera de elementos
- `usePersistedColumns` - Persistencia de columnas en tablas
- `useTaskMutations` - Mutaciones de tareas
- `useTaskQueries` - Consultas de tareas

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

¡Las contribuciones son bienvenidas! Queremos hacer OngTec mejor con tu ayuda.

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
- **Rama principaly en actual desarroyo:** `main`

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
R: La interfaz está diseñada para ser intuitiva, pero recomendamos apoyo técnico para la instalación inicial.

**P: ¿Qué navegadores son soportados?**  
R: Chrome, Firefox, Safari y Edge versiones modernas (últimos 2 años).

**P: ¿Cómo reporto un bug?**  
R: Crea un issue en [GitHub Issues](https://github.com/David162893/OngTec/issues) con detalles claros.

---

## 🙏 Agradecimientos

- A la comunidad de React y Vite
- A todos los contribuidores que ayudan a mejorar OngTec
- A las siguientes librerías que hacen posible este proyecto


---

**⭐ Si OngTec te resulta útil, considera dejar una estrella en GitHub**

---



---