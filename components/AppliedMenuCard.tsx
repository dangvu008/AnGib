"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  ChefHat, 
  Clock, 
  Flame,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  Target,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { MenuSchedule } from "./MenuSchedule"

interface AppliedMenu {
  id: number
  name: string
  description: string
  days: number
  startDate: string
  schedule: Array<{
    day: number
    breakfast?: string
    lunch?: string
    dinner?: string
  }>
  appliedAt: string
  progress: {
    completedDays: number
    completedMeals: number
    totalMeals: number
  }
}

export function AppliedMenuCard() {
  const [appliedMenu, setAppliedMenu] = useState<AppliedMenu | null>(null)
  const [todayMeals, setTodayMeals] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAppliedMenu()
  }, [])

  const loadAppliedMenu = () => {
    try {
      const saved = localStorage.getItem("angi-active-menu")
      if (saved) {
        const menu = JSON.parse(saved)
        setAppliedMenu(menu)
        
        // Calculate progress
        const startDate = new Date(menu.startDate)
        const today = new Date()
        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        const completedDays = Math.max(0, Math.min(daysPassed, menu.days))
        const completedMeals = completedDays * 3 // Assuming 3 meals per day
        
        const updatedMenu = {
          ...menu,
          progress: {
            completedDays,
            completedMeals,
            totalMeals: menu.days * 3
          }
        }
        
        setAppliedMenu(updatedMenu)
        localStorage.setItem("angi-active-menu", JSON.stringify(updatedMenu))
        
        // Get today's meals
        if (daysPassed >= 0 && daysPassed < menu.days) {
          const todaySchedule = menu.schedule[daysPassed]
          if (todaySchedule) {
            setTodayMeals(todaySchedule)
          }
        }
      }
    } catch (error) {
      console.error("Error loading applied menu:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markMealComplete = (mealType: string) => {
    if (!appliedMenu) return
    
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
      
      toast.success(`✅ Đã hoàn thành ${mealType === 'breakfast' ? 'bữa sáng' : mealType === 'lunch' ? 'bữa trưa' : 'bữa tối'}`)
      
      // Reload to update progress
      loadAppliedMenu()
    } catch (error) {
      toast.error("Không thể cập nhật tiến độ")
    }
  }

  const getMealStatus = (mealType: string) => {
    if (!appliedMenu) return false
    
    try {
      const saved = localStorage.getItem("angi-meal-progress")
      const progress = saved ? JSON.parse(saved) : {}
      
      const today = format(new Date(), "yyyy-MM-dd")
      const dayKey = `${appliedMenu.id}-${today}`
      
      return progress[dayKey]?.[mealType] || false
    } catch {
      return false
    }
  }

  const getDayName = (dayOffset: number) => {
    const date = addDays(new Date(appliedMenu?.startDate || new Date()), dayOffset)
    if (isToday(date)) return "Hôm nay"
    if (isTomorrow(date)) return "Ngày mai"
    if (isYesterday(date)) return "Hôm qua"
    return format(date, "EEEE", { locale: vi })
  }

  if (isLoading) {
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

  if (!appliedMenu) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-bold text-lg mb-2">Chưa có thực đơn nào</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Áp dụng một thực đơn để bắt đầu lên kế hoạch bữa ăn
            </p>
          </div>
          <Link href="/menu">
            <Button className="gap-2">
              <ChefHat className="h-4 w-4" />
              Chọn thực đơn
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = (appliedMenu.progress.completedMeals / appliedMenu.progress.totalMeals) * 100

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              {appliedMenu.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Bắt đầu từ {format(new Date(appliedMenu.startDate), "dd/MM/yyyy", { locale: vi })}
            </p>
          </div>
          <Badge variant="secondary">
            Ngày {appliedMenu.progress.completedDays + 1}/{appliedMenu.days}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tiến độ</span>
            <span className="text-sm text-muted-foreground">
              {appliedMenu.progress.completedMeals}/{appliedMenu.progress.totalMeals} bữa
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(progressPercentage)}% hoàn thành
          </p>
        </div>

        {/* Menu Schedule */}
        <MenuSchedule appliedMenu={appliedMenu} />

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href="/menu" className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Xem thực đơn
            </Button>
          </Link>
          <Link href="/shopping" className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ShoppingCart className="h-4 w-4" />
              Đi chợ
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("angi-active-menu")
              localStorage.removeItem("angi-meal-progress")
              setAppliedMenu(null)
              toast.success("Đã hủy thực đơn")
            }}
            className="px-3"
          >
            Hủy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
