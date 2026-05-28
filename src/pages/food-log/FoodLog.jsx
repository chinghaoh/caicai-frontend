import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { apiClient } from '@/apiClient'
import FoodLogView from './FoodLogView'

export default function FoodLog() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient(`/api/food-logs?date=${date}`)
      setEntries(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const handleAdd = async (foodItemId, amountGrams, mealType) => {
    try {
      await apiClient('/api/food-logs', {
        method: 'POST',
        body: { foodItemId, amountGrams, mealType, date },
      })
      await fetchEntries()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiClient(`/api/food-logs/${id}`, { method: 'DELETE' })
      await fetchEntries()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <FoodLogView
      date={date}
      onDateChange={setDate}
      entries={entries}
      loading={loading}
      error={error}
      onAdd={handleAdd}
      onDelete={handleDelete}
    />
  )
}