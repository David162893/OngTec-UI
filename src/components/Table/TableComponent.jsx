import { useState, useEffect, useMemo } from "react"
import ButtonComponent from "../Button/ButtonComponent"
import ModalComponent from "../Modal/ModalComponent"
import FormSelectComponent from "../FormSelect/FormSelectComponent"
import FormInputComponent from "../FormInput/FormImputComponent"
import FormDateComponent from "../FormDate/FormDateComponent"
import { usePersistedColumns } from "@/hooks/usePersistedColumns"
import styles from "./TableComponent.module.scss"
import arrowIcon from "@/assets/arrow.svg"
import trashIcon from "@/assets/trash.svg"

export default function TableComponent({
    data = [],
    hiddenColumns = [],
    columnLabels = {},
    columnFilterTypes = {},
    columnOrder = [],
    className,
    onEdit,
    onDelete,
    ...props
}) {
    const [showColumnSelector, setShowColumnSelector] = useState(false)
    const [activeFilters, setActiveFilters] = useState([])
    const [pendingCol, setPendingCol] = useState("")
    const [sortConfigs, setSortConfigs] = useState([])

    // Construir estructura recursiva de columnas
    const buildStructure = (obj, parentKey = "") => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const fullPath = parentKey ? `${parentKey}.${key}` : key
            const isArray = Array.isArray(value)
            const isObject = typeof value === "object" && value !== null && !isArray
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

        // Reordena según columnOrder
        if (!columnOrder.length) return combined

        const reorder = (structure, order) => {
            const topLevelKeys = order.map(path => path.split('.')[0])
            const reordered = {}

            // Primero los que están en order
            topLevelKeys.forEach(key => {
                if (structure[key]) reordered[key] = structure[key]
            })

            // Luego el resto
            Object.keys(structure).forEach(key => {
                if (!reordered[key]) reordered[key] = structure[key]
            })

            return reordered
        }

        return reorder(combined, columnOrder)
    }, [data, columnOrder])

    // Estadísticas de nodos
    const getStats = (node) => {
        if (!node.children || !Object.keys(node.children).length) return { depth: 1, width: 1 }
        const stats = Object.values(node.children).map(getStats)
        return {
            depth: Math.max(...stats.map(s => s.depth)) + 1,
            width: stats.reduce((sum, s) => sum + s.width, 0)
        }
    }

    const maxHeaderDepth = useMemo(() =>
        Object.values(globalStructure).length
            ? Math.max(...Object.values(globalStructure).map(node => getStats(node).depth), 0)
            : 1
        , [globalStructure])

    // Todas las columnas hoja SIN filtrar (para el modal)
    const allLeafColumns = useMemo(() => {
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

    // Columnas hoja filtrando hiddenColumns
    const leafColumns = useMemo(() => {
        const hiddenSet = new Set(hiddenColumns.map(c => c.toLowerCase()))
        const filtered = allLeafColumns.filter(path => {
            const lastKey = path.split('.').pop().toLowerCase()
            return !hiddenSet.has(lastKey)
        })

        if (!columnOrder.length) return filtered

        return [
            ...columnOrder.filter(col => filtered.includes(col)),
            ...filtered.filter(col => !columnOrder.includes(col))
        ]
    }, [allLeafColumns, hiddenColumns, columnOrder])

    const { visibleColumns, toggleColumn } = usePersistedColumns({
        storageKey: "ongtec_table_columns",
        defaultColumns: leafColumns
    })

    const getColumnLabel = (col) => {
        if (columnLabels[col]) return columnLabels[col]
        const lastKey = col.split('.').pop()
        if (columnLabels[lastKey]) return columnLabels[lastKey]
        const parentKey = col.split('.').slice(-2)[0]
        if (parentKey && columnLabels[parentKey]) return columnLabels[parentKey]
        return lastKey
    }

    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && showColumnSelector && setShowColumnSelector(false)
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [showColumnSelector])

    // Obtener valor por path
    const getValueByPath = (obj, path) =>
        path.split('.').reduce((acc, part) => {
            if (!acc) return acc
            if (Array.isArray(acc) && acc.length > 0 && typeof acc[0] === "object") {
                return acc.map(item => item[part])
            }
            return acc[part]
        }, obj)

    const renderCellValue = (value) => {
        if (value == null) return "-"
        if (Array.isArray(value)) return value.join(", ")
        if (typeof value === "object") return JSON.stringify(value)

        const str = String(value)
        // Limpia fechas ISO: "2000-12-11Z" → "2000-12-11", "2024-01-15T00:00:00Z" → "2024-01-15"
        if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
            return str.replace(/Z$/, "").split("T")[0]
        }

        return str
    }

    const getLeafPaths = (node) =>
        !node.children ? [node.path] : Object.values(node.children).flatMap(getLeafPaths)

    // Generar filas del header
    const headerRows = useMemo(() => {
        const rows = Array.from({ length: maxHeaderDepth }, () => [])

        const fillRows = (structure, level) => {
            Object.entries(structure).forEach(([key, node]) => {
                const childLeaves = getLeafPaths(node)
                const visibleLeaves = childLeaves.filter(leaf => visibleColumns.includes(leaf))
                if (visibleLeaves.length === 0) return

                const isLeaf = !node.children || !Object.keys(node.children).length
                const isCollapsed = !isLeaf && visibleLeaves.length === 1

                rows[level].push({
                    label: getColumnLabel(key),
                    path: node.path,
                    colSpan: visibleLeaves.length,
                    rowSpan: (isLeaf || isCollapsed) ? maxHeaderDepth - level : 1,
                    isLeaf: isLeaf || isCollapsed,
                    collapsedPath: isCollapsed ? visibleLeaves[0] : null
                })

                if (node.children && !isCollapsed) fillRows(node.children, level + 1)
            })
        }

        fillRows(globalStructure, 0)
        return rows
    }, [globalStructure, maxHeaderDepth, visibleColumns])

    // Filtros
    const filterOptions = useMemo(() =>
        leafColumns.map(col => ({
            value: col,
            label: getColumnLabel(col)
        }))
        , [leafColumns, columnLabels])

    const usedCols = useMemo(() => new Set(activeFilters.map(f => f.col)), [activeFilters])

    const removeFilter = (col) => {
        setActiveFilters(prev => prev.filter(f => f.col !== col))
    }

    function clearFilter(col) {
        const type = getFilterType(col)
        setActiveFilters(prev => prev.map(f => {
            if (f.col !== col) return f
            if (type === "text") return { ...f, value: "" }
            if (type === "multiselect") return { ...f, values: [] }
            if (type === "date") return { ...f, from: { day: "", month: "", year: "" }, to: { day: "", month: "", year: "" } }
            return f
        }))
    }

    // Filtrar datos localmente
    const filteredData = useMemo(() => {
        if (!activeFilters.length) return data
        return data.filter(row =>
            activeFilters.every(filter => {
                const cellValue = getValueByPath(row, filter.col)

                if (filter.type === "text") {
                    if (!filter.value.trim()) return true
                    return String(cellValue ?? "").toLowerCase().includes(filter.value.toLowerCase())
                }

                if (filter.type === "multiselect") {
                    if (!filter.values.length) return true
                    const strVal = Array.isArray(cellValue)
                        ? cellValue.map(String)
                        : [String(cellValue ?? "")]
                    return filter.values.some(v => strVal.includes(v))
                }

                if (filter.type === "date") {
                    const { from, to } = filter
                    const hasFrom = !!from.year
                    const hasTo = !!to.year
                    if (!hasFrom && !hasTo) return true

                    // Parsea la fecha de la celda
                    const raw = String(cellValue ?? "")
                    const parts = raw.split(/[-TZ]/).filter(Boolean)
                    if (parts.length < 1) return true
                    const cellYear = Number(parts[0])
                    const cellMonth = parts[1] ? Number(parts[1]) : null
                    const cellDay = parts[2] ? Number(parts[2]) : null

                    if (hasFrom) {
                        const fromYear = Number(from.year)
                        const fromMonth = from.month ? Number(from.month) : null
                        const fromDay = from.day ? Number(from.day) : null

                        // Comparar solo hasta el nivel de detalle que tenga el filtro
                        if (cellYear < fromYear) return false
                        if (cellYear === fromYear && fromMonth !== null) {
                            if (cellMonth === null || cellMonth < fromMonth) return false
                            if (cellMonth === fromMonth && fromDay !== null) {
                                if (cellDay === null || cellDay < fromDay) return false
                            }
                        }
                    }

                    if (hasTo) {
                        const toYear = Number(to.year)
                        const toMonth = to.month ? Number(to.month) : null
                        const toDay = to.day ? Number(to.day) : null

                        if (cellYear > toYear) return false
                        if (cellYear === toYear && toMonth !== null) {
                            if (cellMonth === null || cellMonth > toMonth) return false
                            if (cellMonth === toMonth && toDay !== null) {
                                if (cellDay === null || cellDay > toDay) return false
                            }
                        }
                    }

                    return true
                }

                return true
            })
        )
    }, [data, activeFilters])

    const uniqueValuesByCol = useMemo(() => {
        const map = {}
        leafColumns.forEach(col => {
            const lastKey = col.split('.').pop()
            const type = columnFilterTypes[col] ?? columnFilterTypes[lastKey]
            if (type !== "multiselect") return

            const vals = new Set()
            data.forEach(row => {
                const v = getValueByPath(row, col) // ✅ usa el path completo: "status.name"
                if (Array.isArray(v)) v.forEach(i => i != null && vals.add(String(i)))
                else if (v != null) vals.add(String(v))
            })
            map[col] = [...vals].sort()
        })
        return map
    }, [data, leafColumns, columnFilterTypes])

    const getFilterType = (col) => {
        const lastKey = col.split('.').pop()
        return columnFilterTypes[col] ?? columnFilterTypes[lastKey] ?? "text"
    }

    const addFilter = (col) => {
        if (!col || usedCols.has(col)) return
        const type = getFilterType(col)
        const base = { col, type }
        if (type === "text") setActiveFilters(prev => [...prev, { ...base, value: "" }])
        if (type === "multiselect") setActiveFilters(prev => [...prev, { ...base, values: [] }])
        if (type === "date") setActiveFilters(prev => [...prev, {
            ...base,
            from: { day: "", month: "", year: "" },
            to: { day: "", month: "", year: "" }
        }])
    }

    const updateFilter = (col, patch) => {
        setActiveFilters(prev => prev.map(f => f.col === col ? { ...f, ...patch } : f))
    }

    const addMultiselectValue = (col, val) => {
        setActiveFilters(prev => prev.map(f =>
            f.col === col && !f.values.includes(val)
                ? { ...f, values: [...f.values, val] }
                : f
        ))
    }

    const removeMultiselectValue = (col, val) => {
        setActiveFilters(prev => prev.map(f =>
            f.col === col ? { ...f, values: f.values.filter(v => v !== val) } : f
        ))
    }

    const { minYear, maxYear } = useMemo(() => {
        const dateCols = leafColumns.filter(col => {
            const lastKey = col.split('.').pop()
            return (columnFilterTypes[col] ?? columnFilterTypes[lastKey]) === "date"
        })

        const years = data.flatMap(row =>
            dateCols
                .map(col => getValueByPath(row, col))
                .filter(Boolean)
                .map(v => {
                    // Normaliza "2000-12-11Z" → "2000-12-11"
                    const cleaned = String(v).replace(/Z$/, "").split("T")[0]
                    const year = new Date(cleaned).getFullYear()
                    return isNaN(year) ? null : year
                })
                .filter(Boolean)
        )

        if (!years.length) return { minYear: undefined, maxYear: undefined }
        return {
            minYear: Math.min(...years),
            maxYear: Math.max(...years),
        }
    }, [data, leafColumns, columnFilterTypes])

    const handleSort = (col) => {
        setSortConfigs(prev => {
            const existing = prev.find(s => s.col === col)
            if (existing) {
                if (existing.dir === "asc") return prev.map(s => s.col === col ? { ...s, dir: "desc" } : s)
                return prev.filter(s => s.col !== col)
            }
            return [...prev, { col, dir: "asc" }]
        })
    }

    const sortedData = useMemo(() => {
        if (!sortConfigs.length) return filteredData
        return [...filteredData].sort((a, b) => {
            for (const { col, dir } of sortConfigs) {
                const valA = String(getValueByPath(a, col) ?? "").toLowerCase()
                const valB = String(getValueByPath(b, col) ?? "").toLowerCase()
                const isNum = !isNaN(valA) && !isNaN(valB)
                const a_ = isNum ? Number(valA) : valA
                const b_ = isNum ? Number(valB) : valB
                if (a_ < b_) return dir === "asc" ? -1 : 1
                if (a_ > b_) return dir === "asc" ? 1 : -1
            }
            return 0
        })
    }, [filteredData, sortConfigs])

    return (
        <>
            {/* Panel de filtros */}
            <div className={styles.filterPanel}>
                <div className={styles.filterHeader}>
                    <span className={styles.filterTitle}>Filtros</span>
                    <div className={styles.filterSelectWrapper}>
                        <FormSelectComponent
                            placeholder="＋ Añadir filtro..."
                            value={pendingCol}
                            onChange={e => {
                                const col = e.target.value
                                if (!col) return
                                setPendingCol("")
                                addFilter(col)
                            }}
                            options={filterOptions.filter(o => !usedCols.has(o.value))}
                        />
                    </div>
                </div>

                {activeFilters.length > 0 && (
                    <div className={styles.filterInputsRow}>
                        {activeFilters.map((filter) => (
                            <div key={filter.col} className={styles.filterChip}>
                                <div className={styles.filterChipHeader}>
                                    <div className={styles.filterChipLabel}>
                                        {getColumnLabel(filter.col)}
                                    </div>
                                    <button
                                        className={styles.filterClose}
                                        onClick={() => removeFilter(filter.col)}
                                        title="Cerrar filtro"
                                    >✕</button>
                                </div>
                                <div className={styles.filterChipBody}>

                                    {filter.type === "text" && (
                                        <FormInputComponent
                                            name={filter.col}
                                            value={filter.value}
                                            placeholder="Buscar..."
                                            onChange={e => updateFilter(filter.col, { value: e.target.value })}
                                        />
                                    )}

                                    {filter.type === "multiselect" && (
                                        <div className={styles.multiselectFilter}>
                                            <FormSelectComponent
                                                placeholder="Añadir .."
                                                value=""
                                                onChange={e => e.target.value && addMultiselectValue(filter.col, e.target.value)}
                                                options={(uniqueValuesByCol[filter.col] ?? [])
                                                    .filter(v => !filter.values.includes(v))
                                                    .map(v => ({ value: v, label: v }))}
                                            />
                                            {filter.values.length > 0 && (
                                                <div className={styles.multiselectChips}>
                                                    {filter.values.map(val => (
                                                        <span key={val} className={styles.multiselectChip}>
                                                            {val}
                                                            <button
                                                                className={styles.multiselectChipRemove}
                                                                onClick={() => removeMultiselectValue(filter.col, val)}
                                                            >✕</button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {filter.type === "date" && (
                                        <div className={styles.dateRangeFilter}>
                                            <span className={styles.dateRangeLabel}>Desde</span>
                                            <FormDateComponent
                                                name={`${filter.col}_from`}
                                                value={filter.from}
                                                onChange={e => updateFilter(filter.col, { from: e.target.value })}
                                                minYear={minYear}
                                                maxYear={maxYear}
                                            />
                                            <span className={styles.dateRangeLabel}>Hasta</span>
                                            <FormDateComponent
                                                name={`${filter.col}_to`}
                                                value={filter.to}
                                                onChange={e => updateFilter(filter.col, { to: e.target.value })}
                                                minYear={minYear}
                                                maxYear={maxYear}
                                            />
                                        </div>
                                    )}

                                    <button
                                        className={styles.filterRemove}
                                        onClick={() => clearFilter(filter.col)}
                                        title="Limpiar filtro"
                                    >
                                        <img src={trashIcon} alt="Limpiar" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeFilters.length === 0 && (
                    <span className={styles.filterEmpty}>
                        Sin filtros activos — selecciona una columna para filtrar
                    </span>
                )}
            </div>

            {/* Tabla */}
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
                                            className={[
                                                !cell.isLeaf ? styles.nestedHeader : "",
                                                cell.isLeaf ? styles.sortableHeader : ""
                                            ].join(" ")}
                                            onClick={cell.isLeaf ? () => handleSort(cell.collapsedPath ?? cell.path) : undefined}
                                        >
                                            <span className={styles.headerContent}>
                                                {cell.label}
                                                {cell.isLeaf && (() => {
                                                    const col = cell.collapsedPath ?? cell.path
                                                    const config = sortConfigs.find(s => s.col === col)
                                                    const index = sortConfigs.findIndex(s => s.col === col)
                                                    return (
                                                        <span className={styles.sortWrapper}>
                                                            <img
                                                                src={arrowIcon}
                                                                alt=""
                                                                className={[
                                                                    styles.sortIcon,
                                                                    config
                                                                        ? config.dir === "asc" ? styles.sortAsc : styles.sortDesc
                                                                        : styles.sortNeutral
                                                                ].join(" ")}
                                                            />
                                                            {config && sortConfigs.length > 1 && (
                                                                <span className={styles.sortBadge}>{index + 1}</span>
                                                            )}
                                                        </span>
                                                    )
                                                })()}
                                            </span>
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
                            {sortedData.length > 0 ? (
                                sortedData.map((row, rowIndex) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length + 1}
                                        className={styles.noDataMessage}
                                    >
                                        {data.length === 0
                                            ? "No hay datos disponibles."
                                            : "Ningún resultado coincide con los filtros activos."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal selector de columnas */}
            <ModalComponent
                open={showColumnSelector}
                onClose={() => setShowColumnSelector(false)}
                title="Configurar columnas"
                className={styles.columnSelectorModal}
            >
                <div className={styles.columnSelectorBody}>
                    {leafColumns.map(col => {
                        const lastKey = col.split('.').pop()
                        return (
                            <label key={col} className={styles.columnOption}>
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.includes(col)}
                                    onChange={() => toggleColumn(col, leafColumns)}
                                />
                                <span>{getColumnLabel(col)}</span>
                            </label>
                        )
                    })}
                </div>
            </ModalComponent>
        </>
    )
}