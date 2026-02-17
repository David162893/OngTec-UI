import { API_BASE } from "../utils/Paths"

export const LocalidadService = {
    async getAll() {
        try {

            const token = localStorage.getItem("authToken")

            const res = await fetch(`${API_BASE}/localidades`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.message || `Error: ${res.status}`)
            }

            return await res.json()

        } catch (error) {
            console.error("Error en getAll Localidades:", error)
            throw error
        }
    }
}
