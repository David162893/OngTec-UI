import { useState } from "react"
import { toast } from "react-toastify"
import { ProfileService } from "@/services/ProfileService"
import { handleError } from "@/utils/errorHandler"

export function useUpdateProfile() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const mutate = async (data) => {
        try {
            setLoading(true)
            setError(null)
            const result = await ProfileService.update(data)
            toast.success("Perfil actualizado correctamente")
            return result
        } catch (err) {
            const message = handleError(err)
            setError(message)
            toast.error(message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { mutate, loading, error }
}