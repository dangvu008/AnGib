// Auto-generated types for Supabase database
// Run: supabase gen types typescript --local > lib/supabase-types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          dietary_type: string | null
          allergies: string[] | null
          disliked_ingredients: string[] | null
          health_goals: string[] | null
          daily_calorie_target: number
          daily_protein_target: number
          daily_carbs_target: number
          daily_fat_target: number
          weekly_budget: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dietary_type?: string | null
          allergies?: string[] | null
          disliked_ingredients?: string[] | null
          health_goals?: string[] | null
          daily_calorie_target?: number
          daily_protein_target?: number
          daily_carbs_target?: number
          daily_fat_target?: number
          weekly_budget?: number | null
        }
        Update: {
          dietary_type?: string | null
          allergies?: string[] | null
          disliked_ingredients?: string[] | null
          health_goals?: string[] | null
          daily_calorie_target?: number
          daily_protein_target?: number
          daily_carbs_target?: number
          daily_fat_target?: number
          weekly_budget?: number | null
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
          fiber: number | null
          estimated_cost: number | null
          is_vegetarian: boolean
          is_vegan: boolean
          is_gluten_free: boolean
          is_dairy_free: boolean
          image_url: string | null
          video_url: string | null
          instructions: Json | null
          tips: string | null
          popularity_score: number
          rating_avg: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_vi: string
          description?: string | null
          category_id?: string | null
          meal_type?: string | null
          cuisine_type?: string | null
          difficulty_level?: string | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          total_time_minutes?: number | null
          servings?: number
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          fiber?: number | null
          estimated_cost?: number | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          is_dairy_free?: boolean
          image_url?: string | null
          video_url?: string | null
          instructions?: Json | null
          tips?: string | null
          popularity_score?: number
          rating_avg?: number
          rating_count?: number
        }
        Update: Partial<Database['public']['Tables']['dishes']['Insert']>
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
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          total_days?: number | null
          status?: string
          target_calories?: number | null
          target_budget?: number | null
        }
        Update: Partial<Database['public']['Tables']['meal_plans']['Insert']>
      }
      meal_plan_items: {
        Row: {
          id: string
          meal_plan_id: string
          dish_id: string
          meal_date: string
          meal_time: string
          servings: number
          notes: string | null
          is_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          dish_id: string
          meal_date: string
          meal_time: string
          servings?: number
          notes?: string | null
          is_completed?: boolean
          completed_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['meal_plan_items']['Insert']>
      }
      shopping_lists: {
        Row: {
          id: string
          user_id: string
          meal_plan_id: string | null
          name: string
          shopping_date: string | null
          estimated_total: number | null
          actual_total: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_plan_id?: string | null
          name: string
          shopping_date?: string | null
          estimated_total?: number | null
          actual_total?: number | null
          status?: string
        }
        Update: Partial<Database['public']['Tables']['shopping_lists']['Insert']>
      }
      nutrition_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          meal_time: string | null
          dish_id: string | null
          meal_plan_item_id: string | null
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          log_date: string
          meal_time?: string | null
          dish_id?: string | null
          meal_plan_item_id?: string | null
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['nutrition_logs']['Insert']>
      }
    }
    Views: {
      popular_dishes_this_week: {
        Row: {
          id: string
          name_vi: string
          image_url: string | null
          calories: number | null
          rating_avg: number
          times_planned: number
        }
      }
    }
    Functions: {
      search_dishes_by_preferences: {
        Args: {
          p_user_id: string
          p_meal_type?: string
          p_limit?: number
        }
        Returns: Database['public']['Tables']['dishes']['Row'][]
      }
      get_meal_plan_for_week: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          meal_date: string
          meal_time: string
          dish_name: string
          dish_id: string
          calories: number
          is_completed: boolean
        }[]
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
      get_weekly_expense: {
        Args: {
          p_user_id: string
          p_start_date: string
        }
        Returns: number
      }
      search_dishes: {
        Args: {
          search_query: string
        }
        Returns: Database['public']['Tables']['dishes']['Row'][]
      }
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]


