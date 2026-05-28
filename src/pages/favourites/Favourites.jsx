import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { apiClient }from '@/apiClient'
import PageHeader from '@/components/ui/PageHeader'
import FoodItemCard from '@/components/ui/FoodItemCard'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Favourites() {
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    fetchFavourites()
  }, [])

  async function fetchFavourites() {
    try {
      const data = await apiClient('/api/foods/favourites')
      setFavourites(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(foodId) {
    try {
      await apiClient(`/api/foods/${foodId}/favourite`, { method: 'DELETE' })
      setFavourites(prev => prev.filter(f => f.id !== foodId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <PageHeader title="Favourites" />

      {error && (
        <p className="text-xs text-red-400 mb-4">{error}</p>
      )}

      {favourites.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="No favourites yet"
          description="Foods you favourite will appear here for quick access."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {favourites.map(food => (
            <FoodItemCard
              key={food.id}
              food={food}
              onAction={() => handleRemove(food.id)}
              actionIcon={<Heart size={18} className="fill-green-400 text-green-400" />}
            />
          ))}
        </div>
      )}
    </div>
  )
}