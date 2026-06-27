import { useState } from "react"
import { PackageMinus, PackagePlus, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useSikoraStore } from "@/store/useSikoraStore"
import { recommendFor } from "@/lib/aiEngine"
import { rupiah } from "@/lib/format"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { SeverityBadge } from "@/components/shared/SeverityBadge"
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

type Mode = "masuk" | "keluar"

export function Persediaan() {
  const products = useSikoraStore((s) => s.products)
  const addStock = useSikoraStore((s) => s.addStock)
  const removeStock = useSikoraStore((s) => s.removeStock)

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("masuk")
  const [productId, setProductId] = useState(products[0]?.id ?? "")
  const [qty, setQty] = useState("")

  function launch(m: Mode, presetId?: string) {
    setMode(m)
    if (presetId) setProductId(presetId)
    setQty("")
    setOpen(true)
  }

  function submit() {
    const n = parseInt(qty, 10)
    const p = products.find((x) => x.id === productId)
    if (!p || !n || n <= 0) {
      toast.error("Masukkan jumlah yang valid")
      return
    }
    if (mode === "masuk") {
      addStock(productId, n, "Input manual")
      toast.success(`Barang masuk: ${p.name} +${n} ${p.unit}`, { description: "Nilai persediaan diperbarui." })
    } else {
      removeStock(productId, n, "Input manual")
      toast.success(`Barang keluar: ${p.name} -${n} ${p.unit}`)
    }
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Persediaan & Rantai Pasok" subtitle="Kelola stok dengan rekomendasi AI Decision Support System." />

      <Reveal>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => launch("masuk")} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <PackagePlus className="size-4" /> Barang Masuk
          </Button>
          <Button onClick={() => launch("keluar")} variant="outline" className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <PackageMinus className="size-4" /> Barang Keluar
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <SectionCard title="Daftar Produk" subtitle={`${products.length} produk · rekomendasi diperbarui real-time`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                  <th className="pb-3 pl-2">Produk</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3 text-right">Stok</th>
                  <th className="pb-3 text-right">Harga</th>
                  <th className="pb-3">Status AI</th>
                  <th className="pb-3">Rekomendasi AI</th>
                  <th className="pb-3 text-right pr-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => {
                  const r = recommendFor(p)
                  const actionable = r.severity === "segera" || r.severity === "perlu"
                  return (
                    <tr key={p.id} className="group hover:bg-slate-50/60">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-lg">{p.icon}</span>
                          <span className="font-medium text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="text-slate-500">{p.category}</td>
                      <td className="text-right font-semibold text-slate-800">
                        {p.stock} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                      </td>
                      <td className="text-right text-slate-500">{rupiah(p.price)}</td>
                      <td>
                        <SeverityBadge severity={r.severity} />
                      </td>
                      <td>
                        {actionable ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600">
                            <Sparkles className="size-3.5" /> Restock {r.recommendedQty} {p.unit}
                          </span>
                        ) : r.severity === "overstock" ? (
                          <span className="text-xs text-orange-500">Kurangi pengadaan</span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="pr-2 text-right">
                        <button
                          onClick={() => launch("masuk", p.id)}
                          className={cn(
                            "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                            actionable ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "text-slate-500 hover:bg-slate-100",
                          )}
                        >
                          + Stok
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </Reveal>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "masuk" ? "Barang Masuk" : "Barang Keluar"}</DialogTitle>
            <DialogDescription>
              {mode === "masuk"
                ? "Tambah stok produk. Nilai persediaan & dashboard diperbarui otomatis."
                : "Catat barang keluar non-penjualan (rusak, retur, dll)."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Produk</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih produk" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.icon} {p.name} — stok {p.stock} {p.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jumlah</Label>
              <Input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit} className={mode === "masuk" ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
              {mode === "masuk" ? "Tambah Stok" : "Kurangi Stok"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
