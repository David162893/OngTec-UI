import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./LoginPage.module.scss"
import useLogin from "@/hooks/useAuth"
import ButtonComponent from "@/components/Button/ButtonComponent"
import { useAuth } from "@/context/AuthContext"
import ModalComponent from "@/components/Modal/ModalComponent"

export default function LoginModal({ open, onClose }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const { mutate: loginMutate, loading, error: loginError } = useLogin()
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
        if (!email || !password) return

        try {
            const data = await loginMutate(email, password)

            if (data.user) {
                const rolNombre = data.user.rol?.name?.toUpperCase() || ""
                const userRole = (rolNombre === "ADMINISTRADOR" || rolNombre === "ADMIN")
                    ? "ADMINISTRADOR"
                    : "VOLUNTARIO"

                login({
                    userData: data.user,
                    token: data.token,
                    role: userRole,
                    userType: rolNombre,
                })

                handleClose()
                navigate(location.state?.from?.pathname || "/profile", { replace: true })
            }
        } catch { }
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
                {(error || loginError) && <p className={styles.loginError}>{error || loginError}</p>}

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
                    <ButtonComponent type="submit" variant="primary" className={styles.formButton} disabled={loading || !email || !password}>
                        {loading ? "Entrando..." : "Entrar"}
                    </ButtonComponent>
                </form>
            </div>
        </ModalComponent>

    )
}