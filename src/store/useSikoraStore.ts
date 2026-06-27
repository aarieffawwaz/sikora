import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  AppNotification,
  CartItem,
  Coop,
  LedgerEntry,
  Product,
  StockMovement,
  Transaction,
} from "@/lib/types"
import { recommendFor } from "@/lib/aiEngine"
import { uid } from "@/lib/format"
import {
  CASH_OPENING,
  COOP,
  LEDGER,
  NOTIFICATIONS,
  PRODUCTS,
  TRANSACTIONS,
} from "@/data/seed"

interface SikoraState {
  synced: boolean
  lastSyncAt: number
  isOnline: boolean
  selectedProvinceId: string | null
  sidebarCollapsed: boolean
  coop: Coop
  products: Product[]
  movements: StockMovement[]
  transactions: Transaction[]
  ledger: LedgerEntry[]
  cashBalance: number
  notifications: AppNotification[]
  mapFilter: "semua" | "kritis" | "menipis" | "aman"

  syncFromSimkopdes: () => void
  addStock: (productId: string, qty: number, note?: string) => void
  removeStock: (productId: string, qty: number, note?: string) => void
  recordSale: (cart: CartItem[], paid: number) => Transaction
  toggleOnline: () => void
  toggleSidebar: () => void
  setProvince: (id: string | null) => void
  pushNotification: (n: Omit<AppNotification, "id" | "at">) => void
  resetDemo: () => void
  setMapFilter: (filter: "semua" | "kritis" | "menipis" | "aman") => void
}

function seedCash(): number {
  return LEDGER.length ? LEDGER[LEDGER.length - 1].balanceAfter : CASH_OPENING
}

function initial() {
  return {
    synced: true,
    lastSyncAt: Date.now() - 2 * 60_000,
    isOnline: true,
    selectedProvinceId: null,
    sidebarCollapsed: false,
    coop: structuredClone(COOP),
    products: structuredClone(PRODUCTS),
    movements: [] as StockMovement[],
    transactions: structuredClone(TRANSACTIONS),
    ledger: structuredClone(LEDGER),
    cashBalance: seedCash(),
    notifications: structuredClone(NOTIFICATIONS),
    mapFilter: "semua" as const,
  }
}

export const useSikoraStore = create<SikoraState>()(
  persist(
    (set, get) => ({
      ...initial(),

      syncFromSimkopdes: () =>
        set((s) => ({
          synced: true,
          lastSyncAt: Date.now(),
          coop: structuredClone(COOP),
          notifications: [
            { id: uid("n"), kind: "sync" as const, title: "Sinkronisasi Simkopdes berhasil.", at: Date.now() },
            ...s.notifications,
          ].slice(0, 30),
        })),

      addStock: (productId, qty, note) =>
        set((s) => {
          const p = s.products.find((x) => x.id === productId)
          if (!p || qty <= 0) return s
          const products = s.products.map((x) =>
            x.id === productId ? { ...x, stock: x.stock + qty } : x,
          )
          const mv: StockMovement = {
            id: uid("mv"),
            productId,
            productName: p.name,
            type: "masuk",
            qty,
            note,
            at: Date.now(),
          }
          return { products, movements: [mv, ...s.movements] }
        }),

      removeStock: (productId, qty, note) =>
        set((s) => {
          const p = s.products.find((x) => x.id === productId)
          if (!p || qty <= 0) return s
          const products = s.products.map((x) =>
            x.id === productId ? { ...x, stock: Math.max(0, x.stock - qty) } : x,
          )
          const mv: StockMovement = {
            id: uid("mv"),
            productId,
            productName: p.name,
            type: "keluar",
            qty,
            note,
            at: Date.now(),
          }
          return { products, movements: [mv, ...s.movements] }
        }),

      recordSale: (cart, paid) => {
        const s = get()
        const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0)
        const tx: Transaction = {
          id: uid("trx"),
          items: cart,
          total,
          paid,
          change: Math.max(0, paid - total),
          offline: !s.isOnline,
          synced: s.isOnline,
          at: Date.now(),
        }

        // mutate stock + observed sales, detect new restock alerts
        const before = new Map(s.products.map((p) => [p.id, recommendFor(p).severity]))
        const products = s.products.map((p) => {
          const line = cart.find((c) => c.productId === p.id)
          if (!line) return p
          return { ...p, stock: Math.max(0, p.stock - line.qty), soldUnits: p.soldUnits + line.qty }
        })

        const newCash = s.cashBalance + total
        const ledgerEntry: LedgerEntry = {
          id: uid("l"),
          type: "masuk",
          category: "Penjualan",
          description: `Penjualan POS #${tx.id.slice(-4)} (${cart.length} item)`,
          amount: total,
          balanceAfter: newCash,
          at: tx.at,
        }

        const notifs: AppNotification[] = []
        for (const p of products) {
          const line = cart.find((c) => c.productId === p.id)
          if (!line) continue
          const sev = recommendFor(p).severity
          if ((sev === "segera" || sev === "perlu") && before.get(p.id) === "aman") {
            notifs.push({
              id: uid("n"),
              kind: "ai",
              title: `AI: ${p.name} kini ${sev === "segera" ? "perlu segera" : "perlu"} direstock (sisa ${p.stock} ${p.unit}).`,
              at: Date.now(),
            })
          }
        }
        if (!s.isOnline) {
          notifs.push({ id: uid("n"), kind: "warning", title: "Transaksi disimpan offline, menunggu sinkronisasi.", at: Date.now() })
        }

        set({
          products,
          transactions: [tx, ...s.transactions],
          ledger: [...s.ledger, ledgerEntry],
          cashBalance: newCash,
          notifications: [...notifs, ...s.notifications].slice(0, 30),
        })
        return tx
      },

      toggleOnline: () =>
        set((s) => {
          const goingOnline = !s.isOnline
          if (goingOnline) {
            const pending = s.transactions.filter((t) => !t.synced)
            if (pending.length) {
              return {
                isOnline: true,
                transactions: s.transactions.map((t) => ({ ...t, synced: true })),
                notifications: [
                  { id: uid("n"), kind: "success" as const, title: `${pending.length} transaksi offline berhasil disinkronkan.`, at: Date.now() },
                  ...s.notifications,
                ].slice(0, 30),
              }
            }
          }
          return { isOnline: goingOnline }
        }),

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setProvince: (id) => set({ selectedProvinceId: id }),

      pushNotification: (n) =>
        set((s) => ({
          notifications: [{ ...n, id: uid("n"), at: Date.now() }, ...s.notifications].slice(0, 30),
        })),

      resetDemo: () => set({ ...initial() }),

      setMapFilter: (filter) => set({ mapFilter: filter }),
    }),
    {
      name: "sikora-store",
      version: 1,
    },
  ),
)
