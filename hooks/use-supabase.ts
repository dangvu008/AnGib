import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Hook để lấy thông tin user hiện tại
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

/**
 * Hook để lấy user preferences
 */
export function useUserPreferences(userId: string | undefined) {
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (error) throw error
        setPreferences(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [userId])

  return { preferences, loading, error }
}

/**
 * Hook để lấy danh sách món ăn
 */
export function useDishes(filters?: {
  mealType?: string
  isVegetarian?: boolean
  limit?: number
}) {
  const [dishes, setDishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        let query = supabase
          .from('dishes')
          .select('*')
          .order('popularity_score', { ascending: false })

        if (filters?.mealType) {
          query = query.eq('meal_type', filters.mealType)
        }

        if (filters?.isVegetarian !== undefined) {
          query = query.eq('is_vegetarian', filters.isVegetarian)
        }

        if (filters?.limit) {
          query = query.limit(filters.limit)
        }

        const { data, error } = await query

        if (error) throw error
        setDishes(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchDishes()
  }, [filters?.mealType, filters?.isVegetarian, filters?.limit])

  return { dishes, loading, error }
}

/**
 * Hook để lấy meal plans của user
 */
export function useMealPlans(userId: string | undefined) {
  const [mealPlans, setMealPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchMealPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('meal_plans')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setMealPlans(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchMealPlans()
  }, [userId])

  return { mealPlans, loading, error, refetch: async () => {
    // Refetch function
    setLoading(true)
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId!)
      .order('created_at', { ascending: false })
    
    if (!error) setMealPlans(data || [])
    setLoading(false)
  }}
}

/**
 * Hook để lấy nutrition logs của user
 */
export function useDailyNutrition(userId: string | undefined, date: string) {
  const [nutrition, setNutrition] = useState<{
    total_calories: number
    total_protein: number
    total_carbs: number
    total_fat: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchNutrition = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_daily_nutrition', {
            p_user_id: userId,
            p_date: date
          })

        if (error) throw error
        setNutrition(data?.[0] || null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchNutrition()
  }, [userId, date])

  return { nutrition, loading, error }
}

/**
 * Hook để subscribe realtime changes
 */
export function useRealtimeMealPlanItems(mealPlanId: string | undefined) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mealPlanId) {
      setLoading(false)
      return
    }

    // Fetch initial data
    const fetchItems = async () => {
      const { data } = await supabase
        .from('meal_plan_items')
        .select('*, dishes(*)')
        .eq('meal_plan_id', mealPlanId)
        .order('meal_date', { ascending: true })

      setItems(data || [])
      setLoading(false)
    }

    fetchItems()

    // Subscribe to changes
    const channel = supabase
      .channel(`meal-plan-items-${mealPlanId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_plan_items',
          filter: `meal_plan_id=eq.${mealPlanId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((item) => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mealPlanId])

  return { items, loading }
}

