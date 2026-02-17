import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { GenderService } from "@/services/GenderService"

export function useGetGenders() {

    const [genders, setGenders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetchGenders = async () => {
            try {
                setLoading(true)
                const data = await GenderService.getAll()
                toast.success("Géneros cargados correctamente")
                setGenders(data || [])
                setError(null)
            } catch (err) {
                toast.error("Error al cargar los géneros")
                setError(err)
                setGenders([])
            } finally {
                setLoading(false)
            }
        }

        fetchGenders()

    }, [])

    return { data: genders, loading, error }
}
