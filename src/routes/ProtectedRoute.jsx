import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, role } = useAuth()
    const location = useLocation()

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/"
                state={{ from: location, reason: "not-authenticated" }}
                replace
            />
        )
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return (
            <Navigate
                to="/"
                state={{ from: location, reason: "not-authorized" }}
                replace
            />
        )
    }


    return children
}

export default ProtectedRoute
