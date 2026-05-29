import { useState } from 'react'
import { Trash2 } from 'lucide-react'

export default function LoggedEntry({ entry, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(entry.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-bg-card rounded-xl p-4 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-text-primary truncate">{entry.foodName}</p>
        <p className="text-sm text-text-muted">{entry.amountGrams}g</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-green font-medium">{Math.round(entry.calories)} kcal</span>
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-purple inline-block" />
            Protein {Math.round(entry.protein)}g
          </span>
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-orange inline-block" />
            Carbs {Math.round(entry.carbs)}g
          </span>
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-yellow inline-block" />
            Fat {Math.round(entry.fat)}g
          </span>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-red transition-colors cursor-pointer disabled:opacity-40"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}