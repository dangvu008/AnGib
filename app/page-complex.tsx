"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WeeklyPlanCard } from "@/components/WeeklyPlanCard"
import { UserOnboarding } from "@/components/UserOnboarding"
import { UpcomingMeals } from "@/components/UpcomingMeals"
import { HideButton } from "@/components/HideButton"
import { useHiddenItems } from "@/contexts/HiddenItemsContext"
import { AppHeader } from "@/components/AppHeader"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Clock,
  Shuffle,
  ChefHat,
  Store,
  TrendingUp,
  Flame,
  DollarSign,
  Calendar,
  ArrowRight,
  Utensils,
  Sparkles,
  Leaf,
  Settings,
  CheckCircle2,
  Info,
  Menu,
  Home,
  RefreshCw,
  Target,
  Users,
  Heart,
  MessageCircle,
  Lightbulb,
  Sun,
  Snowflake,
  CloudRain,
  Check,
  Plus,
  Minus,
  X,
  ShoppingCart,
  Star,
} from "lucide-react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import { useDishes } from "@/hooks/useDishes"
import { useRestaurants } from "@/hooks/useRestaurants"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedDietaryType, setSelectedDietaryType] = useState("vegetarian")
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [selectedHealthGoals, setSelectedHealthGoals] = useState<string[]>([])
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(1500)
  const [weeklyBudget, setWeeklyBudget] = useState(500000)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMeal, setGeneratedMeal] = useState<any>(null)
  const [showGeneratedMeal, setShowGeneratedMeal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { isHidden } = useHiddenItems()

  // Fetch data from database
  const { dishes: vegetarianDishes, loading: dishesLoading } = useDishes({
    isVegetarian: true,
    limit: 3
  })

  const { dishes: randomDishes, loading: randomDishesLoading } = useDishes({
    limit: 6
  })

  const { restaurants, loading: restaurantsLoading } = useRestaurants({
    isVegetarian: true,
    limit: 3
  })

  useEffect(() => {
    if (!dishesLoading && !restaurantsLoading) {
      setIsLoading(false)
    }
  }, [dishesLoading, restaurantsLoading])

  // Mock data for demonstration (will be replaced with real data)
  const mockDishes = [
    {
      id: "1",
      name: "Đậu hũ sốt cà chua",
      nameVi: "Đậu hũ sốt cà chua",
      description: "Món chay đơn giản, đậm đà hương vị",
      image: "/images/tofu-tomato.jpg",
      rating: 4.5,
      calo: 180,
      time: "15 phút",
      difficulty: "Dễ",
      isVegetarian: true,
      isFavorite: false,
      category: { nameVi: "Chay" },
      mealType: "lunch",
      difficultyLevel: "easy",
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      calories: 180,
      protein: 12,
      carbs: 15,
      fat: 8,
      ratingAvg: 4.5,
      dishTags: [{ tag: { nameVi: "Chay" } }]
    },
    {
      id: "2", 
      name: "Canh bí đỏ",
      nameVi: "Canh bí đỏ",
      description: "Canh ngọt thanh, bổ dưỡng",
      image: "/images/pumpkin-soup.jpg",
      rating: 4.8,
      calo: 80,
      time: "10 phút",
      difficulty: "Dễ",
      isVegetarian: true,
      isFavorite: true,
      category: { nameVi: "Canh" },
      mealType: "lunch",
      difficultyLevel: "easy",
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      calories: 80,
      protein: 2,
      carbs: 18,
      fat: 1,
      ratingAvg: 4.8,
      dishTags: [{ tag: { nameVi: "Chay" } }, { tag: { nameVi: "Nhanh" } }]
    }
  ]

  const mockRestaurants = [
    {
      id: "1",
      name: "Chay An Lạc",
      description: "Nhà hàng chay nổi tiếng với các món ăn chay truyền thống",
      cuisineType: "Vietnamese Vegetarian",
      address: "123 Nguyễn Huệ, Q1, TP.HCM",
      rating: 4.5,
      priceRange: "$$",
      isVegetarian: true,
      isVegan: true,
      image: "/images/restaurant-chay-an-lac.jpg"
    },
    {
      id: "2",
      name: "Vegetarian Garden",
      description: "Không gian xanh với các món chay hiện đại",
      cuisineType: "Modern Vegetarian",
      address: "456 Lê Lợi, Q1, TP.HCM",
      rating: 4.7,
      priceRange: "$$$",
      isVegetarian: true,
      isVegan: true,
      image: "/images/restaurant-vegetarian-garden.jpg"
    }
  ]

  // Use real data from database or fallback to mock data
  const displayDishes = vegetarianDishes.length > 0 ? vegetarianDishes : mockDishes
  const displayRestaurants = restaurants.length > 0 ? restaurants : mockRestaurants

  const dietaryTypes = [
    { id: "omnivore", name: "Ăn tạp", description: "Ăn tất cả các loại thực phẩm" },
    { id: "vegetarian", name: "Chay", description: "Không ăn thịt, cá" },
    { id: "vegan", name: "Thuần chay", description: "Không ăn sản phẩm từ động vật" },
    { id: "pescatarian", name: "Pescatarian", description: "Chỉ ăn cá, không ăn thịt" }
  ]

  const allergies = [
    { id: "gluten", name: "Gluten", icon: "🌾" },
    { id: "dairy", name: "Sữa", icon: "🥛" },
    { id: "nuts", name: "Hạt", icon: "🥜" },
    { id: "shellfish", name: "Hải sản", icon: "🦐" },
    { id: "eggs", name: "Trứng", icon: "🥚" },
    { id: "soy", name: "Đậu nành", icon: "🫘" }
  ]

  const healthGoals = [
    { id: "weight_loss", name: "Giảm cân", icon: "⚖️" },
    { id: "muscle_gain", name: "Tăng cơ", icon: "💪" },
    { id: "heart_health", name: "Tim mạch", icon: "❤️" },
    { id: "diabetes", name: "Tiểu đường", icon: "🩺" },
    { id: "energy", name: "Năng lượng", icon: "⚡" },
    { id: "digestion", name: "Tiêu hóa", icon: "🔄" }
  ]

  const quickActions = [
    {
      title: "Công thức nấu ăn",
      description: "Khám phá hàng ngàn công thức",
      icon: ChefHat,
      href: "/dishes",
      color: "bg-orange-500"
    },
    {
      title: "Danh sách mua sắm",
      description: "Tạo danh sách đi chợ thông minh",
      icon: ShoppingCart,
      href: "/shopping",
      color: "bg-green-500"
    },
    {
      title: "Kế hoạch tuần",
      description: "Lên kế hoạch bữa ăn hàng tuần",
      icon: Calendar,
      href: "/weekly-plan",
      color: "bg-blue-500"
    },
    {
      title: "Cài đặt",
      description: "Tùy chỉnh sở thích cá nhân",
      icon: Settings,
      href: "/settings",
      color: "bg-purple-500"
    }
  ]

  const handleRandomMeal = () => {
    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const availableDishes = displayDishes.filter(dish => !isHidden(`dish-${dish.id}`))
      if (availableDishes.length > 0) {
        const randomDish = availableDishes[Math.floor(Math.random() * availableDishes.length)]
        setGeneratedMeal(randomDish)
        setShowGeneratedMeal(true)
        toast.success("Đã tạo món ăn ngẫu nhiên!")
      } else {
        toast.error("Không có món ăn phù hợp")
      }
      setIsGenerating(false)
    }, 2000)
  }

  const handleAllergyToggle = (allergyId: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergyId) 
        ? prev.filter(id => id !== allergyId)
        : [...prev, allergyId]
    )
  }

  const handleHealthGoalToggle = (goalId: string) => {
    setSelectedHealthGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleCompleteOnboarding = () => {
    setIsCompleted(true)
    setShowOnboarding(false)
    toast.success("Chào mừng bạn đến với AnGi! 🎉")
  }

  const handleSkipOnboarding = () => {
    setShowOnboarding(false)
    toast.info("Bạn có thể cập nhật sở thích sau trong Cài đặt")
  }

  // Filter out hidden items
  const filteredDishes = displayDishes.filter(dish => !isHidden(`dish-${dish.id}`))
  const filteredRestaurants = displayRestaurants.filter(restaurant => !isHidden(`restaurant-${restaurant.id}`))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="max-w-6xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với <span className="text-primary">AnGi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Trợ lý ẩm thực thông minh giúp bạn lên kế hoạch bữa ăn hoàn hảo
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Input
              placeholder="Tìm kiếm món ăn, nhà hàng, công thức..."
              className="pl-10 pr-4 py-3 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link href={action.href}>
                  <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer group">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Random Meal Generator */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Món ăn ngẫu nhiên</h2>
                <p className="text-purple-100">Để AI chọn món ăn phù hợp với bạn</p>
              </div>
              <Button
                onClick={handleRandomMeal}
                disabled={isGenerating}
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Tạo món ăn
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Dishes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Món ăn chay thanh đạm</h2>
            <Link href="/dishes">
              <Button variant="outline" className="gap-2">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes.slice(0, 3).map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dish.imageUrl || "/healthy-salad-bowl-colorful-vegetables.jpg"}
                      alt={dish.nameVi}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                      <div className="flex gap-1.5">
                        {dish.isVegetarian && (
                          <Badge className="bg-chart-2 text-white">
                            <Leaf className="h-3 w-3 mr-1" />
                            Chay
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <HideButton
                          itemId={`dish-${dish.id}`}
                          itemName={dish.nameVi}
                          itemType="meal"
                          itemImage={dish.imageUrl}
                          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1 text-white">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{dish.ratingAvg.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-base mb-1 line-clamp-1">{dish.nameVi}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {dish.category.nameVi} • {dish.mealType === 'lunch' ? 'Trưa' : 'Tối'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                        {Math.round(dish.calories)} calo
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        {dish.prepTimeMinutes + dish.cookTimeMinutes} phút
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {dish.difficultyLevel === 'easy' ? 'Dễ' : 'Trung bình'}
                      </Badge>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dish.dishTags.slice(0, 2).map((dishTag) => (
                        <Badge key={dishTag.tag.id} variant="outline" className="text-[10px]">
                          {dishTag.tag.nameVi}
                        </Badge>
                      ))}
                    </div>

                    <Link href={`/cook/${dish.id}`}>
                      <Button className="w-full" size="sm">
                        <ChefHat className="h-4 w-4 mr-2" />
                        Xem công thức
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Restaurants Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Quán ăn chay gần bạn</h2>
            <Link href="/restaurants">
              <Button variant="outline" className="gap-2">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.slice(0, 3).map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={restaurant.imageUrl || "/restaurant-interior-cozy-dining.jpg"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                      <div className="flex gap-1.5">
                        {restaurant.isVegetarian && (
                          <Badge className="bg-chart-2 text-white">
                            <Leaf className="h-3 w-3 mr-1" />
                            Chay
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <HideButton
                          itemId={`restaurant-${restaurant.id}`}
                          itemName={restaurant.name}
                          itemType="restaurant"
                          itemImage={restaurant.imageUrl}
                          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1 text-white">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{restaurant.ratingAvg.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-base mb-1 line-clamp-1">{restaurant.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {restaurant.cuisineType} • {restaurant.priceRange}
                    </p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Store className="h-3.5 w-3.5 text-green-500" />
                        {restaurant.address}
                      </span>
                    </div>
                    <Button className="w-full" size="sm">
                      <Store className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Plan Section */}
        <div className="mb-8">
          <WeeklyPlanCard />
        </div>

        {/* Upcoming Meals */}
        <div className="mb-8">
          <UpcomingMeals />
        </div>
      </div>

      {/* Generated Meal Modal */}
      <AnimatePresence>
        {showGeneratedMeal && generatedMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGeneratedMeal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Món ăn được đề xuất</h3>
                <p className="text-gray-600 mb-4">{generatedMeal.nameVi}</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setShowGeneratedMeal(false)}>
                    Tạo món khác
                  </Button>
                  <Button variant="outline" onClick={() => setShowGeneratedMeal(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
