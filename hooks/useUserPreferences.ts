import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UserPreferences {
  diet: string
  allergies: string[]
  dislikedIngredients: string[]
  dislikedDishes: string[]
  healthGoals: string[]
  budget: number
}

export function useUserPreferences() {
  const { user, isAuthenticated } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPreferences = async () => {
      if (!isAuthenticated || !user) {
        setPreferences(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch('/api/user/preferences')
        if (response.ok) {
          const data = await response.json()
          setPreferences(data.preferences)
        } else {
          // Fallback to user context
          setPreferences(user.preferences)
        }
      } catch (error) {
        console.error('Error loading preferences:', error)
        // Fallback to user context
        setPreferences(user.preferences)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [isAuthenticated, user])

  const filterItems = (items: any[], type: 'dishes' | 'ingredients' | 'menus') => {
    if (!preferences) return items

    return items.filter(item => {
      // Filter by diet
      if (preferences.diet === 'vegetarian' && item.isVegetarian === false) {
        return false
      }
      if (preferences.diet === 'vegan' && (item.isVegetarian === false || item.containsDairy)) {
        return false
      }

      // Filter by allergies
      if (preferences.allergies.length > 0) {
        const hasAllergy = preferences.allergies.some(allergy => 
          item.ingredients?.some((ingredient: any) => 
            ingredient.toLowerCase().includes(allergy.toLowerCase())
          ) ||
          item.tags?.some((tag: any) => 
            tag.toLowerCase().includes(allergy.toLowerCase())
          )
        )
        if (hasAllergy) return false
      }

      // Filter by disliked ingredients
      if (preferences.dislikedIngredients.length > 0) {
        const hasDislikedIngredient = preferences.dislikedIngredients.some(disliked => 
          item.ingredients?.some((ingredient: any) => 
            ingredient.toLowerCase().includes(disliked.toLowerCase())
          ) ||
          item.tags?.some((tag: any) => 
            tag.toLowerCase().includes(disliked.toLowerCase())
          ) ||
          item.name?.toLowerCase().includes(disliked.toLowerCase())
        )
        if (hasDislikedIngredient) return false
      }

      // Filter by disliked dishes
      if (preferences.dislikedDishes.length > 0) {
        const hasDislikedDish = preferences.dislikedDishes.some(disliked => 
          item.name?.toLowerCase().includes(disliked.toLowerCase()) ||
          item.description?.toLowerCase().includes(disliked.toLowerCase())
        )
        if (hasDislikedDish) return false
      }

      return true
    })
  }

  const getFilterSummary = () => {
    if (!preferences) return null

    const filters = []
    
    if (preferences.diet !== 'omnivore') {
      filters.push(`Chế độ ăn: ${preferences.diet}`)
    }
    
    if (preferences.allergies.length > 0) {
      filters.push(`Dị ứng: ${preferences.allergies.join(', ')}`)
    }
    
    if (preferences.dislikedIngredients.length > 0) {
      filters.push(`Loại bỏ nguyên liệu: ${preferences.dislikedIngredients.length} mục`)
    }
    
    if (preferences.dislikedDishes.length > 0) {
      filters.push(`Loại bỏ món ăn: ${preferences.dislikedDishes.length} mục`)
    }

    return filters
  }

  return {
    preferences,
    loading,
    filterItems,
    getFilterSummary,
    isFiltering: preferences && (
      preferences.allergies.length > 0 ||
      preferences.dislikedIngredients.length > 0 ||
      preferences.dislikedDishes.length > 0
    )
  }
}
