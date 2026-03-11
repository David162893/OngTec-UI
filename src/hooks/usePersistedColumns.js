import { useState, useEffect } from "react"

export function usePersistedColumns({ storageKey, defaultColumns = [] }) {
    const [hiddenColumns, setHiddenColumns] = useState(() => {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) return parsed
            }
        } catch (e) {
            console.warn("Error leyendo columnas persistidas:", e)
        }
        return []
    })

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(hiddenColumns))
        } catch (e) {
            console.warn("Error guardando columnas persistidas:", e)
        }
    }, [storageKey, hiddenColumns])

    const toggleColumn = (col) => {
        setHiddenColumns(prev =>
            prev.includes(col)
                ? prev.filter(c => c !== col)
                : [...prev, col]
        )
    }

    const visibleColumns = defaultColumns.filter(c => !hiddenColumns.includes(c))

    return { visibleColumns, hiddenColumns, setHiddenColumns, toggleColumn }
}