import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const DATASETS = {
  harian: [
    { label: "Senin", penjualan: 1.2, masuk: 0.4, keluar: 0.3, sinkronisasi: 0.2 },
    { label: "Selasa", penjualan: 1.5, masuk: 0.6, keluar: 0.5, sinkronisasi: 0.3 },
    { label: "Rabu", penjualan: 2.1, masuk: 0.8, keluar: 0.7, sinkronisasi: 0.5 },
    { label: "Kamis", penjualan: 1.8, masuk: 0.7, keluar: 0.6, sinkronisasi: 0.4 },
    { label: "Jumat", penjualan: 2.4, masuk: 1.1, keluar: 0.9, sinkronisasi: 0.7 },
    { label: "Sabtu", penjualan: 3.2, masuk: 1.5, keluar: 1.2, sinkronisasi: 1.0 },
  ],
  mingguan: [
    { label: "18 Mei", penjualan: 3.1, masuk: 1.2, keluar: 1.0, sinkronisasi: 0.6 },
    { label: "25 Mei", penjualan: 4.4, masuk: 2.6, keluar: 1.5, sinkronisasi: 0.9 },
    { label: "1 Jun", penjualan: 6.2, masuk: 3.1, keluar: 2.0, sinkronisasi: 1.3 },
    { label: "8 Jun", penjualan: 7.0, masuk: 4.8, keluar: 3.4, sinkronisasi: 1.7 },
    { label: "15 Jun", penjualan: 9.8, masuk: 5.6, keluar: 4.1, sinkronisasi: 2.4 },
    { label: "22 Jun", penjualan: 13.5, masuk: 7.4, keluar: 5.0, sinkronisasi: 3.1 },
  ],
  bulanan: [
    { label: "Jan", penjualan: 12.5, masuk: 5.4, keluar: 4.2, sinkronisasi: 2.8 },
    { label: "Feb", penjualan: 14.8, masuk: 6.8, keluar: 5.1, sinkronisasi: 3.5 },
    { label: "Mar", penjualan: 18.2, masuk: 7.5, keluar: 6.0, sinkronisasi: 4.2 },
    { label: "Apr", penjualan: 16.4, masuk: 7.0, keluar: 5.8, sinkronisasi: 3.9 },
    { label: "Mei", penjualan: 22.5, masuk: 9.8, keluar: 8.2, sinkronisasi: 5.6 },
    { label: "Jun", penjualan: 28.4, masuk: 12.6, keluar: 10.5, sinkronisasi: 7.4 },
  ],
}

const SERIES = [
  { key: "penjualan", label: "Penjualan", color: "#2563eb" },
  { key: "masuk", label: "Barang Masuk", color: "#10b981" },
  { key: "keluar", label: "Barang Keluar", color: "#f59e0b" },
  { key: "sinkronisasi", label: "Sinkronisasi", color: "#8b5cf6" },
]

export function ActivityChart({ timeframe = "mingguan" }: { timeframe?: "harian" | "mingguan" | "bulanan" }) {
  const data = DATASETS[timeframe] || DATASETS.mingguan

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="size-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: s.color }}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
