interface SparklineProps {
  data: number[]
  color: string
  className?: string
}

export function Sparkline({ data, color, className }: SparklineProps) {
  const w = 72
  const h = 30
  const paddingRight = 4
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * (w - paddingRight)
      const y = h - ((d - min) / span) * (h - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  const lastIdx = data.length - 1
  const lastX = w - paddingRight
  const lastY = h - ((data[lastIdx] - min) / span) * (h - 4) - 2

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className} fill="none">
      <polyline points={pts} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.5} fill={color} />
    </svg>
  )
}
