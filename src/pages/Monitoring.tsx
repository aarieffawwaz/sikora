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
import { IconChip, type ChipTone } from "@/components/shared/IconChip"
import { CountUp } from "@/components/shared/CountUp"

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
    { label: "Segera Restock", numericValue: counts.segera, suffix: " Produk", icon: AlertCircle, tone: "rose" as ChipTone, delta: "Tindakan segera diperlukan" },
    { label: "Perlu Restock", numericValue: counts.perlu, suffix: " Produk", icon: Clock, tone: "amber" as ChipTone, delta: "Perlu pengawasan stok" },
    { label: "Stok Aman", numericValue: counts.aman, suffix: " Produk", icon: CheckCircle2, tone: "emerald" as ChipTone, delta: "Kondisi stabil & aman" },
    { label: "Overstock", numericValue: counts.overstock, suffix: " Produk", icon: ShieldAlert, tone: "orange" as ChipTone, delta: "Optimalisasi pengadaan" },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Monitoring" subtitle="Pantau kondisi persediaan dan sinkronisasi seluruh gerai." />

      <Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-card px-4 py-3.5 shadow-sm">
              <div className="flex items-start gap-3">
                <IconChip icon={s.icon} tone={s.tone} variant="solid" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                  <p className="mt-0.5 text-xl font-bold leading-tight text-slate-900">
                    <CountUp value={s.numericValue} format={(n) => `${Math.round(n)}${s.suffix}`} />
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-end justify-between gap-1">
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                  {s.delta}
                </span>
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
            
            {/* Health Operational details section to fill empty space */}
            <div className="mt-6 border-t border-slate-100 pt-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">Kepatuhan Pelaporan</span>
                  <span className="text-slate-800">96%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">Akurasi Prediksi AI</span>
                  <span className="text-slate-800">89%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-violet-600 h-full rounded-full" style={{ width: "89%" }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">Akurasi Sinkronisasi</span>
                  <span className="text-slate-800">100%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
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
