"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Flame,
  TrendingUp,
  Leaf,
  ChefHat,
  CheckCircle2,
  ShoppingCart
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlobalSearch } from "@/components/GlobalSearch"
import { AppHeader } from "@/components/AppHeader"
import { ShareButton } from "@/components/ShareButton"
import MenuTemplates from "@/components/MenuTemplates"
import { QuickHideButton } from "@/components/HideButton"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { format, addDays } from "date-fns"
import { vi } from "date-fns/locale"
import { AddToShoppingDialog } from "@/components/AddToShoppingDialog"

export default function MenuPage() {
  const [applyingMenu, setApplyingMenu] = useState<any>(null)
  const [startDate, setStartDate] = useState(new Date())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [cartMenuIds, setCartMenuIds] = useState<string[]>([])

  const mealPlans = [
    {
      id: 1,
      name: "Thực đơn chay 7 ngày",
      description: "Kế hoạch ăn chay đầy đủ dinh dưỡng cho cả tuần",
      days: 7,
      totalMeals: 21,
      calories: "1,400-1,600 calo/ngày",
      image: "/healthy-salad-bowl-colorful-vegetables.jpg",
      tags: ["Chay", "Cân bằng", "Tiết kiệm"],
      schedule: [
        { day: 1, breakfast: "Cháo chay", lunch: "Cơm + 3 món", dinner: "Bún chay" },
        { day: 2, breakfast: "Bánh mì trứng", lunch: "Cơm + 3 món", dinner: "Phở chay" },
        { day: 3, breakfast: "Xôi chay", lunch: "Cơm + 3 món", dinner: "Mì xào" },
        { day: 4, breakfast: "Cháo chay", lunch: "Cơm + 3 món", dinner: "Bún riêu chay" },
        { day: 5, breakfast: "Bánh mì pate", lunch: "Cơm + 3 món", dinner: "Cơm chiên" },
        { day: 6, breakfast: "Phở chay", lunch: "Cơm + 3 món", dinner: "Lẩu chay" },
        { day: 7, breakfast: "Bánh cuốn", lunch: "Cơm + 3 món", dinner: "Canh + rau" },
      ],
    },
    {
      id: 2,
      name: "Thực đơn giảm cân",
      description: "Ăn ngon mà vẫn giữ dáng hiệu quả",
      days: 14,
      totalMeals: 42,
      calories: "1,200-1,400 calo/ngày",
      image: "/grilled-chicken-rice-asian-meal.jpg",
      tags: ["Giảm cân", "Protein cao", "Ít carbs"],
      schedule: [
        { day: 1, breakfast: "Smoothie xanh", lunch: "Salad gà", dinner: "Súp rau" },
        { day: 2, breakfast: "Yến mạch", lunch: "Cơm gạo lứt + cá", dinner: "Canh nấm" },
        { day: 3, breakfast: "Trứng luộc", lunch: "Ức gà + rau", dinner: "Đậu hũ hấp" },
        { day: 4, breakfast: "Sữa chua", lunch: "Bún cá", dinner: "Salad" },
        { day: 5, breakfast: "Bánh mì nguyên cám", lunch: "Cơm + thịt nạc", dinner: "Canh chua" },
        { day: 6, breakfast: "Cháo yến mạch", lunch: "Gà luộc", dinner: "Rau luộc" },
        { day: 7, breakfast: "Trứng ốp", lunch: "Cơm + cá", dinner: "Canh rau" },
      ],
    },
    {
      id: 3,
      name: "Thực đơn gia đình",
      description: "Bữa cơm sum vầy cho cả nhà",
      days: 7,
      totalMeals: 21,
      calories: "1,800-2,200 calo/ngày",
      image: "/vietnamese-pho-bowl-steaming-fresh-herbs.jpg",
      tags: ["Gia đình", "Đa dạng", "Truyền thống"],
      schedule: [
        { day: 1, breakfast: "Cháo thịt bằm", lunch: "Cơm + 3 món", dinner: "Bún chả" },
        { day: 2, breakfast: "Bánh mì thịt", lunch: "Cơm + 3 món", dinner: "Phở bò" },
        { day: 3, breakfast: "Xôi gà", lunch: "Cơm + 3 món", dinner: "Mì xào hải sản" },
        { day: 4, breakfast: "Bún bò", lunch: "Cơm + 3 món", dinner: "Bún riêu" },
        { day: 5, breakfast: "Bánh cuốn", lunch: "Cơm + 3 món", dinner: "Cơm chiên dương châu" },
        { day: 6, breakfast: "Phở gà", lunch: "Cơm + 3 món", dinner: "Lẩu" },
        { day: 7, breakfast: "Bánh mì pate", lunch: "Cơm + 3 món", dinner: "Bún đậu mắm tôm" },
      ],
    },
  ]

  const handleApplyMenu = (menu: any) => {
    // Lưu thực đơn vào localStorage
    const appliedMenu = {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      startDate: startDate.toISOString(),
      days: menu.days,
      schedule: menu.schedule,
      appliedAt: new Date().toISOString()
    }
    
    localStorage.setItem("angi-active-menu", JSON.stringify(appliedMenu))
    
    // Auto-generate shopping list from menu
    generateShoppingListFromMenu(menu)
    
    toast.success(`✅ Đã áp dụng: ${menu.name}`, {
      description: `Bắt đầu từ ${format(startDate, "dd/MM/yyyy", { locale: vi })}`,
      duration: 4000,
      action: {
        label: "Xem trang chủ",
        onClick: () => window.location.href = "/"
      }
    })
    
    setApplyingMenu(null)
  }

  const generateShoppingListFromMenu = (menu: any) => {
    try {
      // Get existing shopping list
      const saved = localStorage.getItem("angi-shopping-list")
      const existingList = saved ? JSON.parse(saved) : []
      
      // Create a comprehensive shopping list from menu
      const menuShoppingList = {
        id: Date.now(),
        name: `Thực đơn: ${menu.name}`,
        quantity: "1",
        price: 0,
        category: "Khác",
        checked: false,
        note: `Từ thực đơn ${menu.name}`,
        sourceMenuId: String(menu.id),
        isMenuPlan: true
      }
      
      // Add menu plan to shopping list
      existingList.push(menuShoppingList)
      
      // Add individual meals as separate items for easy tracking
      menu.schedule.forEach((day: any, dayIndex: number) => {
        Object.entries(day.meals).forEach(([mealType, mealName]: [string, any]) => {
          existingList.push({
            id: Date.now() + dayIndex + Math.random(),
            name: `${mealName} (${day.date})`,
            quantity: "1",
            price: 0,
            category: "Khác",
            checked: false,
            note: `Bữa ${mealType === 'breakfast' ? 'sáng' : mealType === 'lunch' ? 'trưa' : 'tối'} - Ngày ${dayIndex + 1}`,
            sourceMenuId: String(menu.id),
            sourceDay: dayIndex + 1,
            sourceMealType: mealType
          })
        })
      })
      
      localStorage.setItem("angi-shopping-list", JSON.stringify(existingList))
      
      toast.success("📝 Đã tạo danh sách mua sắm từ thực đơn", {
        description: `${menu.schedule.length * 3} bữa ăn đã được thêm vào giỏ`,
        duration: 3000
      })
      
    } catch (error) {
      console.error("Error generating shopping list:", error)
      toast.error("Không thể tạo danh sách mua sắm")
    }
  }

  // Load items from localStorage shopping list to determine if menu already referenced
  useEffect(() => {
    try {
      const saved = localStorage.getItem("angi-shopping-list")
      if (!saved) return
      const items = JSON.parse(saved) as Array<any>
      const ids = (items || [])
        .map((i: any) => i.sourceMenuId)
        .filter(Boolean)
      setCartMenuIds(Array.from(new Set(ids)))
    } catch {}
  }, [])

  const handleAddToCart = (menu: any) => {
    try {
      const saved = localStorage.getItem("angi-shopping-list")
      const list = saved ? JSON.parse(saved) : []
      const already = list.some((i: any) => i.sourceMenuId === String(menu.id))
      if (already) {
        toast.info("Thực đơn đã có trong giỏ", {
          description: "Bạn có muốn tăng số lượng hoặc chỉnh sửa trong trang Đi chợ?"
        })
        return
      }
      // Just mark a lightweight entry as a reminder; actual ingredients are picked in dialog
      list.push({
        id: Date.now(),
        name: `Thực đơn: ${menu.name}`,
        quantity: "1",
        price: 0,
        category: "Khác",
        checked: false,
        note: "Từ thực đơn",
        sourceMenuId: String(menu.id)
      })
      localStorage.setItem("angi-shopping-list", JSON.stringify(list))
      setCartMenuIds((prev) => Array.from(new Set([...prev, String(menu.id)])))
      toast.success("Đã thêm thực đơn vào giỏ")
    } catch {
      toast.error("Không thể cập nhật giỏ")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">📋 Thực đơn</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kế hoạch bữa ăn cho từng mục tiêu</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-5 text-center">
              <div className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="text-xl md:text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Thực đơn</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-5 text-center">
              <div className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center">
                <ChefHat className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="text-xl md:text-2xl font-bold">84</p>
              <p className="text-xs text-muted-foreground">Bữa ăn</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-5 text-center">
              <div className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="text-xl md:text-2xl font-bold">92%</p>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </CardContent>
          </Card>
        </div>

        {/* Saved Templates */}
        <div className="mb-8">
          <MenuTemplates onApply={(menu) => handleApplyMenu(menu)} />
        </div>

        {/* Meal Plans */}
        <div className="space-y-4">
          {mealPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-transparent" />
                    {/* Quick hide in corner */}
                    <div className="absolute top-3 right-3 z-10">
                      <QuickHideButton
                        itemId={plan.id}
                        itemName={plan.name}
                        itemType="meal"
                        itemImage={plan.image}
                        className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white shadow"
                      />
                    </div>
                  </div>
                  <CardContent className="flex-1 p-5 md:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {plan.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag === "Chay" && <Leaf className="h-3 w-3 mr-1" />}
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Thời gian</p>
                        <p className="font-bold text-sm">{plan.days} ngày</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Bữa ăn</p>
                        <p className="font-bold text-sm">{plan.meals} món</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Calo/ngày</p>
                        <p className="font-bold text-sm flex items-center justify-center gap-1">
                          <Flame className="h-3 w-3" />
                          {plan.calories.split("-")[0]}
                        </p>
                      </div>
                    </div>
                  <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                    {/* Primary actions */}
                    <Button 
                      className="h-10 px-4"
                      size="sm"
                      onClick={() => setApplyingMenu(plan)}
                    >
                      <ChefHat className="h-4 w-4 mr-2" />
                      Áp dụng
                    </Button>
                    <Button 
                      variant={cartMenuIds.includes(String(plan.id)) ? "secondary" : "outline"}
                      size="sm" 
                      className="h-10 px-4 gap-2"
                      onClick={() => handleAddToCart(plan)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="hidden md:inline">
                        {cartMenuIds.includes(String(plan.id)) ? "Đã có" : "Giỏ"}
                      </span>
                    </Button>

                    {/* Secondary actions */}
                    <ShareButton
                      content={{
                        title: plan.name,
                        description: plan.description,
                        type: 'menu',
                        data: {
                          days: plan.days,
                          totalMeals: plan.totalMeals,
                          calories: plan.calories,
                          tags: plan.tags,
                          schedule: plan.schedule,
                          mainDishes: plan.schedule.map(day => day.lunch),
                          sideDishes: plan.schedule.map(day => day.breakfast),
                          totalCalories: plan.calories
                        }
                      }}
                      size="sm"
                      variant="outline"
                    />
                    <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 px-4 whitespace-nowrap"
                      onClick={() => window.location.href = `/menu/${plan.id}`}
                    >
                      Chi tiết
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-10 px-4 whitespace-nowrap"
                      onClick={() => setApplyingMenu(plan)}
                    >
                      Áp dụng
                    </Button>
                    </div>
                  </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
  <AddToShoppingDialog
    open={showAddDialog}
    onOpenChange={setShowAddDialog}
    onAddIngredients={() => setShowAddDialog(false)}
  />

      {/* Apply Menu Sheet */}
      <Sheet open={applyingMenu !== null} onOpenChange={(open) => !open && setApplyingMenu(null)}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh]">
          {applyingMenu && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl font-bold mb-2">Áp dụng thực đơn</SheetTitle>
                <p className="text-sm text-muted-foreground">{applyingMenu.name}</p>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                {/* Menu Preview */}
                <Card className="border-0 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={applyingMenu.image} alt={applyingMenu.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base mb-1">{applyingMenu.name}</p>
                        <p className="text-xs text-muted-foreground">{applyingMenu.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-xs text-muted-foreground">Thời gian</p>
                        <p className="font-bold text-sm">{applyingMenu.days} ngày</p>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-xs text-muted-foreground">Bữa ăn</p>
                        <p className="font-bold text-sm">{applyingMenu.totalMeals || 21}</p>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-xs text-muted-foreground">Calo/ngày</p>
                        <p className="font-bold text-sm">{applyingMenu.calories.split("-")[0]}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chọn ngày bắt đầu */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">📅 Chọn ngày bắt đầu</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                      const date = addDays(new Date(), offset)
                      const isSelected = format(date, "yyyy-MM-dd") === format(startDate, "yyyy-MM-dd")
                      return (
                        <Button
                          key={offset}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="h-auto py-2 flex-col"
                          onClick={() => setStartDate(date)}
                        >
                          <p className="text-[10px] opacity-70">
                            {format(date, "EEEE", { locale: vi })}
                          </p>
                          <p className="text-base font-bold">
                            {format(date, "dd")}
                          </p>
                          <p className="text-[10px] opacity-70">
                            Tháng {format(date, "M")}
                          </p>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Preview lịch trình */}
                <div>
                  <p className="text-sm font-semibold mb-3">📋 Lịch trình {applyingMenu.days} ngày</p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {Array.isArray(applyingMenu.schedule) && applyingMenu.schedule.map((meal: any, index: number) => {
                      const dayDate = addDays(startDate, index)
                      return (
                        <Card key={index} className="border-0 bg-muted/30">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-sm">
                                Ngày {meal.day} - {format(dayDate, "dd/MM (EEEE)", { locale: vi })}
                              </p>
                              <Badge variant="secondary" className="text-[10px]">
                                3 bữa
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground mb-0.5">Sáng</p>
                                <p className="font-medium">{meal.breakfast}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-0.5">Trưa</p>
                                <p className="font-medium">{meal.lunch}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-0.5">Tối</p>
                                <p className="font-medium">{meal.dinner}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="space-y-2">
                  <Button 
                    className="w-full h-12" 
                    size="lg"
                    onClick={() => handleApplyMenu(applyingMenu)}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Xác nhận áp dụng thực đơn
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    💡 Thực đơn sẽ được hiển thị trên trang chủ và tự động gợi ý món ăn
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

