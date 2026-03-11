import { API_BASE } from "../utils/Paths"

export const LocalidadService = {
    async getAll(idRegion, controller) {
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const token = localStorage.getItem("authToken")

            const res = await fetch(`${API_BASE}/open/directions/locations/${idRegion}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                const err = new Error(errorData.message || "Error al obtener las localidades")
                err.status = res.status
                throw err
            }

            return await res.json()

        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    }
}