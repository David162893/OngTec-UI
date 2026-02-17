import { useEffect, useRef, useState, useCallback } from "react"
import useDrumRoll, { ITEM_H, VISIBLE, HALF } from "@/hooks/useDrumRoll"
import styles from "./DrumRollComponent.module.scss"

export default function DrumRollComponent({ items, value, onChange, disabled, label }) {
    const [open, setOpen] = useState(false)
    const wrapRef = useRef(null)
    const panelRef = useRef(null)

    const {
        listRef,
        scrollIdx,
        initScroll,
        attachWheel,
        confirmCurrent,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onItemClick,
        onKeyDown,
    } = useDrumRoll({ items, value, onChange, disabled })

    useEffect(() => {
        if (open) initScroll()
    }, [open])

    useEffect(() => {
        if (!open || !listRef.current) return
        const cleanup = attachWheel(listRef.current)
        return cleanup
    }, [open, attachWheel, listRef])

    const closeAndConfirm = useCallback(() => {
        confirmCurrent()
        setOpen(false)
    }, [confirmCurrent])

    useEffect(() => {
        if (!open) return
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                closeAndConfirm()
            }
        }
        document.addEventListener("pointerdown", handler)
        return () => document.removeEventListener("pointerdown", handler)
    }, [open, closeAndConfirm])

    useEffect(() => {
        if (!open) return
        const handler = (e) => { if (e.key === "Escape") closeAndConfirm() }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [open, closeAndConfirm])

    const handleItemClick = useCallback((idx) => {
        onItemClick(idx)
        setTimeout(() => setOpen(false), 200)
    }, [onItemClick])

    const selectedItem = items.find(it => it.value === String(value))
    const hasValue = !!selectedItem

    return (
        <div
            ref={wrapRef}
            className={`${styles.drumWrap} ${disabled ? styles.drumDisabled : ""} ${hasValue ? styles.drumFilled : ""}`}
        >
            <span className={styles.drumFloatLabel}>{label}</span>

            <button
                type="button"
                className={`${styles.drumTrigger} ${open ? styles.drumTriggerOpen : ""}`}
                onClick={() => { if (!disabled) setOpen(o => !o) }}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={`${styles.drumTriggerValue} ${!hasValue ? styles.drumTriggerPlaceholder : ""}`}>
                    {selectedItem?.label ?? "—"}
                </span>
                <span className={`${styles.drumTriggerArrow} ${open ? styles.drumTriggerArrowOpen : ""}`} aria-hidden>
                    ‹
                </span>
            </button>

            {open && (
                <div
                    ref={panelRef}
                    className={styles.drumPanel}
                    role="listbox"
                    aria-label={label}
                    onKeyDown={onKeyDown}
                    tabIndex={-1}
                >
                    <div className={styles.drumFadeTop} aria-hidden />
                    <div className={styles.drumFadeBottom} aria-hidden />
                    <div className={styles.drumSelector} aria-hidden />

                    <div
                        className={styles.drumList}
                        ref={listRef}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}
                        onPointerCancel={onPointerUp}
                        style={{ height: `${ITEM_H * VISIBLE}px` }}
                    >
                        <div style={{ height: `${ITEM_H * HALF}px`, flexShrink: 0 }} aria-hidden />

                        {items.map((item, i) => {
                            const absDist = Math.abs(i - scrollIdx)
                            const isCenter = absDist === 0
                            const opacity = Math.max(0.15, 1 - absDist * 0.25)
                            const scale = Math.max(0.75, 1 - absDist * 0.08)

                            return (
                                <div
                                    key={item.value}
                                    role="option"
                                    aria-selected={isCenter}
                                    className={`${styles.drumItem} ${isCenter ? styles.drumItemSelected : ""}`}
                                    style={{ opacity, transform: `scale(${scale})` }}
                                    onClick={() => handleItemClick(i)}
                                >
                                    {item.label}
                                </div>
                            )
                        })}

                        <div style={{ height: `${ITEM_H * HALF}px`, flexShrink: 0 }} aria-hidden />
                    </div>
                </div>
            )}
        </div>
    )
}