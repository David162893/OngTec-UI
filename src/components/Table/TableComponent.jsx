import { useState, useEffect, useMemo } from "react"
import ButtonComponent from "../Button/ButtonComponent"
import ModalComponent from "../Modal/ModalComponent"
import { usePersistedColumns } from "@/hooks/usePersistedColumns"
import styles from "./TableComponent.module.scss"

export default function TableComponent({ data = [], className, onEdit, onDelete, pos, max, ...props }) {
    console.log("TableComponent renderizado con data:", data)
    const [showColumnSelector, setShowColumnSelector] = useState(false)

    // --- Construir estructura recursiva de columnas (soporta objetos anidados) ---
    const buildStructure = (obj, parentKey = "") => {
        const structure = {}

        Object.keys(obj).forEach(key => {
            const fullPath = parentKey ? `${parentKey}.${key}` : key
            const value = obj[key]

            if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
                structure[key] = {
                    path: fullPath,
                    children: buildStructure(value[0], fullPath)
                }
            }
            else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                structure[key] = {
                    path: fullPath,
                    children: buildStructure(value, fullPath)
                }
            }
            else {
                structure[key] = { path: fullPath, children: null }
            }
        })

        return structure
    }

    // --- Combinar estructura de todas las filas para obtener la estructura global ---
    const globalStructure = useMemo(() => {
        const combined = {}
        const merge = (target, source) => {
            Object.keys(source).forEach(key => {
                if (!target[key]) target[key] = source[key]
                else if (source[key].children) {
                    target[key].children = target[key].children || {}
                    merge(target[key].children, source[key].children)
                }
            })
        }
        data.forEach(item => merge(combined, buildStructure(item)))
        return combined
    }, [data])

    // --- Calcular profundidad máxima de headers (para rowspan) ---
    const getStats = (node) => {
        if (!node.children || Object.keys(node.children).length === 0) return { depth: 1, width: 1 }
        let width = 0
        let maxChildDepth = 0
        Object.values(node.children).forEach(child => {
            const stats = getStats(child)
            width += stats.width
            maxChildDepth = Math.max(maxChildDepth, stats.depth)
        })
        return { depth: maxChildDepth + 1, width }
    }

    const maxHeaderDepth = useMemo(() => {
        let max = 0
        Object.values(globalStructure).forEach(node => {
            max = Math.max(max, getStats(node).depth)
        })
        return max
    }, [globalStructure])

    // --- Obtener rutas de todas las hojas (columnas finales) ---
    const leafColumns = useMemo(() => {
        const leaves = []
        const findLeaves = (structure) => {
            Object.values(structure).forEach(node => {
                if (!node.children) leaves.push(node.path)
                else findLeaves(node.children)
            })
        }
        findLeaves(globalStructure)
        return leaves
    }, [globalStructure])

    // --- Hook para columnas visibles persistidas ---
    const { visibleColumns, toggleColumn } = usePersistedColumns({
        storageKey: "ongtec_table_columns",
        defaultColumns: leafColumns
    })

    // --- Cerrar selector de columnas al pulsar ESC ---
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && showColumnSelector) setShowColumnSelector(false)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [showColumnSelector])

    // --- Función auxiliar para obtener valor de celda según path ---
    const getValueByPath = (obj, path) => {
        return path.split('.').reduce((acc, part) => {
            if (!acc) return acc

            // Si es array, aplicar a todos los elementos
            if (Array.isArray(acc)) {
                return acc.map(item => item[part])
            }

            return acc[part]
        }, obj)
    }


    const renderCellValue = (value) => {
        if (value === null || value === undefined) return "-"

        if (Array.isArray(value))
            return value.join(", ")


        if (typeof value === "object")
            return JSON.stringify(value)


        return String(value)
    }


    const getLeafPaths = (node) => !node.children ? [node.path] : Object.values(node.children).flatMap(getLeafPaths)

    // --- Generar filas del <thead> respetando columnas visibles ---
    const headerRows = useMemo(() => {
        const rows = Array.from({ length: maxHeaderDepth }, () => [])

        const fillRows = (structure, level) => {
            Object.entries(structure).forEach(([key, node]) => {
                const childLeaves = node.children ? Object.values(node.children).flatMap(getLeafPaths) : [node.path]
                // Ignorar nodos sin hojas visibles
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
                                            <ButtonComponent variant="tableToggle" onClick={() => setShowColumnSelector(true)}>⚙️</ButtonComponent>
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
                                        <ButtonComponent variant="tableAction" onClick={() => onEdit?.(row, rowIndex)}>Editar</ButtonComponent>
                                        <ButtonComponent variant="tableAction" onClick={() => onDelete?.(row, rowIndex)}>Eliminar</ButtonComponent>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {typeof pos === 'number' && typeof max === 'number' &&
                        (<>
                            {props.loadMore &&
                                <ButtonComponent variant="tableLoadMore" onClick={() => doLoadMore(pos + 10)} className={styles.floatingButtonLoadMore}>
                                    Cargar más
                                </ButtonComponent>
                            }
                            {props.reset &&
                                <ButtonComponent variant="tableReset" onClick={() => doReset(0)} className={styles.floatingButtonStart}>
                                    Inicio
                                </ButtonComponent>
                            }
                            {props.doBefore &&
                                <ButtonComponent variant="tableBefore" onClick={() => doBefore(pos)} className={styles.floatingButton}>
                                    Cargar menos
                                </ButtonComponent>
                            }
                            {props.doNext &&
                                <ButtonComponent variant="tableNext" onClick={() => doNext(pos + 10)} className={styles.floatingButtonReset}>
                                    Cargar más
                                </ButtonComponent>
                            }
                        </>)
                    }
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