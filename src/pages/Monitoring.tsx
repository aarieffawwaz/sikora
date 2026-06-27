import { useSikoraStore } from "@/store/useSikoraStore"
import { recommendFor } from "@/lib/aiEngine"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { OperationsMap, MapFilterDropdown } from "@/components/shared/OperationsMap"
import { RestockPriority } from "@/components/dashboard/RestockPriority"
import { HealthGauge } from "@/components/dashboard/HealthGauge"

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
    { label: "Segera Restock", value: counts.segera, cls: "text-rose-600 bg-rose-50" },
    { label: "Perlu Restock", value: counts.perlu, cls: "text-amber-600 bg-amber-50" },
    { label: "Aman", value: counts.aman, cls: "text-emerald-600 bg-emerald-50" },
    { label: "Overstock", value: counts.overstock, cls: "text-orange-600 bg-orange-50" },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Monitoring" subtitle="Pantau kondisi persediaan dan sinkronisasi seluruh gerai." />

      <Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.cls}`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
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
        <SectionCard title="Prioritas Restock (AI DSS)" subtitle="Diurutkan berdasarkan tingkat urgensi">
          <RestockPriority limit={8} />
        </SectionCard>
      </Reveal>
    </div>
  )
}
