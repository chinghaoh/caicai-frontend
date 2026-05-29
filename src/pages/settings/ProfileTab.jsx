import { useState, useEffect } from 'react'
import { apiClient } from '@/apiClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const GENDER_OPTIONS = ['MALE', 'FEMALE']
const ACTIVITY_OPTIONS = [
  { value: 'SEDENTARY',   label: 'Sedentary',    desc: 'Little or no exercise' },
  { value: 'LIGHT',       label: 'Light',         desc: '1–3 days/week' },
  { value: 'MODERATE',    label: 'Moderate',      desc: '3–5 days/week' },
  { value: 'ACTIVE',      label: 'Active',        desc: '6–7 days/week' },
  { value: 'VERY_ACTIVE', label: 'Very Active',   desc: 'Twice daily or physical job' },
]

export default function ProfileTab({ user }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    weightKg: '',
    heightCm: '',
    gender: 'MALE',
    activityLevel: 'MODERATE',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name:          user.name          ?? '',
        age:           user.age           ?? '',
        weightKg:      user.weightKg      ?? '',
        heightCm:      user.heightCm      ?? '',
        gender:        user.gender        ?? 'MALE',
        activityLevel: user.activityLevel ?? 'MODERATE',
      })
    }
  }, [user])

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
      await apiClient('/api/users/me', {
        method: 'PUT',
        body: {
          name:          form.name,
          age:           parseInt(form.age),
          weightKg:      parseFloat(form.weightKg),
          heightCm:      parseFloat(form.heightCm),
          gender:        form.gender,
          activityLevel: form.activityLevel,
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

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-text-primary">Personal Information</h2>

      <div className="bg-bg-card rounded-xl p-5 flex flex-col gap-4">
        {/* name + email row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Your name"
            error={fieldErrors.name}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Email Address</label>
            <div className="bg-bg-input border border-border rounded-lg px-3 py-2 text-base text-text-muted cursor-not-allowed">
              {user?.email ?? '—'}
            </div>
            <span className="text-xs text-text-muted">Email cannot be changed here</span>
          </div>
        </div>

        {/* age + height row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            value={form.age}
            onChange={e => set('age', e.target.value)}
            placeholder="25"
            error={fieldErrors.age}
          />
          <Input
            label="Height (cm)"
            type="number"
            value={form.heightCm}
            onChange={e => set('heightCm', e.target.value)}
            placeholder="175"
            error={fieldErrors.heightCm}
          />
        </div>

        {/* weight + gender row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            value={form.weightKg}
            onChange={e => set('weightKg', e.target.value)}
            placeholder="70.0"
            error={fieldErrors.weightKg}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Gender</label>
            <select
              value={form.gender}
              onChange={e => set('gender', e.target.value)}
              className="bg-bg-input border border-border rounded-lg px-3 py-2 text-base text-text-primary focus:outline-none focus:border-green cursor-pointer"
            >
              {GENDER_OPTIONS.map(g => (
                <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>
              ))}
            </select>
            {fieldErrors.gender && <span className="text-xs text-red">{fieldErrors.gender}</span>}
          </div>
        </div>

        {/* activity level */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary">Activity Level</label>
          <select
            value={form.activityLevel}
            onChange={e => set('activityLevel', e.target.value)}
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-base text-text-primary focus:outline-none focus:border-green cursor-pointer"
          >
            {ACTIVITY_OPTIONS.map(a => (
              <option key={a.value} value={a.value}>{a.label} — {a.desc}</option>
            ))}
          </select>
          {fieldErrors.activityLevel && <span className="text-xs text-red">{fieldErrors.activityLevel}</span>}
        </div>

        {error && <p className="text-xs text-red">{error}</p>}
        {success && <p className="text-xs text-green">Profile saved successfully.</p>}

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  )
}