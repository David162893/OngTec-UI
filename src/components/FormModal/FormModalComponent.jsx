import { useState, useEffect } from "react"
import styles from "./FormModalComponent.module.scss"
import ModalComponent from "@/components/Modal/ModalComponent"
import ButtonComponent from "@/components/Button/ButtonComponent"
import FormInputComponent from "@/components/FormInput/FormImputComponent"
import FormSelectComponent from "@/components/FormSelect/FormSelectComponent"
import FormDateComponent from "@/components/FormDate/FormDateComponent"
import trashIcon from "@/assets/trash.svg"

export default function FormModal({
    open, onClose, title,
    initialData = {},
    onSubmit,
    selectHooks = {},
    dateProps = {},
    fieldOrder = []
}) {
    const [formData, setFormData] = useState({})

    const selectOptions = Object.fromEntries(
        Object.entries(selectHooks).map(([key, useHook]) => {
            const result = useHook(formData)
            const raw = Object.values(result)[0] || []
            const normalized = raw.map(item => {
                const nameKey = Object.keys(item).find(k => k !== "id")
                return { id: item.id, name: item[nameKey] ?? "" }
            }).filter(item => item.id != null)
            return [key, normalized]
        })
    )

    console.log("selectHooks keys:", Object.keys(selectHooks))

    useEffect(() => {
        setFormData(initialData)
    }, [initialData])

    function getNestedValue(obj, path) {
        return path.split(".").reduce((acc, key) => acc?.[key], obj)
    }

    function setNestedValue(obj, path, value) {
        const keys = path.split(".")
        let current = obj
        keys.forEach((key, index) => {
            if (index === keys.length - 1) current[key] = value
            else { current[key] = current[key] || {}; current = current[key] }
        })
    }

    function handleChange(path, value) {
        setFormData(prev => {
            const updated = { ...prev }
            setNestedValue(updated, path, value)
            return updated
        })
    }

    function isDateObject(value) {
        return typeof value === "object" && value !== null &&
            ("day" in value || "month" in value || "year" in value)
    }

    // 🔴 MULTISELECT — array de { id, name } con selectHook
    function isMultiselect(key, value) {
        return Array.isArray(value) &&
            selectOptions[key] &&
            (value.length === 0 || (typeof value[0] === "object" && "id" in value[0]))
    }

    const fullWidthStringKeys = ["description", "location"]

    function renderField(key, value, parentPath = "") {
        const path = parentPath ? `${parentPath}.${key}` : key

        // 🗓️ DATE
        if (isDateObject(value)) {
            const currentValue = getNestedValue(formData, path) ?? value
            return (
                <div key={path} className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                    <FormDateComponent
                        label={key}
                        name={path}
                        value={currentValue}
                        onChange={(e) => handleChange(path, e.target.value)}
                        minYear={dateProps.minYear}
                        maxYear={dateProps.maxYear}
                    />
                </div>
            )
        }

        // 🔴 MULTISELECT — array de objetos con hook
        if (Array.isArray(value) && selectOptions[key]) {
            const currentValues = getNestedValue(formData, path) ?? value
            const options = selectOptions[key].map(o => ({ value: o.id, label: o.name }))
            const selectedIds = new Set(currentValues.map(v => v.id))
            const availableOptions = options.filter(o => !selectedIds.has(o.value))

            return (
                <div key={path} className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                    <label><strong>{key}</strong></label>
                    <div className={styles.multiselectWrapper}>
                        <FormSelectComponent
                            name={path}
                            value=""
                            placeholder="Añadir..."
                            options={availableOptions}
                            onChange={(e) => {
                                if (!e.target.value) return
                                const selected = selectOptions[key].find(
                                    o => o.id === Number(e.target.value)
                                )
                                if (selected) handleChange(path, [...currentValues, selected])
                            }}
                        />
                        {currentValues.length > 0 && (
                            <div className={styles.multiselectChips}>
                                {currentValues.map(item => (
                                    <span key={item.id} className={styles.multiselectChip}>
                                        {item.name}
                                        <button
                                            className={styles.multiselectChipRemove}
                                            onClick={() => handleChange(
                                                path,
                                                currentValues.filter(v => v.id !== item.id)
                                            )}
                                        >
                                            <img src={trashIcon} alt="Eliminar" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        // 🔵 SELECT array de strings
        if (Array.isArray(value)) {
            const isStringSelect = value.length > 0 && value.every(item => typeof item === "string")
            if (isStringSelect) {
                const currentValue = getNestedValue(formData, path) ?? value[0]
                const options = value.map(v => ({ value: v, label: v }))
                return (
                    <div key={path} className={styles.fieldGroup}>
                        <FormSelectComponent
                            label={key}
                            name={path}
                            value={currentValue}
                            options={options}
                            onChange={(e) => handleChange(path, e.target.value)}
                        />
                    </div>
                )
            }
            return (
                <div key={path} className={`${styles.nestedGroup} ${styles.fullWidth}`}>
                    <label><strong>{key}</strong></label>
                    {value.map((item, index) => renderField(index, item, path))}
                </div>
            )
        }

        // 🟡 OBJECT { id, name } → Select
        if (typeof value === "object" && value !== null &&
            "id" in value && "name" in value && selectOptions[key]) {
            const options = selectOptions[key].map(o => ({ value: o.id, label: o.name }))
            const currentValue = getNestedValue(formData, path)?.id ?? value.id
            return (
                <div key={path} className={styles.fieldGroup}>
                    <FormSelectComponent
                        label={key}
                        name={path}
                        value={currentValue}
                        options={options}
                        onChange={(e) => {
                            const selected = selectOptions[key].find(
                                o => o.id === Number(e.target.value)
                            )
                            handleChange(path, selected)
                        }}
                    />
                </div>
            )
        }

        // 🟣 NESTED OBJECT
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
            const checked = getNestedValue(formData, path) ?? value
            return (
                <div key={path} className={styles.fieldGroupCheckbox}>
                    <input type="checkbox" checked={checked} id={path}
                        onChange={e => handleChange(path, e.target.checked)} />
                    <label htmlFor={path}>{key}</label>
                </div>
            )
        }

        // 🟠 NUMBER
        if (typeof value === "number") {
            const currentValue = getNestedValue(formData, path) ?? value
            return (
                <div key={path} className={styles.fieldGroup}>
                    <FormInputComponent label={key} name={path} type="number"
                        value={currentValue}
                        onChange={(e) => handleChange(path, Number(e.target.value))} />
                </div>
            )
        }

        // 🔵 STRING
        const currentValue = getNestedValue(formData, path) ?? value ?? ""
        const isFullWidth = fullWidthStringKeys.includes(key)
        return (
            <div key={path} className={`${styles.fieldGroup} ${isFullWidth ? styles.fullWidth : ""}`}>
                <FormInputComponent label={key} name={path} type="text"
                    value={currentValue}
                    onChange={(e) => handleChange(path, e.target.value)} />
            </div>
        )
    }

    function buildFinalObject(structure, values, parentPath = "") {
        const result = Array.isArray(structure) ? [] : {}
        Object.entries(structure).forEach(([key, value]) => {
            const path = parentPath ? `${parentPath}.${key}` : key
            if (Array.isArray(value)) {
                // Multiselect devuelve el array completo desde formData
                result[key] = getNestedValue(values, path) ?? value
            } else if (typeof value === "object" && value !== null) {
                result[key] = buildFinalObject(value, values, path)
            } else {
                result[key] = getNestedValue(values, path) ?? value
            }
        })
        return result
    }

    function handleSubmit() {
        const finalData = buildFinalObject(initialData, formData)
        onSubmit?.(finalData)
        onClose()
    }

    const orderedEntries = fieldOrder.length
        ? [
            ...fieldOrder.filter(key => key in initialData).map(key => [key, initialData[key]]),
            ...Object.entries(initialData).filter(([key]) => !fieldOrder.includes(key))
        ]
        : Object.entries(initialData)

    return (
        <ModalComponent open={open} onClose={onClose} title={title} className={styles.formModal}>
            <div className={styles.formContainer}>
                {orderedEntries.map(([key, value]) => renderField(key, value))}
                <ButtonComponent variant="modalSave" onClick={handleSubmit}>
                    Guardar
                </ButtonComponent>
            </div>
        </ModalComponent>
    )
}