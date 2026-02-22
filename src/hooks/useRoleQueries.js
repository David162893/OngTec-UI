import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { RoleService } from "@/services/RoleService"
import { handleError } from "@/utils/errorHandler"

export function useGetRoles() {
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchRoles = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await RoleService.getAll()
                setRoles(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setRoles([])
            } finally {
                setLoading(false)
            }
        }

        fetchRoles()

        return () => controller.abort()

    }, [])

    return { data: roles, loading, error }
}