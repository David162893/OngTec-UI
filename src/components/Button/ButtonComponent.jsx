import styles from "./ButtonComponent.module.scss"

export default function ButtonComponent({ variant, className, children, ...props }) {

    const combinedClasses = `${styles[variant] || ''} ${className || ''}`.trim()

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    )
}