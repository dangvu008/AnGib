"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  ChefHat, 
  Utensils, 
  Flame, 
  Leaf,
  CheckCircle2,
  ArrowRight,
  Plus,
  Edit3
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface MealPlan {
  id: string
  day: string
  breakfast: {
    name: string
    calories: number
    prepTime: number
    isVegetarian: boolean
  } | null
  lunch: {
    name: string
    calories: number
    prepTime: number
    isVegetarian: boolean
  } | null
  dinner: {
    name: string
    calories: number
    prepTime: number
    isVegetarian: boolean
  } | null
}

interface WeeklyPlan {
  id: string
  weekStart: string
  weekEnd: string
  totalMeals: number
  completedMeals: number
  totalCalories: number
  averageCalories: number
  days: MealPlan[]
}

export function WeeklyPlanCard() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWeeklyPlan()
  }, [])

  const loadWeeklyPlan = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/weekly-plan')
      if (response.ok) {
        const data = await response.json()
        setWeeklyPlan(data.plan)
        // Also save to localStorage for offline access
        localStorage.setItem('angi-weekly-plan', JSON.stringify(data.plan))
      } else {
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('angi-weekly-plan')
        if (saved) {
          const plan = JSON.parse(saved)
          setWeeklyPlan(plan)
        } else {
          // Generate default plan as last resort
          const defaultPlan = generateDefaultWeeklyPlan()
          setWeeklyPlan(defaultPlan)
          localStorage.setItem('angi-weekly-plan', JSON.stringify(defaultPlan))
        }
      }
    } catch (error) {
      console.error('Error loading weekly plan:', error)
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('angi-weekly-plan')
        if (saved) {
          const plan = JSON.parse(saved)
          setWeeklyPlan(plan)
        } else {
          const defaultPlan = generateDefaultWeeklyPlan()
          setWeeklyPlan(defaultPlan)
          localStorage.setItem('angi-weekly-plan', JSON.stringify(defaultPlan))
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError)
      }
    } finally {
      setLoading(false)
    }
  }

  const generateDefaultWeeklyPlan = (): WeeklyPlan => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1) // Thứ 2
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // Chủ nhật

    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    
    const sampleMeals = [
      { name: "Bánh mì chay", calories: 320, prepTime: 10, isVegetarian: true },
      { name: "Phở chay", calories: 450, prepTime: 20, isVegetarian: true },
      { name: "Cơm chay", calories: 380, prepTime: 15, isVegetarian: true },
      { name: "Bún chay", calories: 420, prepTime: 25, isVegetarian: true },
      { name: "Canh chua chay", calories: 180, prepTime: 30, isVegetarian: true },
      { name: "Đậu hũ sốt cà chua", calories: 250, prepTime: 20, isVegetarian: true },
      { name: "Rau muống xào tỏi", calories: 120, prepTime: 10, isVegetarian: true }
    ]

    const weeklyDays: MealPlan[] = days.map((day, index) => {
      const dayMeals = sampleMeals.slice(index, index + 3)
      return {
        id: `day-${index + 1}`,
        day,
        breakfast: dayMeals[0] || null,
        lunch: dayMeals[1] || null,
        dinner: dayMeals[2] || null
      }
    })

    const totalMeals = weeklyDays.reduce((total, day) => {
      return total + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0)
    }, 0)

    const completedMeals = Math.floor(totalMeals * 0.3) // 30% hoàn thành

    const totalCalories = weeklyDays.reduce((total, day) => {
      return total + 
        (day.breakfast?.calories || 0) + 
        (day.lunch?.calories || 0) + 
        (day.dinner?.calories || 0)
    }, 0)

    return {
      id: 'current-week',
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      totalMeals,
      completedMeals,
      totalCalories,
      averageCalories: Math.round(totalCalories / 7),
      days: weeklyDays
    }
  }

  const getProgressPercentage = () => {
    if (!weeklyPlan) return 0
    return Math.round((weeklyPlan.completedMeals / weeklyPlan.totalMeals) * 100)
  }

  const getTodayMeals = () => {
    if (!weeklyPlan) return null
    const today = new Date()
    const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1 // Chủ nhật = 6
    return weeklyPlan.days[dayIndex] || null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Kế hoạch tuần</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weeklyPlan) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Kế hoạch tuần</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có kế hoạch tuần</h3>
            <p className="text-muted-foreground mb-4">
              Tạo kế hoạch nấu ăn cho tuần này để có bữa ăn đa dạng và cân bằng
            </p>
            <Link href="/weekly-plan">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tạo kế hoạch mới
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const todayMeals = getTodayMeals()
  const progressPercentage = getProgressPercentage()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Kế hoạch tuần</CardTitle>
          </div>
          <Link href="/weekly-plan">
            <Button variant="ghost" size="sm" className="gap-1">
              <Edit3 className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDate(weeklyPlan.weekStart)} - {formatDate(weeklyPlan.weekEnd)}</span>
          <Badge variant="secondary" className="gap-1">
            <Flame className="h-3 w-3" />
            {weeklyPlan.averageCalories} calo/ngày
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Tiến độ tuần</span>
            <span className="font-medium">{weeklyPlan.completedMeals}/{weeklyPlan.totalMeals} bữa</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3" />
            <span>{progressPercentage}% hoàn thành</span>
          </div>
        </div>

        {/* Today's Meals */}
        {todayMeals && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hôm nay - {todayMeals.day}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {todayMeals.breakfast && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{todayMeals.breakfast.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {todayMeals.breakfast.calories} calo
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {todayMeals.breakfast.prepTime} phút
                      </span>
                      {todayMeals.breakfast.isVegetarian && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          <Leaf className="h-2.5 w-2.5 mr-0.5" />
                          Chay
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {todayMeals.lunch && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{todayMeals.lunch.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {todayMeals.lunch.calories} calo
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {todayMeals.lunch.prepTime} phút
                      </span>
                      {todayMeals.lunch.isVegetarian && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          <Leaf className="h-2.5 w-2.5 mr-0.5" />
                          Chay
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {todayMeals.dinner && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{todayMeals.dinner.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {todayMeals.dinner.calories} calo
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {todayMeals.dinner.prepTime} phút
                      </span>
                      {todayMeals.dinner.isVegetarian && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          <Leaf className="h-2.5 w-2.5 mr-0.5" />
                          Chay
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Link href="/weekly-plan" className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Utensils className="h-4 w-4" />
              Xem chi tiết
            </Button>
          </Link>
          <Link href="/weekly-plan?action=create" className="flex-1">
            <Button size="sm" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Tạo mới
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}