import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot, ReferenceLine
} from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { date, weightKg } = payload[0].payload
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="text-text-muted">{date}</p>
      <p className="text-green font-semibold">{weightKg} kg</p>
    </div>
  )
}

export default function WeightChart({ entries, goalWeight }) {
  const points = useMemo(() => {
    if (!entries || entries.length === 0) return []
    return entries.map(e => ({
      weightKg: e.weightKg,
      date: format(parseISO(e.loggedAt), 'MMM d'),
      rawDate: e.loggedAt,
    }))
  }, [entries])

  if (points.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center">
        <p className="text-sm text-text-muted">No weight data yet</p>
      </div>
    )
  }

  if (points.length < 3) {
    return (
      <div className="h-36 flex flex-col items-center justify-center gap-1">
        <p className="text-sm text-text-muted">Log weight on 3 different days to see your trend</p>
        <p className="text-xs text-text-muted">{points.length} of 3 days logged</p>
      </div>
    )
  }

  const weights = points.map(p => p.weightKg)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const padding = Math.max((maxW - minW) * 0.3, 1)
  const yMin = Math.floor(minW - padding)
  const yMax = Math.ceil(maxW + padding)

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: '#737373', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: '#737373', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}kg`}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="weightKg"
            stroke="var(--color-green)"
            strokeWidth={2}
            dot={false}
            activeDot={<Dot r={4} fill="var(--color-green)" stroke="none" />}
          />
          {goalWeight != null && goalWeight >= yMin && goalWeight <= yMax && (
            <ReferenceLine
              y={goalWeight}
              stroke="var(--color-green)"
              strokeOpacity={0.4}
              strokeWidth={1.5}
              label={{
                value: `Goal ${goalWeight}kg`,
                position: 'insideTopRight',
                fill: 'var(--color-green)',
                fontSize: 11,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}