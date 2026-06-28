import type {
  AppNotification,
  Coop,
  CrewTask,
  LedgerEntry,
  Member,
  PreOrder,
  Product,
  PurchaseOrder,
  Supplier,
  Transaction,
} from "@/lib/types"

const now = Date.now()
const min = 60_000
const hr = 60 * min
const day = 24 * hr

export const COOP: Coop = {
  name: "KDKMP Sukamaju",
  region: "Kab. Bandung, Jawa Barat",
  memberCount: 340,
  geraiCount: 3,
  gerai: [
    { id: "g1", name: "Gerai Sukamaju Pusat", region: "Jawa Barat", status: "aman", x: 33, y: 70 },
    { id: "g2", name: "Gerai Cibiru", region: "Jawa Barat", status: "understock", x: 35, y: 72 },
    { id: "g3", name: "Gerai Margahayu", region: "Jawa Barat", status: "belum-sinkron", x: 31, y: 69 },
  ],
}

export const SUPPLIERS: Supplier[] = [
  { id: "sup_sembako", name: "CV Sumber Pangan Jaya", contact: "+62 821-1111-2222", categories: ["Sembako", "Pangan"], leadTimeDays: 3 },
  { id: "sup_minuman", name: "PT Tirta Nusantara", contact: "+62 822-3333-4444", categories: ["Minuman"], leadTimeDays: 2 },
  { id: "sup_rumah", name: "Toko Grosir Mitra Rumah", contact: "+62 823-5555-6666", categories: ["Kebutuhan Rumah"], leadTimeDays: 4 },
]

/** Products — the 4 demo items (Beras/Minyak/Gula/Telur) match the reference,
 * tuned so Beras=Segera, Minyak/Gula=Perlu, Telur=Aman. */
export const PRODUCTS: Product[] = [
  { id: "p_beras", name: "Beras Premium", category: "Sembako", unit: "kg", price: 14000, cost: 12200, stock: 8, minThreshold: 20, maxThreshold: 120, baseVelocity: 4, soldUnits: 28, icon: "🍚", supplierId: "sup_sembako" },
  { id: "p_minyak", name: "Minyak Goreng", category: "Sembako", unit: "liter", price: 17500, cost: 15800, stock: 10, minThreshold: 15, maxThreshold: 70, baseVelocity: 2.5, soldUnits: 18, icon: "🛢️", supplierId: "sup_sembako" },
  { id: "p_gula", name: "Gula Pasir", category: "Sembako", unit: "kg", price: 16000, cost: 14500, stock: 7, minThreshold: 10, maxThreshold: 50, baseVelocity: 2, soldUnits: 14, icon: "🧂", supplierId: "sup_sembako" },
  { id: "p_telur", name: "Telur Ayam", category: "Pangan", unit: "kg", price: 28000, cost: 25000, stock: 15, minThreshold: 10, maxThreshold: 40, baseVelocity: 2, soldUnits: 12, icon: "🥚", supplierId: "sup_sembako", expiryDate: now + 5 * day },
  { id: "p_tepung", name: "Tepung Terigu", category: "Sembako", unit: "kg", price: 12000, cost: 10500, stock: 34, minThreshold: 15, maxThreshold: 80, baseVelocity: 1.8, soldUnits: 9, icon: "🌾", supplierId: "sup_sembako" },
  { id: "p_mie", name: "Mie Instan", category: "Pangan", unit: "pcs", price: 3500, cost: 2900, stock: 220, minThreshold: 60, maxThreshold: 400, baseVelocity: 12, soldUnits: 64, icon: "🍜", supplierId: "sup_sembako" },
  { id: "p_kopi", name: "Kopi Sachet", category: "Minuman", unit: "pcs", price: 2000, cost: 1500, stock: 180, minThreshold: 50, maxThreshold: 300, baseVelocity: 9, soldUnits: 41, icon: "☕", supplierId: "sup_minuman" },
  { id: "p_galon", name: "Air Galon", category: "Minuman", unit: "galon", price: 20000, cost: 17000, stock: 62, minThreshold: 20, maxThreshold: 50, baseVelocity: 3, soldUnits: 16, icon: "💧", supplierId: "sup_minuman" },
  { id: "p_gas", name: "Gas LPG 3kg", category: "Kebutuhan Rumah", unit: "tabung", price: 22000, cost: 19500, stock: 28, minThreshold: 12, maxThreshold: 60, baseVelocity: 2.4, soldUnits: 11, icon: "🔥", supplierId: "sup_rumah" },
  { id: "p_sabun", name: "Sabun Mandi", category: "Kebutuhan Rumah", unit: "pcs", price: 4500, cost: 3600, stock: 95, minThreshold: 30, maxThreshold: 200, baseVelocity: 5, soldUnits: 22, icon: "🧼", supplierId: "sup_rumah" },
]

export const CASH_OPENING = 4_500_000

/** A few of today's transactions so the dashboard feels live on first load. */
export const TRANSACTIONS: Transaction[] = [
  { id: "t_seed1", items: [{ productId: "p_mie", name: "Mie Instan", qty: 5, price: 3500 }, { productId: "p_kopi", name: "Kopi Sachet", qty: 4, price: 2000 }], total: 25500, paid: 30000, change: 4500, offline: false, synced: true, at: now - 5 * hr },
  { id: "t_seed2", items: [{ productId: "p_beras", name: "Beras Premium", qty: 3, price: 14000 }], total: 42000, paid: 50000, change: 8000, offline: false, synced: true, at: now - 4 * hr },
  { id: "t_seed3", items: [{ productId: "p_telur", name: "Telur Ayam", qty: 2, price: 28000 }, { productId: "p_minyak", name: "Minyak Goreng", qty: 2, price: 17500 }], total: 91000, paid: 100000, change: 9000, offline: true, synced: true, at: now - 3 * hr },
  { id: "t_seed4", items: [{ productId: "p_gas", name: "Gas LPG 3kg", qty: 1, price: 22000 }], total: 22000, paid: 22000, change: 0, offline: false, synced: true, at: now - 90 * min },
  { id: "t_seed5", items: [{ productId: "p_galon", name: "Air Galon", qty: 2, price: 20000 }, { productId: "p_sabun", name: "Sabun Mandi", qty: 3, price: 4500 }], total: 53500, paid: 60000, change: 6500, offline: false, synced: true, at: now - 40 * min },
]

export const LEDGER: LedgerEntry[] = (() => {
  const entries: LedgerEntry[] = []
  let bal = CASH_OPENING
  entries.push({ id: "l_open", type: "masuk", category: "Saldo Awal", description: "Kas pembuka harian", amount: CASH_OPENING, balanceAfter: bal, at: now - 6 * hr })
  for (const t of TRANSACTIONS) {
    bal += t.total
    entries.push({ id: "l_" + t.id, type: "masuk", category: "Penjualan", description: `Penjualan POS #${t.id.slice(-4)}`, amount: t.total, balanceAfter: bal, at: t.at })
  }
  return entries
})()

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", kind: "warning", title: "AI memprediksi stok gula menipis dalam 3 hari.", detail: "Segera lakukan restock.", at: now - 5 * min },
  { id: "n2", kind: "sync", title: "Sinkronisasi Simkopdes berhasil.", at: now - 10 * min },
  { id: "n3", kind: "success", title: "3 transaksi offline berhasil disinkronkan.", at: now - 2 * hr },
  { id: "n4", kind: "report", title: "Kas harian berhasil dibuat otomatis.", at: now - 3 * hr },
]

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po_seed1",
    supplierId: "sup_sembako",
    supplierName: "CV Sumber Pangan Jaya",
    items: [{ productId: "p_gula", productName: "Gula Pasir", qty: 25, unitCost: 14500 }],
    total: 25 * 14500,
    status: "diajukan",
    createdAt: now - 2 * hr,
    updatedAt: now - 2 * hr,
    aiGenerated: true,
  },
]

export const MEMBERS: Member[] = [
  { id: "mem_1", nik: "3204XXXXXXXX0001", name: "Siti Aminah", phone: "+62 812-0001-0001", points: 180, tier: "perak", joinedAt: now - 200 * day },
  { id: "mem_2", nik: "3204XXXXXXXX0002", name: "Budi Santoso", phone: "+62 812-0002-0002", points: 40, tier: "reguler", joinedAt: now - 30 * day },
  { id: "mem_3", nik: "3204XXXXXXXX0003", name: "Rina Wulandari", phone: "+62 812-0003-0003", points: 620, tier: "emas", joinedAt: now - 400 * day },
]

export const PREORDERS: PreOrder[] = [
  { id: "pre_1", customerName: "Warga - Pak Dedi", customerPhone: "+62 813-1111-0001", items: [{ productId: "p_gas", productName: "Gas LPG 3kg", qty: 2 }], status: "baru", at: now - 30 * min, note: "(simulasi pesan WA masuk)" },
  { id: "pre_2", customerName: "Warga - Ibu Yuli", customerPhone: "+62 813-1111-0002", items: [{ productId: "p_beras", productName: "Beras Premium", qty: 5 }], status: "disiapkan", at: now - 90 * min },
]

export const CREW_TASKS: CrewTask[] = [
  { id: "ct_1", label: "Buka gerai & nyalakan lampu", done: true, completedAt: now - 5 * hr },
  { id: "ct_2", label: "Cek rak & rapikan display produk", done: true, completedAt: now - 4 * hr },
  { id: "ct_3", label: "Lap kaca & area kasir", done: false },
  { id: "ct_4", label: "Catat suhu kulkas/galon (jika ada)", done: false },
  { id: "ct_5", label: "Tutup gerai & kunci pintu", done: false },
]

/** Weekly operational activity (aggregate) for the dashboard line chart. */
export const ACTIVITY_WEEKLY = [
  { label: "18 Mei", penjualan: 3.1, masuk: 1.2, keluar: 1.0, sinkronisasi: 0.6 },
  { label: "25 Mei", penjualan: 4.4, masuk: 2.6, keluar: 1.5, sinkronisasi: 0.9 },
  { label: "1 Jun", penjualan: 6.2, masuk: 3.1, keluar: 2.0, sinkronisasi: 1.3 },
  { label: "8 Jun", penjualan: 7.0, masuk: 4.8, keluar: 3.4, sinkronisasi: 1.7 },
  { label: "15 Jun", penjualan: 9.8, masuk: 5.6, keluar: 4.1, sinkronisasi: 2.4 },
  { label: "22 Jun", penjualan: 13.5, masuk: 7.4, keluar: 5.0, sinkronisasi: 3.1 },
]
