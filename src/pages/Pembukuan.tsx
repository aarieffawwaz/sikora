import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react"
import { useSikoraStore } from "@/store/useSikoraStore"
import { isToday, rupiah } from "@/lib/format"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { IconChip } from "@/components/shared/IconChip"
import { CountUp } from "@/components/shared/CountUp"

export function Pembukuan() {
  const ledger = useSikoraStore((s) => s.ledger)
  const cashBalance = useSikoraStore((s) => s.cashBalance)

  const todays = ledger.filter((l) => isToday(l.at))
  const masuk = todays.filter((l) => l.type === "masuk").reduce((s, l) => s + l.amount, 0)
  const keluar = todays.filter((l) => l.type === "keluar").reduce((s, l) => s + l.amount, 0)
  const rows = [...ledger].reverse()

  const cards = [
    { icon: Wallet, tone: "blue" as const, label: "Saldo Kas", value: cashBalance },
    { icon: ArrowUpRight, tone: "green" as const, label: "Kas Masuk Hari Ini", value: masuk },
    { icon: ArrowDownLeft, tone: "amber" as const, label: "Kas Keluar Hari Ini", value: keluar },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Pembukuan Otomatis" subtitle="Setiap transaksi tercatat otomatis — tanpa input manual." />

      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-slate-100 bg-card p-4 shadow-sm">
              <IconChip icon={c.icon} tone={c.tone} />
              <p className="mt-3 text-xs text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-900">
                <CountUp value={c.value} format={rupiah} />
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <SectionCard title="Buku Kas Harian" subtitle={`${ledger.length} entri tercatat otomatis`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                  <th className="pb-3 pl-2">Waktu</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Keterangan</th>
                  <th className="pb-3 text-right">Masuk</th>
                  <th className="pb-3 text-right">Keluar</th>
                  <th className="pb-3 pr-2 text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60">
                    <td className="py-3 pl-2 text-slate-400">
                      {new Date(l.at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{l.category}</span>
                    </td>
                    <td className="text-slate-600">{l.description}</td>
                    <td className="text-right font-medium text-emerald-600">{l.type === "masuk" ? rupiah(l.amount) : "—"}</td>
                    <td className="text-right font-medium text-rose-500">{l.type === "keluar" ? rupiah(l.amount) : "—"}</td>
                    <td className="pr-2 text-right font-semibold text-slate-800">{rupiah(l.balanceAfter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </Reveal>
    </div>
  )
}
