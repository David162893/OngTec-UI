import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { TasksService } from "@/services/TaskService"

export function useUserTasks(userId) {

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchTasks = async () => {
            try {
                setLoading(true)
                const data = await TasksService.getUserTasks(userId)
                toast.success("Tareas cargadas correctamente");
                setTasks(data || [])
                setError(null)
            } catch (err) {
                toast.error("Error al cargar las tareas del usuario");
                setError(err)
                setTasks([])
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [userId])

    return { tasks, loading, error }
}
