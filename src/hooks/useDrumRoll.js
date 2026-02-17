import { useCallback, useEffect, useRef, useState } from "react"

export const ITEM_H = 52
export const VISIBLE = 5
export const HALF = Math.floor(VISIBLE / 2)

export default function useDrumRoll({ items, value, onChange, disabled }) {
    const listRef = useRef(null)
    const dragRef = useRef({
        active: false,
        startY: 0,
        startScroll: 0,
        lastY: 0,
        lastT: 0,
        vel: 0,
    })
    const rafRef = useRef(null)
    const snapTimer = useRef(null)
    const isSnapping = useRef(false)
    const initializedRef = useRef(false)

    const [scrollIdx, setScrollIdx] = useState(() => {
        const i = items.findIndex(it => it.value === String(value))
        return i >= 0 ? i : 0
    })

    const readIdx = useCallback(() => {
        if (!listRef.current) return 0
        return Math.round(listRef.current.scrollTop / ITEM_H)
    }, [])

    const initScroll = useCallback(() => {
        if (!listRef.current) return
        const i = items.findIndex(it => it.value === String(value))
        const target = i >= 0 ? i : 0
        listRef.current.scrollTop = target * ITEM_H
        setScrollIdx(target)
        initializedRef.current = true
    }, [items, value])

    useEffect(() => {
        initializedRef.current = false
    }, [items])

    const confirmCurrent = useCallback(() => {
        if (!listRef.current) return
        const idx = Math.round(listRef.current.scrollTop / ITEM_H)
        const clamped = Math.max(0, Math.min(idx, items.length - 1))
        listRef.current.scrollTop = clamped * ITEM_H
        setScrollIdx(clamped)
        if (items[clamped]) onChange(items[clamped].value)
    }, [items, onChange])

    const doSnapVisual = useCallback(() => {
        if (!listRef.current || isSnapping.current) return
        const raw = listRef.current.scrollTop
        const idx = Math.round(raw / ITEM_H)
        const clamped = Math.max(0, Math.min(idx, items.length - 1))
        const target = clamped * ITEM_H

        if (Math.abs(raw - target) < 0.5) {
            listRef.current.scrollTop = target
            setScrollIdx(clamped)
            return
        }

        isSnapping.current = true
        const start = raw
        const distance = target - start
        const duration = Math.min(200, Math.max(80, Math.abs(distance) * 1.2))
        const startTime = performance.now()
        const easeOut = (t) => 1 - Math.pow(1 - t, 3)

        const animate = (now) => {
            const p = Math.min((now - startTime) / duration, 1)
            listRef.current.scrollTop = start + distance * easeOut(p)
            setScrollIdx(readIdx())
            if (p < 1) {
                rafRef.current = requestAnimationFrame(animate)
            } else {
                listRef.current.scrollTop = target
                setScrollIdx(clamped)
                isSnapping.current = false
            }
        }
        rafRef.current = requestAnimationFrame(animate)
    }, [items.length, readIdx])

    const runInertia = useCallback(() => {
        if (!listRef.current) return
        const d = dragRef.current
        d.vel *= 0.90
        listRef.current.scrollTop += d.vel
        setScrollIdx(readIdx())

        if (Math.abs(d.vel) > 0.3) {
            rafRef.current = requestAnimationFrame(runInertia)
        } else {
            d.vel = 0
            doSnapVisual()
        }
    }, [doSnapVisual, readIdx])

    const onPointerDown = useCallback((e) => {
        if (disabled) return
        cancelAnimationFrame(rafRef.current)
        clearTimeout(snapTimer.current)
        isSnapping.current = false

        e.currentTarget.setPointerCapture(e.pointerId)
        const d = dragRef.current
        d.active = true
        d.startY = e.clientY
        d.startScroll = listRef.current.scrollTop
        d.lastY = e.clientY
        d.lastT = e.timeStamp
        d.vel = 0
    }, [disabled])

    const onPointerMove = useCallback((e) => {
        const d = dragRef.current
        if (!d.active || !listRef.current) return
        listRef.current.scrollTop = d.startScroll + (d.startY - e.clientY)
        const dt = e.timeStamp - d.lastT
        if (dt > 0) d.vel = ((d.lastY - e.clientY) / dt) * 16
        d.lastY = e.clientY
        d.lastT = e.timeStamp
        setScrollIdx(readIdx())
    }, [readIdx])

    const onPointerUp = useCallback(() => {
        const d = dragRef.current
        if (!d.active) return
        d.active = false

        if (Math.abs(d.vel) > 1) {
            rafRef.current = requestAnimationFrame(runInertia)
        } else {
            doSnapVisual()
        }
    }, [runInertia, doSnapVisual])

    const attachWheel = useCallback((node) => {
        if (!node) return
        const handler = (e) => {
            if (disabled) return
            e.preventDefault()
            e.stopPropagation()

            cancelAnimationFrame(rafRef.current)
            isSnapping.current = false

            const delta = Math.sign(e.deltaY)
            const current = Math.round(listRef.current.scrollTop / ITEM_H)
            const next = Math.max(0, Math.min(current + delta, items.length - 1))

            dragRef.current.vel = 0
            listRef.current.scrollTop = next * ITEM_H
            setScrollIdx(next)

            clearTimeout(snapTimer.current)
            snapTimer.current = setTimeout(() => {
                if (items[next]) onChange(items[next].value)
            }, 80)
        }
        node.addEventListener("wheel", handler, { passive: false })
        return () => node.removeEventListener("wheel", handler)
    }, [disabled, items, onChange])

    const onItemClick = useCallback((idx) => {
        if (disabled) return
        const clamped = Math.max(0, Math.min(idx, items.length - 1))
        cancelAnimationFrame(rafRef.current)
        isSnapping.current = false

        const start = listRef.current.scrollTop
        const target = clamped * ITEM_H
        const distance = target - start
        const duration = Math.min(180, Math.max(60, Math.abs(distance) * 1.0))
        const startTime = performance.now()
        const easeOut = (t) => 1 - Math.pow(1 - t, 3)

        isSnapping.current = true
        const animate = (now) => {
            const p = Math.min((now - startTime) / duration, 1)
            listRef.current.scrollTop = start + distance * easeOut(p)
            setScrollIdx(readIdx())
            if (p < 1) {
                rafRef.current = requestAnimationFrame(animate)
            } else {
                listRef.current.scrollTop = target
                setScrollIdx(clamped)
                isSnapping.current = false
                if (items[clamped]) onChange(items[clamped].value)
            }
        }
        rafRef.current = requestAnimationFrame(animate)
    }, [disabled, items, onChange, readIdx])

    const onKeyDown = useCallback((e) => {
        if (disabled) return
        if (e.key === "ArrowDown") { e.preventDefault(); onItemClick(Math.min(scrollIdx + 1, items.length - 1)) }
        if (e.key === "ArrowUp") { e.preventDefault(); onItemClick(Math.max(scrollIdx - 1, 0)) }
    }, [disabled, scrollIdx, items, onItemClick])

    useEffect(() => () => {
        cancelAnimationFrame(rafRef.current)
        clearTimeout(snapTimer.current)
    }, [])

    return {
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
    }
}