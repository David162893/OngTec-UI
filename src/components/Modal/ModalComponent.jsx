import { useRef } from "react"
import { createPortal } from "react-dom"
import ButtonComponent from "@/components/Button/ButtonComponent"
import useCloseModal from "@/hooks/useCloseModal"
import styles from "./ModalComponent.module.scss"

export default function ModalComponent({ 
    open, 
    onClose, 
    title, 
    children, 
    className = "" 
}) {
    const modalRef = useRef(null)

    // Hook unificado para cerrar con Escape y Click fuera
    useCloseModal(modalRef, onClose, open)

    if (!open) return null

    // Usamos Portal para que el modal se renderice fuera de la jerarquía actual
    return createPortal(
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${className}`} ref={modalRef}>
                <div className={styles.modalHeader}>
                    {title && <h3 className={styles.modalTitle}>{title}</h3>}
                    <ButtonComponent 
                        variant="modalClose" 
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ✕
                    </ButtonComponent>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}