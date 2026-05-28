import { Trash2 } from 'lucide-react'

export default function FoodLogCard({ entries, onDelete }) {
  return (
    <div className="flex flex-col gap-2">
      {entries.map(entry => (
        <div key={entry.id} className="bg-bg-card rounded-xl p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-text-primary truncate">{entry.foodName}</p>
            {entry.brand && (
              <p className="text-sm text-text-muted uppercase">{entry.brand}</p>
            )}
            <div className="flex gap-3 mt-1">
              <span className="text-sm text-green-400">{Math.round(entry.calories)} kcal</span>
              <span className="text-sm text-blue-400">P {Math.round(entry.protein)}g</span>
              <span className="text-sm text-orange-400">C {Math.round(entry.carbs)}g</span>
              <span className="text-sm text-yellow-400">F {Math.round(entry.fat)}g</span>
            </div>
            <p className="text-sm text-text-muted mt-1">{entry.amountGrams}g</p>
          </div>
          <button
            onClick={() => onDelete(entry.id)}
            className="ml-4 text-text-muted hover:text-red-400 transition-colors cursor-pointer shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}