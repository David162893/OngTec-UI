import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { RoleService } from "@/services/RoleService"

export function useGetRoles() {

    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetchRoles = async () => {
            try {
                setLoading(true)
                const data = await RoleService.getAll()
                toast.success("Roles cargados correctamente")
                setRoles(data || [])
                setError(null)
            } catch (err) {
                toast.error("Error al cargar los roles")
                setError(err)
                setRoles([])
            } finally {
                setLoading(false)
            }
        }

        fetchRoles()

    }, [])

    return { data: roles, loading, error }
}
