function Badge({ label, value, color }) {
  return (
    <div className="flex items-center gap-1 text-sm text-text-secondary">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
      <span>{label} {value}g</span>
    </div>
  )
}

export default function MacroBadge({ calories, protein, carbs, fat }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {calories !== undefined && (
        <span className="text-sm font-semibold text-green">{calories} kcal</span>
      )}
      <Badge label="P" value={protein} color="bg-purple" />
      <Badge label="C" value={carbs}   color="bg-orange" />
      <Badge label="F" value={fat}     color="bg-yellow" />
    </div>
  )
}