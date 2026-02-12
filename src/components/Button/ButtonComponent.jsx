import styles from "./ButtonComponent.module.scss"

export default function ButtonComponent({ variant, className, children, ...props }) {

    const variantClass = styles[variant] || ''
    const combinedClasses = `${variantClass} ${className || ''}`.trim()

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    )
}