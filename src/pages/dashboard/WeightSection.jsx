import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { apiClient } from '@/apiClient'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import  WeightChart from './WeightChart'

// ── helpers ───────────────────────────────────────────────────────────────────

function build30DayChartData(entries) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return Object.entries(
    [...entries]
      .filter(e => new Date(e.loggedAt) >= thirtyDaysAgo)
      .reduce((acc, e) => {
        const day = e.loggedAt.slice(0, 10)
        if (!acc[day]) acc[day] = []
        acc[day].push(e.weightKg)
        return acc
      }, {})
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, weights]) => ({
      weightKg: Math.round((weights.reduce((s, w) => s + w, 0) / weights.length) * 10) / 10,
      loggedAt: day + 'T00:00:00',
    }))
}

function ChangeLabel({ change, currentWeight, goalWeight }) {
  if (change == null) return <span className="text-text-muted">—</span>
  if (change === 0) return <span className="text-text-muted">0.0 kg</span>

  const towardsGoal = goalWeight != null
    ? (change > 0 && currentWeight < goalWeight) || (change < 0 && currentWeight > goalWeight)
    : change < 0

  const color = towardsGoal ? 'text-green' : 'text-red'
  const sign = change > 0 ? '+' : ''
  return <span className={color}>{sign}{change.toFixed(1)} kg</span>
}

// ── component ─────────────────────────────────────────────────────────────────

export default function WeightSection({ entries, goalWeight, onRefresh }) {
  const [input, setInput] = useState('')
  const [logging, setLogging] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const current = entries.length > 0 ? entries[0].weightKg : null
  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const preview = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const chartEntries = build30DayChartData(entries)

  useEffect(() => setPage(1), [entries])

  function getChange(entryIndex) {
    if (entryIndex >= entries.length - 1) return null
    return entries[entryIndex].weightKg - entries[entryIndex + 1].weightKg
  }

  async function handleLog() {
    const val = parseFloat(input)
    if (!val || val <= 0 || val > 500) { setError('Enter a valid weight'); return }
    setError(null)
    setLogging(true)
    try {
      await apiClient('/api/weight', {
        method: 'POST',
        body: { weightKg: val, date: format(new Date(), 'yyyy-MM-dd') },
      })
      setInput('')
      onRefresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLogging(false)
    }
  }

  async function handleDelete(id) {
    try {
      await apiClient(`/api/weight/${id}`, { method: 'DELETE' })
      onRefresh()
    } catch {
      // silent
    }
  }

  return (
    <div className="bg-bg-card rounded-xl p-4 flex flex-col gap-4">

      {/* stats row */}
      <div className="flex items-start justify-between">
        <div>
          <p className=" text-text-muted uppercase tracking-wide">Current Weight</p>
          <p className="text-2xl font-bold text-text-primary mt-0.5">
            {current != null ? `${current} kg` : '— kg'}
          </p>
        </div>
        {goalWeight != null && (
          <div className="text-right">
            <p className="text-text-muted uppercase tracking-wide">Target</p>
            <p className="text-2xl font-bold text-green mt-0.5">{goalWeight} kg</p>
          </div>
        )}
      </div>

      {/* log input */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            min="1"
            max="500"
            placeholder="Enter weight..."
            value={input}
            onChange={e => { setInput(e.target.value); setError(null) }}
            onKeyDown={e => e.key === 'Enter' && handleLog()}
            className="flex-1 bg-bg-input text-text-primary placeholder-text-muted rounded-lg px-3 py-2 text-sm border border-transparent focus:outline-none focus:border-green"
          />
          <button
            onClick={handleLog}
            disabled={logging || !input}
            className="px-4 py-2 bg-green text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {logging ? '...' : 'Log'}
          </button>
        </div>
        {error && <p className="text-xs text-red">{error}</p>}
      </div>

      {/* chart */}
      {chartEntries.length > 0 && <WeightChart entries={chartEntries} />}

      {/* history */}
      {entries.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3">Weight History</p>

          {/* desktop table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className=" text-text-muted uppercase tracking-wide border-b border-border">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Weight</th>
                  <th className="text-left py-2 font-medium">Change</th>
                  <th className="text-right py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((entry, i) => {
                  const realIndex = (page - 1) * PAGE_SIZE + i
                  return (
                    <tr key={entry.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 text-text-secondary">
                        {format(parseISO(entry.loggedAt), 'MMM d, yyyy · h:mm a')}
                      </td>
                      <td className="py-3 font-medium text-text-primary">{entry.weightKg} kg</td>
                      <td className="py-3">
                        <ChangeLabel
                          change={getChange(realIndex)}
                          currentWeight={entries[realIndex]?.weightKg}
                          goalWeight={goalWeight}
                        />
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-text-muted hover:text-red transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* mobile rows */}
          <div className="md:hidden flex flex-col">
            {preview.map((entry, i) => {
              const realIndex = (page - 1) * PAGE_SIZE + i
              return (
                <div key={entry.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{entry.weightKg} kg</p>
                    <p className="text-xs text-text-muted">
                      {format(parseISO(entry.loggedAt), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ChangeLabel
                      change={getChange(realIndex)}
                      currentWeight={entries[realIndex]?.weightKg}
                      goalWeight={goalWeight}
                    />
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-text-muted hover:text-red transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      ) : (
        <EmptyState icon="⚖️" title="No weight logged yet" description="Log your first weight above to start tracking progress." />
      )}
    </div>
  )
}