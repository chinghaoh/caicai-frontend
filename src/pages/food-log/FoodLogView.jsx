import { useState, useEffect, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { apiClient } from '@/apiClient'
import PageHeader from '@/components/ui/PageHeader'
import FilterPills from '@/components/ui/FilterPills'
import FoodItemCard from '@/components/ui/FoodItemCard'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import FoodLogTable from './FoodLogTable'
import FoodLogCard from './FoodLogCard'

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']
const MEAL_LABELS = { BREAKFAST: 'Breakfast', LUNCH: 'Lunch', DINNER: 'Dinner', SNACK: 'Snack' }

export default function FoodLogView({ date, onDateChange, entries, loading, error, onAdd, onDelete }) {
  const [activeMeal, setActiveMeal] = useState('BREAKFAST')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [amountGrams, setAmountGrams] = useState('100')
  const [amountError, setAmountError] = useState(null)
  const [adding, setAdding] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await apiClient(`/api/foods?query=${encodeURIComponent(query)}`)
        setSearchResults(data)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const shiftDate = (days) => {
    const d = parseISO(date)
    d.setDate(d.getDate() + days)
    onDateChange(format(d, 'yyyy-MM-dd'))
  }

  const openModal = (food) => {
    setSelectedFood(food)
    setAmountGrams('100')
    setAmountError(null)
  }

  const closeModal = () => {
    setSelectedFood(null)
    setAmountError(null)
  }

  const handleAdd = async () => {
    const amount = parseInt(amountGrams, 10)
    if (!amount || amount < 1) {
      setAmountError('Amount must be at least 1g')
      return
    }
    setAdding(true)
    try {
      await onAdd(selectedFood.id, amount, activeMeal)
      closeModal()
      setQuery('')
      setSearchResults([])
    } catch (err) {
      setAmountError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const entriesForMeal = entries.filter(e => e.mealType === activeMeal)

  const mealTotals = (mealEntries) => mealEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const totals = mealTotals(entriesForMeal)

  const isToday = date === format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="flex flex-col min-h-screen bg-bg-page pb-20 md:pb-0">
      <div className="px-4 pt-4">
        <PageHeader title="Food Log" />

        {/* Date navigator */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => shiftDate(-1)} className="p-2 rounded-lg bg-bg-card cursor-pointer">
            <ChevronLeft size={18} className="text-text-muted" />
          </button>
          <span className="text-base font-medium text-text-primary">
            {isToday ? 'Today' : format(parseISO(date), 'EEE, MMM d')}
          </span>
          <button onClick={() => shiftDate(1)} className="p-2 rounded-lg bg-bg-card cursor-pointer">
            <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>

        {/* Meal filter pills */}
        <FilterPills
          options={MEAL_TYPES.map(m => ({ value: m, label: MEAL_LABELS[m] }))}
          active={activeMeal}
          onChange={setActiveMeal}
        />

        {/* Search */}
        <div className="mt-4 mb-2">
          <Input
            placeholder="Search food..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Search results */}
        {searching && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
        {!searching && searchResults.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {searchResults.map(food => (
              <FoodItemCard key={food.id} food={food} onAdd={() => openModal(food)} />
            ))}
          </div>
        )}
        {!searching && query.length >= 2 && searchResults.length === 0 && (
          <p className="text-text-muted text-sm text-center py-4">No results for "{query}"</p>
        )}
      </div>

      {/* Logged entries */}
      <div className="px-4 mt-2">
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : entriesForMeal.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title={`No ${MEAL_LABELS[activeMeal].toLowerCase()} logged`}
            description="Search for a food above to add it"
          />
        ) : (
          <>
            {/* Meal totals */}
            <div className="flex gap-4 mb-3 px-1">
              <span className="text-sm text-green-400 font-medium">{Math.round(totals.calories)} kcal</span>
              <span className="text-sm text-blue-400">P {Math.round(totals.protein)}g</span>
              <span className="text-sm text-orange-400">C {Math.round(totals.carbs)}g</span>
              <span className="text-sm text-yellow-400">F {Math.round(totals.fat)}g</span>
            </div>

            <div className="hidden md:block">
              <FoodLogTable entries={entriesForMeal} onDelete={onDelete} />
            </div>
            <div className="md:hidden">
              <FoodLogCard entries={entriesForMeal} onDelete={onDelete} />
            </div>
          </>
        )}
      </div>

      {/* Amount modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
          <div className="bg-bg-card rounded-t-2xl md:rounded-2xl w-full md:max-w-sm p-6">
            <h2 className="text-base font-semibold text-text-primary mb-1">{selectedFood.name}</h2>
            {selectedFood.brand && (
              <p className="text-sm text-text-muted uppercase mb-4">{selectedFood.brand}</p>
            )}
            <Input
              label="Amount (grams)"
              type="number"
              value={amountGrams}
              onChange={e => {
                setAmountGrams(e.target.value)
                setAmountError(null)
              }}
              error={amountError}
            />
            <div className="flex gap-3 mt-4">
              <Button variant="secondary" fullWidth onClick={closeModal}>Cancel</Button>
              <Button fullWidth loading={adding} onClick={handleAdd}>
                Add to {MEAL_LABELS[activeMeal]}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}