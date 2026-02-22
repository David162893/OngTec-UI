import { useNavigate } from 'react-router-dom'
import styles from "./NotFoundPage.module.scss"
import ButtonComponent from "@/components/Button/ButtonComponent"
import logo from "@/assets/ongtec.svg"

export default function NotFound() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={logo} alt="Ongtec Logo" className={styles.logo} />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>La página que buscas no existe o ha sido movida.</p>
        <ButtonComponent type="button" variant="backBtn" onClick={handleBack}>
          ← Volver atrás
        </ButtonComponent>
      </div>
    </div>
  )
}