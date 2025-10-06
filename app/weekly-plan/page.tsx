"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  ChefHat, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2,
  ArrowLeft,
  Settings,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ShareButton } from "@/components/ShareButton"
import { AppHeader } from "@/components/AppHeader"
import { AddToShoppingDialog } from "@/components/AddToShoppingDialog"
import { useState } from "react"

interface MealPlan {
  id: string
  date: string
  meals: {
    breakfast?: string
    lunch?: string
    dinner?: string
  }
  notes?: string
}

interface WeeklyPlanData {
  totalMeals: number
  plannedMeals: number
  thisWeek: MealPlan[]
}

export default function WeeklyPlanPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [planData, setPlanData] = useState<WeeklyPlanData>({
    totalMeals: 21,
    plannedMeals: 0,
    thisWeek: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editingMeal, setEditingMeal] = useState<string | null>(null)
  const [newMeal, setNewMeal] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    notes: ""
  })

  useEffect(() => {
    loadWeeklyPlan()
  }, [])

  const loadWeeklyPlan = () => {
    try {
      const savedPlan = localStorage.getItem("angi-weekly-plan")
      if (savedPlan) {
        const plan = JSON.parse(savedPlan)
        // Ensure all days have proper id
        if (plan.thisWeek && Array.isArray(plan.thisWeek)) {
          plan.thisWeek = plan.thisWeek.map((day: any, index: number) => ({
            ...day,
            id: day.id || `day-${index}`
          }))
        }
        setPlanData(plan)
      } else {
        generateDefaultWeeklyPlan()
      }
    } catch (error) {
      console.error("Error loading weekly plan:", error)
      generateDefaultWeeklyPlan()
    } finally {
      setIsLoading(false)
    }
  }

  const generateDefaultWeeklyPlan = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const thisWeek: MealPlan[] = []
    let plannedCount = 0

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      
      const meals = {
        breakfast: i < 6 ? "Cháo yến mạch + trái cây" : undefined,
        lunch: i < 5 ? "Cơm chay + canh chua" : undefined,
        dinner: i < 7 ? "Salad + bánh mì" : undefined
      }

      Object.values(meals).forEach(meal => {
        if (meal) plannedCount++
      })

      thisWeek.push({
        id: `day-${i}`,
        date: date.toISOString().split('T')[0],
        meals,
        notes: ""
      })
    }

    const newPlan: WeeklyPlanData = {
      totalMeals: 21,
      plannedMeals: plannedCount,
      thisWeek
    }

    setPlanData(newPlan)
    localStorage.setItem("angi-weekly-plan", JSON.stringify(newPlan))
  }

  const updateMeal = (dayId: string, mealType: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    const updatedWeek = planData.thisWeek.map(day => {
      if (day.id === dayId) {
        const updatedMeals = { ...day.meals }
        if (value.trim()) {
          updatedMeals[mealType] = value
        } else {
          delete updatedMeals[mealType]
        }
        return { ...day, meals: updatedMeals }
      }
      return day
    })

    // Recalculate planned meals
    const plannedCount = updatedWeek.reduce((count, day) => {
      return count + Object.values(day.meals).filter(meal => meal).length
    }, 0)

    const updatedPlan = {
      ...planData,
      thisWeek: updatedWeek,
      plannedMeals: plannedCount
    }

    setPlanData(updatedPlan)
    localStorage.setItem("angi-weekly-plan", JSON.stringify(updatedPlan))
  }

  const addNewMeal = (dayId: string) => {
    const day = planData.thisWeek.find(d => d.id === dayId)
    if (!day) return

    const updatedWeek = planData.thisWeek.map(d => {
      if (d.id === dayId) {
        const updatedMeals = { ...d.meals }
        if (newMeal.breakfast) updatedMeals.breakfast = newMeal.breakfast
        if (newMeal.lunch) updatedMeals.lunch = newMeal.lunch
        if (newMeal.dinner) updatedMeals.dinner = newMeal.dinner
        return { ...d, meals: updatedMeals, notes: newMeal.notes || d.notes }
      }
      return d
    })

    const plannedCount = updatedWeek.reduce((count, day) => {
      return count + Object.values(day.meals).filter(meal => meal).length
    }, 0)

    const updatedPlan = {
      ...planData,
      thisWeek: updatedWeek,
      plannedMeals: plannedCount
    }

    setPlanData(updatedPlan)
    localStorage.setItem("angi-weekly-plan", JSON.stringify(updatedPlan))
    
    setNewMeal({ breakfast: "", lunch: "", dinner: "", notes: "" })
    setEditingMeal(null)
    toast.success("Đã cập nhật bữa ăn!")
  }

  const clearDay = (dayId: string) => {
    const updatedWeek = planData.thisWeek.map(day => {
      if (day.id === dayId) {
        return { ...day, meals: {}, notes: "" }
      }
      return day
    })

    const plannedCount = updatedWeek.reduce((count, day) => {
      return count + Object.values(day.meals).filter(meal => meal).length
    }, 0)

    const updatedPlan = {
      ...planData,
      thisWeek: updatedWeek,
      plannedMeals: plannedCount
    }

    setPlanData(updatedPlan)
    localStorage.setItem("angi-weekly-plan", JSON.stringify(updatedPlan))
    toast.success("Đã xóa kế hoạch ngày này!")
  }

  const autoGeneratePlan = () => {
    const mealOptions = {
      breakfast: [
        "Cháo yến mạch + trái cây",
        "Bánh mì + sữa chua",
        "Smoothie xanh + hạt",
        "Bánh pancake chay",
        "Cơm nếp + đậu phụ"
      ],
      lunch: [
        "Cơm chay + canh chua",
        "Salad quinoa + rau củ",
        "Bún chay + rau sống",
        "Cơm gạo lứt + đậu hũ",
        "Mì xào chay + rau"
      ],
      dinner: [
        "Salad + bánh mì",
        "Súp rau củ + bánh mì",
        "Cơm chay + canh",
        "Pasta chay + rau",
        "Bánh mì sandwich chay"
      ]
    }

    const updatedWeek = planData.thisWeek.map(day => {
      const meals = {}
      const dayIndex = planData.thisWeek.indexOf(day)
      
      // Generate meals based on day of week
      if (dayIndex < 6) meals.breakfast = mealOptions.breakfast[dayIndex % mealOptions.breakfast.length]
      if (dayIndex < 5) meals.lunch = mealOptions.lunch[dayIndex % mealOptions.lunch.length]
      meals.dinner = mealOptions.dinner[dayIndex % mealOptions.dinner.length]

      return { ...day, meals }
    })

    const plannedCount = updatedWeek.reduce((count, day) => {
      return count + Object.values(day.meals).filter(meal => meal).length
    }, 0)

    const updatedPlan = {
      ...planData,
      thisWeek: updatedWeek,
      plannedMeals: plannedCount
    }

    setPlanData(updatedPlan)
    localStorage.setItem("angi-weekly-plan", JSON.stringify(updatedPlan))
    toast.success("Đã tạo kế hoạch tự động!")
  }

  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    return days[date.getDay()]
  }

  const getDateString = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
  }

  const progressPercentage = (planData.plannedMeals / planData.totalMeals) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kế hoạch tuần</h1>
                <p className="text-gray-600">Lên kế hoạch bữa ăn cho cả tuần</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton
                content={{
                  title: "Kế hoạch bữa ăn tuần",
                  description: `Kế hoạch ${planData.plannedMeals}/${planData.totalMeals} bữa ăn cho tuần này`,
                  type: 'weekly-plan',
                  data: {
                    totalMeals: planData.totalMeals,
                    plannedMeals: planData.plannedMeals,
                    days: planData.thisWeek.map(day => ({
                      date: day.date,
                      breakfast: day.meals.breakfast,
                      lunch: day.meals.lunch,
                      dinner: day.meals.dinner
                    }))
                  }
                }}
                size="sm"
                variant="outline"
              />
              <Button onClick={() => setShowAddDialog(true)} variant="outline" size="sm">
                Chuẩn bị đi chợ tuần này
              </Button>
              <Button onClick={autoGeneratePlan} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tự động
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tiến độ tuần này</h2>
                  <p className="text-gray-600">Đã lên kế hoạch {planData.plannedMeals}/{planData.totalMeals} bữa ăn</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-600">Hoàn thành</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 via-teal-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {planData.thisWeek && Array.isArray(planData.thisWeek) ? planData.thisWeek.map((day, index) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{getDayName(day.date)}</CardTitle>
                      <p className="text-sm text-gray-600">{getDateString(day.date)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMeal(editingMeal === day.id ? null : day.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearDay(day.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Meals Display */}
                  <div className="space-y-3">
                    {day.meals.breakfast && (
                      <div className="flex items-start gap-2">
                        <ChefHat className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-blue-600 mb-1">Sáng</div>
                          <div className="text-sm text-gray-900">{day.meals.breakfast}</div>
                        </div>
                      </div>
                    )}
                    
                    {day.meals.lunch && (
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-orange-600 mb-1">Trưa</div>
                          <div className="text-sm text-gray-900">{day.meals.lunch}</div>
                        </div>
                      </div>
                    )}
                    
                    {day.meals.dinner && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-green-600 mb-1">Tối</div>
                          <div className="text-sm text-gray-900">{day.meals.dinner}</div>
                        </div>
                      </div>
                    )}

                    {!day.meals.breakfast && !day.meals.lunch && !day.meals.dinner && (
                      <div className="text-center py-4 text-gray-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có kế hoạch</p>
                      </div>
                    )}
                  </div>

                  {/* Edit Form */}
                  {editingMeal === day.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <div>
                        <Label htmlFor="breakfast">Sáng</Label>
                        <Input
                          id="breakfast"
                          placeholder="Bữa sáng..."
                          value={newMeal.breakfast}
                          onChange={(e) => setNewMeal({...newMeal, breakfast: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lunch">Trưa</Label>
                        <Input
                          id="lunch"
                          placeholder="Bữa trưa..."
                          value={newMeal.lunch}
                          onChange={(e) => setNewMeal({...newMeal, lunch: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dinner">Tối</Label>
                        <Input
                          id="dinner"
                          placeholder="Bữa tối..."
                          value={newMeal.dinner}
                          onChange={(e) => setNewMeal({...newMeal, dinner: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                          id="notes"
                          placeholder="Ghi chú thêm..."
                          value={newMeal.notes}
                          onChange={(e) => setNewMeal({...newMeal, notes: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => addNewMeal(day.id)}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMeal(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )) : null}
        </div>
      </div>
    </div>
    <AddToShoppingDialog
      open={showAddDialog}
      onOpenChange={setShowAddDialog}
      onAddIngredients={() => setShowAddDialog(false)}
    />
  )
}
