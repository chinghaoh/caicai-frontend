import { useState, useRef, useEffect } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'

export default function LoggedEntry({ entry, onDelete, onUpdate }) {
  const [deleting, setDeleting]   = useState(false)
  const [editing, setEditing]     = useState(false)
  const [grams, setGrams]         = useState(String(entry.amountGrams))
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState(null)
  const inputRef                  = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function handleEditOpen() {
    setGrams(String(entry.amountGrams))
    setError(null)
    setEditing(true)
  }

  function handleEditCancel() {
    setEditing(false)
    setError(null)
  }

  async function handleSave() {
    const parsed = parseInt(grams, 10)
    if (!grams || isNaN(parsed) || parsed < 1) {
      setError('Must be at least 1g')
      return
    }
    if (parsed === entry.amountGrams) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      await onUpdate(entry.id, parsed)
      setEditing(false)
    } catch (e) {
      setError(e?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(entry.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-bg-card rounded-xl p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-text-primary truncate">{entry.foodName}</p>

        {editing ? (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="relative w-28">
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  value={grams}
                  onChange={e => { setGrams(e.target.value); setError(null) }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleEditCancel() }}
                  className="w-full bg-bg-input border border-border rounded-lg px-3 py-1.5 text-base text-text-primary focus:outline-none focus:border-green pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted pointer-events-none">g</span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-green text-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleEditCancel}
                disabled={saving}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-input text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            {error && <p className="text-xs text-red mt-1">{error}</p>}
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted">{entry.amountGrams}g</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-green font-medium">{Math.round(entry.calories)} kcal</span>
              <span className="flex items-center gap-1 text-sm text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-purple inline-block" />
                P {Math.round(entry.protein)}g
              </span>
              <span className="flex items-center gap-1 text-sm text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-orange inline-block" />
                C {Math.round(entry.carbs)}g
              </span>
              <span className="flex items-center gap-1 text-sm text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-yellow inline-block" />
                F {Math.round(entry.fat)}g
              </span>
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleEditOpen}
            disabled={deleting}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-40"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-red transition-colors cursor-pointer disabled:opacity-40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  )
}