"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  ChefHat,
  Calendar,
  Utensils,
  Star,
  Clock,
  Users,
  Search,
  Plus,
  CheckCircle2,
  Sparkles,
  Flame
} from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/currency"
import { useAuth } from "@/contexts/AuthContext"

interface Dish {
  id: string
  nameVi: string
  imageUrl?: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  calories: number
  estimatedCost: number
  ratingAvg: number
  isVegetarian: boolean
  dishIngredients: {
    ingredientId: string
    quantity: number
    unit: string
    ingredient: {
      id: string
      nameVi: string
      pricePerUnit?: number
    }
  }[]
}

interface Menu {
  id: string
  name: string
  description: string
  duration: number
  totalCost: number
  rating: number
  mealCount: number
  caloriesPerDay: number
}

interface WeeklyPlan {
  id: string
  name: string
  startDate: string
  endDate: string
  meals: {
    dishId: string
    dish: Dish
  }[]
}

interface AddToShoppingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddIngredients: (ingredients: {
    name: string
    quantity: string
    price: number
    category: string
    note: string
  }[]) => void
}

export function AddToShoppingDialog({ open, onOpenChange, onAddIngredients }: AddToShoppingDialogProps) {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("recipes")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Data states
  const [dishes, setDishes] = useState<Dish[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null)
  
  // Selection states
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set())
  const [selectedMenus, setSelectedMenus] = useState<Set<string>>(new Set())
  const [useWeeklyPlan, setUseWeeklyPlan] = useState(false)
  
  // Loading states
  const [loading, setLoading] = useState(false)

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchDishes()
      fetchMenus()
      if (isAuthenticated) {
        fetchWeeklyPlan()
      }
    }
  }, [open, isAuthenticated])

  const fetchDishes = async () => {
    try {
      const response = await fetch('/api/dishes?limit=20')
      if (response.ok) {
        const data = await response.json()
        setDishes(data.dishes || [])
      }
    } catch (error) {
      console.error('Error fetching dishes:', error)
      toast.error("Không thể tải danh sách món ăn")
    }
  }

  const fetchMenus = async () => {
    // Mock menus for now
    setMenus([
      {
        id: "menu-1",
        name: "Thực đơn chay 7 ngày",
        description: "Thực đơn cân bằng cho cả tuần",
        duration: 7,
        totalCost: 350000,
        rating: 4.8,
        mealCount: 21,
        caloriesPerDay: 1400
      },
      {
        id: "menu-5",
        name: "Thực đơn healthy",
        description: "Thực đơn lành mạnh, ít dầu mỡ",
        duration: 5,
        totalCost: 280000,
        rating: 4.9,
        mealCount: 15,
        caloriesPerDay: 1500
      }
    ])
  }

  const fetchWeeklyPlan = async () => {
    try {
      const response = await fetch('/api/weekly-plan')
      if (response.ok) {
        const data = await response.json()
        if (data.appliedPlan) {
          setWeeklyPlan(data.appliedPlan)
          // Auto-select weekly plan if it exists
          setUseWeeklyPlan(true)
          setActiveTab("weekly-plan")
        }
      }
    } catch (error) {
      console.error('Error fetching weekly plan:', error)
    }
  }

  const toggleDish = (dishId: string) => {
    setSelectedDishes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dishId)) {
        newSet.delete(dishId)
      } else {
        newSet.add(dishId)
      }
      return newSet
    })
  }

  const toggleMenu = (menuId: string) => {
    setSelectedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }

  const getCategoryFromIngredient = (ingredientName: string): string => {
    const name = ingredientName.toLowerCase()
    if (name.includes('đậu') || name.includes('nấm') || name.includes('hũ')) return 'Đạm'
    if (name.includes('rau') || name.includes('củ') || name.includes('cà') || name.includes('bí')) return 'Rau củ'
    if (name.includes('dầu') || name.includes('tỏi') || name.includes('hành') || name.includes('muối') || name.includes('nước mắm')) return 'Gia vị'
    if (name.includes('gạo') || name.includes('bún') || name.includes('phở') || name.includes('bánh')) return 'Tinh bột'
    return 'Khác'
  }

  const handleAddToShoppingList = () => {
    const ingredientsToAdd: {
      name: string
      quantity: string
      price: number
      category: string
      note: string
    }[] = []

    // Aggregate ingredients from selected sources
    const ingredientMap = new Map<string, {
      quantity: number
      unit: string
      price: number
      sources: string[]
    }>()

    // Add from weekly plan
    if (useWeeklyPlan && weeklyPlan) {
      weeklyPlan.meals.forEach(meal => {
        meal.dish.dishIngredients.forEach(ing => {
          const key = ing.ingredient.nameVi
          const existing = ingredientMap.get(key)
          if (existing) {
            existing.quantity += ing.quantity
            existing.sources.push(weeklyPlan.name)
          } else {
            ingredientMap.set(key, {
              quantity: ing.quantity,
              unit: ing.unit,
              price: ing.ingredient.pricePerUnit || 0,
              sources: [weeklyPlan.name]
            })
          }
        })
      })
    }

    // Add from selected dishes
    selectedDishes.forEach(dishId => {
      const dish = dishes.find(d => d.id === dishId)
      if (dish) {
        dish.dishIngredients.forEach(ing => {
          const key = ing.ingredient.nameVi
          const existing = ingredientMap.get(key)
          if (existing) {
            existing.quantity += ing.quantity
            existing.sources.push(dish.nameVi)
          } else {
            ingredientMap.set(key, {
              quantity: ing.quantity,
              unit: ing.unit,
              price: ing.ingredient.pricePerUnit || 0,
              sources: [dish.nameVi]
            })
          }
        })
      }
    })

    // Convert map to array
    ingredientMap.forEach((value, name) => {
      ingredientsToAdd.push({
        name,
        quantity: `${value.quantity}${value.unit}`,
        price: value.price * value.quantity,
        category: getCategoryFromIngredient(name),
        note: value.sources.length > 1 
          ? `Cho ${value.sources.length} món` 
          : `Cho ${value.sources[0]}`
      })
    })

    if (ingredientsToAdd.length === 0) {
      toast.warning("⚠️ Chưa chọn nguồn nào", {
        description: "Hãy chọn ít nhất một công thức, thực đơn hoặc kế hoạch tuần"
      })
      return
    }

    onAddIngredients(ingredientsToAdd)
    
    const totalCount = ingredientsToAdd.length
    const totalPrice = ingredientsToAdd.reduce((sum, ing) => sum + ing.price, 0)
    
    toast.success(`✅ Đã thêm ${totalCount} nguyên liệu`, {
      description: `Tổng: ${formatCurrency(totalPrice)}`,
      duration: 3000
    })

    // Reset and close
    setSelectedDishes(new Set())
    setSelectedMenus(new Set())
    setUseWeeklyPlan(false)
    onOpenChange(false)
  }

  const filteredDishes = dishes.filter(dish =>
    dish.nameVi.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSelected = selectedDishes.size + selectedMenus.size + (useWeeklyPlan ? 1 : 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Thêm nguyên liệu từ...
          </DialogTitle>
          <DialogDescription>
            Chọn công thức, thực đơn hoặc kế hoạch tuần để tự động thêm nguyên liệu vào danh sách mua sắm
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recipes" className="gap-2">
              <ChefHat className="h-4 w-4" />
              Công thức
              {selectedDishes.size > 0 && (
                <Badge variant="secondary" className="ml-1">{selectedDishes.size}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="menus" className="gap-2">
              <Utensils className="h-4 w-4" />
              Thực đơn
              {selectedMenus.size > 0 && (
                <Badge variant="secondary" className="ml-1">{selectedMenus.size}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="weekly-plan" className="gap-2 relative">
              <Calendar className="h-4 w-4" />
              Kế hoạch tuần
              {weeklyPlan && useWeeklyPlan && (
                <Badge variant="secondary" className="ml-1">
                  <Sparkles className="h-3 w-3" />
                </Badge>
              )}
              {weeklyPlan && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>

          {/* Recipes Tab */}
          <TabsContent value="recipes" className="flex-1 overflow-y-auto mt-4 space-y-3">
            <div className="sticky top-0 bg-background z-10 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm công thức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDishes.map(dish => (
                <Card
                  key={dish.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedDishes.has(dish.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleDish(dish.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedDishes.has(dish.id)}
                        onCheckedChange={() => toggleDish(dish.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h4 className="font-semibold text-sm flex-1">{dish.nameVi}</h4>
                          {dish.isVegetarian && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Chay</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {dish.prepTimeMinutes + dish.cookTimeMinutes}p
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            {dish.calories} calo
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {dish.ratingAvg.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">
                            {dish.dishIngredients.length} nguyên liệu
                          </Badge>
                          <span className="text-sm font-bold">{formatCurrency(dish.estimatedCost)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDishes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ChefHat className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Không tìm thấy công thức nào</p>
              </div>
            )}
          </TabsContent>

          {/* Menus Tab */}
          <TabsContent value="menus" className="flex-1 overflow-y-auto mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {menus.map(menu => (
                <Card
                  key={menu.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedMenus.has(menu.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleMenu(menu.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedMenus.has(menu.id)}
                        onCheckedChange={() => toggleMenu(menu.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-base mb-1">{menu.name}</h4>
                            <p className="text-sm text-muted-foreground">{menu.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {menu.rating}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {menu.duration} ngày
                          </div>
                          <div className="flex items-center gap-1">
                            <Utensils className="h-3 w-3" />
                            {menu.mealCount} bữa
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            {menu.caloriesPerDay} calo/ngày
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-foreground">
                            {formatCurrency(menu.totalCost)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {menus.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Utensils className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có thực đơn nào</p>
              </div>
            )}
          </TabsContent>

          {/* Weekly Plan Tab */}
          <TabsContent value="weekly-plan" className="flex-1 overflow-y-auto mt-4">
            {!isAuthenticated ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">Vui lòng đăng nhập để sử dụng kế hoạch tuần</p>
                <Button size="sm" variant="outline">Đăng nhập</Button>
              </div>
            ) : !weeklyPlan ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">Chưa có kế hoạch tuần nào đang áp dụng</p>
                <Button size="sm" variant="outline" asChild>
                  <a href="/weekly-plan">Tạo kế hoạch tuần</a>
                </Button>
              </div>
            ) : (
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  useWeeklyPlan ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setUseWeeklyPlan(!useWeeklyPlan)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={useWeeklyPlan}
                      onCheckedChange={setUseWeeklyPlan}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg">{weeklyPlan.name}</h4>
                            <Badge className="gap-1">
                              <Sparkles className="h-3 w-3" />
                              Đang áp dụng
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {weeklyPlan.startDate} - {weeklyPlan.endDate}
                          </p>
                        </div>
                        {useWeeklyPlan && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Utensils className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Bữa ăn</span>
                          </div>
                          <p className="font-bold">{weeklyPlan.meals.length} bữa</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <ChefHat className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Nguyên liệu</span>
                          </div>
                          <p className="font-bold">
                            {new Set(weeklyPlan.meals.flatMap(m => m.dish.dishIngredients.map(i => i.ingredient.nameVi))).size} loại
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg col-span-2 md:col-span-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Ưu tiên</span>
                          </div>
                          <p className="font-bold text-primary">Được đề xuất</p>
                        </div>
                      </div>
                      {useWeeklyPlan && (
                        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-xs text-primary font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Kế hoạch tuần này sẽ được ưu tiên thêm vào danh sách mua sắm
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="border-t pt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              Đã chọn: <span className="text-primary font-bold">{totalSelected}</span> nguồn
            </p>
            {totalSelected > 0 && (
              <p className="text-xs text-muted-foreground">
                Nguyên liệu trùng lặp sẽ được gom tự động
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleAddToShoppingList}
              disabled={totalSelected === 0}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm vào danh sách
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

