import { AlertTriangle, CheckCircle2, FileText, RefreshCw, Sparkles, type LucideIcon } from "lucide-react"
import { useSikoraStore } from "@/store/useSikoraStore"
import type { NotifKind } from "@/lib/types"
import { waktuLalu } from "@/lib/format"
import { cn } from "@/lib/utils"

const ICON: Record<NotifKind, { icon: LucideIcon; tone: string }> = {
  ai: { icon: Sparkles, tone: "bg-violet-100 text-violet-600" },
  warning: { icon: AlertTriangle, tone: "bg-rose-100 text-rose-600" },
  sync: { icon: RefreshCw, tone: "bg-blue-100 text-blue-600" },
  success: { icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-600" },
  report: { icon: FileText, tone: "bg-slate-100 text-slate-600" },
}

export function NotificationsList({ limit = 4 }: { limit?: number }) {
  const notifications = useSikoraStore((s) => s.notifications)

  return (
    <div className="space-y-3">
      {notifications.slice(0, limit).map((n) => {
        const { icon: Icon, tone } = ICON[n.kind]
        return (
          <div key={n.id} className="flex gap-3">
            <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tone)}>
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-snug text-slate-700">{n.title}</p>
              {n.detail && <p className="text-xs text-slate-500">{n.detail}</p>}
              <p className="mt-0.5 text-xs text-slate-400">{waktuLalu(n.at)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
