import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
        }
      }
      dishes: {
        Row: {
          id: string
          name: string
          name_vi: string
          description: string | null
          category_id: string | null
          meal_type: string | null
          cuisine_type: string | null
          difficulty_level: string | null
          prep_time_minutes: number | null
          cook_time_minutes: number | null
          total_time_minutes: number | null
          servings: number
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
          estimated_cost: number | null
          is_vegetarian: boolean
          is_vegan: boolean
          is_gluten_free: boolean
          is_dairy_free: boolean
          image_url: string | null
          video_url: string | null
          instructions: any | null
          tips: string | null
          popularity_score: number
          rating_avg: number
          rating_count: number
          created_at: string
          updated_at: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          total_days: number | null
          status: string
          target_calories: number | null
          target_budget: number | null
          created_at: string
          updated_at: string
        }
      }
      // Add other tables as needed
    }
    Functions: {
      search_dishes_by_preferences: {
        Args: {
          p_user_id: string
          p_meal_type?: string
          p_limit?: number
        }
        Returns: any[]
      }
      get_meal_plan_for_week: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: any[]
      }
      get_daily_nutrition: {
        Args: {
          p_user_id: string
          p_date: string
        }
        Returns: {
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
        }[]
      }
    }
  }
}

// Typed client
export const supabaseTyped = createClient<Database>(supabaseUrl, supabaseAnonKey)

