import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  AppNotification,
  CartItem,
  CashierShift,
  Coop,
  CrewTask,
  CurrentRole,
  LedgerEntry,
  Member,
  PreOrder,
  PreOrderStatus,
  Product,
  PurchaseOrder,
  StockMovement,
  StockOpnameEntry,
  Supplier,
  Transaction,
} from "@/lib/types"
import { isOpnameAnomaly, memberTierFor, recommendFor, suggestPoItems } from "@/lib/aiEngine"
import { rupiah, uid } from "@/lib/format"
import {
  CASH_OPENING,
  COOP,
  CREW_TASKS,
  LEDGER,
  MEMBERS,
  NOTIFICATIONS,
  PREORDERS,
  PRODUCTS,
  PURCHASE_ORDERS,
  SUPPLIERS,
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
  currentRole: CurrentRole
  activeShift: CashierShift | null
  shifts: CashierShift[]
  suppliers: Supplier[]
  purchaseOrders: PurchaseOrder[]
  members: Member[]
  preOrders: PreOrder[]
  crewTasks: CrewTask[]
  stockOpnames: StockOpnameEntry[]
  activePromoIds: string[]

  syncFromSimkopdes: () => void
  addStock: (productId: string, qty: number, note?: string) => void
  removeStock: (productId: string, qty: number, note?: string) => void
  recordSale: (cart: CartItem[], paid: number, memberId?: string) => Transaction
  toggleOnline: () => void
  toggleSidebar: () => void
  setProvince: (id: string | null) => void
  pushNotification: (n: Omit<AppNotification, "id" | "at">) => void
  resetDemo: () => void
  setMapFilter: (filter: "semua" | "kritis" | "menipis" | "aman") => void
  setRole: (role: CurrentRole) => void
  openShift: (openingCash: number, cashierName: string) => void
  closeShift: (actualClosingCash: number) => void
  generatePoDraft: (supplierId: string) => PurchaseOrder
  submitPo: (poId: string) => void
  markPoShipped: (poId: string) => void
  receivePo: (poId: string) => void
  togglePromo: (bundleKey: string) => void
  addMember: (data: { nik: string; name: string; phone: string }) => Member
  updatePreOrderStatus: (id: string, status: PreOrderStatus) => void
  toggleCrewTask: (id: string) => void
  recordStockOpname: (productId: string, countedStock: number) => StockOpnameEntry
  adjustStock: (productId: string, newStock: number, note?: string) => void
  transferStock: (productId: string, fromGerai: string, toGerai: string, qty: number) => void
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
    currentRole: "pengurus" as const,
    activeShift: null as CashierShift | null,
    shifts: [] as CashierShift[],
    suppliers: structuredClone(SUPPLIERS),
    purchaseOrders: structuredClone(PURCHASE_ORDERS),
    members: structuredClone(MEMBERS),
    preOrders: structuredClone(PREORDERS),
    crewTasks: structuredClone(CREW_TASKS),
    stockOpnames: [] as StockOpnameEntry[],
    activePromoIds: [] as string[],
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

      recordSale: (cart, paid, memberId) => {
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
          memberId,
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

        let members = s.members
        if (memberId) {
          const earned = Math.floor(total / 10_000) // 1 poin per Rp 10.000 belanja
          members = s.members.map((m) =>
            m.id === memberId ? { ...m, points: m.points + earned, tier: memberTierFor(m.points + earned) } : m,
          )
        }

        set({
          products,
          transactions: [tx, ...s.transactions],
          ledger: [...s.ledger, ledgerEntry],
          cashBalance: newCash,
          notifications: [...notifs, ...s.notifications].slice(0, 30),
          members,
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

      setRole: (role) => set({ currentRole: role }),

      openShift: (openingCash, cashierName) =>
        set((s) => {
          if (s.activeShift) return s
          const shift: CashierShift = {
            id: uid("sh"),
            openedAt: Date.now(),
            openingCash,
            cashierName,
            status: "open",
          }
          return {
            activeShift: shift,
            notifications: [
              { id: uid("n"), kind: "success" as const, title: `Shift kasir dibuka — kas awal ${rupiah(openingCash)}.`, at: Date.now() },
              ...s.notifications,
            ].slice(0, 30),
          }
        }),

      closeShift: (actualClosingCash) =>
        set((s) => {
          if (!s.activeShift) return s
          const cashSales = s.transactions
            .filter((t) => t.at >= s.activeShift!.openedAt)
            .reduce((sum, t) => sum + t.total, 0)
          const expectedClosingCash = s.activeShift.openingCash + cashSales
          const variance = actualClosingCash - expectedClosingCash
          const closed: CashierShift = {
            ...s.activeShift,
            closedAt: Date.now(),
            expectedClosingCash,
            actualClosingCash,
            variance,
            status: "closed",
          }
          const ledger = [...s.ledger]
          if (variance !== 0) {
            const newBal = actualClosingCash
            ledger.push({
              id: uid("l"),
              type: variance > 0 ? "masuk" : "keluar",
              category: "Selisih Kas",
              description: `Penyesuaian selisih kas shift #${closed.id.slice(-4)}`,
              amount: Math.abs(variance),
              balanceAfter: newBal,
              at: Date.now(),
            })
          }
          return {
            activeShift: null,
            shifts: [closed, ...s.shifts],
            cashBalance: actualClosingCash,
            ledger,
            notifications: [
              variance === 0
                ? { id: uid("n"), kind: "success" as const, title: "Shift ditutup — kas sesuai.", at: Date.now() }
                : { id: uid("n"), kind: "warning" as const, title: `Shift ditutup — selisih kas ${rupiah(variance)}.`, at: Date.now() },
              ...s.notifications,
            ].slice(0, 30),
          }
        }),

      generatePoDraft: (supplierId) => {
        const s = get()
        const supplier = s.suppliers.find((x) => x.id === supplierId)!
        const items = suggestPoItems(s.products, supplierId)
        const po: PurchaseOrder = {
          id: uid("po"),
          supplierId,
          supplierName: supplier.name,
          items,
          total: items.reduce((sum, i) => sum + i.qty * i.unitCost, 0),
          status: "draft",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          aiGenerated: true,
        }
        set({
          purchaseOrders: [po, ...s.purchaseOrders],
          notifications: [
            { id: uid("n"), kind: "ai" as const, title: `AI menyusun draf PO untuk ${supplier.name} (${items.length} produk).`, at: Date.now() },
            ...s.notifications,
          ].slice(0, 30),
        })
        return po
      },

      submitPo: (poId) =>
        set((s) => ({
          purchaseOrders: s.purchaseOrders.map((po) =>
            po.id === poId ? { ...po, status: "diajukan" as const, updatedAt: Date.now() } : po,
          ),
          notifications: [
            { id: uid("n"), kind: "report" as const, title: "PO diajukan ke supplier.", at: Date.now() },
            ...s.notifications,
          ].slice(0, 30),
        })),

      markPoShipped: (poId) =>
        set((s) => ({
          purchaseOrders: s.purchaseOrders.map((po) =>
            po.id === poId ? { ...po, status: "dikirim" as const, updatedAt: Date.now() } : po,
          ),
          notifications: [
            { id: uid("n"), kind: "report" as const, title: "Supplier menandai PO dalam pengiriman.", at: Date.now() },
            ...s.notifications,
          ].slice(0, 30),
        })),

      receivePo: (poId) => {
        const s = get()
        const po = s.purchaseOrders.find((x) => x.id === poId)
        if (!po) return
        for (const item of po.items) {
          get().addStock(item.productId, item.qty, `PO ${po.id.slice(-4)} diterima`)
        }
        const after = get()
        const newCash = after.cashBalance - po.total
        const ledgerEntry: LedgerEntry = {
          id: uid("l"),
          type: "keluar",
          category: "Pembelian",
          description: `Pembayaran PO ${po.supplierName} #${po.id.slice(-4)}`,
          amount: po.total,
          balanceAfter: newCash,
          at: Date.now(),
        }
        set({
          purchaseOrders: after.purchaseOrders.map((x) =>
            x.id === poId ? { ...x, status: "diterima" as const, updatedAt: Date.now() } : x,
          ),
          cashBalance: newCash,
          ledger: [...after.ledger, ledgerEntry],
          notifications: [
            { id: uid("n"), kind: "success" as const, title: `PO ${po.supplierName} diterima — stok ${po.items.length} produk diperbarui.`, at: Date.now() },
            ...after.notifications,
          ].slice(0, 30),
        })
      },

      togglePromo: (bundleKey) =>
        set((s) => ({
          activePromoIds: s.activePromoIds.includes(bundleKey)
            ? s.activePromoIds.filter((k) => k !== bundleKey)
            : [...s.activePromoIds, bundleKey],
        })),

      addMember: (data) => {
        const member: Member = { id: uid("mem"), ...data, points: 0, tier: "reguler", joinedAt: Date.now() }
        set((s) => ({ members: [...s.members, member] }))
        return member
      },

      updatePreOrderStatus: (id, status) =>
        set((s) => {
          const preOrders = s.preOrders.map((p) => (p.id === id ? { ...p, status } : p))
          const target = s.preOrders.find((p) => p.id === id)
          const notifications =
            status === "selesai" && target
              ? [
                  { id: uid("n"), kind: "success" as const, title: `Pre-order ${target.customerName} selesai disiapkan.`, at: Date.now() },
                  ...s.notifications,
                ].slice(0, 30)
              : s.notifications
          return { preOrders, notifications }
        }),

      toggleCrewTask: (id) =>
        set((s) => ({
          crewTasks: s.crewTasks.map((t) =>
            t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : undefined } : t,
          ),
        })),

      recordStockOpname: (productId, countedStock) => {
        const s = get()
        const p = s.products.find((x) => x.id === productId)!
        const variance = countedStock - p.stock
        const anomaly = isOpnameAnomaly(p.stock, countedStock)
        const entry: StockOpnameEntry = {
          id: uid("op"),
          productId,
          productName: p.name,
          systemStock: p.stock,
          countedStock,
          variance,
          anomaly,
          at: Date.now(),
        }
        const products = s.products.map((x) => (x.id === productId ? { ...x, stock: countedStock } : x))
        const mv: StockMovement = {
          id: uid("mv"),
          productId,
          productName: p.name,
          type: "adjustment",
          qty: variance,
          note: "Stock opname",
          at: Date.now(),
        }
        set({
          products,
          movements: [mv, ...s.movements],
          stockOpnames: [entry, ...s.stockOpnames],
          notifications: [
            anomaly
              ? { id: uid("n"), kind: "warning" as const, title: `Anomali stock opname: ${p.name} selisih ${variance > 0 ? "+" : ""}${variance} ${p.unit}.`, at: Date.now() }
              : { id: uid("n"), kind: "report" as const, title: `Stock opname ${p.name}: sesuai.`, at: Date.now() },
            ...s.notifications,
          ].slice(0, 30),
        })
        return entry
      },

      adjustStock: (productId, newStock, note) =>
        set((s) => {
          const p = s.products.find((x) => x.id === productId)
          if (!p) return s
          const variance = newStock - p.stock
          const products = s.products.map((x) => (x.id === productId ? { ...x, stock: newStock } : x))
          const mv: StockMovement = {
            id: uid("mv"),
            productId,
            productName: p.name,
            type: "adjustment",
            qty: variance,
            note: note ?? "Penyesuaian manual",
            at: Date.now(),
          }
          return { products, movements: [mv, ...s.movements] }
        }),

      transferStock: (productId, fromGerai, toGerai, qty) =>
        set((s) => {
          const p = s.products.find((x) => x.id === productId)
          if (!p || qty <= 0) return s
          const mv: StockMovement = {
            id: uid("mv"),
            productId,
            productName: p.name,
            type: "transfer",
            qty,
            fromGerai,
            toGerai,
            at: Date.now(),
          }
          return {
            movements: [mv, ...s.movements],
            notifications: [
              { id: uid("n"), kind: "report" as const, title: `Transfer stok dicatat: ${qty} ${p.unit} ${p.name} dari ${fromGerai} ke ${toGerai}.`, at: Date.now() },
              ...s.notifications,
            ].slice(0, 30),
          }
        }),
    }),
    {
      name: "sikora-store",
      version: 2,
    },
  ),
)
