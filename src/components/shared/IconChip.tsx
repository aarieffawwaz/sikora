import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChipTone = "blue" | "green" | "amber" | "purple" | "orange" | "rose" | "slate"
export type ChipVariant = "light" | "solid"

const LIGHT_TONES: Record<ChipTone, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  purple: "bg-violet-100 text-violet-600",
  orange: "bg-orange-100 text-orange-600",
  rose: "bg-rose-100 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
}

const SOLID_TONES: Record<ChipTone, string> = {
  blue: "bg-blue-600 text-white",
  green: "bg-emerald-600 text-white",
  amber: "bg-amber-500 text-white",
  purple: "bg-violet-600 text-white",
  orange: "bg-orange-500 text-white",
  rose: "bg-rose-600 text-white",
  slate: "bg-slate-600 text-white",
}

export function IconChip({
  icon: Icon,
  tone = "blue",
  variant = "light",
  className,
}: {
  icon: LucideIcon
  tone?: ChipTone
  variant?: ChipVariant
  className?: string
}) {
  const toneClass = variant === "solid" ? SOLID_TONES[tone] : LIGHT_TONES[tone]
  const shapeClass = variant === "solid" ? "rounded-full" : "rounded-xl"
  
  return (
    <div className={cn("flex size-11 shrink-0 items-center justify-center", shapeClass, toneClass, className)}>
      <Icon className="size-5" strokeWidth={2.2} />
    </div>
  )
}
