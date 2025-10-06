"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Settings, 
  ChefHat, 
  ShoppingCart, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: string
  link: string
  completed: boolean
}

export function UserOnboarding() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Hoàn thiện hồ sơ",
      description: "Cập nhật thông tin cá nhân và sở thích ăn uống",
      icon: <User className="h-5 w-5" />,
      action: "Cập nhật hồ sơ",
      link: "/profile",
      completed: false
    },
    {
      id: "settings",
      title: "Tùy chỉnh cài đặt",
      description: "Thiết lập chế độ ăn chay và mục tiêu dinh dưỡng",
      icon: <Settings className="h-5 w-5" />,
      action: "Mở cài đặt",
      link: "/settings",
      completed: false
    },
    {
      id: "menu",
      title: "Chọn thực đơn",
      description: "Khám phá và áp dụng thực đơn phù hợp",
      icon: <ChefHat className="h-5 w-5" />,
      action: "Xem thực đơn",
      link: "/menu",
      completed: false
    },
    {
      id: "shopping",
      title: "Lên danh sách mua sắm",
      description: "Tạo danh sách nguyên liệu cần thiết",
      icon: <ShoppingCart className="h-5 w-5" />,
      action: "Tạo danh sách",
      link: "/shopping",
      completed: false
    },
    {
      id: "weekly-plan",
      title: "Lập kế hoạch tuần",
      description: "Lên kế hoạch bữa ăn cho cả tuần",
      icon: <Calendar className="h-5 w-5" />,
      action: "Lập kế hoạch",
      link: "/weekly-plan",
      completed: false
    }
  ]

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("angi-onboarding-completed")
    if (!hasCompletedOnboarding) {
      setIsVisible(true)
    }

    // Check completed steps
    const completedSteps = JSON.parse(localStorage.getItem("angi-completed-steps") || "[]")
    steps.forEach((step, index) => {
      if (completedSteps.includes(step.id)) {
        step.completed = true
      }
    })
  }, [])

  const markStepCompleted = (stepId: string) => {
    const completedSteps = JSON.parse(localStorage.getItem("angi-completed-steps") || "[]")
    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId)
      localStorage.setItem("angi-completed-steps", JSON.stringify(completedSteps))
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem("angi-onboarding-completed", "true")
    setIsVisible(false)
  }

  const skipOnboarding = () => {
    localStorage.setItem("angi-onboarding-completed", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <Card className="shadow-xl border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-primary">Chào mừng đến với AnGi! 🎉</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Hãy hoàn thiện hồ sơ để có trải nghiệm tốt nhất
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipOnboarding}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tiến độ</span>
                <span className="text-sm text-muted-foreground">
                  {steps.filter(s => s.completed).length}/{steps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-primary to-chart-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    step.completed 
                      ? "bg-green-50 border border-green-200" 
                      : index === currentStep
                      ? "bg-primary/5 border border-primary/20"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    step.completed 
                      ? "bg-green-100 text-green-600" 
                      : index === currentStep
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      {step.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Hoàn thành
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                  {!step.completed && index === currentStep && (
                    <Link href={step.link}>
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => markStepCompleted(step.id)}
                      >
                        {step.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={skipOnboarding}
                className="flex-1"
              >
                Bỏ qua
              </Button>
              <Button
                size="sm"
                onClick={completeOnboarding}
                className="flex-1"
                disabled={steps.filter(s => s.completed).length < 3}
              >
                Hoàn thành
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

