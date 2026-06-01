import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { apiClient } from '@/apiClient'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'
import StepBasics from './StepBasics'
import StepGoals from './StepGoals'
import StepSuggestion from './StepSuggestion'

const TOTAL_STEPS = 3

function ProgressBar({ current, total }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < current ? 'bg-green' : 'bg-border'
            }`}
        />
      ))}
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAuth()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [adjusting, setAdjusting] = useState(false)
  const [suggestion, setSuggestion] = useState(null)
  const [adjusted, setAdjusted] = useState(null)

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    heightCm: '',
    weightKg: '',
    goalType: '',
    targetWeightKg: '',
    activityLevel: '',
  })

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function handleAdjustChange(field, value) {
    setAdjusted(prev => ({ ...prev, [field]: value }))
  }

  function validateStep1() {
    const errs = {}
    if (!formData.gender)
      errs.gender = 'Please select a gender'
    if (!formData.age || isNaN(formData.age) || +formData.age < 10 || +formData.age > 120)
      errs.age = 'Enter a valid age (10–120)'
    if (!formData.heightCm || isNaN(formData.heightCm) || +formData.heightCm < 50 || +formData.heightCm > 220)
      errs.heightCm = 'Enter a valid height (220 cm)'
    if (!formData.weightKg || isNaN(formData.weightKg) || +formData.weightKg < 20 || +formData.weightKg > 300)
      errs.weightKg = 'Enter a valid weight (300 kg)'
    return errs
  }

  function validateStep2() {
    const errs = {}
    if (!formData.goalType)
      errs.goalType = 'Please select a goal type'
    if (!formData.targetWeightKg || isNaN(formData.targetWeightKg) || +formData.targetWeightKg < 20)
      errs.targetWeightKg = 'Enter a valid target weight'
    if (!formData.activityLevel)
      errs.activityLevel = 'Please select an activity level'
    return errs
  }

  async function handleNext() {
    if (step === 1) {
      const errs = validateStep1()
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
      setStep(2)
    } else if (step === 2) {
      const errs = validateStep2()
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
      await fetchSuggestion()
    }
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1)
  }

  async function handleSkip() {
    try {
      await apiClient('/api/users/me/complete-onboarding', { method: 'POST' })
    } catch {
      // best effort — navigate regardless
    }
    navigate('/dashboard')
  }

  async function fetchSuggestion() {
    setLoading(true)
    setErrors({})
    try {
      const data = await apiClient('/api/goals/suggest', {
        method: 'POST',
        body: {
          age: parseInt(formData.age),
          weightKg: parseFloat(formData.weightKg),
          heightCm: parseInt(formData.heightCm),
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          goalType: formData.goalType,
          targetWeightKg: parseFloat(formData.targetWeightKg),
        },
      })
      console.log('fetchSuggestion data:', data)
      setSuggestion(data)
      setAdjusted(data)
      setStep(3)
    } catch {
      setSuggestion(null)
      setAdjusted({ calories: '', protein: '', carbs: '', fat: '', waterMl: '' })
      setAdjusting(true)
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept() {
    setSaving(true)
    setSaveError('')
    const goals = adjusting ? adjusted : suggestion
    try {
      await apiClient('/api/goals', {
        method: 'POST',
        body: {
          calories: parseInt(goals.calories),
          protein: parseInt(goals.protein),
          carbs: parseInt(goals.carbs),
          fat: parseInt(goals.fat),
          waterMl: parseInt(goals.waterMl),
          startingWeightKg: parseFloat(formData.weightKg),
          targetWeightKg: parseFloat(formData.targetWeightKg),
        },
      })
      completeOnboarding()
      navigate('/dashboard')
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center px-4 py-10"
    style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 0%, #052e16 0%, #0f0f0f 60%)' }}
    >

      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-4">
        <button
          onClick={step > 1 ? handleBack : undefined}
          className={`flex items-center gap-1 text-base font-semibold text-green cursor-pointer ${step === 1 ? 'invisible' : ''
            }`}
        >
          <ChevronLeft size={18} />
          Caicai
        </button>
        {step < 3 && (
          <button
            onClick={handleSkip}
            className="text-base text-text-muted cursor-pointer hover:text-text-secondary"
          >
            Skip
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-3xl mb-6">
        <ProgressBar current={step} total={TOTAL_STEPS} />
      </div>

      {/* Card */}
      <div className="w-full max-w-3xl bg-bg-card rounded-xl p-6 flex flex-col gap-6">

        {/* Step content */}
        {step === 1 && (
          <StepBasics data={formData} onChange={handleChange} errors={errors} />
        )}
        {step === 2 && (
          <StepGoals data={formData} onChange={handleChange} errors={errors} />
        )}
        {step === 3 && (suggestion || adjusting) && (
          <StepSuggestion
            suggestion={suggestion}
            adjusting={adjusting}
            adjusted={adjusted}
            onAdjustChange={handleAdjustChange}
            onAccept={handleAccept}
            onAdjust={() => setAdjusting(true)}
            saving={saving}
            error={saveError}
          />
        )}

        {/* Continue button — steps 1 and 2 only */}
        {step < 3 && (
          <Button onClick={handleNext} loading={loading} fullWidth>
            Continue
          </Button>
        )}

      </div>
    </div>
  )
}