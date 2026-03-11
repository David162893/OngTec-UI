import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { TaskTypeService } from "@/services/TaskTypeService"
import { handleError } from "@/utils/errorHandler"

export function useGetTaskTypes() {

    const [taskTypes, setTaskTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        const fetchTaskTypes = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await TaskTypeService.getAll(controller.signal)
                setTaskTypes(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setTaskTypes([])
            } finally {
                setLoading(false)
            }
        }
        fetchTaskTypes()
        return () => controller.abort()
    }, [])
    return { data: taskTypes, loading, error }
}