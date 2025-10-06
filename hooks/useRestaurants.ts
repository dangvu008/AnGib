import { useState, useEffect } from 'react'

interface Restaurant {
  id: string
  name: string
  description?: string
  cuisineType: string
  address: string
  latitude?: number
  longitude?: number
  phone?: string
  priceRange?: string
  priceMin?: number
  priceMax?: number
  ratingAvg: number
  isVegetarian: boolean
  isVegan: boolean
  openingHours?: string
  imageUrl?: string
  restaurantDishes: {
    id: string
    name: string
    description?: string
    price: number
    isAvailable: boolean
    dish: {
      id: string
      name: string
      nameVi: string
      imageUrl?: string
    }
  }[]
}

interface UseRestaurantsReturn {
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useRestaurants(filters?: {
  cuisineType?: string
  isVegetarian?: boolean
  priceRange?: string
  limit?: number
}): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filters?.cuisineType) params.append('cuisineType', filters.cuisineType)
      if (filters?.isVegetarian) params.append('isVegetarian', 'true')
      if (filters?.priceRange) params.append('priceRange', filters.priceRange)
      if (filters?.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/restaurants?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      
      const data = await response.json()
      setRestaurants(data.restaurants || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [filters?.cuisineType, filters?.isVegetarian, filters?.priceRange, filters?.limit])

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants
  }
}
