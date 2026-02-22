import { useState, useEffect } from "react"
import styles from "./FormModalComponent.module.scss"
import ModalComponent from "@/components/Modal/ModalComponent"
import ButtonComponent from "@/components/Button/ButtonComponent"

export default function FormModal({
    open,
    onClose,
    title,
    initialData = {},
    onSubmit
}) {
    const [formData, setFormData] = useState({})

    useEffect(() => {
        setFormData({})
    }, [initialData])

    function getNestedValue(obj, path) {
        return path.split(".").reduce((acc, key) => acc?.[key], obj)
    }

    function setNestedValue(obj, path, value) {
        const keys = path.split(".")
        let current = obj

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value
            } else {
                current[key] = current[key] || {}
                current = current[key]
            }
        })
    }

    function handleChange(path, value) {
        setFormData(prev => {
            const updated = { ...prev }
            setNestedValue(updated, path, value)
            return updated
        })
    }

    const fullWidthStringKeys = ["description", "location"]

    function renderField(key, value, parentPath = "") {
        const path = parentPath ? `${parentPath}.${key}` : key

        // 🔵 SELECT (array de strings)
        if (Array.isArray(value)) {
            const isSelect =
                value.length > 0 &&
                value.every(item => typeof item === "string")

            if (isSelect) {
                const selectedValue =
                    getNestedValue(formData, path) ?? value[0]

                return (
                    <div key={path} className={styles.fieldGroup}>
                        <label>{key}</label>
                        <select
                            value={selectedValue}
                            onChange={e => handleChange(path, e.target.value)}
                        >
                            {value.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            }

            return (
                <div key={path} className={`${styles.nestedGroup} ${styles.fullWidth}`}>
                    <label><strong>{key}</strong></label>
                    {value.map((item, index) =>
                        renderField(index, item, path)
                    )}
                </div>
            )
        }

        // 🟣 OBJETO ANIDADO
        if (typeof value === "object" && value !== null) {
            return (
                <div key={path} className={`${styles.nestedGroup} ${styles.fullWidth}`}>
                    <label><strong>{key}</strong></label>
                    {Object.entries(value).map(([childKey, childValue]) =>
                        renderField(childKey, childValue, path)
                    )}
                </div>
            )
        }

        // 🟢 BOOLEAN
        if (typeof value === "boolean") {
            const checked =
                getNestedValue(formData, path) ?? value

            return (
                <div key={path} className={styles.fieldGroupCheckbox}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => handleChange(path, e.target.checked)}
                        id={path}
                    />
                    <label htmlFor={path}>{key}</label>
                </div>
            )
        }

        // 🟠 NUMBER
        if (typeof value === "number") {
            const currentValue =
                getNestedValue(formData, path) ?? value

            return (
                <div key={path} className={styles.fieldGroup}>
                    <label>{key}</label>
                    <input
                        type="number"
                        value={currentValue}
                        onChange={e =>
                            handleChange(path, Number(e.target.value))
                        }
                    />
                </div>
            )
        }

        // 🔵 STRING (default)
        const currentValue =
            getNestedValue(formData, path) ?? value ?? ""

        return (
            <div key={path} className={`${styles.fieldGroup} ${fullWidthStringKeys.includes(key) ? styles.fullWidth : ""}`}>
                <label>{key}</label>
                <input
                    type="text"
                    value={currentValue}
                    onChange={e =>
                        handleChange(path, e.target.value)
                    }
                />
            </div>
        )
    }

    function buildFinalObject(structure, values, parentPath = "") {
        const result = Array.isArray(structure) ? [] : {}

        Object.entries(structure).forEach(([key, value]) => {
            const path = parentPath ? `${parentPath}.${key}` : key

            if (Array.isArray(value)) {
                const selected =
                    getNestedValue(values, path) ?? value[0]
                result[key] = selected
            }
            else if (typeof value === "object" && value !== null) {
                result[key] = buildFinalObject(value, values, path)
            }
            else {
                result[key] =
                    getNestedValue(values, path) ?? value
            }
        })

        return result
    }

    function handleSubmit() {
        const finalData = buildFinalObject(initialData, formData)
        onSubmit?.(finalData)
        onClose()
    }

    return (
        <ModalComponent open={open} onClose={onClose} title={title} className={styles.formModal}>
            <div className={styles.formContainer}>
                {Object.entries(initialData).map(([key, value]) =>
                    renderField(key, value)
                )}

                <ButtonComponent variant="modalSave" onClick={handleSubmit}>
                    Guardar
                </ButtonComponent>
            </div>
        </ModalComponent>
    )
}