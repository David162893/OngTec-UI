import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { TaskService } from "@/services/TaskService"
import { handleError } from "@/utils/errorHandler"

export function useUserTasks(userId) {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const controller = new AbortController()

        const fetchTasks = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await TaskService.getUserTasks(userId)
                console.log("Tareas obtenidas:", data)
                setTasks(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setTasks([])
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()

        return () => controller.abort()

    }, [userId])

    return { tasks, loading, error }
}