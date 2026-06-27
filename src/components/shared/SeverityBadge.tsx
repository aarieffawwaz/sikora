import { Sparkles } from "lucide-react"
import type { Severity } from "@/lib/types"
import { SEVERITY_LABEL } from "@/lib/aiEngine"
import { cn } from "@/lib/utils"

const STYLES: Record<Severity, string> = {
  segera: "bg-rose-50 text-rose-600 ring-rose-200",
  perlu: "bg-amber-50 text-amber-600 ring-amber-200",
  aman: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  overstock: "bg-orange-50 text-orange-600 ring-orange-200",
}

export function SeverityBadge({ severity, ai = true }: { severity: Severity; ai?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        STYLES[severity],
      )}
    >
      {SEVERITY_LABEL[severity]}
      {ai && <Sparkles className="size-3" />}
    </span>
  )
}
