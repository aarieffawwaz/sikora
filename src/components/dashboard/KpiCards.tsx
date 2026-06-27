import { Boxes, Brain, RefreshCw, ShoppingCart, TrendingUp, Wallet } from "lucide-react"
import { useSikoraStore } from "@/store/useSikoraStore"
import { aiRecommendCount, inventoryValue, salesToday } from "@/lib/dashboard"
import { angka, rupiahCompact } from "@/lib/format"
import { IconChip, type ChipTone } from "@/components/shared/IconChip"
import { CountUp } from "@/components/shared/CountUp"
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
  const products = useSikoraStore((s) => s.products)
  const transactions = useSikoraStore((s) => s.transactions)
  const synced = useSikoraStore((s) => s.synced)

  const invVal = inventoryValue(products)
  const today = salesToday(transactions)
  const aiCount = aiRecommendCount(products)

  const cards = [
    {
      icon: Boxes,
      tone: "blue" as ChipTone,
      label: "Nilai Persediaan",
      value: <CountUp value={invVal} format={rupiahCompact} />,
      delta: "12,6% dari periode lalu",
      spark: [2.1, 2.2, 2.15, 2.3, 2.28, 2.4, 2.48],
    },
    {
      icon: ShoppingCart,
      tone: "green" as ChipTone,
      label: "Transaksi Hari Ini",
      value: <CountUp value={today.count} format={angka} />,
      delta: "15,2% dari kemarin",
      spark: [3, 5, 4, 6, 5, 8, 9],
    },
    {
      icon: Wallet,
      tone: "amber" as ChipTone,
      label: "Kas Hari Ini",
      value: <CountUp value={today.total} format={rupiahCompact} />,
      delta: "9,8% dari kemarin",
      spark: [1, 2, 1.8, 2.4, 2.2, 3, 3.4],
    },
    {
      icon: Brain,
      tone: "purple" as ChipTone,
      label: "AI Prediksi",
      value: (
        <span>
          <CountUp value={aiCount} format={angka} /> Produk
        </span>
      ),
      sub: "Direkomendasikan",
      delta: "Update hari ini",
      deltaPlain: true,
      spark: [2, 3, 2.5, 4, 3.5, 5, 4.5],
    },
    {
      icon: RefreshCw,
      tone: "orange" as ChipTone,
      label: "Sinkronisasi Simkopdes",
      value: <span>{synced ? "100%" : "—"} Sinkron</span>,
      delta: "Update 2 menit lalu",
      deltaPlain: true,
      spark: [4, 5, 4.5, 6, 5.5, 7, 8],
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="flex flex-col rounded-2xl border border-slate-100 bg-card px-4 py-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <IconChip icon={c.icon} tone={c.tone} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
              <p className="mt-0.5 text-xl font-bold leading-tight text-slate-900">{c.value}</p>
              {c.sub && <p className="text-xs font-semibold text-slate-700">{c.sub}</p>}
            </div>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <span className={c.deltaPlain ? "text-xs text-slate-400" : "inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"}>
              {!c.deltaPlain && <TrendingUp className="size-3.5" />}
              {c.delta}
            </span>
            <Sparkline data={c.spark} color={TREND[c.tone]} />
          </div>
        </div>
      ))}
    </div>
  )
}
