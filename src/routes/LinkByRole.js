export const LINKS_BY_ROLE = {
  ADMINISTRADOR: [
    { name: "Inicio", path: "/" },
    { name: "Tareas", path: "/tasks" },
    { name: "Usuarios", path: "/users" }
  ],
  VOLUNTARIO: [
    { name: "Inicio", path: "/" },
    { name: "Mis Tareas", path: "/own-tasks" }
  ],
  GUEST: [
    { name: "Inicio", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Registro", path: "/register" }
  ]
}

export const BREADCRUMB_LABELS = {
  "/": "Inicio",
  "/own-tasks": "Mis Tareas",
  "/projects": "Proyectos",
  "/users": "Usuarios",
  "/settings": "Configuración"
}
