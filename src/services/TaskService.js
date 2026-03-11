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

export const TaskService = {
    async getUserTasks(page, size) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/tasks/search${ page && size ? `?page=${page}&size=${size}` : ''}`, {
                method: "GET",
                headers: getAuthHeaders(),
                body: JSON.stringify({}),
                signal: controller.signal,
            })
            clearTimeout(timeoutId)
            return await handleResponse(res)
        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async getUserTasks(userId, page, size) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/user/${userId}/tasks${ page && size ? `?page=${page}&size=${size}` : ''}`, {
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

    async create(taskData) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/tasks`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(taskData),
                signal: controller.signal,
            })
            clearTimeout(timeoutId)
            return await handleResponse(res)
        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async update(taskData) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/task/update`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(taskData),
                signal: controller.signal,
            })
            clearTimeout(timeoutId)
            return await handleResponse(res)
        } catch (err) {
            clearTimeout(timeoutId)
            throw err
        }
    },

    async delete(taskId) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
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
}