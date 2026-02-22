import { useEffect, useRef, useState } from "react"

export default function useHideOnScroll({
  minScroll = 200,
  delta = 10,
} = {}) {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const accumulatedDelta = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY.current

      if (
        (accumulatedDelta.current > 0 && diff < 0) ||
        (accumulatedDelta.current < 0 && diff > 0)
      ) {
        accumulatedDelta.current = 0
      }

      accumulatedDelta.current += diff
      lastScrollY.current = currentScrollY

      if (currentScrollY > minScroll && accumulatedDelta.current > delta) {
        setHidden(true)
        accumulatedDelta.current = 0
      }

      if (accumulatedDelta.current < -delta) {
        setHidden(false)
        accumulatedDelta.current = 0
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [minScroll, delta])

  return hidden
}