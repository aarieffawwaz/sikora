import type { Coop, Product, Transaction } from "./types"
import { recommendations, SEVERITY_LABEL } from "./aiEngine"
import { rupiah, rupiahCompact } from "./format"
import { salesToday } from "./dashboard"

export interface AssistantContext {
  coop: Coop
  products: Product[]
  transactions: Transaction[]
}

export const SUGGESTIONS = [
  "Produk apa yang perlu direstock minggu ini?",
  "Prediksi kebutuhan bulan depan",
  "Mengapa stok gula menipis?",
  "Ringkas aktivitas koperasi hari ini",
  "Gerai mana yang belum sinkron?",
]

/** Scripted AI DSS — answers interpolate live operational data. */
export function answer(question: string, ctx: AssistantContext): string {
  const q = question.toLowerCase()
  const recs = recommendations(ctx.products)

  // Why a specific / the top product needs restock
  if (q.includes("restock") || q.includes("kenapa") || q.includes("mengapa") || q.includes("perlu")) {
    const named = ctx.products.find((p) => q.includes(p.name.toLowerCase().split(" ")[0]))
    const target = named ? recs.find((r) => r.productId === named.id)! : recs[0]
    const days = isFinite(target.daysUntilStockout) ? target.daysUntilStockout.toFixed(1) : "∞"
    return [
      `${target.icon} **${target.productName}** — status: ${SEVERITY_LABEL[target.severity]}.`,
      ``,
      `Analisis AI DSS:`,
      `• Sisa stok: ${target.stock} ${target.unit}`,
      `• Estimasi permintaan: ~${target.velocity.toFixed(1)} ${target.unit}/hari`,
      `• Perkiraan habis dalam: ${days} hari`,
      `• Rekomendasi pengadaan: ${target.recommendedQty} ${target.unit}`,
      ``,
      target.reason,
    ].join("\n")
  }

  // Forecast next month
  if (q.includes("prediksi") || q.includes("bulan depan") || q.includes("kebutuhan")) {
    const lines = recs
      .filter((r) => r.severity !== "overstock")
      .slice(0, 5)
      .map((r) => `• ${r.icon} ${r.productName}: ~${Math.round(r.velocity * 30)} ${r.unit}/bulan`)
    return [
      `📅 **Prediksi kebutuhan 30 hari ke depan** (berdasarkan laju permintaan saat ini):`,
      ``,
      ...lines,
      ``,
      `Prediksi diperbarui adaptif seiring bertambahnya transaksi.`,
    ].join("\n")
  }

  // Summary of today's activity
  if (q.includes("ringkas") || q.includes("aktivitas") || q.includes("hari ini")) {
    const { count, total } = salesToday(ctx.transactions)
    const need = recs.filter((r) => r.severity === "segera" || r.severity === "perlu").length
    return [
      `📊 **Ringkasan operasional hari ini:**`,
      ``,
      `• Transaksi POS: ${count} transaksi`,
      `• Total penjualan: ${rupiah(total)}`,
      `• Produk perlu direstock: ${need} produk`,
      `• Anggota terlayani: ${ctx.coop.memberCount} anggota`,
      ``,
      need > 0
        ? `Saran: prioritaskan pengadaan ${recs[0].productName} (paling mendesak).`
        : `Semua persediaan dalam kondisi aman. 👍`,
    ].join("\n")
  }

  // Gerai sync status
  if (q.includes("gerai") || q.includes("sinkron")) {
    const belum = ctx.coop.gerai.filter((g) => g.status === "belum-sinkron")
    if (!belum.length) return `✅ Semua gerai ${ctx.coop.name} sudah tersinkronisasi dengan Simkopdes.`
    return [
      `🔄 **Gerai belum sinkron:**`,
      ``,
      ...belum.map((g) => `• ${g.name} (${g.region})`),
      ``,
      `Jalankan Sinkronisasi Data untuk memperbarui dari Simkopdes.`,
    ].join("\n")
  }

  // Inventory value / general
  if (q.includes("nilai") || q.includes("persediaan") || q.includes("modal")) {
    const val = ctx.products.reduce((s, p) => s + p.stock * p.cost, 0)
    return `💰 Total nilai persediaan saat ini: **${rupiahCompact(val)}** (${ctx.products.length} jenis produk).`
  }

  // Fallback
  const top = recs[0]
  return [
    `Saya menganalisis data operasional ${ctx.coop.name}. Saat ini prioritas utama:`,
    ``,
    `${top.icon} **${top.productName}** — ${SEVERITY_LABEL[top.severity]}, rekomendasi pengadaan ${top.recommendedQty} ${top.unit}.`,
    ``,
    `Coba tanyakan tentang restock, prediksi kebutuhan, atau ringkasan aktivitas.`,
  ].join("\n")
}
