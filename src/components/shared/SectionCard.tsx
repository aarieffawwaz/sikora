import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

/** Standard white rounded card used across every module for visual consistency. */
export function SectionCard({ title, subtitle, action, children, className, bodyClassName }: SectionCardProps) {
  return (
    <div className={cn("rounded-2xl border border-slate-100 bg-card p-5 shadow-sm", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
