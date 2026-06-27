/** Full rupiah: 18500 -> "Rp 18.500" */
export function rupiah(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID")
}

/** Compact rupiah: 2_480_000_000 -> "Rp 2,48 M", 18_500_000 -> "Rp 18,5 Jt" */
export function rupiahCompact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e9) return `Rp ${fmt(n / 1e9)} M`
  if (abs >= 1e6) return `Rp ${fmt(n / 1e6)} Jt`
  if (abs >= 1e3) return `Rp ${fmt(n / 1e3)} Rb`
  return rupiah(n)
}

function fmt(n: number): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 })
}

/** 1248 -> "1.248" */
export function angka(n: number): string {
  return Math.round(n).toLocaleString("id-ID")
}

/** Relative time in Bahasa Indonesia */
export function waktuLalu(ts: number, now = Date.now()): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000))
  if (s < 60) return "baru saja"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} menit yang lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam yang lalu`
  const d = Math.floor(h / 24)
  return `${d} hari yang lalu`
}

export function isToday(ts: number, now = Date.now()): boolean {
  const a = new Date(ts)
  const b = new Date(now)
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}
