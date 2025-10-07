"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Zap,
  Leaf,
  Droplets,
  Activity,
  BarChart3
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface NutritionalData {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  cholesterol: number
  vitamins: Record<string, number>
  minerals: Record<string, number>
}

interface NutritionalAnalysisProps {
  appliedMenu: any
}

export function NutritionalAnalysis({ appliedMenu }: NutritionalAnalysisProps) {
  const [nutritionData, setNutritionData] = useState<NutritionalData | null>(null)
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25,
    sodium: 2300
  })
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  useEffect(() => {
    calculateNutrition()
  }, [appliedMenu])

  const calculateNutrition = () => {
    // Mock calculation - in real app, this would use a nutrition database
    const totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      vitamins: {} as Record<string, number>,
      minerals: {} as Record<string, number>
    }

    appliedMenu.schedule.forEach((day: any) => {
      Object.values(day.meals || {}).forEach((meal: any) => {
        totalNutrition.calories += meal.calories || 0
        totalNutrition.protein += meal.protein || 0
        totalNutrition.carbs += meal.carbs || 0
        totalNutrition.fat += meal.fat || 0
        totalNutrition.fiber += meal.fiber || 0
        totalNutrition.sugar += meal.sugar || 0
        totalNutrition.sodium += meal.sodium || 0
        totalNutrition.cholesterol += meal.cholesterol || 0
      })
    })

    // Calculate averages per day
    const days = appliedMenu.schedule.length
    const avgNutrition = {
      calories: Math.round(totalNutrition.calories / days),
      protein: Math.round(totalNutrition.protein / days),
      carbs: Math.round(totalNutrition.carbs / days),
      fat: Math.round(totalNutrition.fat / days),
      fiber: Math.round(totalNutrition.fiber / days),
      sugar: Math.round(totalNutrition.sugar / days),
      sodium: Math.round(totalNutrition.sodium / days),
      cholesterol: Math.round(totalNutrition.cholesterol / days),
      vitamins: totalNutrition.vitamins,
      minerals: totalNutrition.minerals
    }

    setNutritionData(avgNutrition)
    analyzeNutrition(avgNutrition)
  }

  const analyzeNutrition = (nutrition: NutritionalData) => {
    const analysis = {
      overall: "good",
      recommendations: [] as string[],
      warnings: [] as string[],
      strengths: [] as string[]
    }

    // Calorie analysis
    const calorieRatio = nutrition.calories / dailyGoals.calories
    if (calorieRatio < 0.8) {
      analysis.warnings.push("Lượng calo thấp hơn khuyến nghị")
    } else if (calorieRatio > 1.2) {
      analysis.warnings.push("Lượng calo cao hơn khuyến nghị")
    } else {
      analysis.strengths.push("Lượng calo cân bằng")
    }

    // Protein analysis
    const proteinRatio = nutrition.protein / dailyGoals.protein
    if (proteinRatio < 0.8) {
      analysis.recommendations.push("Tăng cường protein từ thịt, cá, đậu")
    } else if (proteinRatio > 1.2) {
      analysis.warnings.push("Lượng protein cao, cần cân bằng")
    } else {
      analysis.strengths.push("Protein đầy đủ")
    }

    // Fiber analysis
    if (nutrition.fiber < dailyGoals.fiber * 0.8) {
      analysis.recommendations.push("Tăng cường chất xơ từ rau củ, ngũ cốc")
    } else {
      analysis.strengths.push("Chất xơ đầy đủ")
    }

    // Sodium analysis
    if (nutrition.sodium > dailyGoals.sodium) {
      analysis.warnings.push("Lượng muối cao, giảm gia vị")
    } else {
      analysis.strengths.push("Lượng muối hợp lý")
    }

    // Overall assessment
    if (analysis.warnings.length > analysis.strengths.length) {
      analysis.overall = "needs_improvement"
    } else if (analysis.strengths.length > analysis.warnings.length) {
      analysis.overall = "excellent"
    }

    setAnalysisResults(analysis)
  }

  const getNutritionColor = (current: number, goal: number) => {
    const ratio = current / goal
    if (ratio < 0.7) return "text-red-600"
    if (ratio < 0.9) return "text-yellow-600"
    if (ratio > 1.3) return "text-orange-600"
    return "text-green-600"
  }

  const getAnalysisIcon = (overall: string) => {
    switch (overall) {
      case "excellent": return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "good": return <Target className="h-5 w-5 text-blue-600" />
      case "needs_improvement": return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default: return <BarChart3 className="h-5 w-5 text-gray-600" />
    }
  }

  const getAnalysisText = (overall: string) => {
    switch (overall) {
      case "excellent": return "Xuất sắc"
      case "good": return "Tốt"
      case "needs_improvement": return "Cần cải thiện"
      default: return "Đang phân tích"
    }
  }

  if (!nutritionData || !analysisResults) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getAnalysisIcon(analysisResults.overall)}
            Đánh giá tổng quan dinh dưỡng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold mb-2">
              {getAnalysisText(analysisResults.overall)}
            </h3>
            <p className="text-muted-foreground">
              Thực đơn này cung cấp {nutritionData.calories} calo/ngày
            </p>
          </div>

          {/* Strengths */}
          {analysisResults.strengths.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Điểm mạnh
              </h4>
              <div className="space-y-1">
                {analysisResults.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {analysisResults.warnings.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Cần chú ý
              </h4>
              <div className="space-y-1">
                {analysisResults.warnings.map((warning, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysisResults.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Khuyến nghị
              </h4>
              <div className="space-y-1">
                {analysisResults.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Nutrition Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Chi tiết dinh dưỡng hàng ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Macronutrients */}
            <div>
              <h4 className="font-semibold mb-3">Dưỡng chất đa lượng</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      Calories
                    </span>
                    <span className={getNutritionColor(nutritionData.calories, dailyGoals.calories)}>
                      {nutritionData.calories}/{dailyGoals.calories}
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionData.calories / dailyGoals.calories) * 100} 
                    className="h-2" 
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Protein
                    </span>
                    <span className={getNutritionColor(nutritionData.protein, dailyGoals.protein)}>
                      {nutritionData.protein}g/{dailyGoals.protein}g
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionData.protein / dailyGoals.protein) * 100} 
                    className="h-2" 
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Carbs
                    </span>
                    <span className={getNutritionColor(nutritionData.carbs, dailyGoals.carbs)}>
                      {nutritionData.carbs}g/{dailyGoals.carbs}g
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionData.carbs / dailyGoals.carbs) * 100} 
                    className="h-2" 
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-purple-500" />
                      Chất béo
                    </span>
                    <span className={getNutritionColor(nutritionData.fat, dailyGoals.fat)}>
                      {nutritionData.fat}g/{dailyGoals.fat}g
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionData.fat / dailyGoals.fat) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>

            {/* Micronutrients */}
            <div>
              <h4 className="font-semibold mb-3">Dưỡng chất vi lượng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Leaf className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Chất xơ</p>
                  <p className="font-bold">{nutritionData.fiber}g</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Natri</p>
                  <p className="font-bold">{nutritionData.sodium}mg</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Adjustment */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Điều chỉnh mục tiêu dinh dưỡng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Cá nhân hóa mục tiêu dinh dưỡng phù hợp với nhu cầu của bạn
          </p>
          <Button variant="outline" className="gap-2">
            <Target className="h-4 w-4" />
            Cá nhân hóa mục tiêu
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
