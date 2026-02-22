export function handleError(err) {
    if (!navigator.onLine) {
        return "Sin conexión a internet. Comprueba tu red."
    }

    if (err.name === "AbortError") {
        return "El servidor no responde. Comprueba tu conexión e inténtalo más tarde."
    }

    if (err instanceof TypeError && /fetch|network|load failed/i.test(err.message)) {
        return "No se pudo conectar con el servidor. Inténtalo más tarde."
    }

    if (err.status || err.statusCode) {
        const status = err.status || err.statusCode
        const httpErrors = {
            400: "Solicitud incorrecta. Revisa los datos introducidos.",
            401: "No autorizado. Credenciales incorrectas o sesión expirada.",
            403: "No tienes permisos para realizar esta acción.",
            404: "El recurso solicitado no existe.",
            408: "La solicitud ha tardado demasiado. Inténtalo de nuevo.",
            409: "Conflicto con los datos existentes.",
            422: "Los datos enviados no son válidos.",
            429: "Demasiadas solicitudes. Espera un momento antes de continuar.",
            500: "Error interno del servidor. Inténtalo más tarde.",
            502: "El servidor no está disponible temporalmente.",
            503: "Servicio no disponible. Inténtalo más tarde.",
            504: "El servidor tardó demasiado en responder.",
        }
        return httpErrors[status] || `Error inesperado (${status}). Inténtalo más tarde.`
    }

    if (err.message) {
        return err.message
    }

    return "Ha ocurrido un error inesperado. Inténtalo más tarde."
}