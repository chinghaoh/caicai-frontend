function Badge({ label, value, color }) {
    return (
      <div className="flex flex-col items-center">
        <span className={`text-sm font-semibold ${color}`}>{value}g</span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
    )
  }
  
  export default function MacroBadge({ calories, protein, carbs, fat }) {
    return (
      <div className="flex items-center gap-4">
        {calories !== undefined && (
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-green">{calories}</span>
            <span className="text-xs text-text-muted">kcal</span>
          </div>
        )}
        <Badge label="protein" value={protein} color="text-blue" />
        <Badge label="carbs" value={carbs} color="text-orange" />
        <Badge label="fat" value={fat} color="text-yellow" />
      </div>
    )
  }