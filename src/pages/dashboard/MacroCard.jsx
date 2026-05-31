import { useNavigate } from 'react-router-dom'

export default function MacroCard({ label, consumed, goal, color }) {
  const navigate = useNavigate()

  const isWater = label === 'Water'
  const unit = isWater ? 'L' : 'g'
  const display = v => isWater ? (v / 1000).toFixed(1) : Math.round(v)
  const pct = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0

  return (
    <div
      className="bg-bg-card rounded-xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-bg-input transition-colors"
      onClick={() => navigate('/log')}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted uppercase tracking-wide" style={{ color }}>{label}</span>
        <span className="text-xs text-text-muted">{Math.round(pct)}%</span>
      </div>
      <div>
        <span className="text-2xl font-bold text-text-primary">{display(consumed)}</span>
        <span className="text-sm text-text-muted ml-1">/ {display(goal)}{unit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-input overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}