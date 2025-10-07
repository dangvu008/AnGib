"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Flame,
  CheckCircle2,
  ChefHat,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { format, addDays, isToday, isTomorrow, isYesterday } from "date-fns"
import { vi } from "date-fns/locale"

interface MenuScheduleProps {
  appliedMenu: any
}

export function MenuSchedule({ appliedMenu }: MenuScheduleProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [mealProgress, setMealProgress] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadMealProgress()
  }, [appliedMenu])

  const loadMealProgress = () => {
    try {
      const saved = localStorage.getItem("angi-meal-progress")
      const progress = saved ? JSON.parse(saved) : {}
      
      const today = format(new Date(), "yyyy-MM-dd")
      const dayKey = `${appliedMenu.id}-${today}`
      
      setMealProgress(progress[dayKey] || {})
    } catch (error) {
      console.error("Error loading meal progress:", error)
    }
  }

  const markMealComplete = (mealType: string) => {
    try {
      const saved = localStorage.getItem("angi-meal-progress")
      const progress = saved ? JSON.parse(saved) : {}
      
      const today = format(new Date(), "yyyy-MM-dd")
      const dayKey = `${appliedMenu.id}-${today}`
      
      if (!progress[dayKey]) {
        progress[dayKey] = {}
      }
      
      progress[dayKey][mealType] = true
      localStorage.setItem("angi-meal-progress", JSON.stringify(progress))
      
      setMealProgress(prev => ({ ...prev, [mealType]: true }))
      
    } catch (error) {
      console.error("Error marking meal complete:", error)
    }
  }

  const getDayName = (dayOffset: number) => {
    const date = addDays(new Date(appliedMenu.startDate), dayOffset)
    if (isToday(date)) return "Hôm nay"
    if (isTomorrow(date)) return "Ngày mai"
    if (isYesterday(date)) return "Hôm qua"
    return format(date, "EEEE", { locale: vi })
  }

  const getDayDate = (dayOffset: number) => {
    const date = addDays(new Date(appliedMenu.startDate), dayOffset)
    return format(date, "dd/MM", { locale: vi })
  }

  const currentDay = appliedMenu.schedule[selectedDay]
  const dayOffset = Math.floor((new Date().getTime() - new Date(appliedMenu.startDate).getTime()) / (1000 * 60 * 60 * 24))
  const isCurrentDay = selectedDay === dayOffset

  return (
    <div className="space-y-4">
      {/* Day Selector */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lịch trình {appliedMenu.days} ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {appliedMenu.schedule.map((day: any, index: number) => {
              const isActive = selectedDay === index
              const isToday = index === dayOffset
              const isPast = index < dayOffset
              
              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(index)}
                  className={`h-auto p-3 flex flex-col gap-1 ${
                    isToday ? "ring-2 ring-primary" : ""
                  } ${isPast ? "opacity-60" : ""}`}
                >
                  <span className="text-xs font-medium">{getDayName(index)}</span>
                  <span className="text-xs text-muted-foreground">{getDayDate(index)}</span>
                  {isPast && (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  )}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Meals */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{getDayName(selectedDay)}</span>
            <Badge variant="secondary">
              {Object.keys(currentDay.meals).length} bữa
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(currentDay.meals).map(([mealType, mealName]: [string, any]) => {
            const isCompleted = mealProgress[mealType] || false
            const mealTypeName = mealType === 'breakfast' ? 'Sáng' : 
                               mealType === 'lunch' ? 'Trưa' : 'Tối'
            
            return (
              <motion.div
                key={mealType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border ${
                  isCompleted ? "bg-green-50 border-green-200" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <div>
                      <span className="font-medium">{mealTypeName}</span>
                      <span className="text-muted-foreground ml-2">{mealName}</span>
                    </div>
                  </div>
                  {!isCompleted && isCurrentDay && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markMealComplete(mealType)}
                      className="h-7 px-3 text-xs"
                    >
                      Hoàn thành
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Link href="/menu" className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <ChefHat className="h-4 w-4" />
            Xem thực đơn
          </Button>
        </Link>
        <Link href="/shopping" className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <ArrowRight className="h-4 w-4" />
            Đi chợ
          </Button>
        </Link>
      </div>
    </div>
  )
}
