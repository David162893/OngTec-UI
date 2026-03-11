import { useEffect, useRef, useCallback } from "react"

/**
 * Hook de scroll infinito.
 * Coloca un elemento invisible al final de la lista (sentinelRef) y cuando
 * el usuario se acerca a él, llama a onLoadMore automáticamente.
 * Se detiene cuando hasMore es false o hay una petición en curso (loading).
 */

export function useInfiniteScroll({ onLoadMore, loading, hasMore, rootMargin = "200px" }) {
    const sentinelRef = useRef(null)
    const loadingRef = useRef(loading)
    const hasMoreRef = useRef(hasMore)

    useEffect(() => { loadingRef.current = loading }, [loading])
    useEffect(() => { hasMoreRef.current = hasMore }, [hasMore])

    const handleIntersect = useCallback((entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loadingRef.current && hasMoreRef.current) {
            onLoadMore()
        }
    }, [onLoadMore])

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return
        const observer = new IntersectionObserver(handleIntersect, { rootMargin })
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [handleIntersect, rootMargin])

    return { sentinelRef }
}