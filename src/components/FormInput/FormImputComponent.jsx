import { useState, useCallback, useRef } from "react"
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
    const { ref, width, onChange: autoSizeChange } = useAutoSize({
        min: inputMinWidth,
        max: inputMaxWidth
    })

    const handleChange = useCallback((e) => {
        autoSizeChange(e)
        onChange?.(e)
    }, [autoSizeChange, onChange])

    return (
        <div className={`${styles.inputWrapper} ${wrapperClassName}`}>
            {label && (
                <label htmlFor={name}>
                    {label}
                </label>
            )}

            <input
                ref={autoSize ? ref : undefined}
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={autoSize ? handleChange : onChange}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                className={`${styles[`inputType-${type}`]} ${className}`}
                style={autoSize ? { width: `${width}px` } : undefined}
            />
        </div>
    )
}