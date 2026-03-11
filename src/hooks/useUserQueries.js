import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { UserService } from "@/services/UserService"
import { handleError } from "@/utils/errorHandler"

export function useUsers(page, size) {
    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        const controller = new AbortController()

        const fetchUsers = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await UserService.getUsers(page, size)
                setUsers(data ?? [])
                console.log("Usuarios obtenidas:", data)
                setUsers(data || [])
            } catch (err) {
                if (err.name === "AbortError") return
                const message = handleError(err)
                setError(message)
                toast.error(message)
                setUsers([])
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()

        return () => controller.abort()

    }, [page, size])

    return { users, loading, error }
}