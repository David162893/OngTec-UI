import { API_BASE } from "../utils/Paths"

export const ProfileService = {

    async update(data) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const token = localStorage.getItem("authToken")

            const res = await fetch(`${API_BASE}/profile/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                const err = new Error(errorData.message || "Error al actualizar el perfil")
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