import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

interface CountUpProps {
  value: number
  from?: number // kept for backwards compatibility
  format?: (n: number) => string
  duration?: number // in seconds
  className?: string
}

/** Animated number with an odometer / slot-machine scroll-up effect on mount or change. */
export function CountUp({
  value,
  format = (n) => Math.round(n).toString(),
  duration = 1.2,
  className,
}: CountUpProps) {
  const location = useLocation()
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(false)
    const timeout = setTimeout(() => {
      setAnimated(true)
    }, 50)
    return () => clearTimeout(timeout)
  }, [value, location.key])

  const formatted = format(value)

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {formatted.split("").map((char, index) => {
        const isDigit = /\d/.test(char)
        if (!isDigit) {
          return (
            <span key={index} className="whitespace-pre">
              {char}
            </span>
          )
        }

        const digit = parseInt(char, 10)
        return (
          <span
            key={index}
            className="inline-block overflow-hidden relative align-baseline font-mono text-center"
            style={{ height: "1em", lineHeight: "1em", width: "0.6em" }}
          >
            <span
              className="flex flex-col"
              style={{
                transform: `translateY(-${animated ? digit * 10 : 0}%)`,
                transition: `transform ${duration}s cubic-bezier(0.15, 0.85, 0.35, 1)`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center justify-center"
                  style={{ height: "1em", width: "0.6em" }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
