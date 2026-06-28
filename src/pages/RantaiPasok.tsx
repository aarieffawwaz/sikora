import { useState } from "react"
import { ArrowRightLeft, ClipboardList, PackageSearch, Sparkles, Tag } from "lucide-react"
import { toast } from "sonner"
import { useSikoraStore } from "@/store/useSikoraStore"
import { bundleKey, expiryAlerts, suggestBundles } from "@/lib/aiEngine"
import { rupiah } from "@/lib/format"
import type { POStatus } from "@/lib/types"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

export function RantaiPasok() {
  const products = useSikoraStore((s) => s.products)
  const suppliers = useSikoraStore((s) => s.suppliers)
  const coop = useSikoraStore((s) => s.coop)
  const purchaseOrders = useSikoraStore((s) => s.purchaseOrders)
  const generatePoDraft = useSikoraStore((s) => s.generatePoDraft)
  const submitPo = useSikoraStore((s) => s.submitPo)
  const markPoShipped = useSikoraStore((s) => s.markPoShipped)
  const receivePo = useSikoraStore((s) => s.receivePo)
  const transferStock = useSikoraStore((s) => s.transferStock)
  const adjustStock = useSikoraStore((s) => s.adjustStock)
  const activePromoIds = useSikoraStore((s) => s.activePromoIds)
  const togglePromo = useSikoraStore((s) => s.togglePromo)

  const [poDialog, setPoDialog] = useState(false)
  const [poSupplierId, setPoSupplierId] = useState(suppliers[0]?.id ?? "")

  const [transferProductId, setTransferProductId] = useState(products[0]?.id ?? "")
  const [fromGerai, setFromGerai] = useState(coop.gerai[0]?.name ?? "")
  const [toGerai, setToGerai] = useState(coop.gerai[1]?.name ?? coop.gerai[0]?.name ?? "")
  const [transferQty, setTransferQty] = useState("")

  const [adjustProductId, setAdjustProductId] = useState(products[0]?.id ?? "")
  const [adjustQty, setAdjustQty] = useState("")

  const bundles = suggestBundles(products)
  const expiry = expiryAlerts(products)

  function submitPoDraft() {
    const supplier = suppliers.find((s) => s.id === poSupplierId)
    const po = generatePoDraft(poSupplierId)
    if (!po.items.length) {
      toast.warning(`Tidak ada produk dari ${supplier?.name} yang perlu direstock saat ini.`)
    } else {
      toast.success(`Draf PO untuk ${supplier?.name} dibuat`, { description: `${po.items.length} produk, total ${rupiah(po.total)}.` })
    }
    setPoDialog(false)
  }

  function submitTransfer() {
    const n = parseInt(transferQty, 10)
    if (!n || n <= 0 || !fromGerai || !toGerai) {
      toast.error("Lengkapi form transfer dengan benar")
      return
    }
    transferStock(transferProductId, fromGerai, toGerai, n)
    toast.success("Transfer stok dicatat")
    setTransferQty("")
  }

  function submitAdjust() {
    const n = parseInt(adjustQty, 10)
    if (isNaN(n) || n < 0) {
      toast.error("Isi stok baru yang valid")
      return
    }
    adjustStock(adjustProductId, n, "Penyesuaian manual")
    toast.success("Stok disesuaikan")
    setAdjustQty("")
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Rantai Pasok" subtitle="Smart-PO, transfer & penyesuaian stok, promo bundling — didukung AI Decision Support." />

      <Reveal>
        <SectionCard
          title="Purchase Order (Smart-PO)"
          subtitle={`${purchaseOrders.length} PO tercatat`}
          action={
            <Button size="sm" className="gap-2" onClick={() => setPoDialog(true)}>
              <Sparkles className="size-4" /> Generate Draf PO (AI)
            </Button>
          }
        >
          {purchaseOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">Belum ada PO.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                    <th className="pb-3 pl-2">Supplier</th>
                    <th className="pb-3">Item</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 pl-4">Status</th>
                    <th className="pb-3 text-right pr-2">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/60">
                      <td className="py-3 pl-2 font-medium text-slate-800">{po.supplierName}</td>
                      <td className="text-slate-500">{po.items.map((i) => i.productName).join(", ") || "—"}</td>
                      <td className="text-right font-semibold text-slate-800">{rupiah(po.total)}</td>
                      <td className="pl-4">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", PO_STATUS_STYLE[po.status])}>
                          {PO_STATUS_LABEL[po.status]}
                        </span>
                      </td>
                      <td className="pr-2 text-right">
                        {po.status === "draft" && (
                          <button onClick={() => submitPo(po.id)} className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-100">
                            Ajukan
                          </button>
                        )}
                        {po.status === "diajukan" && (
                          <button onClick={() => markPoShipped(po.id)} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                            Tandai Dikirim
                          </button>
                        )}
                        {po.status === "dikirim" && (
                          <button onClick={() => receivePo(po.id)} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100">
                            Terima Barang
                          </button>
                        )}
                        {po.status === "diterima" && <span className="text-xs text-slate-400">Selesai</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionCard title="Transfer Stok" subtitle="Pencatatan perpindahan stok antar gerai (simulasi)">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Produk</Label>
                <Select value={transferProductId} onValueChange={setTransferProductId}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.icon} {p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Dari Gerai</Label>
                  <Select value={fromGerai} onValueChange={setFromGerai}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {coop.gerai.map((g) => (
                        <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Ke Gerai</Label>
                  <Select value={toGerai} onValueChange={setToGerai}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {coop.gerai.map((g) => (
                        <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Jumlah</Label>
                <Input type="number" min={1} value={transferQty} onChange={(e) => setTransferQty(e.target.value)} placeholder="0" />
              </div>
              <Button onClick={submitTransfer} variant="outline" className="w-full gap-2">
                <ArrowRightLeft className="size-4" /> Catat Transfer
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Stock Adjustment" subtitle="Koreksi stok manual (selisih, rusak, dll)">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Produk</Label>
                <Select value={adjustProductId} onValueChange={setAdjustProductId}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.icon} {p.name} — stok {p.stock} {p.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Stok Baru (Hasil Koreksi)</Label>
                <Input type="number" min={0} value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} placeholder="0" />
              </div>
              <Button onClick={submitAdjust} variant="outline" className="w-full gap-2">
                <PackageSearch className="size-4" /> Simpan Penyesuaian
              </Button>
            </div>
          </SectionCard>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <SectionCard title="Promo & Bundling" subtitle="Saran AI dari produk overstock & mendekati kedaluwarsa">
          {bundles.length === 0 && expiry.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">Belum ada saran promo saat ini.</p>
          ) : (
            <div className="space-y-3">
              {bundles.map((b) => {
                const key = bundleKey(b)
                const active = activePromoIds.includes(key)
                return (
                  <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                        <Tag className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{b.productNames.join(" + ")} — diskon {b.discountPct}%</p>
                        <p className="text-xs text-slate-400">{b.reason}</p>
                      </div>
                    </div>
                    <Button size="sm" variant={active ? "default" : "outline"} onClick={() => togglePromo(key)}>
                      {active ? "Aktif" : "Aktifkan"}
                    </Button>
                  </div>
                )
              })}
              {expiry.map((a) => (
                <div key={a.productId} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <ClipboardList className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.productName} mendekati kedaluwarsa ({a.daysLeft} hari)</p>
                    <p className="text-xs text-slate-500">Saran diskon {a.suggestedDiscountPct}% untuk percepat penjualan.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </Reveal>

      <Dialog open={poDialog} onOpenChange={setPoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Draf PO (AI)</DialogTitle>
            <DialogDescription>AI akan menyusun draf PO dari rekomendasi restock untuk supplier terpilih.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-xs">Supplier</Label>
            <Select value={poSupplierId} onValueChange={setPoSupplierId}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPoDialog(false)}>Batal</Button>
            <Button onClick={submitPoDraft}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
