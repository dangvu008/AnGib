"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Flame,
  ChefHat,
  Settings,
  Target,
  ShoppingCart,
  Share2,
  ArrowLeft,
  Users,
  Star
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { AppHeader } from "@/components/AppHeader"
import { MenuCustomizer } from "@/components/MenuCustomizer"
import { MealPrepPlanner } from "@/components/MealPrepPlanner"
import { NutritionalAnalysis } from "@/components/NutritionalAnalysis"
import { NutritionSummary } from "@/components/NutritionSummary"
import { AddDishToShoppingButton } from "@/components/AddDishToShoppingButton"
import { ShareButton } from "@/components/ShareButton"
import { useParams } from "next/navigation"

// Mock database for menu details
const menuDatabase: any = {
  "1": {
    id: 1,
    name: "Thực đơn cân bằng 7 ngày",
    description: "Thực đơn đầy đủ dinh dưỡng với các món ăn đa dạng",
    days: 7,
    servings: 2,
    prepTime: 30,
    difficulty: "medium",
    calories: 1800,
    nutrition: {
      protein: "120g",
      carbs: "200g", 
      fat: "60g",
      fiber: "25g"
    },
    schedule: [
      {
        day: 1,
        date: "Thứ 2",
        meals: {
          breakfast: {
            name: "Cháo yến mạch",
            description: "Cháo yến mạch với chuối và mật ong",
            prepTime: "10 phút",
            calories: 300,
            ingredients: [
              { name: "Yến mạch", quantity: 50, unit: "g", price: 15000 },
              { name: "Chuối", quantity: 1, unit: "quả", price: 5000 },
              { name: "Mật ong", quantity: 1, unit: "thìa", price: 3000 }
            ]
          },
          lunch: {
            name: "Cơm gà nướng",
            description: "Cơm trắng với gà nướng và rau củ",
            prepTime: "25 phút",
            calories: 500,
            ingredients: [
              { name: "Gà", quantity: 150, unit: "g", price: 25000 },
              { name: "Gạo", quantity: 100, unit: "g", price: 8000 },
              { name: "Cà rốt", quantity: 50, unit: "g", price: 5000 }
            ]
          },
          dinner: {
            name: "Canh chua cá",
            description: "Canh chua cá với cà chua và dứa",
            prepTime: "20 phút",
            calories: 400,
            ingredients: [
              { name: "Cá", quantity: 100, unit: "g", price: 20000 },
              { name: "Cà chua", quantity: 2, unit: "quả", price: 6000 },
              { name: "Dứa", quantity: 50, unit: "g", price: 4000 }
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
            description: "Bánh mì sandwich với trứng và rau",
            prepTime: "15 phút",
            calories: 350,
            ingredients: [
              { name: "Bánh mì", quantity: 2, unit: "lát", price: 8000 },
              { name: "Trứng", quantity: 2, unit: "quả", price: 6000 },
              { name: "Rau xà lách", quantity: 30, unit: "g", price: 3000 }
            ]
          },
          lunch: {
            name: "Phở bò",
            description: "Phở bò truyền thống",
            prepTime: "30 phút",
            calories: 450,
            ingredients: [
              { name: "Bánh phở", quantity: 200, unit: "g", price: 12000 },
              { name: "Thịt bò", quantity: 100, unit: "g", price: 30000 },
              { name: "Hành tây", quantity: 30, unit: "g", price: 2000 }
            ]
          },
          dinner: {
            name: "Salad cá ngừ",
            description: "Salad cá ngừ với rau củ tươi",
            prepTime: "15 phút",
            calories: 300,
            ingredients: [
              { name: "Cá ngừ", quantity: 80, unit: "g", price: 25000 },
              { name: "Rau xà lách", quantity: 50, unit: "g", price: 5000 },
              { name: "Cà chua", quantity: 1, unit: "quả", price: 3000 }
            ]
          }
        }
      }
    ]
  }
}

export default function MenuDetailPage() {
  const params = useParams()
  const menuId = params.id as string
  const menu = menuDatabase[menuId]
  const [selectedDay, setSelectedDay] = useState(0)
  const [isPlanInCart, setIsPlanInCart] = useState(false)
  const [activeTab, setActiveTab] = useState("schedule")

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
      const existingList = saved ? JSON.parse(saved) : []
      
      const menuShoppingList = {
        id: Date.now(),
        name: `Thực đơn: ${menu.name}`,
        quantity: "1",
        price: 0,
        category: "Khác",
        checked: false,
        note: `Từ thực đơn ${menu.name}`,
        sourceMenuId: menuId,
        isMenuPlan: true
      }
      
      existingList.push(menuShoppingList)
      localStorage.setItem("angi-shopping-list", JSON.stringify(existingList))
      
      setIsPlanInCart(true)
      toast.success("✅ Đã thêm thực đơn vào giỏ hàng")
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng")
    }
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Không tìm thấy thực đơn</h1>
              <p className="text-muted-foreground mb-6">
                Thực đơn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
              <Link href="/menu">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại danh sách
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const currentDay = menu.schedule[selectedDay]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/menu">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{menu.name}</h1>
              <p className="text-muted-foreground mb-4">{menu.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {menu.days} ngày
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {menu.servings} người
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {menu.prepTime} phút/ngày
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  {menu.calories} calo/ngày
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                className="gap-2"
                variant={isPlanInCart ? "outline" : "default"}
              >
                <ShoppingCart className="h-4 w-4" />
                {isPlanInCart ? "Đã có trong giỏ" : "Thêm vào giỏ"}
              </Button>
              
              <ShareButton
                content={{
                  title: menu.name,
                  description: menu.description,
                  type: 'menu',
                  data: {
                    days: menu.days,
                    totalMeals: menu.schedule.reduce((sum: number, day: any) => sum + Object.keys(day.meals).length, 0),
                    calories: menu.calories,
                    schedule: menu.schedule
                  }
                }}
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2 border-b">
            {[
              { id: "schedule", label: "Lịch trình", icon: Calendar },
              { id: "nutrition", label: "Dinh dưỡng", icon: Target },
              { id: "prep", label: "Chuẩn bị", icon: ChefHat },
              { id: "customize", label: "Tùy chỉnh", icon: Settings }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "schedule" && (
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
                <CardContent>
                  <div className="space-y-2">
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
                  </div>
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
        )}

        {activeTab === "nutrition" && (
          <NutritionalAnalysis appliedMenu={menu} />
        )}

        {activeTab === "prep" && (
          <MealPrepPlanner appliedMenu={menu} />
        )}

        {activeTab === "customize" && (
          <MenuCustomizer 
            menu={menu}
            onSave={(customizedMenu) => {
              toast.success("✅ Đã lưu tùy chỉnh thực đơn")
            }}
            onCancel={() => {}}
          />
        )}
      </main>
    </div>
  )
}