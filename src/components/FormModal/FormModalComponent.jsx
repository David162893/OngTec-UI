import { useState, useEffect } from "react"
import ModalComponent from "@/components/Modal/ModalComponent"
import ButtonComponent from "@/components/Button/ButtonComponent"

export default function FormModal({
    open,
    onClose,
    title,
    initialData = {},
    fields = [],
    onSubmit
}) {
    const [formData, setFormData] = useState(initialData)

    useEffect(() => {
        setFormData(initialData || {})
    }, [initialData])

    function handleChange(name, value) {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit() {
        onSubmit?.(formData)
        onClose()
    }

    return (
        <ModalComponent open={open} onClose={onClose} title={title}>
            <div>
                {fields.map(field => (
                    <div key={field.name}>
                        <label>{field.label}</label>
                        <input
                            type={field.type || "text"}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    </div>
                ))}

                <ButtonComponent onClick={handleSubmit}>
                    Guardar
                </ButtonComponent>
            </div>
        </ModalComponent>
    )
}
