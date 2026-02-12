import { useEffect, useCallback } from "react"

/**
 * Hook para gestionar el cierre de modales por click externo y tecla Escape.
 * @param {Object} ref - Referencia del elemento (useRef).
 * @param {Function} onClose - Función que se ejecuta para cerrar.
 * @param {boolean} isOpen - Estado de visibilidad para activar/desactivar listeners.
 */
export default function useCloseModal(ref, onClose, isOpen) {
    
    const handleClose = useCallback(() => {
        if (onClose) onClose()
    }, [onClose])
    
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handleClose()
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [ref, handleClose, isOpen])
}