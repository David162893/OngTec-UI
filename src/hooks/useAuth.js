import { useState } from "react"
import { toast } from "react-toastify"
import { LoginService } from "@/services/LoginService"
import { handleError } from "@/utils/errorHandler"

function useLogin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const mutate = async (email, password) => {
        try {
            setLoading(true)
            setError(null)
            const data = await LoginService.getLoginData(email, password)
            toast.success("Inicio de sesión exitoso")
            return data
        } catch (err) {
            const message = handleError(err)
            setError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { mutate, loading, error }
}

export default useLogin