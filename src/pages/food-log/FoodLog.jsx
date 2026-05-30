import { useState, useEffect, useRef, useCallback } from 'react'
import { format } from 'date-fns'
import { Search, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { apiClient } from '@/apiClient'
import CalorieRing from '@/components/ui/CalorieRing'
import FilterPills from '@/components/ui/FilterPills'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProgressBar from '@/components/ui/ProgressBar'
import PageHeader from '@/components/ui/PageHeader'
import DatePicker from '@/components/ui/DatePicker'
import WaterModal from '@/components/water/WaterModel'
import ExpandableFoodCard from './ExpandableFoodCard'
import LoggedEntry from './LoggedEntry'

const MEAL_OPTIONS = [
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
  { value: 'DINNER', label: 'Dinner' },
  { value: 'SNACK', label: 'Snack' },
]

export default function FoodLog() {
  const today = format(new Date(), 'yyyy-MM-dd')

  const [date, setDate] = useState(today)
  const [showPicker, setShowPicker] = useState(false)
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [activeMeal, setActiveMeal] = useState('BREAKFAST')
  const [activeTab, setActiveTab] = useState('logged')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [favourites, setFavourites] = useState([])
  const [favouriteIds, setFavouriteIds] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)
  const [waterModalOpen, setWaterModalOpen] = useState(false)
  const debounceRef = useRef(null)

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true)
    try {
      const res = await apiClient(`/api/dashboard/summary?date=${date}`)
      setSummary(res)
    } catch {
      setSummary(null)
    } finally {
      setSummaryLoading(false)
    }
  }, [date])

  useEffect(() => { fetchSummary() }, [fetchSummary])

  useEffect(() => {
    apiClient('/api/foods/favourites')
      .then(res => {
        setFavourites(res)
        setFavouriteIds(new Set(res.map(f => f.id)))
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (query.length < 2) { setSearchResults([]); setSearching(false); return }
    setSearching(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await apiClient(`/api/foods?query=${encodeURIComponent(query.trim())}`)
        setSearchResults(res)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  async function handleLog(foodId, amountGrams, mealType, logDate) {
    await apiClient('/api/food-logs', {
      method: 'POST',
      body: { foodItemId: foodId, amountGrams, mealType, date: logDate },
    })
    if (logDate === date) fetchSummary()
  }

  async function handleDelete(entryId) {
    await apiClient(`/api/food-logs/${entryId}`, { method: 'DELETE' })
    fetchSummary()
  }

  async function handleUpdate(entryId, amountGrams) {
    await apiClient(`/api/food-logs/${entryId}`, {
      method: 'PUT',
      body: { amountGrams },
    })
    fetchSummary()
  }

  async function handleToggleFavourite(food) {
    const isFav = favouriteIds.has(food.id)
    try {
      if (isFav) {
        await apiClient(`/api/foods/${food.id}/favourite`, { method: 'DELETE' })
        setFavouriteIds(prev => { const s = new Set(prev); s.delete(food.id); return s })
        setFavourites(prev => prev.filter(f => f.id !== food.id))
      } else {
        await apiClient(`/api/foods/${food.id}/favourite`, { method: 'POST' })
        setFavouriteIds(prev => new Set([...prev, food.id]))
        setFavourites(prev => [...prev, food])
      }
    } catch { }
  }

  function shiftDate(days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    const next = format(d, 'yyyy-MM-dd')
    if (next <= today) { setDate(next); setExpandedId(null) }
  }

  const isToday = date === today
  const displayDate = isToday ? 'Today' : format(new Date(date), 'EEE, MMM d')

  const totals = summary?.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: 0 }
  const goal = summary?.goal ?? { calories: 2000, protein: 150, carbs: 200, fat: 65, waterMl: 2500 }
  const logsByMeal = summary?.logsByMealType ?? {}
  const entriesForMeal = logsByMeal[activeMeal] ?? []
  const isSearchActive = query.length >= 2

  const METRICS = [
    { label: 'Protein', value: Math.round(totals.protein), max: goal.protein, unit: 'g', color: 'text-purple', bar: 'bg-purple', clickable: false },
    { label: 'Carbs', value: Math.round(totals.carbs), max: goal.carbs, unit: 'g', color: 'text-orange', bar: 'bg-orange', clickable: false },
    { label: 'Fat', value: Math.round(totals.fat), max: goal.fat, unit: 'g', color: 'text-yellow', bar: 'bg-yellow', clickable: false },
    {
      label: 'Water',
      value: Math.round((totals.waterMl ?? 0) / 100) / 10,
      max: Math.round((goal.waterMl ?? 2500) / 100) / 10,
      unit: 'L',
      color: 'text-blue',
      bar: 'bg-blue',
      clickable: true,
    },
  ]

  function renderFoodCards(foods, emptyIcon, emptyTitle, emptyDesc) {
    if (!foods.length) return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDesc} />
    return (
      <div className="flex flex-col gap-2">
        {foods.map(food => (
          <ExpandableFoodCard
            key={food.id}
            food={food}
            expandedId={expandedId}
            onExpand={setExpandedId}
            onLog={handleLog}
            activeMeal={activeMeal}
            activeDate={date}
            isFavourite={favouriteIds.has(food.id)}
            onToggleFavourite={handleToggleFavourite}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="pb-24 md:pb-8">
      <div className="px-4 pt-4 w-full mx-auto">
        <PageHeader title="Food Log" />

        {/* Date navigator */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => shiftDate(-1)} className="p-2 rounded-lg bg-bg-card hover:bg-bg-input transition-colors cursor-pointer">
            <ChevronLeft size={18} className="text-text-muted" />
          </button>
          <div className="relative flex items-center gap-2">
            <span className="text-base font-medium text-text-primary">{displayDate}</span>
            <button onClick={() => setShowPicker(p => !p)} className="p-1 rounded-lg hover:bg-bg-input transition-colors cursor-pointer">
              <Calendar size={15} className="text-text-muted" />
            </button>
            {showPicker && (
              <DatePicker
                selected={date}
                onChange={d => { setDate(d); setExpandedId(null) }}
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>
          <button onClick={() => shiftDate(1)} disabled={isToday} className="p-2 rounded-lg bg-bg-card hover:bg-bg-input transition-colors cursor-pointer disabled:opacity-30">
            <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>

        {/* Macro summary */}
        {summaryLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : (
          <div className="bg-bg-card rounded-xl p-4 mb-4">
            {/* Mobile */}
            <div className="flex flex-col items-center gap-4 md:hidden">
              <CalorieRing value={totals.calories} goal={goal.calories} size={140} strokeWidth={8} showGoal />
              <div className="w-full flex flex-col gap-3">
                {METRICS.map(m => (
                  <div
                    key={m.label}
                    onClick={m.clickable ? () => setWaterModalOpen(true) : undefined}
                    className={m.clickable ? 'cursor-pointer' : undefined}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-medium ${m.color}`}>{m.label}</span>
                      <span className="text-text-muted">{m.value}{m.unit} / {m.max}{m.unit}</span>
                    </div>
                    <ProgressBar value={m.value} max={m.max} color={m.bar} />
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <CalorieRing value={totals.calories} goal={goal.calories} size={120} strokeWidth={8} showGoal />
              <div className="flex-1 grid grid-cols-4 gap-4">
                {METRICS.map(m => (
                  <div
                    key={m.label}
                    onClick={m.clickable ? () => setWaterModalOpen(true) : undefined}
                    className={m.clickable ? 'cursor-pointer rounded-lg hover:bg-bg-input p-2 -m-2 transition-colors' : undefined}
                  >
                    <span className={`text-sm font-medium ${m.color}`}>{m.label}</span>
                    <p className="text-sm text-text-muted mt-0.5">{m.value}{m.unit} / {m.max}{m.unit}</p>
                    <div className="mt-2"><ProgressBar value={m.value} max={m.max} color={m.bar} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Meal filter pills */}
        <FilterPills
          options={MEAL_OPTIONS}
          active={activeMeal}
          onChange={meal => { setActiveMeal(meal); setExpandedId(null) }}
        />

        {/* Search bar */}
        <div className="relative mt-4 mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setExpandedId(null) }}
            placeholder="Search food..."
            className="w-full bg-bg-card border border-border rounded-xl pl-9 pr-9 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green transition-colors"
          />
          {query && (
            <button onClick={() => { setQuery(''); setSearchResults([]) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search results or tabs */}
        {isSearchActive ? (
          <section>
            <p className="text-sm text-text-muted mb-3">
              {searching ? 'Searching...' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
            </p>
            {searching
              ? <div className="flex justify-center py-8"><LoadingSpinner /></div>
              : renderFoodCards(searchResults, '🔍', 'No results', `Nothing found for "${query}"`)
            }
          </section>
        ) : (
          <>
            {/* Logged / Favourites tabs */}
            <div className="flex mb-4 bg-bg-input rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveTab('logged')}
                className={`flex-1 py-2.5 text-base font-medium transition-colors cursor-pointer ${activeTab === 'logged'
                    ? 'bg-bg-card text-text-primary rounded-xl'
                    : 'text-text-muted'
                  }`}
              >
                Logged {entriesForMeal.length > 0 && <span className="text-text-muted text-sm">{entriesForMeal.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab('favourites')}
                className={`flex-1 py-2.5 text-base font-medium transition-colors cursor-pointer ${activeTab === 'favourites'
                    ? 'bg-bg-card text-text-primary rounded-xl'
                    : 'text-text-muted'
                  }`}
              >
                Favourites
              </button>
            </div>

            {activeTab === 'logged' ? (
              <section>
                {entriesForMeal.length === 0 ? (
                  <EmptyState icon="🍽️" title="Nothing logged" description={`No ${activeMeal.toLowerCase()} entries yet.`} />
                ) : (
                  <div className="flex flex-col gap-2">
                    {entriesForMeal.map(entry => (
                      <LoggedEntry key={entry.id} entry={entry} onDelete={handleDelete} onUpdate={handleUpdate} />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section>
                {renderFoodCards(favourites, '⭐', 'No favourites yet', 'Star a food while searching to save it here.')}
              </section>
            )}
          </>
        )}
      </div>

      <WaterModal
        isOpen={waterModalOpen}
        onClose={() => setWaterModalOpen(false)}
        date={date}
        goalMl={goal.waterMl ?? 2500}
        onUpdate={fetchSummary}
      />
    </div>
  )
}