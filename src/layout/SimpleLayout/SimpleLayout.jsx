import { Outlet, Link } from "react-router-dom"
import homeIcon from "@/assets/home.svg"
import styles from "./SimpleLayout.module.scss"

export default function SimpleLayout() {
    return (
        <>
            <div className={styles.home}>
                <Link to="/" className={styles.homeLink}>
                    <img src={homeIcon} alt="Inicio" />
                </Link>
            </div>

            <Outlet />
        </>
    )
}
