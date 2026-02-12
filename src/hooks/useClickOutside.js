import { useEffect } from "react";

/**
 * Hook que ejecuta una función cuando se hace clic fuera del elemento referenciado.
 * @param {React.RefObject} ref - Referencia al elemento del modal (el recuadro blanco).
 * @param {Function} handler - Función que se ejecuta al hacer clic fuera (onClose).
 */
export default function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}