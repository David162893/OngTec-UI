import { API_BASE } from "../utils/Paths"

export const RoleService = {
    async getAll() {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const token = localStorage.getItem("authToken")

            const res = await fetch(`${API_BASE}/roles`, {
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
                const err = new Error(errorData.message || "Error al obtener los roles")
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