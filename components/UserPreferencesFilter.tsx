"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  X, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2,
  Leaf,
  Utensils,
  ChefHat,
  Filter
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface UserPreferences {
  diet: string
  allergies: string[]
  dislikedIngredients: string[]
  dislikedDishes: string[]
  healthGoals: string[]
  budget: number
}

interface ConflictCheck {
  hasConflict: boolean
  conflicts: string[]
  suggestions: string[]
}

export function UserPreferencesFilter() {
  const { user, isAuthenticated } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>({
    diet: "vegetarian",
    allergies: [],
    dislikedIngredients: [],
    dislikedDishes: [],
    healthGoals: [],
    budget: 1000000
  })
  const [newIngredient, setNewIngredient] = useState("")
  const [newDish, setNewDish] = useState("")
  const [searchIngredient, setSearchIngredient] = useState("")
  const [searchDish, setSearchDish] = useState("")
  const [conflictCheck, setConflictCheck] = useState<ConflictCheck | null>(null)
  const [loading, setLoading] = useState(false)

  // Common ingredients and dishes for suggestions
  const commonIngredients = [
    "thịt bò", "thịt heo", "thịt gà", "cá", "tôm", "cua", "mực", "bạch tuộc",
    "trứng", "sữa", "phô mai", "bơ", "kem", "mật ong", "đường", "muối",
    "hành tây", "tỏi", "ớt", "cà chua", "khoai tây", "cà rốt", "bí đỏ",
    "nấm", "đậu phụ", "đậu nành", "đậu xanh", "đậu đỏ", "gạo", "mì",
    "bánh mì", "bún", "phở", "bánh canh", "hủ tiếu", "mì Quảng"
  ]

  const commonDishes = [
    "bún bò", "phở bò", "bún riêu", "bún chả", "bún mắm", "bún thịt nướng",
    "cơm tấm", "cơm sườn", "cơm gà", "cơm cá", "cơm tôm", "cơm thịt kho",
    "bánh mì thịt", "bánh mì pate", "bánh mì chả cá", "bánh mì xíu mại",
    "chả cá", "chả lụa", "chả bò", "chả heo", "nem nướng", "thịt nướng",
    "canh chua", "canh khổ qua", "canh bí đỏ", "canh rau muống",
    "gỏi cuốn", "gỏi đu đủ", "gỏi tôm thịt", "gỏi bò tái"
  ]

  useEffect(() => {
    if (isAuthenticated && user?.preferences) {
      setPreferences({
        diet: user.preferences.diet || "vegetarian",
        allergies: user.preferences.allergies || [],
        dislikedIngredients: user.preferences.dislikedIngredients || [],
        dislikedDishes: user.preferences.dislikedDishes || [],
        healthGoals: user.preferences.healthGoals || [],
        budget: user.preferences.budget || 1000000
      })
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    checkConflicts()
  }, [preferences])

  const checkConflicts = () => {
    const conflicts: string[] = []
    const suggestions: string[] = []

    // Check diet conflicts
    if (preferences.diet === "vegetarian" || preferences.diet === "vegan") {
      const meatIngredients = preferences.dislikedIngredients.filter(ingredient => 
        ["thịt bò", "thịt heo", "thịt gà", "cá", "tôm", "cua", "mực", "bạch tuộc"].includes(ingredient)
      )
      
      if (meatIngredients.length > 0) {
        conflicts.push(`Chế độ ăn ${preferences.diet} không phù hợp với việc loại bỏ các nguyên liệu: ${meatIngredients.join(", ")}`)
        suggestions.push("Các nguyên liệu này đã được loại bỏ tự động do chế độ ăn chay")
      }
    }

    // Check allergy conflicts
    const allergyConflicts = preferences.allergies.filter(allergy => 
      preferences.dislikedIngredients.includes(allergy)
    )
    
    if (allergyConflicts.length > 0) {
      conflicts.push(`Các nguyên liệu dị ứng đã được thêm vào danh sách loại bỏ: ${allergyConflicts.join(", ")}`)
    }

    // Check health goals conflicts
    if (preferences.healthGoals.includes("giảm cân") && preferences.dislikedIngredients.includes("đường")) {
      suggestions.push("Loại bỏ đường phù hợp với mục tiêu giảm cân")
    }

    if (preferences.healthGoals.includes("tăng cơ") && preferences.dislikedIngredients.includes("đậu phụ")) {
      conflicts.push("Đậu phụ là nguồn protein tốt cho mục tiêu tăng cơ")
      suggestions.push("Nên cân nhắc giữ lại đậu phụ trong chế độ ăn")
    }

    setConflictCheck({
      hasConflict: conflicts.length > 0,
      conflicts,
      suggestions
    })
  }

  const addDislikedIngredient = () => {
    if (newIngredient.trim() && !preferences.dislikedIngredients.includes(newIngredient.trim())) {
      setPreferences(prev => ({
        ...prev,
        dislikedIngredients: [...prev.dislikedIngredients, newIngredient.trim()]
      }))
      setNewIngredient("")
      toast.success(`Đã thêm "${newIngredient.trim()}" vào danh sách loại bỏ`)
    }
  }

  const addDislikedDish = () => {
    if (newDish.trim() && !preferences.dislikedDishes.includes(newDish.trim())) {
      setPreferences(prev => ({
        ...prev,
        dislikedDishes: [...prev.dislikedDishes, newDish.trim()]
      }))
      setNewDish("")
      toast.success(`Đã thêm "${newDish.trim()}" vào danh sách loại bỏ`)
    }
  }

  const removeDislikedIngredient = (ingredient: string) => {
    setPreferences(prev => ({
      ...prev,
      dislikedIngredients: prev.dislikedIngredients.filter(item => item !== ingredient)
    }))
    toast.success(`Đã xóa "${ingredient}" khỏi danh sách loại bỏ`)
  }

  const removeDislikedDish = (dish: string) => {
    setPreferences(prev => ({
      ...prev,
      dislikedDishes: prev.dislikedDishes.filter(item => item !== dish)
    }))
    toast.success(`Đã xóa "${dish}" khỏi danh sách loại bỏ`)
  }

  const savePreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        toast.success("Đã lưu tùy chọn lọc thành công!")
        // Update user context
        if (user) {
          user.preferences = { ...user.preferences, ...preferences }
        }
      } else {
        throw new Error('Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error("Lỗi khi lưu tùy chọn lọc")
    } finally {
      setLoading(false)
    }
  }

  const filteredIngredients = commonIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchIngredient.toLowerCase()) &&
    !preferences.dislikedIngredients.includes(ingredient)
  )

  const filteredDishes = commonDishes.filter(dish =>
    dish.toLowerCase().includes(searchDish.toLowerCase()) &&
    !preferences.dislikedDishes.includes(dish)
  )

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Tùy chọn lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cần đăng nhập</h3>
            <p className="text-muted-foreground mb-4">
              Vui lòng đăng nhập để sử dụng tính năng lọc nguyên liệu và món ăn
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Conflict Check Alert */}
      {conflictCheck && (conflictCheck.hasConflict || conflictCheck.suggestions.length > 0) && (
        <Alert className={conflictCheck.hasConflict ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              {conflictCheck.conflicts.map((conflict, index) => (
                <div key={index} className="text-orange-800">
                  ⚠️ {conflict}
                </div>
              ))}
              {conflictCheck.suggestions.map((suggestion, index) => (
                <div key={index} className="text-blue-800">
                  💡 {suggestion}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Disliked Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Nguyên liệu không mong muốn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new ingredient */}
          <div className="flex gap-2">
            <Input
              placeholder="Nhập nguyên liệu muốn loại bỏ..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDislikedIngredient()}
            />
            <Button onClick={addDislikedIngredient} disabled={!newIngredient.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search suggestions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gợi ý nguyên liệu phổ biến:</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nguyên liệu..."
                className="pl-10"
                value={searchIngredient}
                onChange={(e) => setSearchIngredient(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredIngredients.slice(0, 10).map((ingredient) => (
                <Button
                  key={ingredient}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewIngredient(ingredient)
                    addDislikedIngredient()
                  }}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {ingredient}
                </Button>
              ))}
            </div>
          </div>

          {/* Current disliked ingredients */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Đã loại bỏ ({preferences.dislikedIngredients.length}):
            </Label>
            <div className="flex flex-wrap gap-2">
              {preferences.dislikedIngredients.map((ingredient) => (
                <Badge key={ingredient} variant="destructive" className="gap-1">
                  {ingredient}
                  <button
                    onClick={() => removeDislikedIngredient(ingredient)}
                    className="ml-1 hover:bg-red-600 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disliked Dishes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Món ăn không mong muốn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new dish */}
          <div className="flex gap-2">
            <Input
              placeholder="Nhập món ăn muốn loại bỏ..."
              value={newDish}
              onChange={(e) => setNewDish(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDislikedDish()}
            />
            <Button onClick={addDislikedDish} disabled={!newDish.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search suggestions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gợi ý món ăn phổ biến:</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                className="pl-10"
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredDishes.slice(0, 10).map((dish) => (
                <Button
                  key={dish}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewDish(dish)
                    addDislikedDish()
                  }}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {dish}
                </Button>
              ))}
            </div>
          </div>

          {/* Current disliked dishes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Đã loại bỏ ({preferences.dislikedDishes.length}):
            </Label>
            <div className="flex flex-wrap gap-2">
              {preferences.dislikedDishes.map((dish) => (
                <Badge key={dish} variant="destructive" className="gap-1">
                  {dish}
                  <button
                    onClick={() => removeDislikedDish(dish)}
                    className="ml-1 hover:bg-red-600 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={loading} className="gap-2">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          Lưu tùy chọn lọc
        </Button>
      </div>
    </div>
  )
}
