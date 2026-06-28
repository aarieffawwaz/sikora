import { useMemo, useState } from "react"
import { Lock, Minus, Plus, ShoppingCart, Trash2, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { useSikoraStore } from "@/store/useSikoraStore"
import type { CartItem } from "@/lib/types"
import { bundleKey, suggestBundles } from "@/lib/aiEngine"
import { rupiah } from "@/lib/format"
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

export function Pos() {
  const products = useSikoraStore((s) => s.products)
  const isOnline = useSikoraStore((s) => s.isOnline)
  const recordSale = useSikoraStore((s) => s.recordSale)
  const activeShift = useSikoraStore((s) => s.activeShift)
  const openShift = useSikoraStore((s) => s.openShift)
  const closeShift = useSikoraStore((s) => s.closeShift)
  const transactions = useSikoraStore((s) => s.transactions)
  const members = useSikoraStore((s) => s.members)
  const activePromoIds = useSikoraStore((s) => s.activePromoIds)

  const [cart, setCart] = useState<Record<string, number>>({})
  const [paid, setPaid] = useState("")
  const [memberId, setMemberId] = useState("")

  const [openShiftDialog, setOpenShiftDialog] = useState(false)
  const [openingCash, setOpeningCash] = useState("")
  const [cashierName, setCashierName] = useState("")

  const [closeShiftDialog, setCloseShiftDialog] = useState(false)
  const [actualCash, setActualCash] = useState("")

  const items: CartItem[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const p = products.find((x) => x.id === id)!
          return { productId: id, name: p.name, qty, price: p.price }
        })
        .filter((i) => i.qty > 0),
    [cart, products],
  )
  const total = items.reduce((s, i) => s + i.qty * i.price, 0)
  const paidNum = parseInt(paid, 10) || 0

  const activeBundles = useMemo(
    () => suggestBundles(products).filter((b) => activePromoIds.includes(bundleKey(b))),
    [products, activePromoIds],
  )
  const cartProductIds = new Set(items.map((i) => i.productId))
  const matchedBundle = activeBundles.find((b) => b.productIds.some((id) => cartProductIds.has(id)))

  function add(id: string) {
    const p = products.find((x) => x.id === id)!
    setCart((c) => {
      const next = (c[id] ?? 0) + 1
      if (next > p.stock) {
        toast.error(`Stok ${p.name} tidak cukup`)
        return c
      }
      return { ...c, [id]: next }
    })
  }
  function dec(id: string) {
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }))
  }

  function checkout() {
    if (!items.length) return
    const pay = paidNum >= total ? paidNum : total
    recordSale(items, pay, memberId || undefined)
    toast.success("Transaksi berhasil", {
      description: isOnline ? "Stok, kas & pembukuan diperbarui." : "Disimpan offline, akan disinkronkan.",
    })
    setCart({})
    setPaid("")
    setMemberId("")
  }

  function submitOpenShift() {
    const n = parseInt(openingCash, 10)
    if (!cashierName.trim() || isNaN(n) || n < 0) {
      toast.error("Isi nama kasir & kas awal yang valid")
      return
    }
    openShift(n, cashierName.trim())
    toast.success("Shift kasir dibuka", { description: `Kas awal ${rupiah(n)}.` })
    setOpenShiftDialog(false)
    setOpeningCash("")
    setCashierName("")
  }

  const expectedClosingCash = activeShift
    ? activeShift.openingCash + transactions.filter((t) => t.at >= activeShift.openedAt).reduce((s, t) => s + t.total, 0)
    : 0

  function submitCloseShift() {
    const n = parseInt(actualCash, 10)
    if (isNaN(n) || n < 0) {
      toast.error("Isi jumlah kas fisik yang valid")
      return
    }
    const variance = n - expectedClosingCash
    closeShift(n)
    toast(variance === 0 ? "Shift ditutup — kas sesuai." : "Shift ditutup", {
      description: variance === 0 ? undefined : `Selisih kas: ${rupiah(variance)}`,
    })
    setCloseShiftDialog(false)
    setActualCash("")
  }

  if (!activeShift) {
    return (
      <div className="space-y-5">
        <PageHeader title="Transaksi POS" subtitle="Antarmuka kasir offline-first — penjualan langsung memperbarui semua modul." />
        <Reveal>
          <SectionCard>
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <Lock className="size-9 text-slate-300" />
              <p className="font-medium text-slate-700">Shift kasir belum dibuka</p>
              <p className="max-w-sm text-sm text-slate-400">
                Buka shift dengan mencatat kas awal sebelum mulai bertransaksi. Kas fisik akan dicocokkan saat tutup shift.
              </p>
              <Button className="mt-2 gap-2" onClick={() => setOpenShiftDialog(true)}>
                Buka Shift Kasir
              </Button>
            </div>
          </SectionCard>
        </Reveal>

        <Dialog open={openShiftDialog} onOpenChange={setOpenShiftDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buka Shift Kasir</DialogTitle>
              <DialogDescription>Catat kas awal & nama kasir sebelum mulai bertransaksi.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nama Kasir</Label>
                <Input value={cashierName} onChange={(e) => setCashierName(e.target.value)} placeholder="Mis. Siti" />
              </div>
              <div className="space-y-2">
                <Label>Kas Awal</Label>
                <Input type="number" min={0} value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenShiftDialog(false)}>
                Batal
              </Button>
              <Button onClick={submitOpenShift}>Buka Shift</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Transaksi POS" subtitle="Antarmuka kasir offline-first — penjualan langsung memperbarui semua modul." />

      <Reveal>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Product grid */}
          <SectionCard
            className="lg:col-span-2"
            title="Pilih Produk"
            action={
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    isOnline ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
                  )}
                >
                  {isOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
                  {isOnline ? "Online" : "Mode Offline"}
                </span>
                <Button size="sm" variant="outline" onClick={() => setCloseShiftDialog(true)}>
                  Tutup Shift
                </Button>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => add(p.id)}
                  disabled={p.stock <= 0}
                  className="flex flex-col items-start gap-2 rounded-xl border border-slate-100 p-3 text-left transition-all hover:border-primary/40 hover:shadow-sm disabled:opacity-40"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-xl">{p.icon}</span>
                  <span className="text-sm font-medium leading-tight text-slate-800">{p.name}</span>
                  <span className="text-sm font-semibold text-primary">{rupiah(p.price)}</span>
                  <span className="text-xs text-slate-400">
                    Stok: {p.stock} {p.unit}
                  </span>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Cart */}
          <SectionCard title="Keranjang" className="flex flex-col">
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-slate-300">
                <ShoppingCart className="size-9" />
                <p className="text-sm">Belum ada item</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((i) => (
                  <div key={i.productId} className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{i.name}</p>
                      <p className="text-xs text-slate-400">{rupiah(i.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => dec(i.productId)} className="flex size-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                      <button onClick={() => add(i.productId)} className="flex size-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold text-slate-800">{rupiah(i.qty * i.price)}</span>
                  </div>
                ))}

                {matchedBundle && (
                  <div className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-600">
                    🎉 Promo Bundling Aktif: -{matchedBundle.discountPct}% ({matchedBundle.productNames.join(" + ")})
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Anggota (opsional, akru poin loyalitas)</Label>
                  <Select value={memberId || "none"} onValueChange={(v) => setMemberId(v === "none" ? "" : v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tanpa anggota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa anggota</SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} — {m.points} poin
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total</span>
                    <span className="text-lg font-bold text-slate-900">{rupiah(total)}</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Input
                      type="number"
                      value={paid}
                      onChange={(e) => setPaid(e.target.value)}
                      placeholder={`Uang dibayar (mis. ${total})`}
                    />
                    {paidNum > total && (
                      <p className="text-xs text-slate-500">
                        Kembalian: <span className="font-semibold text-emerald-600">{rupiah(paidNum - total)}</span>
                      </p>
                    )}
                  </div>
                  <Button onClick={checkout} className="mt-3 w-full gap-2" size="lg">
                    <ShoppingCart className="size-4" /> Proses Pembayaran
                  </Button>
                  <button onClick={() => setCart({})} className="mt-2 flex w-full items-center justify-center gap-1 text-xs text-slate-400 hover:text-rose-500">
                    <Trash2 className="size-3.5" /> Kosongkan keranjang
                  </button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </Reveal>

      <Dialog open={closeShiftDialog} onOpenChange={setCloseShiftDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tutup Shift Kasir</DialogTitle>
            <DialogDescription>
              Kas sistem (kas awal + penjualan selama shift): <strong>{rupiah(expectedClosingCash)}</strong>. Hitung kas fisik di laci kasir.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Kas Fisik (Hasil Hitung)</Label>
              <Input type="number" min={0} value={actualCash} onChange={(e) => setActualCash(e.target.value)} placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseShiftDialog(false)}>
              Batal
            </Button>
            <Button onClick={submitCloseShift}>Tutup Shift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
