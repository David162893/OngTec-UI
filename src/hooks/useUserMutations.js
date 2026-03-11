import { useState } from "react"
import { toast } from "react-toastify"
import { UserService } from "@/services/UserService"
import { handleError } from "@/utils/errorHandler"

export default function useUserMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createUser = async (userData) => {
        try {
            setLoading(true)
            setError(null)
            const data = await UserService.create(userData)
            toast.success("Usuario creado correctamente")
            return data
        } catch (err) {
            const message = handleError(err)
            setError(message)
            toast.error(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const updateUser = async (userData) => {
        const body = JSON.stringify(userData)
        console.log("Body enviado:", body)
        try {
            setLoading(true)
            setError(null)
            const data = await UserService.update(userData)
            toast.success("Usuario actualizado correctamente")
            return data
        } catch (err) {
            const message = handleError(err)
            setError(message)
            toast.error(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (userId) => {
        try {
            setLoading(true)
            setError(null)
            await UserService.delete(userId)
            toast.success("Usuario eliminado correctamente")
        } catch (err) {
            const message = handleError(err)
            setError(message)
            toast.error(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    return { createUser, updateUser, deleteUser, loading, error }
}