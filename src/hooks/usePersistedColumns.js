import { useState, useEffect } from "react"

export function usePersistedColumns({ storageKey, defaultColumns = [] }) {
    const [visibleColumns, setVisibleColumns] = useState(() => {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) return parsed
            }
        } catch (e) {
            console.warn("Error leyendo columnas persistidas:", e)
        }
        return defaultColumns
    })

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(visibleColumns))
        } catch (e) {
            console.warn("Error guardando columnas persistidas:", e)
        }
    }, [storageKey, visibleColumns])

    const toggleColumn = (col, allColumns = []) => {
        setVisibleColumns(prev => {
            const newCols = prev.includes(col)
                ? prev.filter(c => c !== col)
                : [...prev, col]
            // Mantener orden según allColumns si se pasa
            return allColumns.length ? allColumns.filter(c => newCols.includes(c)) : newCols
        })
    }

    return { visibleColumns, setVisibleColumns, toggleColumn }
}
