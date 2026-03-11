import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { CountriesService } from "@/services/CountryService"
import { handleError } from "@/utils/errorHandler"

export function useGetCountries() {
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchLocalidades = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await CountriesService.getAll(controller.signal)
                setCountries(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setCountries([])
            } finally {
                setLoading(false)
            }
        }

        fetchLocalidades()

        return () => controller.abort()

    }, [])

    return { data: countries, loading, error }
}