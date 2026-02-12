import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./LoginPage.module.scss"
import LoginService from "@/services/LoginService"
import ButtonComponent from "@/components/Button/ButtonComponent"
import { useAuth } from "@/context/AuthContext"
import ModalComponent from "@/components/Modal/ModalComponent"

export default function LoginModal({ open, onClose }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()
    const reason = location.state?.reason

    const handleClose = () => {
        onClose?.()
        navigate(location.pathname, { replace: true, state: {} })
    }

    useEffect(() => {
        if (!open) {
            setEmail("")
            setPassword("")
            setError(null)
        }
    }, [open])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            setError("Introduce tu correo y contraseña")
            return
        }

        try {
            setError(null)
            const data = await LoginService.getLoginData(email, password)

            if (data.user) {
                const rolNombre = data.user.rol?.name?.toUpperCase() || ""
                let userRole = (rolNombre === "ADMINISTRADOR" || rolNombre === "ADMIN")
                    ? "ADMINISTRADOR"
                    : "VOLUNTARIO"

                login({
                    userData: data.user,
                    token: data.token,
                    role: userRole,
                    userType: rolNombre,
                })

                const redirectTo = location.state?.from?.pathname || "/"
                handleClose()
                navigate(redirectTo, { replace: true })
            }
        } catch (err) {
            setError(err.message || "Error al iniciar sesión")
        }
    }

    return (
        <ModalComponent
            open={open}
            onClose={handleClose}
            title="Iniciar sesión"
        >
            <div className={styles.loginCard}>
                {reason === "not-authorized" && (
                    <p className={styles.loginWarning}>No tienes acceso...</p>
                )}
                {reason === "not-authenticated" && (
                    <p className={styles.loginWarning}>Inicia sesión...</p>
                )}
                {error && <p className={styles.loginError}>{error}</p>}

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                        <label htmlFor="email" className={styles.formLabel}>Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.formInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="password" className={styles.formLabel}>Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.formInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <ButtonComponent type="submit" variant="primary" className={styles.formButton} disabled={!email || !password}>
                        Entrar
                    </ButtonComponent>
                </form>
            </div>
        </ModalComponent>

    )
}