import { useState, useEffect, useRef, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { X, Droplets, Trash2 } from 'lucide-react'
import { apiClient } from '@/apiClient'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const PRESETS = [
  { label: '150ml', value: 150 },
  { label: '250ml', value: 250 },
  { label: '500ml', value: 500 },
  { label: '750ml', value: 750 },
]

export default function WaterModal({ isOpen, onClose, date, goalMl = 2500, onUpdate }) {
  const [entries, setEntries]       = useState([])
  const [totalMl, setTotalMl]       = useState(0)
  const [loading, setLoading]       = useState(false)
  const [adding, setAdding]         = useState(false)
  const [customMl, setCustomMl]     = useState('')
  const [customError, setCustomError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const customInputRef              = useRef(null)

  const fetchWater = useCallback(async () => {
    if (!date) return
    setLoading(true)
    try {
      const res = await apiClient(`/api/water?date=${date}`)
      setEntries(res.entries ?? [])
      setTotalMl(res.totalMl ?? 0)
    } catch {
      setEntries([])
      setTotalMl(0)
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    if (isOpen) {
      fetchWater()
      setCustomMl('')
      setCustomError(null)
    }
  }, [isOpen, fetchWater])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  async function addWater(amountMl) {
    setAdding(true)
    try {
      await apiClient('/api/water', {
        method: 'POST',
        body: { amountMl, date },
      })
      await fetchWater()
      onUpdate?.()
      onClose()
    } catch {
    } finally {
      setAdding(false)
    }
  }

  async function handlePreset(value) {
    await addWater(value)
  }

  async function handleCustomAdd() {
    const amount = parseInt(customMl, 10)
    if (!amount || amount < 1) {
      setCustomError('Enter at least 1ml')
      customInputRef.current?.focus()
      return
    }
    setCustomError(null)
    await addWater(amount)
    setCustomMl('')
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await apiClient(`/api/water/${id}`, { method: 'DELETE' })
      await fetchWater()
      onUpdate?.()
    } catch {
      // silent
    } finally {
      setDeletingId(null)
    }
  }

  if (!isOpen) return null

  const progressPct = Math.min((totalMl / goalMl) * 100, 100)
  const totalL      = (totalMl / 1000).toFixed(1)
  const goalL       = (goalMl / 1000).toFixed(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-border rounded-xl w-full max-w-sm flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-blue" />
            <span className="text-base font-semibold text-text-primary">Water</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-bg-input transition-colors cursor-pointer text-text-muted hover:text-text-secondary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">

          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-text-primary">
                {totalL}
                <span className="text-sm font-normal text-text-muted ml-1">L</span>
              </span>
              <span className="text-sm text-text-muted">Goal {goalL}L</span>
            </div>
            <div className="h-2 bg-bg-input rounded-full overflow-hidden">
              <div
                className="h-full bg-blue rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-text-muted">{Math.round(progressPct)}% of daily goal</span>
          </div>

          {/* Quick-add presets */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide font-medium mb-2">Quick add</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => {handlePreset(p.value); onClose()}}
                  disabled={adding || !!deletingId}
                  className="bg-bg-input hover:bg-border text-text-secondary text-sm font-medium rounded-lg py-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide font-medium mb-2">Custom amount</p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={customInputRef}
                  type="number"
                  min="1"
                  value={customMl}
                  onChange={e => { setCustomMl(e.target.value); setCustomError(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleCustomAdd()}
                  placeholder="e.g. 330"
                  className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors pr-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted pointer-events-none">ml</span>
              </div>
              <button
                onClick={handleCustomAdd}
                disabled={adding || !!deletingId}
                className="bg-blue text-white rounded-lg px-4 font-semibold text-base hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                Add
              </button>
            </div>
            {customError && <p className="text-xs text-red mt-1">{customError}</p>}
          </div>

          {/* Entry list */}
          {loading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : entries.length > 0 ? (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide font-medium mb-2">Today's log</p>
              <div className="flex flex-col gap-1">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-input"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue text-sm font-medium">{entry.amountMl}ml</span>
                      <span className="text-xs text-text-muted">
                        {format(parseISO(entry.loggedAt), 'h:mma')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id || adding}
                      className="p-1 rounded text-text-muted hover:text-red transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {deletingId === entry.id
                        ? <span className="text-xs">...</span>
                        : <Trash2 size={14} />
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted text-center py-2">No water logged yet today.</p>
          )}

        </div>
      </div>
    </div>
  )
}