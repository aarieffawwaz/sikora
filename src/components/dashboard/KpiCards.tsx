import { Archive, Brain, RefreshCw, ShoppingCart, Wallet, Sparkles, Clock } from "lucide-react"
import { IconChip, type ChipTone } from "@/components/shared/IconChip"
import { Sparkline } from "@/components/shared/Sparkline"

const TREND: Record<ChipTone, string> = {
  blue: "#2563eb",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  orange: "#f97316",
  rose: "#f43f5e",
  slate: "#94a3b8",
}

export function KpiCards() {
  const cards = [
    {
      icon: Archive,
      tone: "blue" as ChipTone,
      label: "Nilai Persediaan",
      value: "Rp 2,48 M",
      trend: "12,6%",
      delta: "dari periode lalu",
      spark: [2.1, 2.2, 2.15, 2.3, 2.28, 2.4, 2.48],
    },
    {
      icon: ShoppingCart,
      tone: "green" as ChipTone,
      label: "Transaksi Hari Ini",
      value: "1.248",
      trend: "15,2%",
      delta: "dari kemarin",
      spark: [3, 5, 4, 6, 5, 8, 9],
    },
    {
      icon: Wallet,
      tone: "amber" as ChipTone,
      label: "Kas Hari Ini",
      value: "Rp 18,5 Jt",
      trend: "9,8%",
      delta: "dari kemarin",
      spark: [1, 2, 1.8, 2.4, 2.2, 3, 3.4],
    },
    {
      icon: Brain,
      tone: "purple" as ChipTone,
      label: "AI Prediksi",
      value: "23 Produk",
      delta: "Update hari ini",
      isPill: true,
      spark: [2, 3, 2.5, 4, 3.5, 5, 4.5],
    },
    {
      icon: RefreshCw,
      tone: "orange" as ChipTone,
      label: "Sinkronisasi Simkopdes",
      value: "100% Sinkron",
      delta: "Update 2 menit lalu",
      spark: [4, 5, 4.5, 6, 5.5, 7, 8],
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-card px-4 py-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <IconChip icon={c.icon} tone={c.tone} variant="solid" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
              <p className="mt-0.5 text-xl font-bold leading-tight text-slate-900">{c.value}</p>
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-1">
            {c.trend ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 border border-slate-100 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                <span className="font-semibold text-emerald-600 mr-0.5">↑ {c.trend}</span>
                {c.delta}
              </span>
            ) : c.isPill ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-0.5 border border-slate-100 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                <Sparkles className="size-3 text-blue-500" />
                {c.delta}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-0.5 border border-slate-100 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                <Clock className="size-3 text-slate-400" />
                {c.delta}
              </span>
            )}
            <Sparkline data={c.spark} color={TREND[c.tone]} />
          </div>
        </div>
      ))}
    </div>
  )
}
