import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

/** Fade-up on scroll into view — gives the sleek scrolling feel. */
export function Reveal({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: ReactNode
  delay?: number
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "fade-up-in" : "fade-up-init"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
