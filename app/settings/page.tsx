"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Leaf,
  Clock,
  Bell,
  DollarSign,
  User,
  Shield,
  ChefHat,
  Save,
  Trash2
} from "lucide-react"
import { AppHeader } from "@/components/AppHeader"
import { HiddenItemsManager } from "@/components/HiddenItemsManager"
import { UserPreferencesFilter } from "@/components/UserPreferencesFilter"
import { formatCurrency } from "@/lib/currency"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface UserSettings {
  // Dietary preferences
  dietaryType: string[]
  allergies: string[]
  
  // Meal times
  breakfastTime: string
  lunchTime: string
  dinnerTime: string
  
  // Notifications
  mealReminders: boolean
  shoppingReminders: boolean
  weeklyReport: boolean
  
  // Budget
  weeklyBudget: number
  
  // Personal
  name: string
  servings: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    dietaryType: ["vegetarian-egg-milk"],
    allergies: ["gluten"],
    breakfastTime: "07:00",
    lunchTime: "12:30",
    dinnerTime: "18:30",
    mealReminders: true,
    shoppingReminders: true,
    weeklyReport: true,
    weeklyBudget: 1200000,
    name: "Anh Tuấn",
    servings: 2,
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("angi-user-settings")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
        toast.success("Đã tải cài đặt của bạn")
      } catch (e) {
        console.error("Failed to load settings", e)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("angi-user-settings", JSON.stringify(settings))
    setHasChanges(false)
    toast.success("✅ Đã lưu cài đặt!", {
      description: "Thay đổi sẽ áp dụng ngay",
      duration: 3000
    })
  }

  const handleReset = () => {
    localStorage.removeItem("angi-user-settings")
    window.location.reload()
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const toggleDietaryType = (type: string) => {
    setSettings(prev => ({
      ...prev,
      dietaryType: prev.dietaryType.includes(type)
        ? prev.dietaryType.filter(t => t !== type)
        : [...prev.dietaryType, type]
    }))
    setHasChanges(true)
  }

  const toggleAllergy = (allergy: string) => {
    setSettings(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }))
    setHasChanges(true)
  }

  const dietaryCategories = {
    vegetarian: {
      title: "🌱 Chế độ ăn chay",
      options: [
        { id: "vegetarian-egg-milk", label: "Ăn chay có trứng sữa", desc: "Lacto-ovo vegetarian", icon: "🥚" },
        { id: "vegetarian-strict", label: "Ăn chay thuần túy", desc: "Không trứng, sữa", icon: "🌱" },
        { id: "vegan", label: "Vegan", desc: "Không sản phẩm từ động vật", icon: "🥬" },
        { id: "plant-based", label: "Plant-based", desc: "Chủ yếu thực vật", icon: "🌿" },
      ]
    },
    religious: {
      title: "🕌 Chế độ ăn tôn giáo",
      options: [
        { id: "halal", label: "Halal", desc: "Theo giáo lý Hồi giáo", icon: "☪️" },
        { id: "kosher", label: "Kosher", desc: "Theo giáo lý Do Thái", icon: "✡️" },
        { id: "hindu", label: "Hindu Vegetarian", desc: "Chay theo Ấn Độ giáo", icon: "🕉️" },
        { id: "jain", label: "Jain", desc: "Không hành, tỏi, củ", icon: "☸️" },
        { id: "buddhist", label: "Buddhist Vegetarian", desc: "Chay theo Phật giáo", icon: "☸️" },
      ]
    },
    health: {
      title: "💪 Chế độ ăn sức khỏe",
      options: [
        { id: "keto", label: "Keto", desc: "Ít carbs, nhiều chất béo", icon: "🥑" },
        { id: "paleo", label: "Paleo", desc: "Nguyên thủy, tự nhiên", icon: "🦴" },
        { id: "low-carb", label: "Low-carb", desc: "Giảm tinh bột", icon: "🥗" },
        { id: "low-fat", label: "Low-fat", desc: "Ít chất béo", icon: "🍎" },
        { id: "diabetic", label: "Diabetic-friendly", desc: "Cho người tiểu đường", icon: "💉" },
        { id: "heart-healthy", label: "Heart-healthy", desc: "Tốt cho tim mạch", icon: "❤️" },
      ]
    },
    lifestyle: {
      title: "🎯 Mục tiêu & Lifestyle",
      options: [
        { id: "weight-loss", label: "Giảm cân", desc: "Calorie deficit", icon: "📉" },
        { id: "muscle-gain", label: "Tăng cơ", desc: "Protein cao", icon: "💪" },
        { id: "mediterranean", label: "Mediterranean", desc: "Địa Trung Hải", icon: "🫒" },
        { id: "dash", label: "DASH Diet", desc: "Kiểm soát huyết áp", icon: "🩺" },
        { id: "raw-food", label: "Raw Food", desc: "Thực phẩm sống", icon: "🥒" },
      ]
    },
    other: {
      title: "🍽️ Khác",
      options: [
        { id: "pescatarian", label: "Pescatarian", desc: "Chay + cá/hải sản", icon: "🐟" },
        { id: "flexitarian", label: "Flexitarian", desc: "Linh hoạt chay/mặn", icon: "🔄" },
        { id: "whole30", label: "Whole30", desc: "30 ngày clean eating", icon: "📅" },
        { id: "omnivore", label: "Ăn tất cả", desc: "Không hạn chế", icon: "🍽️" },
      ]
    }
  }

  const allergyOptions = [
    { id: "gluten", label: "Gluten (Lúa mì)", icon: "🌾" },
    { id: "dairy", label: "Sữa", icon: "🥛" },
    { id: "nuts", label: "Hạt", icon: "🥜" },
    { id: "seafood", label: "Hải sản", icon: "🦐" },
    { id: "eggs", label: "Trứng", icon: "🥚" },
    { id: "soy", label: "Đậu nành", icon: "🫘" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">⚙️ Cài đặt</h1>
          <p className="text-muted-foreground">Tùy chỉnh trải nghiệm của bạn</p>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Thông tin cá nhân</h2>
                  <p className="text-sm text-muted-foreground">Tên và khẩu phần ăn</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium mb-2 block">Tên của bạn</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => updateSetting("name", e.target.value)}
                    placeholder="Nhập tên..."
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="servings" className="text-sm font-medium mb-2 block">Số người ăn</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting("servings", Math.max(1, settings.servings - 1))}
                      disabled={settings.servings <= 1}
                    >
                      -
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{settings.servings}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting("servings", Math.min(10, settings.servings + 1))}
                    >
                      +
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">người</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dietary Preferences */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Chế độ ăn</h2>
                  <p className="text-sm text-muted-foreground">Lựa chọn phù hợp với bạn</p>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(dietaryCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey}>
                    <h3 className="font-bold text-sm mb-3">{category.title}</h3>
                    <div className="space-y-2">
                      {category.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            settings.dietaryType.includes(option.id)
                              ? "border-chart-2 bg-chart-2/5 shadow-sm"
                              : "border-border/50 hover:border-chart-2/50 hover:bg-muted/30"
                          }`}
                          onClick={() => toggleDietaryType(option.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-xl">{option.icon}</span>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{option.label}</p>
                                <p className="text-xs text-muted-foreground">{option.desc}</p>
                              </div>
                            </div>
                            {settings.dietaryType.includes(option.id) && (
                              <Badge className="bg-chart-2 text-white">✓</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              <div className="mb-3">
                <h3 className="font-semibold mb-2">🚫 Dị ứng / Không ăn</h3>
                <p className="text-xs text-muted-foreground mb-3">Chọn các thực phẩm bạn không ăn được</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((option) => (
                  <Badge
                    key={option.id}
                    variant={settings.allergies.includes(option.id) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-2 text-sm"
                    onClick={() => toggleAllergy(option.id)}
                  >
                    {option.icon} {option.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meal Times */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Giờ ăn</h2>
                  <p className="text-sm text-muted-foreground">Đặt giờ ăn cố định để nhận thông báo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌅</span>
                    <Label htmlFor="breakfast" className="font-medium">Bữa sáng</Label>
                  </div>
                  <Input
                    id="breakfast"
                    type="time"
                    value={settings.breakfastTime}
                    onChange={(e) => updateSetting("breakfastTime", e.target.value)}
                    className="w-32 h-10"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌞</span>
                    <Label htmlFor="lunch" className="font-medium">Bữa trưa</Label>
                  </div>
                  <Input
                    id="lunch"
                    type="time"
                    value={settings.lunchTime}
                    onChange={(e) => updateSetting("lunchTime", e.target.value)}
                    className="w-32 h-10"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <Label htmlFor="dinner" className="font-medium">Bữa tối</Label>
                  </div>
                  <Input
                    id="dinner"
                    type="time"
                    value={settings.dinnerTime}
                    onChange={(e) => updateSetting("dinnerTime", e.target.value)}
                    className="w-32 h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Thông báo</h2>
                  <p className="text-sm text-muted-foreground">Quản lý nhắc nhở</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <Label htmlFor="meal-reminders" className="font-medium cursor-pointer">
                      Nhắc giờ ăn
                    </Label>
                    <p className="text-xs text-muted-foreground">Thông báo khi đến giờ ăn</p>
                  </div>
                  <Switch
                    id="meal-reminders"
                    checked={settings.mealReminders}
                    onCheckedChange={(checked) => updateSetting("mealReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <Label htmlFor="shopping-reminders" className="font-medium cursor-pointer">
                      Nhắc đi chợ
                    </Label>
                    <p className="text-xs text-muted-foreground">Nhắc nhở khi sắp hết nguyên liệu</p>
                  </div>
                  <Switch
                    id="shopping-reminders"
                    checked={settings.shoppingReminders}
                    onCheckedChange={(checked) => updateSetting("shoppingReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <Label htmlFor="weekly-report" className="font-medium cursor-pointer">
                      Báo cáo tuần
                    </Label>
                    <p className="text-xs text-muted-foreground">Tóm tắt dinh dưỡng và chi tiêu hàng tuần</p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) => updateSetting("weeklyReport", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Ngân sách</h2>
                  <p className="text-sm text-muted-foreground">Đặt giới hạn chi tiêu</p>
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="text-sm font-medium mb-2 block">
                  Ngân sách tuần (VNĐ)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={settings.weeklyBudget}
                  onChange={(e) => updateSetting("weeklyBudget", parseInt(e.target.value) || 0)}
                  placeholder="Nhập ngân sách..."
                  className="h-11 text-lg font-bold"
                  min="0"
                  step="100000"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Bạn sẽ nhận cảnh báo khi chi tiêu vượt {formatCurrency(Math.round(settings.weeklyBudget * 0.8))} (80%)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-chart-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Dữ liệu & Bảo mật</h2>
                  <p className="text-sm text-muted-foreground">Quản lý dữ liệu của bạn</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">💾 Lưu trữ dữ liệu</p>
                  <p className="text-xs text-muted-foreground">
                    Tất cả dữ liệu được lưu trên thiết bị của bạn (LocalStorage). Không có dữ liệu nào được gửi lên server.
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (confirm("Xóa tất cả dữ liệu? Hành động này không thể hoàn tác!")) {
                      handleReset()
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tất cả dữ liệu
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Preferences Filter */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Tùy chọn lọc</h2>
                  <p className="text-sm text-muted-foreground">Quản lý nguyên liệu và món ăn không mong muốn</p>
                </div>
              </div>
              <UserPreferencesFilter />
            </CardContent>
          </Card>

          {/* Hidden Items Manager */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Món ăn đã ẩn</h2>
                  <p className="text-sm text-muted-foreground">Quản lý những món ăn bạn đã ẩn khỏi gợi ý</p>
                </div>
              </div>
              <HiddenItemsManager />
            </CardContent>
          </Card>

          {/* Save Button */}
          {hasChanges && (
            <div className="sticky bottom-6">
              <Button
                className="w-full h-14 text-base font-semibold shadow-2xl"
                size="lg"
                onClick={handleSave}
              >
                <Save className="h-5 w-5 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          )}

          {!hasChanges && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                ✅ Tất cả thay đổi đã được lưu
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

