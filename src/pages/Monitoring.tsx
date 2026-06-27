import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from "lucide-react"
import { useSikoraStore } from "@/store/useSikoraStore"
import { recommendFor } from "@/lib/aiEngine"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { OperationsMap, MapFilterDropdown } from "@/components/shared/OperationsMap"
import { RestockPriority } from "@/components/dashboard/RestockPriority"
import { HealthGauge } from "@/components/dashboard/HealthGauge"
import { GeraiSyncList } from "@/components/dashboard/GeraiSyncList"
import { cn } from "@/lib/utils"

export function Monitoring() {
  const products = useSikoraStore((s) => s.products)
  const counts = products.reduce(
    (acc, p) => {
      acc[recommendFor(p).severity]++
      return acc
    },
    { segera: 0, perlu: 0, aman: 0, overstock: 0 } as Record<string, number>,
  )

  const stats = [
    { label: "Segera Restock", value: counts.segera, icon: AlertCircle, tone: "text-rose-600 border-rose-100 bg-rose-50/20" },
    { label: "Perlu Restock", value: counts.perlu, icon: Clock, tone: "text-amber-600 border-amber-100 bg-amber-50/20" },
    { label: "Stok Aman", value: counts.aman, icon: CheckCircle2, tone: "text-emerald-600 border-emerald-100 bg-emerald-50/20" },
    { label: "Overstock", value: counts.overstock, icon: ShieldAlert, tone: "text-orange-600 border-orange-100 bg-orange-50/20" },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Monitoring" subtitle="Pantau kondisi persediaan dan sinkronisasi seluruh gerai." />

      <Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                "flex items-center justify-between rounded-2xl border p-4 shadow-sm bg-white",
                s.tone.split(" ")[1] // border color
              )}
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-3xl font-black text-slate-800">{s.value}</p>
              </div>
              <div className={cn("flex size-11 items-center justify-center rounded-xl", s.tone.split(" ")[0], s.tone.split(" ")[2])}>
                <s.icon className="size-5.5" />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SectionCard className="lg:col-span-2" title="Peta Operasional KDKMP" subtitle="Sebaran kondisi gerai secara nasional" action={<MapFilterDropdown />}>
            <OperationsMap />
          </SectionCard>
          <SectionCard title="Kesehatan Operasional">
            <HealthGauge />
          </SectionCard>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SectionCard className="lg:col-span-2" title="Prioritas Restock (AI DSS)" subtitle="Diurutkan berdasarkan tingkat urgensi rekomendasi pengadaan">
            <RestockPriority limit={8} />
          </SectionCard>
          <SectionCard title="Status Sinkronisasi Gerai" subtitle="Kondisi sinkronisasi data gerai KDKMP secara real-time">
            <GeraiSyncList />
          </SectionCard>
        </div>
      </Reveal>
    </div>
  )
}
