"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  ChefHat, 
  Calendar,
  ArrowRight,
  X
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function MenuNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [appliedMenu, setAppliedMenu] = useState<any>(null)

  useEffect(() => {
    checkForNewMenu()
  }, [])

  const checkForNewMenu = () => {
    try {
      const saved = localStorage.getItem("angi-active-menu")
      if (saved) {
        const menu = JSON.parse(saved)
        const appliedAt = new Date(menu.appliedAt)
        const now = new Date()
        const hoursSinceApplied = (now.getTime() - appliedAt.getTime()) / (1000 * 60 * 60)
        
        // Show notification if menu was applied within last 24 hours
        if (hoursSinceApplied < 24) {
          setAppliedMenu(menu)
          setShowNotification(true)
        }
      }
    } catch (error) {
      console.error("Error checking for new menu:", error)
    }
  }

  const dismissNotification = () => {
    setShowNotification(false)
  }

  const goToMenu = () => {
    setShowNotification(false)
    window.location.href = "/menu"
  }

  const goToSchedule = () => {
    setShowNotification(false)
    window.location.href = "/"
  }

  if (!showNotification || !appliedMenu) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
      >
        <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-sm">Thực đơn mới đã áp dụng!</h3>
                  <Badge variant="secondary" className="text-xs">
                    {appliedMenu.days} ngày
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>{appliedMenu.name}</strong> đã được áp dụng từ{" "}
                  {format(new Date(appliedMenu.startDate), "dd/MM/yyyy", { locale: vi })}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={goToSchedule}
                    className="flex-1 gap-2"
                  >
                    <Calendar className="h-3 w-3" />
                    Xem lịch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={goToMenu}
                    className="flex-1 gap-2"
                  >
                    <ChefHat className="h-3 w-3" />
                    Thực đơn
                  </Button>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={dismissNotification}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
