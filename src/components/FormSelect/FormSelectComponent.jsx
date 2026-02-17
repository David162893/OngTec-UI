import { useState, useRef, useEffect } from "react"
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
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef(null)

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } })
        setOpen(false)
    }

    // cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className={styles.selectWrapper} ref={wrapperRef}>
            {label && <label htmlFor={name}>{label}</label>}

            <div
                className={`${styles.customSelect} ${open ? styles.open : ""}`}
                onClick={() => setOpen(!open)}
            >
                <span className={value ? styles.selected : styles.placeholder}>
                    {value ? options.find(o => o.value === value)?.label : placeholder}
                </span>
                <span className={styles.arrow}>▾</span>

                {open && (
                    <ul className={styles.optionsList}>
                        {options.map(option => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={option.value === value ? styles.active : ""}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
