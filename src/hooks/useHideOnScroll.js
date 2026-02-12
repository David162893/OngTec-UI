import { useEffect, useRef, useState } from "react"

export default function useHideOnScroll({
  minScroll = 120,
  delta = 10,
} = {}) {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY.current

      if (currentScrollY > minScroll && diff > delta) {
        setHidden(true)
      }

      if (diff < -delta) {
        setHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [minScroll, delta])

  return hidden
}
