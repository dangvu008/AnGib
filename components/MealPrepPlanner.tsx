"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  ChefHat, 
  Timer,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Target,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { format, addMinutes } from "date-fns"
import { vi } from "date-fns/locale"

interface MealPrepItem {
  id: string
  name: string
  prepTime: number // in minutes
  cookingTime: number // in minutes
  difficulty: "easy" | "medium" | "hard"
  ingredients: string[]
  steps: string[]
  completed: boolean
  startTime?: Date
  endTime?: Date
}

interface MealPrepPlannerProps {
  appliedMenu: any
}

export function MealPrepPlanner({ appliedMenu }: MealPrepPlannerProps) {
  const [prepItems, setPrepItems] = useState<MealPrepItem[]>([])
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timers, setTimers] = useState<Record<string, number>>({})
  const [isPlanning, setIsPlanning] = useState(false)

  useEffect(() => {
    generatePrepPlan()
  }, [appliedMenu])

  const generatePrepPlan = () => {
    const items: MealPrepItem[] = []
    
    appliedMenu.schedule.forEach((day: any, dayIndex: number) => {
      Object.entries(day.meals || {}).forEach(([mealType, meal]: [string, any]) => {
        items.push({
          id: `${dayIndex}-${mealType}`,
          name: meal.name,
          prepTime: meal.prepTime || 15,
          cookingTime: meal.cookingTime || 20,
          difficulty: meal.difficulty || "medium",
          ingredients: meal.ingredients || [],
          steps: meal.steps || [],
          completed: false
        })
      })
    })
    
    setPrepItems(items)
  }

  const startTimer = (itemId: string) => {
    setActiveTimer(itemId)
    setTimers(prev => ({ ...prev, [itemId]: 0 }))
    
    const interval = setInterval(() => {
      setTimers(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1
      }))
    }, 1000)
    
    // Store interval for cleanup
    ;(window as any).mealPrepInterval = interval
  }

  const stopTimer = (itemId: string) => {
    setActiveTimer(null)
    clearInterval((window as any).mealPrepInterval)
    
    const item = prepItems.find(i => i.id === itemId)
    if (item) {
      const totalTime = timers[itemId] || 0
      const minutes = Math.floor(totalTime / 60)
      
      toast.success(`✅ Hoàn thành ${item.name} trong ${minutes} phút`)
      
      setPrepItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, completed: true, endTime: new Date() }
          : i
      ))
    }
  }

  const resetItem = (itemId: string) => {
    setPrepItems(prev => prev.map(i => 
      i.id === itemId 
        ? { ...i, completed: false, startTime: undefined, endTime: undefined }
        : i
    ))
    setTimers(prev => ({ ...prev, [itemId]: 0 }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "hard": return "text-red-600 bg-red-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Dễ"
      case "medium": return "Trung bình"
      case "hard": return "Khó"
      default: return "Không xác định"
    }
  }

  const totalItems = prepItems.length
  const completedItems = prepItems.filter(item => item.completed).length
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const estimatedTotalTime = prepItems.reduce((total, item) => 
    total + item.prepTime + item.cookingTime, 0
  )

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Kế hoạch chuẩn bị bữa ăn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Tổng món</p>
              <p className="font-bold text-lg">{totalItems}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
              <p className="font-bold text-lg">{completedItems}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-muted-foreground">Thời gian ước tính</p>
              <p className="font-bold text-lg">{estimatedTotalTime} phút</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Zap className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-muted-foreground">Tiến độ</p>
              <p className="font-bold text-lg">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Prep Items */}
      <div className="space-y-4">
        {prepItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-0 shadow-lg ${item.completed ? 'bg-green-50 border-green-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {getDifficultyText(item.difficulty)}
                      </Badge>
                      {item.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Chuẩn bị: {item.prepTime} phút
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        Nấu: {item.cookingTime} phút
                      </span>
                    </div>

                    {/* Timer Display */}
                    {activeTimer === item.id && (
                      <div className="mb-3 p-2 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4 text-primary" />
                          <span className="font-mono text-lg font-bold">
                            {formatTime(timers[item.id] || 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ingredients */}
                {item.ingredients.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold mb-2">Nguyên liệu:</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.map((ingredient, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps */}
                {item.steps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Các bước:</h4>
                    <ol className="text-sm space-y-1">
                      {item.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-muted-foreground">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {!item.completed ? (
                    <>
                      {activeTimer === item.id ? (
                        <Button
                          size="sm"
                          onClick={() => stopTimer(item.id)}
                          className="gap-2"
                        >
                          <Pause className="h-4 w-4" />
                          Dừng
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => startTimer(item.id)}
                          className="gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Bắt đầu
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetItem(item.id)}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Làm lại
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPlanning(!isPlanning)}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              {isPlanning ? "Hoàn thành lập kế hoạch" : "Lập kế hoạch"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPrepItems(prev => prev.map(item => ({ ...item, completed: false })))
                setActiveTimer(null)
                toast.success("🔄 Đã reset tất cả món ăn")
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset tất cả
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
