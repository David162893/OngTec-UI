import { useEffect, useState } from "react"
import { TasksService } from "@/services/TaskService"

export default function useUserTasks(userId) {

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
                setTasks(data || [])
                setError(null)
            } catch (err) {
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
