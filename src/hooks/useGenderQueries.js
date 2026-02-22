import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { GenderService } from "@/services/GenderService"
import { handleError } from "@/utils/errorHandler"

export function useGetGenders() {
    const [genders, setGenders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchGenders = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await GenderService.getAll()
                setGenders(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setGenders([])
            } finally {
                setLoading(false)
            }
        }

        fetchGenders()

        return () => controller.abort()

    }, [])

    return { data: genders, loading, error }
}