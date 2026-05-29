import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'

export default function WeightChart({ entries }) {
  const points = useMemo(() => {
    if (!entries || entries.length === 0) return []
    return entries.map(e => ({
      weight: e.weightKg,
      date: parseISO(e.loggedAt),
    }))
  }, [entries])

  if (points.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center">
        <p className="text-sm text-text-muted">No weight data yet</p>
      </div>
    )
  }

  const W = 560
  const H = 120
  const PAD_LEFT = 40
  const PAD_RIGHT = 8
  const PAD_Y = 12

  const weights = points.map(p => p.weight)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const range = maxW - minW || 1
  const yMin = minW - range * 0.2
  const yMax = maxW + range * 0.2

  const toX = i => PAD_LEFT + (i / (points.length - 1 || 1)) * (W - PAD_LEFT - PAD_RIGHT)
  const toY = w => PAD_Y + (1 - (w - yMin) / (yMax - yMin)) * (H - PAD_Y * 2)

  const pathD = points.reduce((acc, p, i) => {
    const x = toX(i)
    const y = toY(p.weight)
    if (i === 0) return `M ${x} ${y}`
    const prevX = toX(i - 1)
    const prevY = toY(points[i - 1].weight)
    const cpX = (prevX + x) / 2
    return `${acc} C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`
  }, '')

  const lastX = toX(points.length - 1)
  const lastY = toY(points[points.length - 1].weight)

  const yLabels = [
    { value: maxW, y: toY(maxW) },
    { value: Math.round((minW + maxW) / 2 * 10) / 10, y: toY((minW + maxW) / 2) },
    { value: minW, y: toY(minW) },
  ]

  const xLabelIndices = points.length <= 2
    ? [0, points.length - 1]
    : [0, Math.floor((points.length - 1) / 2), points.length - 1]

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* y-axis labels */}
        {yLabels.map((l, i) => (
          <text
            key={i}
            x={PAD_LEFT - 6}
            y={l.y}
            textAnchor="end"
            dominantBaseline="middle"
            fill="#737373"
            fontSize="9"
            fontFamily="inherit"
          >
            {l.value}
          </text>
        ))}

        {/* dashed midline */}
        {points.length > 1 && (
          <line
            x1={PAD_LEFT}
            y1={H / 2}
            x2={W - PAD_RIGHT}
            y2={H / 2}
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}

        {/* trend line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* dot on last point */}
        <circle cx={lastX} cy={lastY} r="4" fill="var(--color-green)" />
      </svg>

      {/* x-axis labels */}
      <div
        className="flex justify-between mt-1"
        style={{ paddingLeft: `${PAD_LEFT}px`, paddingRight: `${PAD_RIGHT}px` }}
      >
        {xLabelIndices.map((pointIndex, i) => (
          <span key={i} className="text-xs text-text-muted">
            {pointIndex === points.length - 1
              ? 'Today'
              : format(points[pointIndex].date, 'MMM d')}
          </span>
        ))}
      </div>
    </div>
  )
}