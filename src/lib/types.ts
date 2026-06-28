export type Severity = "segera" | "perlu" | "aman" | "overstock"

export type GeraiStatus = "understock" | "overstock" | "aman" | "belum-sinkron"

export interface Product {
  id: string
  name: string
  category: string // commodity type, e.g. "Sembako"
  unit: string // kg, liter, pcs, krat
  price: number // sell price per unit
  cost: number // purchase cost per unit (inventory value)
  stock: number
  minThreshold: number
  maxThreshold: number
  baseVelocity: number // cold-start estimate, units/day
  soldUnits: number // observed units sold (drives adaptive velocity)
  icon: string // emoji
  supplierId?: string
  expiryDate?: number // epoch ms, only set for perishable categories
}

export interface Gerai {
  id: string
  name: string
  region: string
  status: GeraiStatus
  x: number // map position %, 0-100
  y: number
}

export interface Coop {
  name: string
  region: string
  memberCount: number
  geraiCount: number
  gerai: Gerai[]
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "masuk" | "keluar" | "adjustment" | "transfer"
  qty: number
  note?: string
  at: number
  fromGerai?: string // only for type "transfer"
  toGerai?: string // only for type "transfer"
}

export interface CartItem {
  productId: string
  name: string
  qty: number
  price: number
}

export interface Transaction {
  id: string
  items: CartItem[]
  total: number
  paid: number
  change: number
  offline: boolean
  synced: boolean
  at: number
  memberId?: string
}

export interface LedgerEntry {
  id: string
  type: "masuk" | "keluar" // kas masuk / kas keluar
  category: string
  description: string
  amount: number
  balanceAfter: number
  at: number
}

export type NotifKind = "ai" | "sync" | "success" | "report" | "warning"

export interface AppNotification {
  id: string
  kind: NotifKind
  title: string
  detail?: string
  at: number
}

export interface Recommendation {
  productId: string
  productName: string
  icon: string
  stock: number
  unit: string
  severity: Severity
  velocity: number
  daysUntilStockout: number
  recommendedQty: number
  reason: string
  coldStart: boolean
}

// ── Shift / Kasir ────────────────────────────────────────────────────────
export interface CashierShift {
  id: string
  openedAt: number
  closedAt?: number
  openingCash: number
  expectedClosingCash?: number
  actualClosingCash?: number
  variance?: number
  cashierName: string
  status: "open" | "closed"
}

// ── Smart-PO & Supplier ──────────────────────────────────────────────────
export interface Supplier {
  id: string
  name: string
  contact: string
  categories: string[]
  leadTimeDays: number
}

export type POStatus = "draft" | "diajukan" | "dikirim" | "diterima"

export interface PurchaseOrderItem {
  productId: string
  productName: string
  qty: number
  unitCost: number
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  items: PurchaseOrderItem[]
  total: number
  status: POStatus
  createdAt: number
  updatedAt: number
  aiGenerated: boolean
  note?: string
}

// ── Promo & Bundling ─────────────────────────────────────────────────────
export interface BundlePromo {
  productIds: string[]
  productNames: string[]
  discountPct: number
  reason: string
}

export interface ExpiryAlert {
  productId: string
  productName: string
  expiryDate: number
  daysLeft: number
  suggestedDiscountPct: number
}

// ── Membership Loyalty ───────────────────────────────────────────────────
export type MemberTier = "reguler" | "perak" | "emas"

export interface Member {
  id: string
  nik: string
  name: string
  phone: string
  points: number
  tier: MemberTier
  joinedAt: number
}

// ── Pre-Order (mock WA) ──────────────────────────────────────────────────
export type PreOrderStatus = "baru" | "disiapkan" | "selesai"

export interface PreOrderItem {
  productId: string
  productName: string
  qty: number
}

export interface PreOrder {
  id: string
  customerName: string
  customerPhone: string
  items: PreOrderItem[]
  status: PreOrderStatus
  note?: string
  at: number
}

// ── Crew Tasks & Stock Opname ────────────────────────────────────────────
export interface CrewTask {
  id: string
  label: string
  done: boolean
  completedAt?: number
}

export interface StockOpnameEntry {
  id: string
  productId: string
  productName: string
  systemStock: number
  countedStock: number
  variance: number
  anomaly: boolean
  at: number
}

// ── Role (cosmetic framing only, no permission enforcement) ─────────────
export type CurrentRole = "pengurus" | "kasir" | "crew"

// ── Accounting (derived reporting layer, not a separate source of truth) ─
export interface JournalEntry {
  id: string
  at: number
  debitAccount: string
  creditAccount: string
  amount: number
  description: string
}
