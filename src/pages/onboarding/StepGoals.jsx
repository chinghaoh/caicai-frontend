import Input from '@/components/ui/Input'
import RadioCard from '@/components/ui/RadioCard'

const GOAL_TYPES = [
  { value: 'LOSE_WEIGHT', label: 'Lose Weight' },
  { value: 'MAINTAIN',    label: 'Maintain'    },
  { value: 'GAIN_MUSCLE', label: 'Gain Muscle' },
]

const ACTIVITY_LEVELS = [
  { value: 'SEDENTARY',   label: 'Sedentary',   description: 'Little or no exercise'      },
  { value: 'LIGHT',       label: 'Light',        description: '1–3 days/week'              },
  { value: 'MODERATE',    label: 'Moderate',     description: '3–5 days/week'              },
  { value: 'ACTIVE',      label: 'Active',        description: '6–7 days/week'             },
  { value: 'VERY_ACTIVE', label: 'Very Active',  description: 'Twice daily or physical job' },
]

export default function StepGoals({ data, onChange, errors }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-text-primary leading-snug">
          What's your goal?
        </h1>
        <p className="text-sm text-text-muted mt-2">
          We'll use this to personalise your daily targets.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">
          Goal Type
        </span>
        <div className="grid grid-cols-3 gap-2">
          {GOAL_TYPES.map(g => (
            <RadioCard
              key={g.value}
              label={g.label}
              selected={data.goalType === g.value}
              onClick={() => onChange('goalType', g.value)}
            />
          ))}
        </div>
        {errors.goalType && (
          <p className="text-xs text-red mt-1">{errors.goalType}</p>
        )}
      </div>

      <Input
        label="Target Weight (kg)"
        type="number"
        placeholder="70.0"
        value={data.targetWeightKg}
        onChange={e => onChange('targetWeightKg', e.target.value)}
        error={errors.targetWeightKg}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">
          Activity Level
        </span>
        <div className="flex flex-col gap-2">
          {ACTIVITY_LEVELS.map(a => (
            <RadioCard
              key={a.value}
              label={a.label}
              description={a.description}
              selected={data.activityLevel === a.value}
              onClick={() => onChange('activityLevel', a.value)}
            />
          ))}
        </div>
        {errors.activityLevel && (
          <p className="text-xs text-red mt-1">{errors.activityLevel}</p>
        )}
      </div>
    </div>
  )
}