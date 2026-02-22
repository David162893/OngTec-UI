import { useCallback, useId } from "react"
import styles from "./FormImputComponent.module.scss"
import useAutoSize from "@/hooks/useAutoSize"

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

    const handleChange = useCallback((e) => {
        autoSizeChange(e)
        onChange?.(e)
    }, [autoSizeChange, onChange])

    return (
        <div className={`${styles.inputWrapper} ${wrapperClassName} ${className}`}>
            {label && (
                <label htmlFor={inputId}>
                    {label}
                </label>
            )}

            <input
                ref={autoSize ? ref : undefined}
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={autoSize ? handleChange : onChange}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                className={styles[`inputType-${type}`]}
                style={autoSize ? { width: `${width}px` } : undefined}
            />
        </div>
    )
}