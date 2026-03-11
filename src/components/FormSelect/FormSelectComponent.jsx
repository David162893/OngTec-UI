import { useId, useState, useRef, useEffect } from "react"
import styles from "./FormSelectComponent.module.scss"

export default function FormSelectComponent({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    placeholder = "Seleccione una opción"
}) {
    const generatedId = useId()
    const inputId = name || generatedId

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [dropdownStyle, setDropdownStyle] = useState({})
    const wrapperRef = useRef(null)
    const inputRef = useRef(null)

    const filteredOptions = (options || []).filter(o =>
        typeof o?.label === "string" && o.label.toLowerCase().includes(search.toLowerCase())
    )

    const handleOpen = () => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect()
            setDropdownStyle({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            })
        }
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
    }

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } })
        setOpen(false)
        setSearch("")
    }

    const handleClose = () => {
        setOpen(false)
        setSearch("")
    }

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                handleClose()
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    useEffect(() => {
        if (!open) return
        const recalc = () => {
            if (wrapperRef.current) {
                const rect = wrapperRef.current.getBoundingClientRect()
                setDropdownStyle({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                })
            }
        }
        window.addEventListener("scroll", recalc, true)
        window.addEventListener("resize", recalc)
        return () => {
            window.removeEventListener("scroll", recalc, true)
            window.removeEventListener("resize", recalc)
        }
    }, [open])

    const selectedLabel = options.find(o => o.value === value)?.label ?? ""

    return (
        <div className={styles.selectWrapper} ref={wrapperRef}>
            {label && <label htmlFor={inputId}>{label}</label>}

            <div
                className={`${styles.inputRow} ${open ? styles.open : ""}`}
                onClick={handleOpen}
            >
                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    className={styles.searchInput}
                    value={open ? search : selectedLabel}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={handleOpen}
                    placeholder={placeholder}
                    required={required}
                    autoComplete="off"
                />
                <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}>▾</span>
            </div>

            {open && (
                <ul
                    role="listbox"
                    className={styles.optionsList}
                    style={dropdownStyle}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={option.value === value}
                                onMouseDown={() => handleSelect(option.value)}
                                className={option.value === value ? styles.active : ""}
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <li className={styles.noOptions}>Sin resultados</li>
                    )}
                </ul>
            )}
        </div>
    )
}