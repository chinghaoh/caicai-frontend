import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'
import StepGoals from '@/pages/onboarding/StepGoals'
import StepSuggestion from '@/pages/onboarding/StepSuggestion'
import AiSuccessStep from './AiSuccessStep'

// step: 'goals' | 'suggestion' | 'success'

function ProgressBar({ current, total }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i < current ? 'bg-green' : 'bg-border'
          }`}
        />
      ))}
    </div>
  )
}

export default function AiPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep]             = useState('goals')
  const [loading, setLoading]       = useState(false)
  const [saving, setSaving]         = useState(false)
  const [errors, setErrors]         = useState({})
  const [saveError, setSaveError]   = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const [adjusting, setAdjusting]   = useState(false)
  const [adjusted, setAdjusted]     = useState(null)

  const [formData, setFormData] = useState({
    goalType:       '',
    targetWeightKg: user?.weightKg ?? '',
    activityLevel:  user?.activityLevel ?? '',
  })

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function handleAdjustChange(field, value) {
    setAdjusted(prev => ({ ...prev, [field]: value }))
  }

  function validate() {
    const errs = {}
    if (!formData.goalType)
      errs.goalType = 'Please select a goal type'
    if (!formData.targetWeightKg || isNaN(formData.targetWeightKg) || +formData.targetWeightKg < 20 || +formData.targetWeightKg > 300)
      errs.targetWeightKg = 'Enter a valid target weight'
    if (!formData.activityLevel)
      errs.activityLevel = 'Please select an activity level'
    return errs
  }

  async function fetchSuggestion() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setErrors({})
    try {
      const data = await apiClient('/api/goals/suggest', {
        method: 'POST',
        body: {
          age:            user.age,
          weightKg:       parseFloat(user.weightKg),
          heightCm:       parseInt(user.heightCm),
          gender:         user.gender,
          activityLevel:  formData.activityLevel,
          goalType:       formData.goalType,
          targetWeightKg: parseFloat(formData.targetWeightKg),
        },
      })
      setSuggestion(data)
      setAdjusted(data)
      setAdjusting(false)
      setStep('suggestion')
    } catch {
      setSuggestion(null)
      setAdjusted({ calories: '', protein: '', carbs: '', fat: '', waterMl: '' })
      setAdjusting(true)
      setStep('suggestion')
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
          calories:         parseInt(goals.calories),
          protein:          parseInt(goals.protein),
          carbs:            parseInt(goals.carbs),
          fat:              parseInt(goals.fat),
          waterMl:          parseInt(goals.waterMl),
          startingWeightKg: parseFloat(user.weightKg),
          targetWeightKg:   parseFloat(formData.targetWeightKg),
        },
      })
      setStep('success')
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleSuggestAgain() {
    setStep('goals')
    setSuggestion(null)
    setAdjusted(null)
    setAdjusting(false)
    setFormData({
      goalType:       '',
      targetWeightKg: user?.weightKg ?? '',
      activityLevel:  user?.activityLevel ?? '',
    })
  }

  return (
    <div className="px-4 py-6 flex justify-center">
      <div className="w-full max-w-xl">

        {step !== 'success' && (
          <ProgressBar current={step === 'goals' ? 1 : 2} total={2} />
        )}

        <div className="bg-bg-card rounded-xl p-6">
          {step === 'goals' && (
            <>
              <StepGoals data={formData} onChange={handleChange} errors={errors} />
              <div className="mt-6">
                <Button fullWidth loading={loading} onClick={fetchSuggestion}>
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 'suggestion' && (
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

          {step === 'success' && (
            <AiSuccessStep
              onDashboard={() => navigate('/dashboard')}
              onSuggestAgain={handleSuggestAgain}
            />
          )}
        </div>

      </div>
    </div>
  )
}