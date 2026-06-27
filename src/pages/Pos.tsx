import { useMemo, useState } from "react"
import { Minus, Plus, ShoppingCart, Trash2, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { useSikoraStore } from "@/store/useSikoraStore"
import type { CartItem } from "@/lib/types"
import { rupiah } from "@/lib/format"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function Pos() {
  const products = useSikoraStore((s) => s.products)
  const isOnline = useSikoraStore((s) => s.isOnline)
  const recordSale = useSikoraStore((s) => s.recordSale)

  const [cart, setCart] = useState<Record<string, number>>({})
  const [paid, setPaid] = useState("")

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
    recordSale(items, pay)
    toast.success("Transaksi berhasil", {
      description: isOnline ? "Stok, kas & pembukuan diperbarui." : "Disimpan offline, akan disinkronkan.",
    })
    setCart({})
    setPaid("")
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
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  isOnline ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
                )}
              >
                {isOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
                {isOnline ? "Online" : "Mode Offline"}
              </span>
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
    </div>
  )
}
