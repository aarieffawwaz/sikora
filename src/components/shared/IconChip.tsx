import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChipTone = "blue" | "green" | "amber" | "purple" | "orange" | "rose" | "slate"

const TONES: Record<ChipTone, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  purple: "bg-violet-100 text-violet-600",
  orange: "bg-orange-100 text-orange-600",
  rose: "bg-rose-100 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
}

export function IconChip({
  icon: Icon,
  tone = "blue",
  className,
}: {
  icon: LucideIcon
  tone?: ChipTone
  className?: string
}) {
  return (
    <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", TONES[tone], className)}>
      <Icon className="size-5" strokeWidth={2.2} />
    </div>
  )
}
