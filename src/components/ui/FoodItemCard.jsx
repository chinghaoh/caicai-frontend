import { Plus } from 'lucide-react'

export default function FoodItemCard({ food, onAdd, onAction, actionIcon }) {
  const handleClick = () => {
    if (onAction) onAction(food)
    else if (onAdd) onAdd(food)
  }

  const icon = actionIcon ?? <Plus size={20} className="text-white" />

  return (
    <div className="bg-bg-card rounded-xl p-4 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-text-primary truncate">{food.name}</p>
        {food.brand && (
          <p className="text-sm text-text-muted uppercase tracking-wide">{food.brand}</p>
        )}
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-purple flex-shrink-0" />
            P {Math.round(food.proteinPer100g)}g
          </span>
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />
            C {Math.round(food.carbsPer100g)}g
          </span>
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-yellow flex-shrink-0" />
            F {Math.round(food.fatPer100g)}g
          </span>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="w-10 h-10 bg-green rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
      >
        {icon}
      </button>
    </div>
  )
}