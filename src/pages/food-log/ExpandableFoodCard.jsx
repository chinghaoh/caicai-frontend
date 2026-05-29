import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { Heart, X } from 'lucide-react'

const MEAL_OPTIONS = [
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH',     label: 'Lunch'     },
  { value: 'DINNER',    label: 'Dinner'    },
  { value: 'SNACK',     label: 'Snack'     },
]

export default function ExpandableFoodCard({
  food,
  expandedId,
  onExpand,
  onLog,
  activeMeal,
  activeDate,
  isFavourite,
  onToggleFavourite,
}) {
  const isExpanded              = expandedId === food.id
  const [grams, setGrams]       = useState('100')
  const [error, setError]       = useState(null)
  const [logging, setLogging]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [cardMeal, setCardMeal] = useState(activeMeal)
  const [cardDate, setCardDate] = useState(activeDate)
  const [dateInput, setDateInput] = useState('')
  const [dateError, setDateError] = useState(null)
  const inputRef                = useRef(null)

  function toDisplayDate(iso) {
    if (!iso) return ''
    const [yyyy, mm, dd] = iso.split('-')
    return `${dd}/${mm}/${yyyy}`
  }

  function toIsoDate(display) {
    const parts = display.split('/')
    if (parts.length !== 3) return null
    const [dd, mm, yyyy] = parts
    if (!dd || !mm || !yyyy || yyyy.length !== 4) return null
    const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
    const parsed = new Date(iso)
    if (isNaN(parsed.getTime())) return null
    if (iso > format(new Date(), 'yyyy-MM-dd')) return null
    return iso
  }

  useEffect(() => {
    if (isExpanded) {
      setGrams('100')
      setError(null)
      setSuccess(false)
      setCardMeal(activeMeal)
      setCardDate(activeDate)
      setDateInput(toDisplayDate(activeDate))
      setDateError(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isExpanded, activeMeal, activeDate])

  function handleDateBlur() {
    const iso = toIsoDate(dateInput)
    if (iso) {
      setCardDate(iso)
      setDateError(null)
    } else {
      setDateError('Enter a valid date (dd/mm/yyyy)')
    }
  }

  async function handleLog() {
    const amount = parseInt(grams, 10)
    if (!amount || amount < 1) { setError('Enter at least 1g'); return }
    setLogging(true)
    setError(null)
    try {
      await onLog(food.id, amount, cardMeal, cardDate)
      setSuccess(true)
      setTimeout(() => { onExpand(null); setSuccess(false) }, 800)
    } catch (err) {
      setError(err.message || 'Failed to log food')
    } finally {
      setLogging(false)
    }
  }

  const scaledGrams = parseInt(grams) > 0 ? parseInt(grams) : 0

  return (
    <div className="bg-bg-card rounded-xl overflow-hidden">

      {/* Header row */}
      <div
        className="p-4 flex items-center justify-between gap-3 cursor-pointer"
        onClick={() => onExpand(isExpanded ? null : food.id)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-text-primary truncate">{food.name}</p>
          {food.brand && (
            <p className="text-sm text-text-muted uppercase tracking-wide">{food.brand}</p>
          )}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-purple inline-block flex-shrink-0" />
              Protein {Math.round(food.proteinPer100g)}g
            </span>
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-orange inline-block flex-shrink-0" />
              Carbs {Math.round(food.carbsPer100g)}g
            </span>
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-yellow inline-block flex-shrink-0" />
              Fat {Math.round(food.fatPer100g)}g
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onToggleFavourite(food) }}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
          >
            <Heart size={16} className={isFavourite ? 'fill-green text-green' : 'text-text-muted'} />
          </button>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-bg-input' : 'bg-green'}`}>
            {isExpanded
              ? <X size={16} className="text-text-muted" />
              : <span className="text-white text-lg font-light leading-none">+</span>
            }
          </div>
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 flex flex-col gap-4">

          {/* Meal selector */}
          <div>
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide font-medium">Meal</p>
            <div className="flex gap-2 flex-wrap">
              {MEAL_OPTIONS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setCardMeal(m.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    cardMeal === m.value
                      ? 'bg-white text-black'
                      : 'bg-transparent border border-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date input */}
          <div>
            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide font-medium">Date</p>
            <input
              type="text"
              value={dateInput}
              onChange={e => { setDateInput(e.target.value); setDateError(null) }}
              onBlur={handleDateBlur}
              placeholder="dd/mm/yyyy"
              className="w-36 bg-bg-input border border-border rounded-lg px-3 py-2 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green transition-colors"
            />
            {dateError && <p className="text-xs text-red mt-1">{dateError}</p>}
          </div>

          {/* Grams input + log button */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  value={grams}
                  onChange={e => { setGrams(e.target.value); setError(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleLog()}
                  className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-base text-text-primary focus:outline-none focus:border-green pr-10"
                  placeholder="100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted pointer-events-none">g</span>
              </div>
              {error && <p className="text-xs text-red mt-1">{error}</p>}
            </div>
            <button
              onClick={handleLog}
              disabled={logging || success}
              className={`h-10 px-5 rounded-lg font-semibold text-base transition-all cursor-pointer flex-shrink-0 ${
                success ? 'bg-green-bg text-green' : 'bg-green text-white hover:opacity-90'
              } disabled:opacity-60`}
            >
              {logging ? '...' : success ? 'Logged' : 'Log it'}
            </button>
          </div>

          {/* Macro preview */}
          {scaledGrams > 0 && (
            <div className="flex gap-4 text-sm flex-wrap">
              <span className="text-green font-medium">{Math.round(food.caloriesPer100g * scaledGrams / 100)} kcal</span>
              <span className="text-purple">Protein {Math.round(food.proteinPer100g * scaledGrams / 100)}g</span>
              <span className="text-orange">Carbs {Math.round(food.carbsPer100g * scaledGrams / 100)}g</span>
              <span className="text-yellow">Fat {Math.round(food.fatPer100g * scaledGrams / 100)}g</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}