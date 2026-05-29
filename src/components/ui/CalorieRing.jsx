export default function CalorieRing({ value = 0, goal = 2000, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = goal > 0 ? Math.min(value / goal, 1) : 0
  const offset = circumference * (1 - pct)
  const consumed = Math.round(value)
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#242424"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text
          x={cx} y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#f5f5f5"
          fontSize="22"
          fontWeight="700"
          fontFamily="inherit"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${cx}px ${cy}px` }}
        >
          {consumed.toLocaleString()}
        </text>
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#737373"
          fontSize="10"
          fontWeight="600"
          fontFamily="inherit"
          letterSpacing="1"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${cx}px ${cy}px` }}
        >
          KCAL
        </text>
      </svg>
    </div>
  )
}