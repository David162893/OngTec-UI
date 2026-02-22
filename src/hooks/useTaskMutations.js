import { useState } from "react"
import { toast } from "react-toastify"
import { TaskService } from "@/services/TaskService"
import { handleError } from "@/utils/errorHandler"

export default function useTaskMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createTask = async (taskData) => {
        try {
            setLoading(true)
            setError(null)
            const data = await TaskService.create(taskData)
            toast.success("Tarea creada correctamente")
            return data
        } catch (err) {
            const message = handleError(err)
            setError(message)
            toast.error(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const updateTask = async (taskId, taskData) => {
        try {
            setLoading(true)
            setError(null)
            const data = await TaskService.update(taskId, taskData)
            toast.success("Tarea actualizada correctamente")
            return data
        } catch (err) {
            const message = handleError(err)
            setError(message)
            toast.error(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const deleteTask = async (taskId) => {
        try {
            setLoading(true)
            setError(null)
            await TaskService.delete(taskId)
            toast.success("Tarea eliminada correctamente")
        } catch (err) {
            const message = handleError(err)
            setError(message)
            toast.error(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    return { createTask, updateTask, deleteTask, loading, error }
}