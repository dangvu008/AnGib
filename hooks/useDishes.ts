import { useState, useEffect } from 'react'

interface Dish {
  id: string
  name: string
  nameVi: string
  category: {
    id: string
    name: string
    nameVi: string
  }
  mealType: string
  difficultyLevel: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  calories: number
  protein: number
  carbs: number
  fat: number
  isVegetarian: boolean
  isVegan: boolean
  imageUrl?: string
  ratingAvg: number
  dishTags: {
    tag: {
      id: string
      name: string
      nameVi: string
    }
  }[]
}

interface UseDishesReturn {
  dishes: Dish[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDishes(filters?: {
  category?: string
  mealType?: string
  difficulty?: string
  isVegetarian?: boolean
  limit?: number
}): UseDishesReturn {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDishes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.mealType) params.append('mealType', filters.mealType)
      if (filters?.difficulty) params.append('difficulty', filters.difficulty)
      if (filters?.isVegetarian) params.append('isVegetarian', 'true')
      if (filters?.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/dishes?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch dishes')
      }
      
      const data = await response.json()
      setDishes(data.dishes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDishes()
  }, [filters?.category, filters?.mealType, filters?.difficulty, filters?.isVegetarian, filters?.limit])

  return {
    dishes,
    loading,
    error,
    refetch: fetchDishes
  }
}
