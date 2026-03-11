import {
    useEffect,
    useState
} from "react"
import {
    toast
} from "react-toastify"
import {
    RegionService
} from "@/services/RegionService"
import {
    handleError
} from "@/utils/errorHandler"

export function useGetRegion({
    idCountry
}) {
    const [region, setRegions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        if (!idCountry) {
            setRegions([])
            setLoading(false)
            return
        }

        const controller = new AbortController()

        const fetchRegions = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await RegionService.getAll(idCountry, controller.signal)
                setRegions(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setRegions([])
            } finally {
                setLoading(false)
            }
        }

        fetchRegions()

        return () => controller.abort()

    }, [idCountry])

    return {
        data: region,
        loading,
        error
    }
}