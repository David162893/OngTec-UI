import { API_BASE } from "../utils/Paths"

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
})

const handleResponse = async (res) => {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const err = new Error(errorData.message || "Error en la solicitud")
        err.status = res.status
        throw err
    }

    const text = await res.text()
    if (!text) return null

    try {
        return JSON.parse(text)
    } catch {
        return null
    }
}

export const UserService = {

    async getUsers(page, size) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(
                `${API_BASE}/user/search${page && size ? `?page=${page}&size=${size}` : ""}`,
                {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({}),
                    signal: controller.signal,
                }
            )

            clearTimeout(timeoutId)
            return await handleResponse(res)

        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async getUserById(userId) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/user/${userId}`, {
                method: "GET",
                headers: getAuthHeaders(),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            return await handleResponse(res)

        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async create(userData) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/user`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(userData),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            return await handleResponse(res)

        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async update(userData) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/user/update`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(userData),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            return await handleResponse(res)

        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async delete(userId) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/user/${userId}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            return await handleResponse(res)

        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async createUser(userData) {
        try {

            const res = await fetch(`${API_BASE}/user`, {
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