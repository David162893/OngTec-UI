import { useCallback, useId, useState } from "react"
import styles from "./FormImputComponent.module.scss"
import useAutoSize from "@/hooks/useAutoSize"

function validateValue(value, type) {
    const patterns = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^\+?[0-9]{7,15}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    }
    if (!value || !patterns[type]) return true
    return patterns[type].test(value)
}

export default function FormInputComponent({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    disabled = false,
    placeholder = "",
    className = "",
    wrapperClassName = "",
    autoSize = false,
    inputMinWidth = 50,
    inputMaxWidth = 300
}) {
    const generatedId = useId()
    const inputId = name || generatedId

    const { ref, width, onChange: autoSizeChange } = useAutoSize({
        min: inputMinWidth,
        max: inputMaxWidth
    })

    const [isValid, setIsValid] = useState(true)

    const handleChange = useCallback((e) => {
        autoSizeChange(e)
        onChange?.(e)
        setIsValid(true)
    }, [autoSizeChange, onChange])

    const handleBlur = useCallback(() => {
        const valid = validateValue(value, name)
        setIsValid(valid)
    }, [value, name])

    return (
        <div className={`${styles.inputWrapper} ${wrapperClassName} ${className}`}>
            {label && <label htmlFor={inputId}>{label}</label>}

            <input
                ref={autoSize ? ref : undefined}
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={autoSize ? handleChange : onChange}
                onBlur={handleBlur}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                className={`${styles[`inputType-${type}`]} ${!isValid ? styles.invalid : ""}`}
                style={autoSize ? { width: `${width}px` } : undefined}
            />

            {!isValid && (
                <span className={styles.errorText}>
                    {type === "phone" && "Teléfono inválido"}
                    {type === "email" && "Email inválido"}
                    {type === "password" && "Contraseña inválida"}
                </span>
            )}
        </div>
    )
}