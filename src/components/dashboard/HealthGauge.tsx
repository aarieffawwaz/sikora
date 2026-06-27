import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { useSikoraStore } from "@/store/useSikoraStore"
import { healthScore } from "@/lib/dashboard"

const COLORS = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"]

export function HealthGauge() {
  const products = useSikoraStore((s) => s.products)
  const synced = useSikoraStore((s) => s.synced)
  const pending = useSikoraStore((s) => s.transactions.filter((t) => !t.synced).length)

  const { score, breakdown } = healthScore(products, synced, pending)
  const data = breakdown.map((b, i) => ({ ...b, color: COLORS[i] }))

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={82}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{score}</span>
          <span className="text-xs font-medium text-emerald-600">Baik</span>
        </div>
      </div>
      <div className="mt-5 pb-2 grid w-full grid-cols-2 gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="size-2 rounded-full" style={{ background: d.color }} />
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}
