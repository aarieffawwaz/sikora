import { useEffect, useRef, useState } from "react"
import { animate } from "framer-motion"
import { useLocation } from "react-router-dom"

interface CountUpProps {
  value: number
  from?: number
  format?: (n: number) => string
  duration?: number
  className?: string
}

/** Animated number that re-runs whenever `value` changes (the "alive" feel). */
export function CountUp({ value, from = 0, format = (n) => Math.round(n).toString(), duration = 0.8, className }: CountUpProps) {
  const [display, setDisplay] = useState(from)
  const prev = useRef(from)
  const location = useLocation()
  const lastKey = useRef(location.key)

  useEffect(() => {
    const isRouteChange = lastKey.current !== location.key
    lastKey.current = location.key

    const startValue = isRouteChange ? from : prev.current

    if (isRouteChange) {
      setDisplay(from)
    }

    const controls = animate(startValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    })
    prev.current = value
    return () => controls.stop()
  }, [value, duration, location.key, from])

  return <span className={className}>{format(display)}</span>
}
