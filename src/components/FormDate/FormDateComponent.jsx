import { useCallback, useMemo } from "react"
import styles from "./FormDateComponent.module.scss"
import DrumRollComponent from "@/components/DrumRoll/DrumRollComponent"

const MONTHS = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
]

const currentYear = new Date().getFullYear()
const YEAR_ITEMS = Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
}))

function getDaysInMonth(year, month) {
    if (!year || !month) return 31
    return new Date(Number(year), Number(month), 0).getDate()
}

// value esperado: { day: "", month: "", year: "" }
export default function FormDateComponent({
    label,
    name,
    value = { day: "", month: "", year: "" },
    onChange,
    required = false,
    disabled = false,
    className = "",
    wrapperClassName = "",
}) {
    const monthLocked = !value.year
    const dayLocked = !value.year || !value.month

    const dayItems = useMemo(() => {
        const count = getDaysInMonth(value.year, value.month)
        return Array.from({ length: count }, (_, i) => ({
            value: String(i + 1),
            label: String(i + 1).padStart(2, "0"),
        }))
    }, [value.year, value.month])

    const handlePart = useCallback((part) => (val) => {
        const newValue = { ...value, [part]: val }
        if (part === "year" || part === "month") {
            const newDays = getDaysInMonth(
                part === "year" ? val : value.year,
                part === "month" ? val : value.month
            )
            if (Number(newValue.day) > newDays) newValue.day = ""
        }
        onChange?.({ target: { name, value: newValue } })
    }, [onChange, name, value])

    const filledCount = (!!value.year + !!value.month + !!value.day)
    const progressPct = (filledCount / 3) * 100

    return (
        <div className={`${styles.inputWrapper} ${wrapperClassName} ${className}`}>
            {label && (
                <label>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.drumRow}>
                <div className={styles.drumYear}>
                    <DrumRollComponent
                        items={YEAR_ITEMS}
                        value={value.year}
                        onChange={handlePart("year")}
                        disabled={disabled}
                        label="Año"
                    />
                </div>

                <span className={`${styles.sep} ${monthLocked ? styles.sepDim : ""}`}>/</span>

                <div className={styles.drumMonth}>
                    <DrumRollComponent
                        items={MONTHS}
                        value={value.month}
                        onChange={handlePart("month")}
                        disabled={disabled || monthLocked}
                        label="Mes"
                    />
                </div>

                <span className={`${styles.sep} ${dayLocked ? styles.sepDim : ""}`}>/</span>

                <div className={styles.drumDay}>
                    <DrumRollComponent
                        items={dayItems}
                        value={value.day}
                        onChange={handlePart("day")}
                        disabled={disabled || dayLocked}
                        label="Día"
                    />
                </div>
            </div>
        </div>
    )
}