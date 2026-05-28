import { Trash2 } from 'lucide-react'

export default function FoodLogTable({ entries, onDelete }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-text-muted border-b border-border">
          <th className="text-left py-2 font-medium">Food</th>
          <th className="text-right py-2 font-medium">Amount</th>
          <th className="text-right py-2 font-medium text-green-400">kcal</th>
          <th className="text-right py-2 font-medium text-blue-400">P</th>
          <th className="text-right py-2 font-medium text-orange-400">C</th>
          <th className="text-right py-2 font-medium text-yellow-400">F</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id} className="border-b border-border last:border-0">
            <td className="py-3">
              <p className="text-base font-semibold text-text-primary">{entry.foodName}</p>
              {entry.brand && (
                <p className="text-sm text-text-muted uppercase">{entry.brand}</p>
              )}
            </td>
            <td className="text-right py-3 text-text-muted">{entry.amountGrams}g</td>
            <td className="text-right py-3 text-green-400">{Math.round(entry.calories)}</td>
            <td className="text-right py-3 text-blue-400">{Math.round(entry.protein)}g</td>
            <td className="text-right py-3 text-orange-400">{Math.round(entry.carbs)}g</td>
            <td className="text-right py-3 text-yellow-400">{Math.round(entry.fat)}g</td>
            <td className="text-right py-3">
              <button
                onClick={() => onDelete(entry.id)}
                className="text-text-muted hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}