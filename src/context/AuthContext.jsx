import { createContext, useContext, useEffect, useState } from "react"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState("GUEST")
    const [token, setToken] = useState(null)
    const [showLoginModal, setShowLoginModal] = useState(false)

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken")
        const storedRole = localStorage.getItem("userRole")
        const storedUser = localStorage.getItem("user")

        if (storedToken) setToken(storedToken)
        if (storedRole) setRole(storedRole)
        if (storedUser) setUser(JSON.parse(storedUser))
    }, [])

    const login = ({ userData, token, role }) => {
        setUser(userData || null)
        setToken(token || null)
        setRole(role || "GUEST")

        token
            ? localStorage.setItem("authToken", token)
            : localStorage.removeItem("authToken")

        role
            ? localStorage.setItem("userRole", role)
            : localStorage.removeItem("userRole")

        userData
            ? localStorage.setItem("user", JSON.stringify(userData))
            : localStorage.removeItem("user")

        setShowLoginModal(false)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        setRole("GUEST")
        localStorage.clear()
    }

    const openLoginModal = () => setShowLoginModal(true)
    const closeLoginModal = () => setShowLoginModal(false)

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                token,
                isLoggedIn: !!token,
                login,
                logout,
                showLoginModal,
                openLoginModal,
                closeLoginModal
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
