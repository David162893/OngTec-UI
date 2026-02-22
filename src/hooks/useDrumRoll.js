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
    const inertiaActive = useRef(false)

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
    }, [items, value])

    const snapToIndex = useCallback((idx) => {
        if (!listRef.current) return
        const clamped = Math.max(0, Math.min(idx, items.length - 1))
        const start = listRef.current.scrollTop
        const target = clamped * ITEM_H
        const distance = target - start

        if (Math.abs(distance) < 1) {
            listRef.current.scrollTop = target
            setScrollIdx(clamped)
            if (items[clamped]) onChange(items[clamped].value)
            return
        }

        const duration = Math.min(250, Math.max(80, Math.abs(distance) * 1.2))
        const startTime = performance.now()
        const easeOut = (t) => 1 - Math.pow(1 - t, 3)

        const animate = (now) => {
            if (!listRef.current) return
            const p = Math.min((now - startTime) / duration, 1)
            listRef.current.scrollTop = start + distance * easeOut(p)
            setScrollIdx(readIdx())
            if (p < 1) {
                rafRef.current = requestAnimationFrame(animate)
            } else {
                listRef.current.scrollTop = target
                setScrollIdx(clamped)
                if (items[clamped]) onChange(items[clamped].value)
            }
        }
        rafRef.current = requestAnimationFrame(animate)
    }, [items, onChange, readIdx])

    const confirmCurrent = useCallback(() => {
        if (!listRef.current) return
        const idx = readIdx()
        const clamped = Math.max(0, Math.min(idx, items.length - 1))
        snapToIndex(clamped)
    }, [items, readIdx, snapToIndex])

    const runInertia = useCallback(() => {
        if (!listRef.current) {
            inertiaActive.current = false
            return
        }
        const d = dragRef.current
        const speed = Math.abs(d.vel)
        const friction = speed > 8 ? 0.92 : speed > 3 ? 0.95 : 0.92
        d.vel *= friction
        listRef.current.scrollTop += d.vel
        const maxScroll = (items.length - 1) * ITEM_H
        if (listRef.current.scrollTop < 0) {
            listRef.current.scrollTop = 0
            d.vel = 0
        } else if (listRef.current.scrollTop > maxScroll) {
            listRef.current.scrollTop = maxScroll
            d.vel = 0
        }

        const idx = readIdx()
        setScrollIdx(idx)
        if (items[idx]) onChange(items[idx].value)

        if (Math.abs(d.vel) > 0.15) {
            rafRef.current = requestAnimationFrame(runInertia)
        } else {
            d.vel = 0
            inertiaActive.current = false
            snapToIndex(readIdx())
        }
    }, [items, onChange, readIdx, snapToIndex])

    const onPointerDown = useCallback((e) => {
        if (disabled) return
        cancelAnimationFrame(rafRef.current)
        clearTimeout(snapTimer.current)
        inertiaActive.current = false

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
        if (dt > 0) {
            const rawVel = ((d.lastY - e.clientY) / dt) * 16
            d.vel = d.vel * 0.6 + rawVel * 0.4
        }
        d.lastY = e.clientY
        d.lastT = e.timeStamp

        const idx = readIdx()
        setScrollIdx(idx)
        if (items[idx]) onChange(items[idx].value)
    }, [readIdx, items, onChange])

    const onPointerUp = useCallback(() => {
        const d = dragRef.current
        if (!d.active) return
        d.active = false

        if (Math.abs(d.vel) > 0.5) {
            d.vel *= 1.4
            inertiaActive.current = true
            rafRef.current = requestAnimationFrame(runInertia)
        } else {
            snapToIndex(readIdx())
        }
    }, [runInertia, snapToIndex, readIdx])

    const attachWheel = useCallback((node) => {
        if (!node) return
        const handler = (e) => {
            if (disabled) return
            e.preventDefault()
            e.stopPropagation()

            cancelAnimationFrame(rafRef.current)
            inertiaActive.current = false

            const delta = Math.sign(e.deltaY)
            const current = Math.round(listRef.current.scrollTop / ITEM_H)
            const next = Math.max(0, Math.min(current + delta, items.length - 1))

            dragRef.current.vel = 0
            snapToIndex(next)
        }
        node.addEventListener("wheel", handler, { passive: false })
        return () => node.removeEventListener("wheel", handler)
    }, [disabled, items, snapToIndex])

    const onItemClick = useCallback((idx) => {
        if (disabled) return
        cancelAnimationFrame(rafRef.current)
        inertiaActive.current = false
        dragRef.current.vel = 0
        snapToIndex(idx)
    }, [disabled, snapToIndex])

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