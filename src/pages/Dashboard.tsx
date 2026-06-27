import { Link } from "react-router-dom"
import {
  Brain,
  ChevronRight,
  FileBarChart,
  PackageMinus,
  PackagePlus,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { useSikoraStore } from "@/store/useSikoraStore"
import { isToday } from "@/lib/format"
import { aiRecommendCount } from "@/lib/dashboard"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { AssistantPanel } from "@/components/shared/AssistantPanel"
import { OperationsMap } from "@/components/shared/OperationsMap"
import { KpiCards } from "@/components/dashboard/KpiCards"
import { ActivityChart } from "@/components/dashboard/ActivityChart"
import { HealthGauge } from "@/components/dashboard/HealthGauge"
import { RestockPriority } from "@/components/dashboard/RestockPriority"
import { NotificationsList } from "@/components/dashboard/NotificationsList"

function Dropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
      {label}
      <ChevronRight className="size-3.5 rotate-90 text-slate-400" />
    </button>
  )
}

const QUICK = [
  { label: "Kasir POS", icon: ShoppingCart, to: "/pos", tone: "text-blue-600 bg-blue-50" },
  { label: "Barang Masuk", icon: PackagePlus, to: "/persediaan", tone: "text-emerald-600 bg-emerald-50" },
  { label: "Barang Keluar", icon: PackageMinus, to: "/persediaan", tone: "text-orange-600 bg-orange-50" },
  { label: "Kas Harian", icon: Wallet, to: "/pembukuan", tone: "text-amber-600 bg-amber-50" },
  { label: "Prediksi AI", icon: Brain, to: "/persediaan", tone: "text-violet-600 bg-violet-50" },
  { label: "Laporan", icon: FileBarChart, to: "/pembukuan", tone: "text-slate-600 bg-slate-100" },
]

export function Dashboard() {
  const transactions = useSikoraStore((s) => s.transactions)
  const movements = useSikoraStore((s) => s.movements)
  const products = useSikoraStore((s) => s.products)

  const txToday = transactions.filter((t) => isToday(t.at)).length
  const masukToday = movements.filter((m) => m.type === "masuk" && isToday(m.at)).length
  const keluarToday = movements.filter((m) => m.type === "keluar" && isToday(m.at)).length
  const aiCount = aiRecommendCount(products)

  const summary = [
    { icon: ShoppingCart, value: txToday, label: "Transaksi POS", delta: "18% dari kemarin", tone: "text-blue-600 bg-blue-50" },
    { icon: PackagePlus, value: masukToday, label: "Barang Masuk", delta: "12% dari kemarin", tone: "text-emerald-600 bg-emerald-50" },
    { icon: PackageMinus, value: keluarToday, label: "Barang Keluar", delta: "7% dari kemarin", tone: "text-orange-600 bg-orange-50" },
    { icon: RefreshCw, value: aiCount, label: "Rekomendasi AI", delta: "3% dari kemarin", tone: "text-violet-600 bg-violet-50" },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Selamat pagi, Admin Koperasi 👋" subtitle="Pantau operasional koperasi Anda secara real-time." />

      {/* KPI cards */}
      <Reveal>
        <KpiCards />
      </Reveal>

      {/* Status bar */}
      <Reveal delay={0.05}>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 rounded-2xl border border-emerald-100/50 bg-emerald-50/20 px-4 py-2.5 text-xs lg:text-[12.5px] shadow-sm">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-700 whitespace-nowrap">
            <svg className="size-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 11l2 2 4-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Semua sistem berjalan normal
          </span>
          <span className="text-slate-300 hidden sm:inline select-none">•</span>
          <span className="text-slate-600 whitespace-nowrap">Sinkronisasi Simkopdes aktif</span>
          <span className="text-slate-300 hidden md:inline select-none">•</span>
          <span className="text-slate-600 whitespace-nowrap">
            AI memperbarui <span className="font-bold text-slate-800">23</span> rekomendasi stok
          </span>
          <span className="text-slate-300 hidden lg:inline select-none">•</span>
          <span className="text-slate-600 whitespace-nowrap">
            <span className="font-bold text-slate-800">4</span> transaksi offline berhasil disinkronkan
          </span>
          <Link to="/monitoring" className="ml-auto flex items-center gap-0.5 font-bold text-primary whitespace-nowrap">
            Lihat Detail <ChevronRight className="size-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </Reveal>

      {/* Map + Assistant */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="Peta Operasional KDKMP"
            subtitle="Monitoring persediaan, transaksi dan sinkronisasi secara real-time"
            action={<Dropdown label="Kondisi Persediaan" />}
          >
            <OperationsMap />
          </SectionCard>
          <AssistantPanel className="min-h-[420px]" />
        </div>
      </Reveal>

      {/* Activity / Restock / Health / Notifications */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SectionCard title="Aktivitas Operasional" action={<Dropdown label="Mingguan" />}>
            <ActivityChart />
          </SectionCard>
          <SectionCard
            title="Prioritas Restock"
            action={
              <Link to="/persediaan" className="text-xs font-semibold text-primary">
                Lihat Semua
              </Link>
            }
          >
            <RestockPriority />
          </SectionCard>
          <SectionCard title="Kesehatan Operasional">
            <HealthGauge />
          </SectionCard>
          <SectionCard
            title="Notifikasi"
            action={
              <button className="text-xs font-semibold text-primary">Lihat Semua</button>
            }
          >
            <NotificationsList />
          </SectionCard>
        </div>
      </Reveal>

      {/* Summary + Quick access */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SectionCard className="lg:col-span-2" title="Ringkasan Aktivitas Hari Ini">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {summary.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-100 p-3.5">
                  <div className={`mb-2 flex size-9 items-center justify-center rounded-lg ${s.tone}`}>
                    <s.icon className="size-[18px]" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                    <TrendingUp className="size-3" /> {s.delta}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Akses Cepat">
            <div className="grid grid-cols-3 gap-3">
              {QUICK.map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-3 text-center transition-colors hover:bg-slate-50"
                >
                  <span className={`flex size-10 items-center justify-center rounded-xl ${q.tone}`}>
                    <q.icon className="size-5" />
                  </span>
                  <span className="text-xs font-medium text-slate-600">{q.label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </Reveal>
    </div>
  )
}
