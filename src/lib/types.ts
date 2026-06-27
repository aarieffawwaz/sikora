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
  type: "masuk" | "keluar"
  qty: number
  note?: string
  at: number
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
