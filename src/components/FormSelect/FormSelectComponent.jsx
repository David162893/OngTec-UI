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
    const wrapperRef = useRef(null)

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } })
        setOpen(false)
    }

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
            {label && <label htmlFor={inputId}>{label}</label>}

            {/* Select nativo oculto: permite que htmlFor funcione y el browser autofill */}
            <select
                id={inputId}
                name={name}
                value={value}
                required={required}
                onChange={onChange}
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: "none" }}
            >
                <option value="">{placeholder}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            <div
                className={`${styles.customSelect} ${open ? styles.open : ""}`}
                onClick={() => setOpen(!open)}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-labelledby={inputId}
                tabIndex={0}
            >
                <span className={value ? styles.selected : styles.placeholder}>
                    {value ? options.find(o => o.value === value)?.label : placeholder}
                </span>
                <span className={styles.arrow}>▾</span>

                {open && (
                    <ul
                        role="listbox"
                        className={styles.optionsList}
                    >
                        {options.map(option => (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={option.value === value}
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