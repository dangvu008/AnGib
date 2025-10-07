"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Flame,
  Zap,
  Heart,
  Leaf,
  TrendingUp,
  Target
} from "lucide-react"

interface NutritionSummaryProps {
  menu: {
    name: string
    days: number
    nutrition: {
      protein: string
      carbs: string
      fat: string
      fiber: string
    }
    schedule: Array<{
      meals: Record<string, {
        calories: number
        ingredients: Array<{
          name: string
          quantity: number
          unit: string
          price: number
        }>
      }>
    }>
  }
}

export function NutritionSummary({ menu }: NutritionSummaryProps) {
  // Calculate totals
  const totalCalories = menu.schedule.reduce((sum, day) => {
    return sum + Object.values(day.meals).reduce((daySum, meal) => daySum + (meal.calories || 0), 0)
  }, 0)

  const totalCost = menu.schedule.reduce((sum, day) => {
    return sum + Object.values(day.meals).reduce((daySum, meal) => {
      return daySum + meal.ingredients.reduce((ingSum, ing) => ingSum + ing.price, 0)
    }, 0)
  }, 0)

  const avgCaloriesPerDay = Math.round(totalCalories / menu.days)
  const avgCostPerDay = Math.round(totalCost / menu.days)

  const nutritionStats = [
    {
      icon: Flame,
      label: "Calories/ngày",
      value: avgCaloriesPerDay.toLocaleString(),
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      icon: Zap,
      label: "Protein/ngày", 
      value: menu.nutrition.protein,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: Heart,
      label: "Carbs/ngày",
      value: menu.nutrition.carbs,
      color: "text-green-500", 
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      icon: Leaf,
      label: "Chất béo/ngày",
      value: menu.nutrition.fat,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    }
  ]

  return (
    <div className="space-y-4">
      {/* Nutrition Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tổng quan dinh dưỡng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {nutritionStats.map((stat, index) => (
              <div key={index} className={`p-3 rounded-lg ${stat.bgColor}`}>
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Chi phí ước tính
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Tổng chi phí</p>
              <p className="font-bold text-lg">{totalCost.toLocaleString()}₫</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Chi phí/ngày</p>
              <p className="font-bold text-lg">{avgCostPerDay.toLocaleString()}₫</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              💡 Chi phí này chỉ là ước tính dựa trên giá nguyên liệu trung bình
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Menu Benefits */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Lợi ích của thực đơn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Cân bằng dinh dưỡng với đầy đủ protein, carbs và chất béo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Giàu chất xơ từ rau củ và ngũ cốc nguyên hạt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Dễ chuẩn bị với thời gian nấu hợp lý</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Tiết kiệm chi phí với nguyên liệu phổ biến</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
