import type {
  BundlePromo,
  ExpiryAlert,
  MemberTier,
  Product,
  PurchaseOrderItem,
  Recommendation,
  Severity,
} from "./types"

/**
 * SIKORA AI Decision Support System (rule-based, deterministic).
 * Turns operational data into actionable restock recommendations,
 * including cold-start prediction when a product has no sales history.
 */

const LEAD_TIME_DAYS = 3 // estimated procurement lead time
const SAFETY_FACTOR = 1.5
const OBSERVED_WINDOW_DAYS = 7

// Commodity demand factor — fast-movers churn quicker.
const COMMODITY_FACTOR: Record<string, number> = {
  Sembako: 1.4,
  Pangan: 1.2,
  Minuman: 1.0,
  "Kebutuhan Rumah": 0.8,
  Lainnya: 0.7,
}

/** Effective daily demand. Blends cold-start estimate with observed sales. */
export function effectiveVelocity(p: Product): number {
  const observed = p.soldUnits / OBSERVED_WINDOW_DAYS
  return Math.max(p.baseVelocity, observed)
}

/**
 * Cold-start: estimate baseline daily demand from coop characteristics
 * (member count, commodity type) — used when no transaction history exists.
 */
export function coldStartVelocity(category: string, memberCount: number): number {
  const factor = COMMODITY_FACTOR[category] ?? COMMODITY_FACTOR.Lainnya
  // ~ members served per day scaled by commodity churn
  return Math.max(1, Math.round((memberCount / 100) * factor * 10) / 10)
}

export function severityOf(p: Product, velocity: number): Severity {
  const days = velocity > 0 ? p.stock / velocity : Infinity
  if (p.stock <= p.minThreshold * 0.6 || days <= LEAD_TIME_DAYS) return "segera"
  if (p.stock <= p.minThreshold || days <= LEAD_TIME_DAYS * 2) return "perlu"
  if (p.stock >= p.maxThreshold) return "overstock"
  return "aman"
}

export function recommendFor(p: Product): Recommendation {
  const velocity = effectiveVelocity(p)
  const days = velocity > 0 ? p.stock / velocity : Infinity
  const severity = severityOf(p, velocity)
  const coldStart = p.soldUnits === 0

  const target = velocity * LEAD_TIME_DAYS * SAFETY_FACTOR + p.minThreshold
  const recommendedQty = Math.max(0, Math.ceil(target - p.stock))

  let reason: string
  if (severity === "overstock") {
    reason = `Stok ${p.stock} ${p.unit} melampaui batas optimal (${p.maxThreshold}). Pertimbangkan promosi agar perputaran modal tetap sehat.`
  } else if (coldStart) {
    reason = `Gerai belum memiliki riwayat transaksi. Prediksi cold-start memperkirakan permintaan ~${velocity.toFixed(1)} ${p.unit}/hari dari karakteristik koperasi.`
  } else {
    const d = isFinite(days) ? days.toFixed(1) : "∞"
    reason = `Permintaan ~${velocity.toFixed(1)} ${p.unit}/hari, stok ${p.stock} ${p.unit} diperkirakan habis dalam ${d} hari.`
  }

  return {
    productId: p.id,
    productName: p.name,
    icon: p.icon,
    stock: p.stock,
    unit: p.unit,
    severity,
    velocity,
    daysUntilStockout: days,
    recommendedQty,
    reason,
    coldStart,
  }
}

/** All recommendations, action-needed first. */
export function recommendations(products: Product[]): Recommendation[] {
  const order: Record<Severity, number> = { segera: 0, perlu: 1, overstock: 2, aman: 3 }
  return products
    .map(recommendFor)
    .sort((a, b) => order[a.severity] - order[b.severity] || a.daysUntilStockout - b.daysUntilStockout)
}

/** Products that need procurement action (the AI Prediksi count). */
export function actionableCount(products: Product[]): number {
  return products
    .map(recommendFor)
    .filter((r) => r.severity === "segera" || r.severity === "perlu").length
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  segera: "Segera Restock",
  perlu: "Perlu Restock",
  aman: "Aman",
  overstock: "Overstock",
}

// ── Smart-PO ────────────────────────────────────────────────────────────
/** Builds suggested PO line items for a supplier from actionable restock recommendations. */
export function suggestPoItems(products: Product[], supplierId: string): PurchaseOrderItem[] {
  const bySupplier = products.filter((p) => p.supplierId === supplierId)
  const pool = bySupplier.length ? bySupplier : products // resilience: demo still works if supplierId unset
  return recommendations(pool)
    .filter((r) => r.severity === "segera" || r.severity === "perlu")
    .map((r) => {
      const p = pool.find((x) => x.id === r.productId)!
      return { productId: p.id, productName: p.name, qty: r.recommendedQty, unitCost: p.cost }
    })
}

// ── Bundle / Promo detection ──────────────────────────────────────────────
const BUNDLE_DISCOUNT_PCT = 15

/** Detects same-category overstocked products eligible for bundling. */
export function suggestBundles(products: Product[]): BundlePromo[] {
  const overstocked = products.filter((p) => severityOf(p, effectiveVelocity(p)) === "overstock")
  const byCategory = new Map<string, Product[]>()
  for (const p of overstocked) {
    byCategory.set(p.category, [...(byCategory.get(p.category) ?? []), p])
  }
  const bundles: BundlePromo[] = []
  for (const [category, items] of byCategory) {
    if (items.length < 2) continue
    bundles.push({
      productIds: items.map((p) => p.id),
      productNames: items.map((p) => p.name),
      discountPct: BUNDLE_DISCOUNT_PCT,
      reason: `${items.length} produk kategori ${category} overstock — bundling mempercepat perputaran.`,
    })
  }
  return bundles
}

/** Stable identifier for a bundle, used to track which ones are toggled active. */
export function bundleKey(b: BundlePromo): string {
  return [...b.productIds].sort().join("|")
}

// ── Expiry alerts ─────────────────────────────────────────────────────────
const EXPIRY_WARNING_DAYS = 7
const EXPIRY_DISCOUNT_PCT = 20

export function expiryAlerts(products: Product[], withinDays = EXPIRY_WARNING_DAYS): ExpiryAlert[] {
  const now = Date.now()
  return products
    .filter((p): p is Product & { expiryDate: number } => p.expiryDate != null)
    .map((p) => ({
      productId: p.id,
      productName: p.name,
      expiryDate: p.expiryDate,
      daysLeft: Math.ceil((p.expiryDate - now) / 86_400_000),
      suggestedDiscountPct: EXPIRY_DISCOUNT_PCT,
    }))
    .filter((a) => a.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft)
}

// ── Stock opname anomaly ───────────────────────────────────────────────────
const OPNAME_ANOMALY_THRESHOLD_PCT = 0.1

export function isOpnameAnomaly(systemStock: number, countedStock: number): boolean {
  const variance = Math.abs(countedStock - systemStock)
  return variance > Math.max(2, systemStock * OPNAME_ANOMALY_THRESHOLD_PCT)
}

// ── Loyalty tier ────────────────────────────────────────────────────────────
export function memberTierFor(points: number): MemberTier {
  if (points >= 500) return "emas"
  if (points >= 150) return "perak"
  return "reguler"
}

export const MEMBER_TIER_LABEL: Record<MemberTier, string> = {
  reguler: "Reguler",
  perak: "Perak",
  emas: "Emas",
}
