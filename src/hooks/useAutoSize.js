import { useState, useCallback, useRef } from "react"

export default function useAutoSize({ min = 50, max = 300 } = {}) {
    const [width, setWidth] = useState(min)
    const inputRef = useRef(null)

    const measureText = useCallback((text, node) => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const styles = window.getComputedStyle(node)
        ctx.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`
        const textWidth = ctx.measureText(text || node.placeholder || "").width
        const clamped = Math.min(Math.max(textWidth + 16, min), max)
        setWidth(clamped)
    }, [min, max])

    const ref = useCallback((node) => {
        inputRef.current = node
        if (node) {
            measureText(node.value, node)
        }
    }, [measureText])

    const onChange = useCallback((e) => {
        measureText(e.target.value, e.target)
    }, [measureText])

    return { ref, width, onChange }
}