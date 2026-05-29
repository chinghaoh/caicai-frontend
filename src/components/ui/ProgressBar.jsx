const COLOR_MAP = {
  'bg-green':  'bg-green',
  'bg-purple': 'bg-purple',
  'bg-orange': 'bg-orange',
  'bg-yellow': 'bg-yellow',
  'bg-blue':   'bg-blue',
  'bg-red':    'bg-red',
}

export default function ProgressBar({ value, max, color = 'bg-green' }) {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0
  const isOver     = max > 0 && value > max
  const barColor   = isOver ? 'bg-red' : (COLOR_MAP[color] ?? 'bg-green')

  return (
    <div className="w-full bg-bg-input rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}