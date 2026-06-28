import { useState } from "react"
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useSikoraStore } from "@/store/useSikoraStore"
import { ACCOUNTS, balanceSheet, generalLedger, incomeStatement, journalEntries } from "@/lib/accounting"
import { isToday, rupiah, rupiahCompact } from "@/lib/format"
import { CASH_OPENING } from "@/data/seed"
import type { POStatus } from "@/lib/types"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { IconChip } from "@/components/shared/IconChip"
import { CountUp } from "@/components/shared/CountUp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const PO_STATUS_STYLE: Record<POStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  diajukan: "bg-amber-50 text-amber-600",
  dikirim: "bg-blue-50 text-blue-600",
  diterima: "bg-emerald-50 text-emerald-600",
}
const PO_STATUS_LABEL: Record<POStatus, string> = {
  draft: "Draf",
  diajukan: "Diajukan",
  dikirim: "Dikirim",
  diterima: "Diterima",
}

export function Pembukuan() {
  const ledger = useSikoraStore((s) => s.ledger)
  const cashBalance = useSikoraStore((s) => s.cashBalance)
  const transactions = useSikoraStore((s) => s.transactions)
  const products = useSikoraStore((s) => s.products)
  const purchaseOrders = useSikoraStore((s) => s.purchaseOrders)

  const [account, setAccount] = useState<string>(ACCOUNTS.KAS)

  const todays = ledger.filter((l) => isToday(l.at))
  const masuk = todays.filter((l) => l.type === "masuk").reduce((s, l) => s + l.amount, 0)
  const keluar = todays.filter((l) => l.type === "keluar").reduce((s, l) => s + l.amount, 0)
  const rows = [...ledger].reverse()

  const cards = [
    { icon: Wallet, tone: "blue" as const, label: "Saldo Kas", value: cashBalance },
    { icon: ArrowUpRight, tone: "green" as const, label: "Kas Masuk Hari Ini", value: masuk },
    { icon: ArrowDownLeft, tone: "amber" as const, label: "Kas Keluar Hari Ini", value: keluar },
  ]

  const journal = [...journalEntries(ledger)].reverse()
  const ledgerByAccount = generalLedger(ledger)
  const accountRows = [...(ledgerByAccount[account] ?? [])].reverse()

  const laba = incomeStatement(transactions, ledger, products)
  const neraca = balanceSheet(cashBalance, products, CASH_OPENING)

  const marginByProduct = products
    .map((p) => ({ name: p.name, margin: (p.price - p.cost) * p.soldUnits }))
    .sort((a, b) => b.margin - a.margin)

  return (
    <div className="space-y-5">
      <PageHeader title="Pembukuan Otomatis" subtitle="Jurnal, buku besar, dan laporan keuangan tersusun otomatis dari setiap transaksi." />

      <Tabs defaultValue="kas">
        <Reveal>
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="kas">Buku Kas Harian</TabsTrigger>
            <TabsTrigger value="jurnal">Jurnal Umum</TabsTrigger>
            <TabsTrigger value="besar">Buku Besar</TabsTrigger>
            <TabsTrigger value="laporan">Laporan Keuangan</TabsTrigger>
            <TabsTrigger value="faktur">Faktur Supplier</TabsTrigger>
          </TabsList>
        </Reveal>

        <TabsContent value="kas" className="space-y-5 pt-4">
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
        </TabsContent>

        <TabsContent value="jurnal" className="pt-4">
          <Reveal>
            <SectionCard title="Jurnal Umum" subtitle="Setiap entri kas otomatis dipecah jadi baris debit & kredit (double-entry).">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                      <th className="pb-3 pl-2">Tanggal</th>
                      <th className="pb-3">Keterangan</th>
                      <th className="pb-3">Akun Debit</th>
                      <th className="pb-3">Akun Kredit</th>
                      <th className="pb-3 pr-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {journal.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/60">
                        <td className="py-3 pl-2 text-slate-400">{new Date(j.at).toLocaleDateString("id-ID")}</td>
                        <td className="text-slate-600">{j.description}</td>
                        <td className="font-medium text-slate-700">{j.debitAccount}</td>
                        <td className="font-medium text-slate-700">{j.creditAccount}</td>
                        <td className="pr-2 text-right font-semibold text-slate-800">{rupiah(j.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </Reveal>
        </TabsContent>

        <TabsContent value="besar" className="pt-4">
          <Reveal>
            <SectionCard
              title="Buku Besar"
              subtitle="Posisi & riwayat per akun, saldo berjalan."
              action={
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(ACCOUNTS).map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            >
              {accountRows.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">Belum ada transaksi untuk akun ini.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                        <th className="pb-3 pl-2">Tanggal</th>
                        <th className="pb-3">Keterangan</th>
                        <th className="pb-3 text-right">Debit</th>
                        <th className="pb-3 text-right">Kredit</th>
                        <th className="pb-3 pr-2 text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {accountRows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/60">
                          <td className="py-3 pl-2 text-slate-400">{new Date(r.at).toLocaleDateString("id-ID")}</td>
                          <td className="text-slate-600">{r.description}</td>
                          <td className="text-right font-medium text-emerald-600">{r.debit ? rupiah(r.debit) : "—"}</td>
                          <td className="text-right font-medium text-rose-500">{r.credit ? rupiah(r.credit) : "—"}</td>
                          <td className="pr-2 text-right font-semibold text-slate-800">{rupiah(r.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </Reveal>
        </TabsContent>

        <TabsContent value="laporan" className="space-y-5 pt-4">
          <Reveal>
            <SectionCard title="Laporan Laba Rugi" subtitle="Pendapatan dikurangi harga pokok penjualan & beban operasional.">
              <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                <Row label="Pendapatan Penjualan" value={laba.pendapatan} />
                <Row label="Beban Pembelian (HPP)" value={laba.hpp ? -laba.hpp : 0} />
                <Row label="Laba Kotor" value={laba.labaKotor} bold />
                <Row label="Beban Operasional" value={laba.bebanOperasional ? -laba.bebanOperasional : 0} />
                <Row label="Laba Bersih" value={laba.labaBersih} bold accent />
              </div>
            </SectionCard>
          </Reveal>

          <Reveal delay={0.05}>
            <SectionCard title="Neraca" subtitle="Estimasi posisi aset & modal koperasi saat ini (sederhana, bukan audit formal).">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-slate-400">Aset</p>
                  <Row label="Kas" value={neraca.kas} />
                  <Row label="Persediaan Barang Dagang" value={neraca.persediaan} />
                  <Row label="Total Aset" value={neraca.totalAset} bold />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-slate-400">Modal</p>
                  <Row label="Modal Awal" value={neraca.modalAwal} />
                  <Row label="Laba Ditahan (estimasi)" value={neraca.labaDitahan} />
                  <Row label="Total Modal" value={neraca.totalModal} bold accent />
                </div>
              </div>
            </SectionCard>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionCard title="Margin per Produk" subtitle="(Harga jual - harga beli) x unit terjual">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={marginByProduct} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => rupiahCompact(v)} />
                  <Tooltip formatter={(v) => rupiah(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Bar dataKey="margin" name="Margin" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </Reveal>
        </TabsContent>

        <TabsContent value="faktur" className="pt-4">
          <Reveal>
            <SectionCard title="Faktur Supplier" subtitle="Status pembayaran/penerimaan PO dari modul Rantai Pasok.">
              {purchaseOrders.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">Belum ada faktur.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                        <th className="pb-3 pl-2">Tanggal</th>
                        <th className="pb-3">Supplier</th>
                        <th className="pb-3 text-right">Total</th>
                        <th className="pb-3 pl-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {purchaseOrders.map((po) => (
                        <tr key={po.id} className="hover:bg-slate-50/60">
                          <td className="py-3 pl-2 text-slate-400">{new Date(po.createdAt).toLocaleDateString("id-ID")}</td>
                          <td className="font-medium text-slate-800">{po.supplierName}</td>
                          <td className="text-right font-semibold text-slate-800">{rupiah(po.total)}</td>
                          <td className="pl-4">
                            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", PO_STATUS_STYLE[po.status])}>
                              {PO_STATUS_LABEL[po.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </Reveal>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Row({ label, value, bold, accent }: { label: string; value: number; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-1.5 text-sm">
      <span className={cn("text-slate-500", bold && "font-medium text-slate-700")}>{label}</span>
      <span className={cn("font-semibold text-slate-800", bold && "text-base", accent && (value >= 0 ? "text-emerald-600" : "text-rose-500"))}>
        {rupiah(value)}
      </span>
    </div>
  )
}
