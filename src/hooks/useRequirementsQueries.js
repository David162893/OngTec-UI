import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { RequirementService } from "@/services/RequirementService"
import { handleError } from "@/utils/errorHandler"

export function useGetRequirements() {
    const [requirements, setRequirements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchRequirements = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await RequirementService.getAll(controller.signal)
                setRequirements(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setRequirements([])
            } finally {
                setLoading(false)
            }
        }

        fetchRequirements()

        return () => controller.abort()

    }, [])

    return { data: requirements, loading, error }
}