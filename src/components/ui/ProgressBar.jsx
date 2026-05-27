export default function ProgressBar({ value, max, color = 'bg-green' }) {
    const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0
    const isOver = max > 0 && value > max
  
    return (
      <div className="w-full bg-bg-input rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${isOver ? 'bg-red' : color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }