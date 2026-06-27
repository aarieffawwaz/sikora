import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ACTIVITY_WEEKLY } from "@/data/seed"

const SERIES = [
  { key: "penjualan", label: "Penjualan", color: "#2563eb" },
  { key: "masuk", label: "Barang Masuk", color: "#10b981" },
  { key: "keluar", label: "Barang Keluar", color: "#f59e0b" },
  { key: "sinkronisasi", label: "Sinkronisasi", color: "#8b5cf6" },
]

export function ActivityChart() {
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
        <LineChart data={ACTIVITY_WEEKLY} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
