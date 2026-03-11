import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { LINKS_BY_ROLE } from "@/routes/LinkByRole"
import { useAuth } from "@/context/AuthContext"
import useHideOnScroll from "@/hooks/useHideOnScroll"
import ToastToggle from "@/components/ToastToggle/ToastToggle"
import styles from "./HeaderComponent.module.scss"
import homeIcon from "@/assets/home.svg"
import profileIcon from "@/assets/profile.svg"
import tasksIcon from "@/assets/tasks.svg"
import loginIcon from "@/assets/login.svg"
import logoutIcon from "@/assets/logout.svg"
import userIcon from "@/assets/profile.svg"
import registerIcon from "@/assets/profile.svg"

const LINK_ICONS = {
    "/": homeIcon,
    "/tasks": tasksIcon,
    "/login": loginIcon,
    "/own-tasks": tasksIcon,
    "/users": userIcon,
    "/register": registerIcon,
}

export default function HeaderComponent() {
    const navigate = useNavigate()
    const { role, isLoggedIn, logout, openLoginModal } = useAuth()
    const effectiveRole = role && LINKS_BY_ROLE[role] ? role : "GUEST"
    const links = LINKS_BY_ROLE[effectiveRole]
    const hidden = useHideOnScroll()

    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef(null)

    // Cerrar dropdown al click fuera
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    return (
        <header className={`${styles.header} ${hidden ? styles.hidden : ""}`}>
            <div className={styles.topBar}>

                {/* Logo */}
                <div className={styles.logo} onClick={() => navigate("/")}>
                    <span className={styles.logoText}>OngTec</span>
                </div>

                {/* Nav principal */}
                <nav>
                    <ul className={styles.navList}>
                        {links.map((link) => (
                            <li key={link.path} className={styles.navItem}>
                                {link.path === "/login" ? (
                                    <button className={styles.navBtn} onClick={openLoginModal}>
                                        <span className={styles.navBtnInner}>
                                            <img
                                                src={LINK_ICONS[link.path] ?? homeIcon}
                                                alt=""
                                                className={styles.navIcon}
                                            />
                                            <span className={styles.navLabel}>{link.name}</span>
                                        </span>
                                    </button>
                                ) : (
                                    <Link to={link.path} className={styles.navBtn}>
                                        <span className={styles.navBtnInner}>
                                            <img
                                                src={LINK_ICONS[link.path] ?? homeIcon}
                                                alt=""
                                                className={styles.navIcon}
                                            />
                                            <span className={styles.navLabel}>{link.name}</span>
                                        </span>
                                    </Link>
                                )}
                            </li>
                        ))}

                        {/* Perfil con dropdown */}
                        {isLoggedIn && (
                            <li className={styles.navItem} ref={profileRef}>
                                <button
                                    className={`${styles.profileBtn} ${profileOpen ? styles.profileBtnActive : ""}`}
                                    onClick={() => setProfileOpen(prev => !prev)}
                                    aria-expanded={profileOpen}
                                >
                                    <img src={profileIcon} alt="Perfil" className={styles.profileIcon} />
                                    <span className={styles.profileChevron}>
                                        {profileOpen ? "▲" : "▼"}
                                    </span>
                                </button>

                                {/* Dropdown */}
                                <div className={`${styles.dropdown} ${profileOpen ? styles.dropdownOpen : ""}`}>
                                    <div className={styles.dropdownHeader}>
                                        <img src={profileIcon} alt="" className={styles.dropdownAvatar} />
                                        <div className={styles.dropdownUserInfo}>
                                            <span className={styles.dropdownName}>Mi cuenta</span>
                                            <span className={styles.dropdownRole}>{role ?? "Usuario"}</span>
                                        </div>
                                    </div>

                                    <div className={styles.dropdownDivider} />

                                    <Link
                                        to="/profile"
                                        className={styles.dropdownItem}
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <img src={profileIcon} alt="" className={styles.dropdownItemIcon} />
                                        <span>Mi perfil</span>
                                    </Link>

                                    <Link
                                        to="/own-tasks"
                                        className={styles.dropdownItem}
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <img src={tasksIcon} alt="" className={styles.dropdownItemIcon} />
                                        <span>Mis tareas</span>
                                    </Link>

                                    <div className={styles.navItem}>
                                        <ToastToggle />
                                    </div>

                                    <div className={styles.dropdownDivider} />

                                    <button
                                        className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}
                                        onClick={() => { logout(); navigate("/"); setProfileOpen(false) }}
                                    >
                                        <img src={logoutIcon} alt="" className={styles.dropdownItemIcon} />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            {!isLoggedIn && (
                <section className={styles.hero}>
                    <h1>Bienvenido a OngTec</h1>
                    <p>Impulsando el cambio social a través de la innovación tecnológica.</p>
                </section>
            )}
        </header>
    )
}