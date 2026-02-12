import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./LoginPage.module.scss"
import LoginService from "../../services/LoginService"
import ButtonComponent from "../../components/Button/ButtonComponent"
import { useAuth } from "../../context/AuthContext"
import useClickOutside from "../../hooks/useClickOutside"

export default function LoginModal({ open, onClose }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const reason = location.state?.reason
    const { login } = useAuth()
    const modalRef = useRef(null)

    const handleClose = () => {
        onClose && onClose()
        navigate(location.pathname, { replace: true, state: {} })
    }

    useClickOutside(modalRef, handleClose)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") handleClose()
        }

        if (open) {
            window.addEventListener("keydown", handleKeyDown)
        }

        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open])

    useEffect(() => {
        if (!open) {
            setEmail("")
            setPassword("")
            setError(null)
        }
    }, [open])

    if (!open) return null

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
                let userRole = "VOLUNTARIO"

                if (rolNombre === "ADMINISTRADOR" || rolNombre === "ADMIN") {
                    userRole = "ADMINISTRADOR"
                }

                login({
                    userData: data.user,
                    token: data.token,
                    role: userRole,
                    userType: rolNombre,
                })

                const redirectTo = location.state?.from?.pathname || "/"
                onClose && onClose()
                navigate(redirectTo, { replace: true })

            } else {
                throw new Error("Respuesta del servidor inesperada")
            }
        } catch (err) {
            setError(err.message || "Error al iniciar sesión")
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <button
                    aria-label="Cerrar"
                    className={styles.closeButton}
                    onClick={handleClose}
                >
                    ×
                </button>

                <div className={styles.loginCard}>
                    <h2 className={styles.loginTitle}>Iniciar sesión</h2>
                    {reason === "not-authorized" && (
                        <p className={styles.loginWarning}>
                            No tienes acceso a este contenido. Inicia sesión con una cuenta autorizada.
                        </p>
                    )}

                    {reason === "not-authenticated" && (
                        <p className={styles.loginWarning}>
                            Inicia sesión para acceder al contenido.
                        </p>
                    )}

                    {error && <p className={styles.loginError}>{error}</p>}

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <div className={styles.formField}>
                            <label htmlFor="email" className={styles.formLabel}>
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={styles.formInput}
                                placeholder="tucorreo@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formField}>
                            <label htmlFor="password" className={styles.formLabel}>
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={styles.formInput}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <ButtonComponent type="submit" variant="primary" className={styles.formButton} disabled={!email || !password}>
                            Entrar
                        </ButtonComponent>
                    </form>
                </div>
            </div>
        </div>
    )
}