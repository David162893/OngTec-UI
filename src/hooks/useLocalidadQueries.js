import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { LocalidadService } from "@/services/LocalidadService"
import { handleError } from "@/utils/errorHandler"

export function useGetLocalidades() {
    const [localidades, setLocalidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchLocalidades = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await LocalidadService.getAll()
                setLocalidades(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setLocalidades([])
            } finally {
                setLoading(false)
            }
        }

        fetchLocalidades()

        return () => controller.abort()

    }, [])

    return { data: localidades, loading, error }
}