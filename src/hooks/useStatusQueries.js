import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { StatusService } from "@/services/StatusService"
import { handleError } from "@/utils/errorHandler"

export function useGetStatuses() {

    const [statuses, setStatuses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        const fetchStatuses = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await StatusService.getAll(controller.signal)
                setStatuses(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setStatuses([])
            } finally {
                setLoading(false)
            }
        }
        fetchStatuses()
        return () => controller.abort()
    }, [])
    return { data: statuses, loading, error }
}