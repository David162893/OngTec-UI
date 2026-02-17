import { API_BASE } from "../utils/Paths"

export const UserService = {
    async createUser(userData) {
        try {

            const res = await fetch(`${API_BASE}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(userData),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.message || `Error: ${res.status}`)
            }

            return await res.json()

        } catch (error) {
            console.error("Error en createUser:", error)
            throw error
        }
    }
}
