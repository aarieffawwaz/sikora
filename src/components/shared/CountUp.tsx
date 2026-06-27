import { useEffect, useRef, useState } from "react"
import { animate } from "framer-motion"

interface CountUpProps {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}

/** Animated number that re-runs whenever `value` changes (the "alive" feel). */
export function CountUp({ value, format = (n) => Math.round(n).toString(), duration = 0.8, className }: CountUpProps) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    })
    prev.current = value
    return () => controls.stop()
  }, [value, duration])

  return <span className={className}>{format(display)}</span>
}
