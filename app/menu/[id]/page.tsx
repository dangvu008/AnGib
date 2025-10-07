"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Flame,
  Users,
  ChefHat,
  ShoppingCart,
  Plus,
  Leaf,
  CheckCircle2,
  TrendingUp,
  Star
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { AppHeader } from "@/components/AppHeader"
import { ShareButton } from "@/components/ShareButton"
import { AddDishToShoppingButton } from "@/components/AddDishToShoppingButton"
import { NutritionSummary } from "@/components/NutritionSummary"
import { useParams } from "next/navigation"

// Mock database for menu details
const menuDatabase: any = {
  "1": {
    id: 1,
    name: "Thực đơn chay 7 ngày",
    description: "Kế hoạch ăn chay đầy đủ dinh dưỡng cho cả tuần",
    days: 7,
    totalMeals: 21,
    calories: "1,400-1,600 calo/ngày",
    image: "/healthy-salad-bowl-colorful-vegetables.jpg",
    tags: ["Chay", "Cân bằng", "Tiết kiệm"],
    difficulty: "Dễ",
    prepTime: "30-45 phút/ngày",
    nutrition: {
      protein: "45-55g/ngày",
      carbs: "180-220g/ngày", 
      fat: "35-45g/ngày",
      fiber: "25-30g/ngày"
    },
    schedule: [
      {
        day: 1,
        date: "Thứ 2",
        meals: {
          breakfast: {
            name: "Cháo chay",
            description: "Cháo gạo lứt với rau củ và đậu hũ",
            prepTime: "15 phút",
            calories: 320,
            ingredients: [
              { name: "Gạo lứt", quantity: 1, unit: "chén", price: 5000 },
              { name: "Đậu hũ", quantity: 100, unit: "g", price: 8000 },
              { name: "Cà rốt", quantity: 1, unit: "củ", price: 3000 },
              { name: "Rau cải", quantity: 100, unit: "g", price: 4000 }
            ]
          },
          lunch: {
            name: "Cơm + 3 món chay",
            description: "Cơm gạo lứt với đậu hũ sốt cà, canh chua, rau muống xào",
            prepTime: "45 phút",
            calories: 580,
            ingredients: [
              { name: "Gạo lứt", quantity: 1.5, unit: "chén", price: 7500 },
              { name: "Đậu hũ", quantity: 200, unit: "g", price: 16000 },
              { name: "Cà chua", quantity: 3, unit: "quả", price: 6000 },
              { name: "Rau muống", quantity: 200, unit: "g", price: 8000 },
              { name: "Dứa", quantity: 100, unit: "g", price: 5000 }
            ]
          },
          dinner: {
            name: "Bún chay",
            description: "Bún với nước dùng chay và rau củ",
            prepTime: "25 phút",
            calories: 420,
            ingredients: [
              { name: "Bún", quantity: 200, unit: "g", price: 6000 },
              { name: "Nấm", quantity: 150, unit: "g", price: 12000 },
              { name: "Rau sống", quantity: 100, unit: "g", price: 5000 },
              { name: "Tương chay", quantity: 2, unit: "muỗng", price: 3000 }
            ]
          }
        }
      },
      {
        day: 2,
        date: "Thứ 3",
        meals: {
          breakfast: {
            name: "Bánh mì trứng",
            description: "Bánh mì với trứng chiên và rau",
            prepTime: "10 phút",
            calories: 380,
            ingredients: [
              { name: "Bánh mì", quantity: 2, unit: "ổ", price: 8000 },
              { name: "Trứng", quantity: 2, unit: "quả", price: 6000 },
              { name: "Rau xà lách", quantity: 50, unit: "g", price: 3000 }
            ]
          },
          lunch: {
            name: "Cơm + 3 món chay",
            description: "Cơm với đậu hũ chiên, canh bí đỏ, rau cải xào",
            prepTime: "40 phút",
            calories: 560,
            ingredients: [
              { name: "Gạo lứt", quantity: 1.5, unit: "chén", price: 7500 },
              { name: "Đậu hũ", quantity: 200, unit: "g", price: 16000 },
              { name: "Bí đỏ", quantity: 300, unit: "g", price: 9000 },
              { name: "Rau cải", quantity: 200, unit: "g", price: 8000 }
            ]
          },
          dinner: {
            name: "Phở chay",
            description: "Phở với nước dùng chay và rau củ",
            prepTime: "30 phút",
            calories: 450,
            ingredients: [
              { name: "Bánh phở", quantity: 200, unit: "g", price: 8000 },
              { name: "Nấm", quantity: 100, unit: "g", price: 8000 },
              { name: "Rau thơm", quantity: 50, unit: "g", price: 4000 },
              { name: "Tương chay", quantity: 2, unit: "muỗng", price: 3000 }
            ]
          }
        }
      }
      // Add more days...
    ]
  }
}

export default function MenuDetailPage() {
  const params = useParams()
  const menuId = params.id as string
  const menu = menuDatabase[menuId]
  const [selectedDay, setSelectedDay] = useState(0)
  const [isPlanInCart, setIsPlanInCart] = useState(false)

  useEffect(() => {
    // Check if menu is already in cart
    try {
      const saved = localStorage.getItem("angi-shopping-list")
      if (!saved) return
      const list = JSON.parse(saved) as Array<any>
      const exists = (list || []).some((i: any) => i.sourceMenuId === menuId)
      setIsPlanInCart(exists)
    } catch {}
  }, [menuId])

  const handleAddToCart = () => {
    if (isPlanInCart) {
      toast.info("Thực đơn đã có trong giỏ", {
        description: "Bạn có thể chỉnh sửa trong trang Đi chợ"
      })
      return
    }
    try {
      const saved = localStorage.getItem("angi-shopping-list")
      const list = saved ? JSON.parse(saved) : []
      list.push({
        id: Date.now(),
        name: `Thực đơn: ${menu.name}`,
        quantity: "1",
        price: 0,
        category: "Khác",
        checked: false,
        note: "Từ thực đơn",
        sourceMenuId: menuId
      })
      localStorage.setItem("angi-shopping-list", JSON.stringify(list))
      setIsPlanInCart(true)
      toast.success("Đã thêm thực đơn vào giỏ")
    } catch {
      toast.error("Không thể cập nhật giỏ")
    }
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <AppHeader />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy thực đơn</h1>
          <p className="text-muted-foreground mb-6">Thực đơn này chưa có trong hệ thống</p>
          <Link href="/menu">
            <Button>Về trang thực đơn</Button>
          </Link>
        </main>
      </div>
    )
  }

  const currentDay = menu.schedule[selectedDay]
  const totalCalories = menu.schedule.reduce((sum: number, day: any) => {
    return sum + Object.values(day.meals).reduce((daySum: number, meal: any) => daySum + (meal.calories || 0), 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/menu">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Về thực đơn
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{menu.name}</h1>
              <p className="text-sm md:text-base text-muted-foreground">{menu.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton
                content={{
                  title: menu.name,
                  description: menu.description,
                  type: 'menu',
                  data: menu
                }}
                size="sm"
                variant="outline"
              />
              <Button 
                onClick={handleAddToCart} 
                variant={isPlanInCart ? "secondary" : "outline"} 
                size="sm"
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isPlanInCart ? "Đã có" : "Thêm vào giỏ"}
              </Button>
            </div>
          </div>

          {/* Menu Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-lg font-bold">{menu.days}</p>
                <p className="text-xs text-muted-foreground">Ngày</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <ChefHat className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-lg font-bold">{menu.totalMeals}</p>
                <p className="text-xs text-muted-foreground">Bữa ăn</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Flame className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-lg font-bold">{Math.round(totalCalories / menu.days)}</p>
                <p className="text-xs text-muted-foreground">Calo/ngày</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-lg font-bold">{menu.prepTime}</p>
                <p className="text-xs text-muted-foreground">Chuẩn bị</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lịch trình {menu.days} ngày
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {menu.schedule.map((day: any, index: number) => (
                  <Button
                    key={index}
                    variant={selectedDay === index ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedDay(index)}
                  >
                    <div className="text-left">
                      <p className="font-semibold">{day.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {Object.keys(day.meals).length} bữa • {Object.values(day.meals).reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0)} calo
                      </p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Day Details */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentDay.date}</span>
                  <Badge variant="secondary">
                    {Object.keys(currentDay.meals).length} bữa
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(currentDay.meals).map(([mealType, meal]: [string, any]) => (
                  <motion.div
                    key={mealType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{meal.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{meal.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meal.prepTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            {meal.calories} calo
                          </span>
                        </div>
                      </div>
                      <AddDishToShoppingButton
                        dish={{
                          id: `${menuId}-${selectedDay}-${mealType}`,
                          name: meal.name,
                          ingredients: meal.ingredients.map((ing: any) => ({
                            id: ing.name,
                            name: ing.name,
                            quantity: ing.quantity,
                            unit: ing.unit,
                            price: ing.price,
                            category: "Khác"
                          })),
                          estimatedCost: meal.ingredients.reduce((sum: number, ing: any) => sum + ing.price, 0)
                        }}
                        variant="outline"
                        size="sm"
                        showText={false}
                      />
                    </div>
                    
                    {/* Ingredients */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground">Nguyên liệu:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {meal.ingredients.map((ingredient: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm">{ingredient.name}</span>
                            <div className="text-right">
                              <span className="text-sm font-medium">{ingredient.quantity}{ingredient.unit}</span>
                              <span className="text-xs text-muted-foreground ml-2">{ingredient.price.toLocaleString()}₫</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Summary */}
          <div className="lg:col-span-1">
            <NutritionSummary menu={menu} />
          </div>
        </div>
      </main>
    </div>
  )
}
