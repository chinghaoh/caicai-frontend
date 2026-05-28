import { Flame } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function MacroCell({ label, value, unit, color }) {
  return (
    <div className="bg-bg-card rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className={`w-1 h-4 rounded-full ${color}`} />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-text-primary">{value.toLocaleString()}</span>
        <span className="text-sm text-text-muted">{unit}</span>
      </div>
    </div>
  )
}

function AdjustForm({ adjusted, onAdjustChange, onAccept, saving, error }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Adjust your goals.</h1>
        <p className="text-sm text-text-muted mt-2">
          Fine-tune the AI's suggestion to match your preferences.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Daily Calories (kcal)"
          type="number"
          value={adjusted.calories}
          onChange={e => onAdjustChange('calories', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Protein (g)"
            type="number"
            value={adjusted.protein}
            onChange={e => onAdjustChange('protein', e.target.value)}
          />
          <Input
            label="Carbs (g)"
            type="number"
            value={adjusted.carbs}
            onChange={e => onAdjustChange('carbs', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Fat (g)"
            type="number"
            value={adjusted.fat}
            onChange={e => onAdjustChange('fat', e.target.value)}
          />
          <Input
            label="Water (ml)"
            type="number"
            value={adjusted.waterMl}
            onChange={e => onAdjustChange('waterMl', e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red">{error}</p>}

      <Button onClick={onAccept} loading={saving} fullWidth>
        Save Goals
      </Button>
    </div>
  )
}

export default function StepSuggestion({
  suggestion,
  adjusting,
  adjusted,
  onAdjustChange,
  onAccept,
  onAdjust,
  saving,
  error,
}) {
  if (adjusting) {
    return (
      <AdjustForm
        adjusted={adjusted}
        onAdjustChange={onAdjustChange}
        onAccept={onAccept}
        saving={saving}
        error={error}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green bg-green-bg px-2.5 py-1 rounded-full uppercase tracking-widest">
          ✦ AI Suggestion
        </span>
        <h1 className="text-lg font-bold text-text-primary mt-3">Target Found</h1>
        <p className="text-sm text-text-muted mt-2 leading-relaxed">
          {suggestion.explanation}
        </p>
      </div>

      <div className="bg-bg-card rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted uppercase tracking-widest">Daily Calories</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-green">
              {suggestion.calories.toLocaleString()}
            </span>
            <span className="text-sm text-text-muted">kcal</span>
          </div>
        </div>
        <Flame size={36} className="text-green opacity-30" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MacroCell label="Protein" value={suggestion.protein}  unit="g" color="bg-blue"     />
        <MacroCell label="Carbs"   value={suggestion.carbs}    unit="g" color="bg-orange"   />
        <MacroCell label="Fat"     value={suggestion.fat}      unit="g" color="bg-yellow"   />
        <MacroCell
          label="Water"
          value={Math.round(suggestion.waterMl / 100) / 10}
          unit="L"
          color="bg-sky-400"
        />
      </div>

      {error && <p className="text-xs text-red">{error}</p>}

      <div className="flex flex-col gap-2">
        <Button onClick={onAccept} loading={saving} fullWidth>
          Looks good
        </Button>
        <Button variant="secondary" onClick={onAdjust} fullWidth>
          Adjust manually
        </Button>
      </div>
    </div>
  )
}