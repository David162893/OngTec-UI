import { useState } from "react"

export function useGetProfile() {
    const [profile] = useState(() => {
        try {
            const raw = localStorage.getItem("user")
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    })

    return { data: profile, loading: false, error: null }
}