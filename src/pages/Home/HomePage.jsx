import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import ButtonComponent from '@/components/Button/ButtonComponent'
import styles from './HomePage.module.scss';

export default function HomePage() {
    const location = useLocation()
    const { openLoginModal } = useAuth()
    const modalOpenedRef = useRef(false)

    useEffect(() => {
        if (location.state?.from && !modalOpenedRef.current) {
            openLoginModal()
            modalOpenedRef.current = true
        }
    }, [location, openLoginModal])

    return (
        <div className={styles.homepageContainer}>
            <main>
                <section id="about">
                    <h2>Nuestra Labor</h2>

                    <article>
                        <h3>Misión</h3>
                        <p>
                            Reducir la brecha digital en comunidades vulnerables mediante
                            soluciones técnicas sostenibles.
                        </p>
                    </article>

                    <article>
                        <h3>Visión</h3>
                        <p>
                            Un mundo donde la tecnología sea un derecho accesible para todos,
                            no un privilegio.
                        </p>
                    </article>
                </section>

                <section id="services">
                    <h2>Lo que hacemos</h2>

                    <ul>
                        <li>
                            <h3>Educación IT</h3>
                            <p>Capacitación en programación y herramientas digitales.</p>
                        </li>

                        <li>
                            <h3>Infraestructura</h3>
                            <p>Instalación de redes y equipos en zonas rurales.</p>
                        </li>

                        <li>
                            <h3>Software Social</h3>
                            <p>
                                Desarrollo de aplicaciones para mejorar la gestión de otras ONG.
                            </p>
                        </li>
                    </ul>
                </section>

                <section id="cta">
                    <h2>¿Quieres colaborar?</h2>
                    <p>Únete a nuestro equipo de voluntarios o realiza una donación.</p>

                    <ButtonComponent
                        type="button"
                        variant="primary-little"
                    >
                        Hazte Voluntario
                    </ButtonComponent>

                    <ButtonComponent
                        type="button"
                        variant="primary-little"
                    >
                        Donar ahora
                    </ButtonComponent>

                </section>
            </main>

            <footer>
                <div>
                    <p>&copy; 2026 OngTec - Tecnología para el bien común.</p>
                </div>

                <div>
                    <p>Contacto: info@ongtec.org</p>

                    <ul>
                        <li><a href="#facebook">Facebook</a></li>
                        <li><a href="#twitter">Twitter</a></li>
                        <li><a href="#linkedin">LinkedIn</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}
