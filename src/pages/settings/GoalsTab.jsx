import { useState, useEffect } from 'react'
import { apiClient } from '@/apiClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function GoalsTab({ user }) {
  const [form, setForm] = useState({
    calories:       '',
    protein:        '',
    carbs:          '',
    fat:            '',
    waterMl:        '',
    targetWeightKg: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCurrentGoal() {
      try {
        const res = await apiClient('/api/goals/current')
        const g = res.data ?? res
        setForm({
          calories:       g.calories       ?? '',
          protein:        g.protein        ?? '',
          carbs:          g.carbs          ?? '',
          fat:            g.fat            ?? '',
          waterMl:        g.waterMl        ?? '',
          targetWeightKg: g.targetWeightKg ?? '',
        })
      } catch {
        // no goal yet — leave form empty
      } finally {
        setLoading(false)
      }
    }
    fetchCurrentGoal()
  }, [])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setFieldErrors(e => ({ ...e, [field]: null }))
    setSuccess(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)
    setFieldErrors({})
    try {
      await apiClient('/api/goals', {
        method: 'POST',
        body: {
          calories:         parseInt(form.calories),
          protein:          parseInt(form.protein),
          carbs:            parseInt(form.carbs),
          fat:              parseInt(form.fat),
          waterMl:          parseInt(form.waterMl),
          targetWeightKg:   parseFloat(form.targetWeightKg),
          startingWeightKg: parseFloat(user?.weightKg ?? form.targetWeightKg),
        },
      })
      setSuccess(true)
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      else setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-text-primary">Daily Goals</h2>

      <div className="bg-bg-card rounded-xl p-5 flex flex-col gap-4">
        <p className="text-sm text-text-muted">
          Updating your goals creates a new record — your history is always preserved.
        </p>

        {/* calories full width */}
        <Input
          label="Daily Calories (kcal)"
          type="number"
          value={form.calories}
          onChange={e => set('calories', e.target.value)}
          placeholder="2000"
          error={fieldErrors.calories}
        />

        {/* macros 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Protein (g)"
            type="number"
            value={form.protein}
            onChange={e => set('protein', e.target.value)}
            placeholder="150"
            error={fieldErrors.protein}
          />
          <Input
            label="Carbs (g)"
            type="number"
            value={form.carbs}
            onChange={e => set('carbs', e.target.value)}
            placeholder="200"
            error={fieldErrors.carbs}
          />
          <Input
            label="Fat (g)"
            type="number"
            value={form.fat}
            onChange={e => set('fat', e.target.value)}
            placeholder="65"
            error={fieldErrors.fat}
          />
        </div>

        {/* water + target weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Daily Water (ml)"
            type="number"
            value={form.waterMl}
            onChange={e => set('waterMl', e.target.value)}
            placeholder="2500"
            error={fieldErrors.waterMl}
          />
          <Input
            label="Target Weight (kg)"
            type="number"
            step="0.1"
            value={form.targetWeightKg}
            onChange={e => set('targetWeightKg', e.target.value)}
            placeholder="70.0"
            error={fieldErrors.targetWeightKg}
          />
        </div>

        {error && <p className="text-xs text-red">{error}</p>}
        {success && <p className="text-xs text-green">Goals updated successfully.</p>}

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Save Goals
          </Button>
        </div>
      </div>
    </div>
  )
}