import { API_LOGIN } from "../utils/Paths"

const LoginService = {
  async getLoginData(email, password) {
    const res = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Credenciales incorrectas")
      }
      if (res.status === 500) {
        throw new Error("Error del servidor. Por favor, inténtalo más tarde.")
      }
      throw new Error("Error en el inicio de sesión")
    }

    const data = await res.json()

    if (data.token) {
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      const rolNombre = data.user?.rol?.name?.toUpperCase()
      let userRole = "VOLUNTARIO"
      if (rolNombre === "ADMINISTRADOR" || rolNombre === "ADMIN") {
        userRole = "ADMIN"
      }
      localStorage.setItem("userRole", userRole)
    }

    return data
  },
}

export default LoginService