import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { LocalidadService } from "@/services/LocalidadService"

export function useGetLocalidades() {

    const [localidades, setLocalidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetchLocalidades = async () => {
            try {
                setLoading(true)
                const data = await LocalidadService.getAll()
                toast.success("Localidades cargadas correctamente")
                setLocalidades(data || [])
                setError(null)
            } catch (err) {
                toast.error("Error al cargar las localidades")
                setError(err)
                setLocalidades([])
            } finally {
                setLoading(false)
            }
        }

        fetchLocalidades()

    }, [])

    return { data: localidades, loading, error }
}
