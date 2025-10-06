"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogIn, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface LoginPromptProps {
  className?: string
}

export function LoginPrompt({ className = "" }: LoginPromptProps) {
  const { login } = useAuth()

  const handleDemoLogin = () => {
    // Demo user data
    const demoUser = {
      id: "demo-user-1",
      name: "Anh Tuấn",
      email: "anh.tuan@email.com",
      avatar: "/placeholder-user.jpg",
      preferences: {
        diet: "vegetarian",
        allergies: ["gluten"],
        budget: 1200000
      }
    }
    
    login(demoUser)
  }

  return (
    <Card className={`border-dashed border-2 border-muted-foreground/25 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Đăng nhập để sử dụng tính năng ẩn</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Đăng nhập để ẩn món ăn, thực đơn và nhà hàng khỏi gợi ý
            </p>
          </div>
          <Button onClick={handleDemoLogin} className="gap-2">
            <LogIn className="h-4 w-4" />
            Đăng nhập demo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
