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
    return res.json()
}

export const TaskService = {
    async getUserTasks(userId) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/user/${userId}/tasks`, {
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

    async update(taskId, taskData) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
            const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
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