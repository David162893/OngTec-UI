import { useState, useEffect, useMemo } from "react"
import ButtonComponent from "../Button/ButtonComponent"
import ModalComponent from "../Modal/ModalComponent"
import { usePersistedColumns } from "@/hooks/usePersistedColumns"
import styles from "./TableComponent.module.scss"

export default function TableComponent({ data = [], hiddenColumns = [], className, onEdit, onDelete, pos, max, ...props }) {
    const [showColumnSelector, setShowColumnSelector] = useState(false)

    // Construir estructura recursiva de columnas
    const buildStructure = (obj, parentKey = "") => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const fullPath = parentKey ? `${parentKey}.${key}` : key
            const isArray = Array.isArray(value)
            const isObject = typeof value === "object" && value !== null && !isArray

            // Solo expandir arrays si contienen objetos, no primitivos
            const shouldExpandArray = isArray && value.length > 0 && typeof value[0] === "object"

            acc[key] = {
                path: fullPath,
                children: shouldExpandArray ? buildStructure(value[0], fullPath) :
                    isObject ? buildStructure(value, fullPath) : null
            }
            return acc
        }, {})
    }

    // Estructura global combinada
    const globalStructure = useMemo(() => {
        const merge = (target, source) => {
            Object.keys(source).forEach(key => {
                if (!target[key]) target[key] = source[key]
                else if (source[key].children) {
                    target[key].children = target[key].children || {}
                    merge(target[key].children, source[key].children)
                }
            })
        }
        const combined = {}
        data.forEach(item => merge(combined, buildStructure(item)))
        return combined
    }, [data])

    // Estadísticas de nodos (profundidad y ancho)
    const getStats = (node) => {
        if (!node.children || !Object.keys(node.children).length) return { depth: 1, width: 1 }
        const stats = Object.values(node.children).map(getStats)
        return {
            depth: Math.max(...stats.map(s => s.depth)) + 1,
            width: stats.reduce((sum, s) => sum + s.width, 0)
        }
    }

    const maxHeaderDepth = useMemo(() =>
        Math.max(...Object.values(globalStructure).map(node => getStats(node).depth), 0)
        , [globalStructure])

    // Columnas hoja (finales)
    const leafColumns = useMemo(() => {
        const leaves = []
        const hiddenSet = new Set(hiddenColumns.map(c => c.toLowerCase()))
        const findLeaves = (structure) => {
            Object.values(structure).forEach(node => {
                if (!node.children) {
                    const lastKey = node.path.split('.').pop().toLowerCase()
                    if (!hiddenSet.has(lastKey)) {
                        leaves.push(node.path)
                    }
                } else {
                    findLeaves(node.children)
                }
            })
        }
        findLeaves(globalStructure)
        return leaves
    }, [globalStructure, hiddenColumns])

    const { visibleColumns, toggleColumn } = usePersistedColumns({
        storageKey: "ongtec_table_columns",
        defaultColumns: leafColumns
    })

    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && showColumnSelector && setShowColumnSelector(false)
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [showColumnSelector])

    // Obtener valor por path
    const getValueByPath = (obj, path) =>
        path.split('.').reduce((acc, part) => {
            if (!acc) return acc
            // Si es array de objetos, aplicar recursivamente
            if (Array.isArray(acc) && acc.length > 0 && typeof acc[0] === "object") {
                return acc.map(item => item[part])
            }
            return acc[part]
        }, obj)

    const renderCellValue = (value) => {
        if (value == null) return "-"
        if (Array.isArray(value)) return value.join(", ")
        if (typeof value === "object") return JSON.stringify(value)
        return String(value)
    }

    const getLeafPaths = (node) =>
        !node.children ? [node.path] : Object.values(node.children).flatMap(getLeafPaths)

    // Generar filas del header
    const headerRows = useMemo(() => {
        const rows = Array.from({ length: maxHeaderDepth }, () => [])
        const fillRows = (structure, level) => {
            Object.entries(structure).forEach(([key, node]) => {
                const childLeaves = getLeafPaths(node)
                if (!childLeaves.some(leaf => visibleColumns.includes(leaf))) return
                const width = childLeaves.filter(leaf => visibleColumns.includes(leaf)).length
                const isLeaf = !node.children || !Object.keys(node.children).length
                rows[level].push({
                    label: key,
                    path: node.path,
                    colSpan: width,
                    rowSpan: isLeaf ? maxHeaderDepth - level : 1,
                    isLeaf
                })
                if (node.children) fillRows(node.children, level + 1)
            })
        }
        fillRows(globalStructure, 0)
        return rows
    }, [globalStructure, maxHeaderDepth, visibleColumns])

    if (!data.length) return <p className={styles.noDataMessage}>No hay datos disponibles.</p>

    return (
        <>
            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <table className={`${styles.table} ${className || ""}`.trim()} {...props}>
                        <thead>
                            {headerRows.map((row, i) => (
                                <tr key={i}>
                                    {row.map(cell => (
                                        <th
                                            key={cell.path}
                                            colSpan={cell.colSpan}
                                            rowSpan={cell.rowSpan}
                                            className={!cell.isLeaf ? styles.nestedHeader : ""}
                                        >
                                            {cell.label}
                                        </th>
                                    ))}
                                    {i === 0 && (
                                        <th rowSpan={maxHeaderDepth} className={styles.actionsHeader}>
                                            <ButtonComponent variant="tableToggle" onClick={() => setShowColumnSelector(true)}>
                                                ⚙️
                                            </ButtonComponent>
                                        </th>
                                    )}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {visibleColumns.map(path => (
                                        <td key={path}>{renderCellValue(getValueByPath(row, path))}</td>
                                    ))}
                                    <td className={styles.actionsCell}>
                                        <ButtonComponent variant="tableAction" onClick={() => onEdit?.(row, rowIndex)}>
                                            Editar
                                        </ButtonComponent>
                                        <ButtonComponent variant="tableAction" onClick={() => onDelete?.(row, rowIndex)}>
                                            Eliminar
                                        </ButtonComponent>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {typeof pos === 'number' && typeof max === 'number' && (
                        <>
                            {props.loadMore && (
                                <ButtonComponent variant="tableLoadMore" onClick={() => props.loadMore(pos + 10)} className={styles.floatingButtonLoadMore}>
                                    Cargar más
                                </ButtonComponent>
                            )}
                            {props.reset && (
                                <ButtonComponent variant="tableReset" onClick={() => props.reset(0)} className={styles.floatingButtonStart}>
                                    Inicio
                                </ButtonComponent>
                            )}
                            {props.doBefore && (
                                <ButtonComponent variant="tableBefore" onClick={() => props.doBefore(pos)} className={styles.floatingButton}>
                                    Cargar menos
                                </ButtonComponent>
                            )}
                            {props.doNext && (
                                <ButtonComponent variant="tableNext" onClick={() => props.doNext(pos + 10)} className={styles.floatingButtonReset}>
                                    Cargar más
                                </ButtonComponent>
                            )}
                        </>
                    )}
                </div>
            </div>

            <ModalComponent
                open={showColumnSelector}
                onClose={() => setShowColumnSelector(false)}
                title="Configurar columnas"
            >
                <div className={styles.columnSelectorBody}>
                    {leafColumns.map(col => (
                        <label key={col} className={styles.columnOption}>
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(col)}
                                onChange={() => toggleColumn(col, leafColumns)}
                            />
                            <span>{col.replace(/\./g, ' > ')}</span>
                        </label>
                    ))}
                </div>
            </ModalComponent>
        </>
    )
}