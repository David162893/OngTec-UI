import styles from "./HeaderComponent.module.scss"
import { useNavigate, useLocation } from "react-router-dom"
import ButtonComponent from "../Button/ButtonComponent"
import { LINKS_BY_ROLE } from "@/routes/LinkByRole"
import { BREADCRUMB_LABELS } from "@/routes/BreadcrumbLabels"
import { useAuth } from "@/context/AuthContext"
import useHideOnScroll from "@/hooks/useHideOnScroll"
import ToastToggle from "@/components/ToastToggle/ToastToggle";
import homeIcon from "@/assets/home.svg"

export default function HeaderComponent() {
    const navigate = useNavigate()
    const location = useLocation()
    const { role, isLoggedIn, logout, openLoginModal } = useAuth()
    const effectiveRole = role && LINKS_BY_ROLE[role] ? role : "GUEST"
    const links = LINKS_BY_ROLE[effectiveRole]
    const hidden = useHideOnScroll()
    const currentPath = location.pathname
    const pathName = BREADCRUMB_LABELS[currentPath] || currentPath.split("/").filter(Boolean)
        .map(str => str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(" / ")

    return (
        <header className={`${styles.header} ${hidden ? styles.hidden : ""}`}>
            <div className={styles.topBar}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.title} onClick={() => navigate("/")}>OngTec</h1>
                    {/* <div className={styles.breadcrumb}>
                        <img src={homeIcon} alt="Inicio" />
                        <span>/ {pathName}</span>
                    </div> */}
                </div>


                <nav>
                    <ul className={styles.headerList}>
                        {links.map((link) => (
                            <li key={link.path}>
                                <ButtonComponent
                                    type="button"
                                    variant="primaryLittle"
                                    onClick={() => {
                                        if (link.path === "/login") {
                                            openLoginModal()
                                        } else {
                                            navigate(link.path)
                                        }
                                    }}
                                >
                                    {link.name}
                                </ButtonComponent>
                            </li>
                        ))}
                        <ToastToggle />

                        {isLoggedIn && (
                            <li>
                                <ButtonComponent
                                    type="button"
                                    variant="logoutBtn"
                                    onClick={() => {
                                        logout()
                                        navigate("/")
                                    }}
                                >
                                    Salir
                                </ButtonComponent>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            {!isLoggedIn && (
                <section id="hero" className={styles.hero}>
                    <h1>Bienvenido a OngTec</h1>
                    <p>Impulsando el cambio social a través de la innovación tecnológica.</p>
                    <ButtonComponent type="button" variant="primary">Conoce nuestra misión</ButtonComponent>
                </section>
            )}
        </header>
    )
}
