import { useSikoraStore } from "@/store/useSikoraStore"
import { recommendations } from "@/lib/aiEngine"
import { SeverityBadge } from "@/components/shared/SeverityBadge"

export function RestockPriority({ limit = 4 }: { limit?: number }) {
  const products = useSikoraStore((s) => s.products)
  const recs = recommendations(products).slice(0, limit)

  return (
    <div className="space-y-1">
      {recs.map((r) => (
        <div key={r.productId} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">{r.icon}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{r.productName}</p>
            <p className="text-xs text-slate-400">
              Stok: {r.stock} {r.unit}
            </p>
          </div>
          <SeverityBadge severity={r.severity} />
        </div>
      ))}
    </div>
  )
}
