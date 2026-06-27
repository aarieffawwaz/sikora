import { useState } from "react"
import { Building2, CheckCircle2, Database, MapPin, RefreshCw, Store, Users } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useSikoraStore } from "@/store/useSikoraStore"
import { waktuLalu } from "@/lib/format"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { IconChip } from "@/components/shared/IconChip"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CountUp } from "@/components/shared/CountUp"

const STEPS = ["Menghubungkan ke Simkopdes", "Menarik profil koperasi", "Menarik data gerai", "Sinkronisasi selesai"]
const GERAI_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  aman: { label: "Aman", cls: "bg-emerald-50 text-emerald-600" },
  understock: { label: "Understock", cls: "bg-rose-50 text-rose-600" },
  overstock: { label: "Overstock", cls: "bg-orange-50 text-orange-600" },
  "belum-sinkron": { label: "Belum Sinkron", cls: "bg-slate-100 text-slate-500" },
}

export function Sinkronisasi() {
  const coop = useSikoraStore((s) => s.coop)
  const products = useSikoraStore((s) => s.products)
  const lastSyncAt = useSikoraStore((s) => s.lastSyncAt)
  const syncFromSimkopdes = useSikoraStore((s) => s.syncFromSimkopdes)

  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(-1)

  function runSync() {
    if (running) return
    setRunning(true)
    setProgress(0)
    setStep(0)
    let p = 0
    const timer = setInterval(() => {
      p += 4 + Math.random() * 6
      setProgress(Math.min(100, p))
      setStep(Math.min(STEPS.length - 1, Math.floor((p / 100) * STEPS.length)))
      if (p >= 100) {
        clearInterval(timer)
        syncFromSimkopdes()
        setRunning(false)
        toast.success("Sinkronisasi Simkopdes berhasil", { description: "Data koperasi & gerai diperbarui." })
      }
    }, 180)
  }

  const stats = [
    { icon: Building2, tone: "blue" as const, label: "Profil Koperasi", value: coop.name },
    { icon: Users, tone: "green" as const, label: "Jumlah Anggota", numericValue: coop.memberCount, suffix: " anggota" },
    { icon: Store, tone: "amber" as const, label: "Total Gerai", numericValue: coop.geraiCount, suffix: " gerai" },
    { icon: Database, tone: "purple" as const, label: "Produk Tersinkron", numericValue: products.length, suffix: " produk" },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Sinkronisasi Data" subtitle="Tarik data operasional dari Simkopdes tanpa input ulang." />

      <Reveal>
        <SectionCard>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <IconChip icon={RefreshCw} tone="orange" className="size-14" />
              <div>
                <p className="text-base font-semibold text-slate-800">Integrasi Simkopdes</p>
                <p className="text-sm text-slate-500">
                  Sinkronisasi terakhir: {waktuLalu(lastSyncAt)}
                </p>
              </div>
            </div>
            <Button onClick={runSync} disabled={running} size="lg" className="gap-2">
              <RefreshCw className={cn("size-4", running && "animate-spin")} />
              {running ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
            </Button>
          </div>

          {(running || progress > 0) && (
            <div className="mt-6 space-y-3">
              <Progress value={progress} className="h-2" />
              <div className="grid gap-2 sm:grid-cols-2">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      i <= step ? "text-slate-700" : "text-slate-300",
                    )}
                  >
                    <CheckCircle2 className={cn("size-4", i <= step ? "text-emerald-500" : "text-slate-200")} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <motion.div key={s.label} layout className="rounded-2xl border border-slate-100 bg-card p-4 shadow-sm">
              <IconChip icon={s.icon} tone={s.tone} />
              <p className="mt-3 text-xs text-slate-500">{s.label}</p>
              <p className="text-sm font-semibold text-slate-800">
                {s.numericValue !== undefined ? (
                  <CountUp value={s.numericValue} format={(n) => `${Math.round(n)}${s.suffix}`} />
                ) : (
                  s.value
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <SectionCard title="Data Gerai Tersinkron" subtitle={`${coop.name} — ${coop.region}`}>
          <div className="divide-y divide-slate-100">
            {coop.gerai.map((g) => {
              const st = GERAI_STATUS_LABEL[g.status]
              return (
                <div key={g.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{g.name}</p>
                      <p className="text-xs text-slate-400">{g.region}</p>
                    </div>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", st.cls)}>{st.label}</span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </Reveal>
    </div>
  )
}
