import Input from '@/components/ui/Input'
import RadioCard from '@/components/ui/RadioCard'

const GENDERS = ['Male', 'Female']

export default function StepBasics({ data, onChange, errors }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-text-primary leading-snug">
          Let's start with<br />the basics.
        </h1>
        <p className="text-sm text-text-muted mt-2">
          Your physical stats help us calculate your basal metabolic rate with clinical precision.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">
          Gender
        </span>
        <div className="grid grid-cols-2 gap-2">
          {GENDERS.map(g => (
            <RadioCard
              key={g}
              label={g}
              selected={data.gender === g}
              onClick={() => onChange('gender', g)}
            />
          ))}
        </div>
        {errors.gender && (
          <p className="text-xs text-red mt-1">{errors.gender}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Age"
          type="number"
          placeholder="25"
          value={data.age}
          onChange={e => onChange('age', e.target.value)}
          error={errors.age}
        />
        <Input
          label="Height (cm)"
          type="number"
          placeholder="175"
          value={data.heightCm}
          onChange={e => onChange('heightCm', e.target.value)}
          error={errors.heightCm}
        />
      </div>

      <Input
        label="Current Weight (kg)"
        type="number"
        placeholder="75.5"
        value={data.weightKg}
        onChange={e => onChange('weightKg', e.target.value)}
        error={errors.weightKg}
      />
    </div>
  )
}