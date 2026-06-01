import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import CalorieRing from '@/components/ui/CalorieRing'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import MacroCard from './MacroCard'
import WeightSection from './WeightSection'

export default function Dashboard() {
    const navigate = useNavigate()
    const today = format(new Date(), 'yyyy-MM-dd')

    const [summary, setSummary] = useState(null)
    const [weightEntries, setWeightEntries] = useState([])
    const [loadingSummary, setLoadingSummary] = useState(true)
    const [loadingWeight, setLoadingWeight] = useState(true)
    const [error, setError] = useState(null)

    const fetchSummary = useCallback(async () => {
        try {
            const res = await apiClient(`/api/dashboard/summary?date=${today}`)
            setSummary(res.data ?? res)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoadingSummary(false)
        }
    }, [today])

    const fetchWeight = useCallback(async () => {
        try {
            const res = await apiClient('/api/weight')
            setWeightEntries(Array.isArray(res) ? res : [])
        } catch {
            // non-fatal
        } finally {
            setLoadingWeight(false)
        }
    }, [])

    useEffect(() => {
        fetchSummary()
        fetchWeight()
    }, [fetchSummary, fetchWeight])

    if (loadingSummary) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="px-4 py-6 text-center">
                <p className="text-sm text-red">{error}</p>
            </div>
        )
    }

    const totals = summary?.totals ?? {}
    const goal = summary?.goal ?? {}
    const weight = summary?.weight ?? {}

    const MACRO_CARDS = [
        { label: 'Protein', consumed: totals.protein ?? 0, goal: goal.protein ?? 0, color: 'var(--color-purple)' },
        { label: 'Carbs', consumed: totals.carbs ?? 0, goal: goal.carbs ?? 0, color: 'var(--color-orange)' },
        { label: 'Fat', consumed: totals.fat ?? 0, goal: goal.fat ?? 0, color: 'var(--color-yellow)' },
        { label: 'Water', consumed: totals.waterMl ?? 0, goal: goal.waterMl ?? 0, color: 'var(--color-blue)' },
    ]

    return (
        <div className="px-4 py-6">
            <PageHeader
                title={format(new Date(), 'EEEE, MMM d')}
                action={
                    <Button variant="secondary" onClick={() => navigate('/settings?tab=goals')}>
                        <Pencil size={14} className="mr-1.5" />
                        Update Goals
                    </Button>
                }
            />

            {/* calorie ring + macro grid */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="bg-bg-card rounded-xl p-6 flex flex-col items-center justify-center md:w-64 flex-shrink-0">
                    <CalorieRing
                        value={Math.round(totals.calories ?? 0)}
                        goal={Math.round(goal.calories ?? 0)}
                        size={180}
                        strokeWidth={12}
                        showGoal
                    />
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                    {MACRO_CARDS.map(m => (
                        <MacroCard key={m.label} {...m} />
                    ))}
                </div>
            </div>

            {/* weight section */}
            {!loadingWeight && (
                <WeightSection
                    entries={weightEntries}
                    goalWeight={weight.target ?? null}
                    onRefresh={fetchWeight}
                />
            )}
        </div>
    )
}