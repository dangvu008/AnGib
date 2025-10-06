"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Flame, 
  ChefHat, 
  MapPin, 
  Star, 
  ArrowRight,
  Utensils,
  Calendar,
  Heart,
  Leaf,
  Zap,
  Users,
  Phone,
  Navigation,
  Sun,
  Moon,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  List,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { formatCurrency } from "@/lib/currency"
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MealItem {
  id: string
  name: string
  nameVi: string
  dishType: "rice" | "soup" | "stir_fry" | "main" | "side" | "noodle_soup"
  calories: number
  prepTime: number
  cookTime: number
  difficulty: "easy" | "medium" | "hard"
  rating: number
  image: string
  isVegetarian: boolean
  isVegan: boolean
  estimatedCost: number
  servings: number
  nutrition: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  isStandaloneDish: boolean
  isRiceAccompanied: boolean
  vietnameseStyle: boolean
}

interface CurrentMeal {
  id: string
  name: string
  nameVi: string
  description: string
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  cuisineType: string
  totalCalories: number
  totalCost: number
  prepTime: number
  servings: number
  isVegetarian: boolean
  isVegan: boolean
  image: string
  popularityScore: number
  isStandaloneMeal: boolean
  mealItems: MealItem[]
  scheduledTime?: Date
  isCompleted?: boolean
}

interface NearbyRestaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  distance: string
  priceRange: string
  address: string
  phone: string
  image: string
  deliveryTime: string
  deliveryFee: number
  isOpen: boolean
  specialties: string[]
}

// Helper function to get current meal time
function getCurrentMealTime(): "breakfast" | "lunch" | "dinner" | "snack" {
  const hour = new Date().getHours()
  
  if (hour >= 6 && hour < 11) return "breakfast"
  if (hour >= 11 && hour < 14) return "lunch"
  if (hour >= 14 && hour < 17) return "snack"
  if (hour >= 17 && hour < 22) return "dinner"
  
  // Late night or early morning - suggest next breakfast
  return "breakfast"
}

// Helper function to get meal time range
function getMealTimeRange(mealType: string): string {
  switch (mealType) {
    case "breakfast": return "6:00 - 11:00"
    case "lunch": return "11:00 - 14:00"
    case "snack": return "14:00 - 17:00"
    case "dinner": return "17:00 - 22:00"
    default: return ""
  }
}

// Helper function to get next meal type
function getNextMealType(current: string): "breakfast" | "lunch" | "dinner" | "snack" {
  const order = ["breakfast", "lunch", "snack", "dinner"]
  const currentIndex = order.indexOf(current)
  return order[(currentIndex + 1) % order.length] as any
}

// Helper function to get previous meal type
function getPreviousMealType(current: string): "breakfast" | "lunch" | "dinner" | "snack" {
  const order = ["breakfast", "lunch", "snack", "dinner"]
  const currentIndex = order.indexOf(current)
  return order[(currentIndex - 1 + order.length) % order.length] as any
}

export function CurrentMealHighlight() {
  const [meals, setMeals] = useState<CurrentMeal[]>([])
  const [currentMealIndex, setCurrentMealIndex] = useState(0)
  const [nearbyRestaurants, setNearbyRestaurants] = useState<NearbyRestaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [showRestaurants, setShowRestaurants] = useState(false)
  const [showAllMealItems, setShowAllMealItems] = useState(false)
  const [showDishSelector, setShowDishSelector] = useState(false)
  const [selectedDishIndex, setSelectedDishIndex] = useState<number | null>(null)
  const [availableDishes, setAvailableDishes] = useState<MealItem[]>([])
  const { isAuthenticated, user } = useAuth()
  const isMobile = useIsMobile()
  
  // Swipe functionality
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const dragConstraintsRef = useRef(null)
  
  const currentMeal = meals[currentMealIndex]
  
  // Quick stats
  const dailyCalorieTarget = 2000 // Default value
  const dailyCalorieProgress = Math.round((1450 / dailyCalorieTarget) * 100)
  const weeklyMealProgress = Math.round((14 / 21) * 100)

  useEffect(() => {
    loadMeals()
    loadNearbyRestaurants()
  }, [])

  const loadMeals = async () => {
    try {
      setLoading(true)
      
      // Generate meals for today based on current time
      const currentMealTime = getCurrentMealTime()
      const mealTypes = ["breakfast", "lunch", "snack", "dinner"]
      const currentIndex = mealTypes.indexOf(currentMealTime)
      
      // Load meals in order: current, next, next+1, previous
      const orderedMealTypes = [
        currentMealTime,
        ...mealTypes.slice(currentIndex + 1),
        ...mealTypes.slice(0, currentIndex)
      ]
      
      const loadedMeals: CurrentMeal[] = []
      
      for (const mealType of orderedMealTypes) {
        try {
          const response = await fetch(`/api/meal-compositions/current?mealType=${mealType}`)
          if (response.ok) {
            const mealData = await response.json()
            loadedMeals.push({
              ...mealData,
              mealType: mealType as any,
              isCompleted: false
            })
          } else {
            // Fallback to mock data
            loadedMeals.push(generateMockMeal(mealType as any))
          }
        } catch (error) {
          loadedMeals.push(generateMockMeal(mealType as any))
        }
      }
      
      setMeals(loadedMeals)
      setCurrentMealIndex(0) // Start with current meal
      
    } catch (error) {
      console.error('Error loading meals:', error)
      // Load all mock meals
      setMeals([
        generateMockMeal("breakfast"),
        generateMockMeal("lunch"),
        generateMockMeal("snack"),
        generateMockMeal("dinner")
      ])
    } finally {
      setLoading(false)
    }
  }

  const generateMockMeal = (mealType: "breakfast" | "lunch" | "dinner" | "snack"): CurrentMeal => {
    const mockMeals = {
      breakfast: {
        id: "meal-breakfast",
        name: "Vietnamese Breakfast",
        nameVi: "Bữa sáng Việt Nam",
        description: "Bữa sáng nhẹ nhàng với bánh mì hoặc phở",
        totalCalories: 450,
        totalCost: 35000,
        prepTime: 15,
        mealItems: [
          {
            id: "dish-banhmi",
            name: "Banh Mi",
            nameVi: "Bánh mì chay",
            dishType: "main" as const,
            calories: 350,
            prepTime: 10,
            cookTime: 5,
            difficulty: "easy" as const,
            rating: 4.6,
            image: "/placeholder.jpg",
            isVegetarian: true,
            isVegan: false,
            estimatedCost: 25000,
            servings: 1,
            nutrition: { protein: 12, carbs: 45, fat: 8, fiber: 5 },
            isStandaloneDish: true,
            isRiceAccompanied: false,
            vietnameseStyle: true
          }
        ]
      },
      lunch: {
        id: "meal-lunch",
        name: "Traditional Vietnamese Lunch",
        nameVi: "Cơm trưa Việt Nam truyền thống",
        description: "Bữa cơm trưa đầy đủ với cơm, canh, món xào và món chính",
        totalCalories: 610,
        totalCost: 58000,
        prepTime: 30,
        mealItems: [
          {
            id: "dish-rice",
            name: "Steamed Rice",
            nameVi: "Cơm trắng",
            dishType: "rice" as const,
            calories: 200,
            prepTime: 5,
            cookTime: 20,
            difficulty: "easy" as const,
            rating: 4.5,
            image: "/placeholder.jpg",
            isVegetarian: true,
            isVegan: true,
            estimatedCost: 5000,
            servings: 4,
            nutrition: { protein: 4, carbs: 45, fat: 0.5, fiber: 0.6 },
            isStandaloneDish: false,
            isRiceAccompanied: false,
            vietnameseStyle: true
          },
          {
            id: "dish-soup",
            name: "Pumpkin Soup",
            nameVi: "Canh bí đỏ",
            dishType: "soup" as const,
            calories: 80,
            prepTime: 10,
            cookTime: 15,
            difficulty: "easy" as const,
            rating: 4.4,
            image: "/placeholder.jpg",
            isVegetarian: true,
            isVegan: true,
            estimatedCost: 15000,
            servings: 4,
            nutrition: { protein: 2, carbs: 18, fat: 0.3, fiber: 2 },
            isStandaloneDish: false,
            isRiceAccompanied: true,
            vietnameseStyle: true
          }
        ]
      },
      snack: {
        id: "meal-snack",
        name: "Afternoon Snack",
        nameVi: "Bữa phụ chiều",
        description: "Món ăn nhẹ giữa buổi chiều",
        totalCalories: 250,
        totalCost: 20000,
        prepTime: 10,
        mealItems: [
          {
            id: "dish-fruit",
            name: "Fresh Fruit",
            nameVi: "Hoa quả tươi",
            dishType: "side" as const,
            calories: 150,
            prepTime: 5,
            cookTime: 0,
            difficulty: "easy" as const,
            rating: 4.8,
            image: "/placeholder.jpg",
            isVegetarian: true,
            isVegan: true,
            estimatedCost: 15000,
            servings: 1,
            nutrition: { protein: 1, carbs: 35, fat: 0.5, fiber: 5 },
            isStandaloneDish: true,
            isRiceAccompanied: false,
            vietnameseStyle: false
          }
        ]
      },
      dinner: {
        id: "meal-dinner",
        name: "Vietnamese Dinner",
        nameVi: "Bữa tối Việt Nam",
        description: "Bữa tối ấm cúng với gia đình",
        totalCalories: 580,
        totalCost: 55000,
        prepTime: 35,
        mealItems: [
          {
            id: "dish-rice-dinner",
            name: "Steamed Rice",
            nameVi: "Cơm trắng",
            dishType: "rice" as const,
            calories: 200,
            prepTime: 5,
            cookTime: 20,
            difficulty: "easy" as const,
            rating: 4.5,
            image: "/placeholder.jpg",
            isVegetarian: true,
            isVegan: true,
            estimatedCost: 5000,
            servings: 4,
            nutrition: { protein: 4, carbs: 45, fat: 0.5, fiber: 0.6 },
            isStandaloneDish: false,
            isRiceAccompanied: false,
            vietnameseStyle: true
          }
        ]
      }
    }

    const mealData = mockMeals[mealType]
    return {
      ...mealData,
      mealType,
      cuisineType: "vietnamese",
      servings: 4,
      isVegetarian: true,
      isVegan: true,
      image: "/placeholder.jpg",
      popularityScore: 4.7,
      isStandaloneMeal: false,
      isCompleted: false
    }
  }

  const loadNearbyRestaurants = async () => {
    // Mock data for nearby restaurants
    const mockRestaurants: NearbyRestaurant[] = [
      {
        id: "rest-1",
        name: "Nhà hàng Chay An Nhiên",
        cuisine: "Chay Việt Nam",
        rating: 4.8,
        distance: "0.5 km",
        priceRange: "50.000₫ - 150.000₫",
        address: "123 Trần Hưng Đạo, Q1",
        phone: "0901234567",
        image: "/restaurant-interior-cozy-dining.jpg",
        deliveryTime: "20-30 phút",
        deliveryFee: 15000,
        isOpen: true,
        specialties: ["Bún chay", "Phở chay", "Cơm chay"]
      },
      {
        id: "rest-2",
        name: "Quán Chay Hương Sen",
        cuisine: "Chay Á Đông",
        rating: 4.6,
        distance: "1.2 km",
        priceRange: "40.000₫ - 120.000₫",
        address: "456 Nguyễn Huệ, Q1",
        phone: "0907654321",
        image: "/restaurant-interior-cozy-dining.jpg",
        deliveryTime: "25-35 phút",
        deliveryFee: 20000,
        isOpen: true,
        specialties: ["Lẩu chay", "Bánh xèo chay"]
      },
      {
        id: "rest-3",
        name: "Chay Garden",
        cuisine: "Chay Fusion",
        rating: 4.7,
        distance: "0.8 km",
        priceRange: "60.000₫ - 180.000₫",
        address: "789 Lê Lợi, Q1",
        phone: "0909876543",
        image: "/restaurant-interior-cozy-dining.jpg",
        deliveryTime: "15-25 phút",
        deliveryFee: 12000,
        isOpen: false,
        specialties: ["Sushi chay", "Pasta chay"]
      }
    ]
    
    setNearbyRestaurants(mockRestaurants)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50
    
    if (info.offset.x > swipeThreshold) {
      // Swipe right - previous meal
      handlePreviousMeal()
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left - next meal
      handleNextMeal()
    }
    
    // Reset position
    x.set(0)
  }

  const handleNextMeal = () => {
    if (currentMealIndex < meals.length - 1) {
      setCurrentMealIndex(currentMealIndex + 1)
      toast.success(`Chuyển sang ${getMealTypeLabel(meals[currentMealIndex + 1].mealType)}`)
    } else {
      toast.info("Đây là bữa ăn cuối cùng trong ngày")
    }
  }

  const handlePreviousMeal = () => {
    if (currentMealIndex > 0) {
      setCurrentMealIndex(currentMealIndex - 1)
      toast.success(`Quay lại ${getMealTypeLabel(meals[currentMealIndex - 1].mealType)}`)
    } else {
      toast.info("Đây là bữa ăn đầu tiên")
    }
  }

  const handleMarkComplete = () => {
    if (!currentMeal) return
    
    const updatedMeals = [...meals]
    updatedMeals[currentMealIndex] = {
      ...currentMeal,
      isCompleted: true
    }
    setMeals(updatedMeals)
    
    toast.success("Đã đánh dấu hoàn thành!", {
      description: "Chúc bạn ngon miệng! 🎉"
    })
    
    // Auto advance to next meal after 1 second
    setTimeout(() => {
      if (currentMealIndex < meals.length - 1) {
        handleNextMeal()
      }
    }, 1000)
  }

  const handleRefreshMeal = async () => {
    try {
      toast.loading("Đang tạo bữa ăn mới...")
      
      // Call API to generate new meal
      const response = await fetch(`/api/meal-compositions/random?mealType=${currentMeal.mealType}`)
      
      if (response.ok) {
        const newMeal = await response.json()
        const updatedMeals = [...meals]
        updatedMeals[currentMealIndex] = {
          ...newMeal,
          mealType: currentMeal.mealType,
          isCompleted: false
        }
        setMeals(updatedMeals)
        toast.success("Đã tạo bữa ăn mới!")
      } else {
        // Fallback to regenerating mock meal
        const newMockMeal = generateMockMeal(currentMeal.mealType)
        const updatedMeals = [...meals]
        updatedMeals[currentMealIndex] = newMockMeal
        setMeals(updatedMeals)
        toast.success("Đã làm mới bữa ăn!")
      }
    } catch (error) {
      console.error('Error refreshing meal:', error)
      toast.error("Không thể tạo bữa ăn mới")
    }
  }

  const handleRefreshDish = async (dishIndex: number) => {
    if (!currentMeal) return
    
    try {
      toast.loading("Đang thay món...")
      
      const dish = currentMeal.mealItems[dishIndex]
      const response = await fetch(`/api/dishes?dishType=${dish.dishType}&limit=5`)
      
      if (response.ok) {
        const data = await response.json()
        const dishes = data.dishes || []
        
        if (dishes.length > 0) {
          // Pick a random dish different from current
          const otherDishes = dishes.filter((d: any) => d.id !== dish.id)
          if (otherDishes.length > 0) {
            const newDish = otherDishes[Math.floor(Math.random() * otherDishes.length)]
            
            const updatedMeals = [...meals]
            const updatedMeal = { ...currentMeal }
            updatedMeal.mealItems = [...currentMeal.mealItems]
            updatedMeal.mealItems[dishIndex] = {
              ...newDish,
              dishType: dish.dishType
            }
            updatedMeals[currentMealIndex] = updatedMeal
            setMeals(updatedMeals)
            
            toast.success(`Đã thay ${dish.nameVi}!`)
          } else {
            toast.info("Không tìm thấy món khác")
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing dish:', error)
      toast.error("Không thể thay món")
    }
  }

  const handleSelectDish = async (dishIndex: number) => {
    if (!currentMeal) return
    
    setSelectedDishIndex(dishIndex)
    
    try {
      const dish = currentMeal.mealItems[dishIndex]
      const response = await fetch(`/api/dishes?dishType=${dish.dishType}&limit=20`)
      
      if (response.ok) {
        const data = await response.json()
        setAvailableDishes(data.dishes || [])
        setShowDishSelector(true)
      }
    } catch (error) {
      console.error('Error loading dishes:', error)
      toast.error("Không thể tải danh sách món")
    }
  }

  const handleReplaceDish = (newDish: MealItem) => {
    if (!currentMeal || selectedDishIndex === null) return
    
    const updatedMeals = [...meals]
    const updatedMeal = { ...currentMeal }
    updatedMeal.mealItems = [...currentMeal.mealItems]
    updatedMeal.mealItems[selectedDishIndex] = newDish
    updatedMeals[currentMealIndex] = updatedMeal
    setMeals(updatedMeals)
    
    setShowDishSelector(false)
    setSelectedDishIndex(null)
    toast.success(`Đã thay món thành ${newDish.nameVi}!`)
  }

  const getMealTypeLabel = (mealType: string): string => {
    const labels = {
      breakfast: "Bữa sáng",
      lunch: "Bữa trưa",
      snack: "Bữa phụ",
      dinner: "Bữa tối"
    }
    return labels[mealType as keyof typeof labels] || mealType
  }

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast": return Sun
      case "lunch": return Utensils
      case "snack": return Sparkles
      case "dinner": return Moon
      default: return Utensils
    }
  }

  if (loading || !currentMeal) {
    return (
      <div className="mb-8">
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="h-64 md:h-80 bg-gradient-to-r from-orange-400 to-red-500 animate-pulse" />
          <CardContent className="p-4 md:p-6">
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const MealTypeIcon = getMealTypeIcon(currentMeal.mealType)
  const mealTypeInfo = {
    label: getMealTypeLabel(currentMeal.mealType),
    color: currentMeal.mealType === "breakfast" 
      ? "bg-yellow-500 text-white" 
      : currentMeal.mealType === "lunch"
      ? "bg-orange-500 text-white"
      : currentMeal.mealType === "dinner"
      ? "bg-indigo-600 text-white"
      : "bg-pink-500 text-white",
    timeRange: getMealTimeRange(currentMeal.mealType)
  }

  return (
    <div className="mb-8">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Card className="overflow-hidden border-0 shadow-xl relative">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-orange-400 to-red-500">
            <img
              src={currentMeal.image}
              alt={currentMeal.nameVi}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Navigation buttons - Left */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm"
                onClick={handlePreviousMeal}
                disabled={currentMealIndex === 0}
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>
            
            {/* Navigation buttons - Right */}
            <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm"
                onClick={handleNextMeal}
                disabled={currentMealIndex === meals.length - 1}
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>

            {/* Completion badge */}
            {currentMeal.isCompleted && (
              <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-10 bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <Check className="h-4 w-4" />
                <span className="text-xs md:text-sm font-medium">Đã hoàn thành</span>
              </div>
            )}
            
            {/* Meal Type Badge */}
            <div className="absolute top-2 md:top-4 left-2 md:left-4">
              <Badge className={`${mealTypeInfo.color} px-2 md:px-3 py-1 text-xs md:text-sm font-medium`}>
                <MealTypeIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                {mealTypeInfo.label}
              </Badge>
              <p className="text-xs text-white/80 mt-1 ml-1">{mealTypeInfo.timeRange}</p>
            </div>

            {/* Rating */}
            <div className="absolute top-2 md:top-4 right-2 md:right-4">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 md:px-3 py-1">
                <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-xs md:text-sm">{currentMeal.popularityScore.toFixed(1)}</span>
              </div>
            </div>

            {/* Quick Info Overlay - Responsive layout */}
            <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 md:px-3 py-1">
                  <Flame className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-medium">{currentMeal.totalCalories} calo</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 md:px-3 py-1">
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-medium">{currentMeal.prepTime} phút</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 md:px-3 py-1">
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-medium">{currentMeal.servings} người</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 md:px-3 py-1">
                  <Utensils className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-medium">{currentMeal.mealItems.length} món</span>
                </div>
              </div>
            </div>

            {/* Meal counter */}
            <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                {currentMealIndex + 1} / {meals.length}
              </div>
            </div>
          </div>

          <CardContent className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex-1 min-w-0">
                  {currentMeal.nameVi}
                </h2>
                <Badge variant="outline" className="px-2 md:px-3 py-1 text-xs flex-shrink-0 whitespace-nowrap">
                  Dễ
                </Badge>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-3 line-clamp-2">
                {currentMeal.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {currentMeal.cuisineType === "vietnamese" ? "Việt Nam" : currentMeal.cuisineType}
                </Badge>
                {currentMeal.isVegetarian && (
                  <Badge variant="default" className="text-xs px-2 py-1 bg-green-100 text-green-800">
                    <Leaf className="h-3 w-3 mr-1" />
                    Chay
                  </Badge>
                )}
                {currentMeal.isVegan && (
                  <Badge variant="outline" className="text-xs px-2 py-1 border-green-200 text-green-700">
                    <Heart className="h-3 w-3 mr-1" />
                    Vegan
                  </Badge>
                )}
              </div>
            </div>

            {/* Meal Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Các món trong bữa ăn
                </h3>
                {isMobile && currentMeal.mealItems.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllMealItems(!showAllMealItems)}
                    className="text-xs"
                  >
                    {showAllMealItems ? "Thu gọn" : `Xem ${currentMeal.mealItems.length - 2} món khác`}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(isMobile && !showAllMealItems
                  ? currentMeal.mealItems.slice(0, 2)
                  : currentMeal.mealItems
                ).map((item, index) => {
                  const dishTypeIcons = {
                    rice: ChefHat,
                    soup: Flame,
                    stir_fry: Zap,
                    main: Star,
                    side: Heart,
                    noodle_soup: Utensils
                  }
                  const DishIcon = dishTypeIcons[item.dishType] || Star
                  
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <DishIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{item.nameVi}</div>
                        <div className="text-xs text-gray-500">
                          {item.calories} calo • {item.prepTime + item.cookTime} phút
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-medium">{formatCurrency(item.estimatedCost)}</div>
                        <div className="text-xs text-gray-500 hidden md:block">{item.servings} người</div>
                      </div>
                      
                      {/* Dish action menu */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thay món này</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRefreshDish(index)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Món ngẫu nhiên
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSelectDish(index)}>
                              <List className="h-4 w-4 mr-2" />
                              Chọn từ danh sách
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Nutrition Info - Hidden on mobile by default */}
            <div className="hidden md:grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {currentMeal.mealItems.reduce((sum, item) => sum + (item.nutrition?.protein || 0), 0)}g
                </div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {currentMeal.mealItems.reduce((sum, item) => sum + (item.nutrition?.carbs || 0), 0)}g
                </div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {currentMeal.mealItems.reduce((sum, item) => sum + (item.nutrition?.fat || 0), 0)}g
                </div>
                <div className="text-sm text-gray-600">Chất béo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {currentMeal.mealItems.reduce((sum, item) => sum + (item.nutrition?.fiber || 0), 0)}g
                </div>
                <div className="text-sm text-gray-600">Chất xơ</div>
              </div>
            </div>

            {/* Cost and Time */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-2">
                  <span className="text-lg md:text-2xl">💰</span>
                  <div className="text-center md:text-left">
                    <div className="font-bold text-xs md:text-lg whitespace-nowrap">{formatCurrency(currentMeal.totalCost)}</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Chi phí</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-2">
                  <span className="text-lg md:text-2xl">⏱️</span>
                  <div className="text-center md:text-left">
                    <div className="font-bold text-xs md:text-lg whitespace-nowrap">{currentMeal.prepTime} phút</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Thời gian</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-2">
                  <span className="text-lg md:text-2xl">👥</span>
                  <div className="text-center md:text-left">
                    <div className="font-bold text-xs md:text-lg whitespace-nowrap">{currentMeal.servings} người</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Khẩu phần</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mb-4">
              {/* Row 1: Main action buttons */}
              <div className="flex gap-2">
                {!currentMeal.isCompleted ? (
                  <>
                    <Button 
                      className="flex-1 h-10 md:h-12 text-sm md:text-base bg-green-600 hover:bg-green-700"
                      onClick={handleMarkComplete}
                    >
                      <Check className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                      <span className="hidden xs:inline">Đã xong</span>
                      <span className="xs:hidden">Xong</span>
                    </Button>
                    <Link href={`/cook/${currentMeal.id}`} className="flex-1">
                      <Button className="w-full h-10 md:h-12 text-sm md:text-base">
                        <ChefHat className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                        <span className="hidden xs:inline">Nấu ngay</span>
                        <span className="xs:hidden">Nấu</span>
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href={`/cook/${currentMeal.id}`} className="flex-1">
                    <Button className="w-full h-10 md:h-12 text-sm md:text-base">
                      <ChefHat className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                      Xem công thức
                    </Button>
                  </Link>
                )}
              </div>

              {/* Row 2: Secondary action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 md:h-12 text-sm md:text-base"
                  onClick={handleRefreshMeal}
                >
                  <RefreshCw className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  <span className="hidden xs:inline">Đổi bữa</span>
                  <span className="xs:hidden">Đổi</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 h-10 md:h-12 text-sm md:text-base"
                  onClick={() => setShowRestaurants(!showRestaurants)}
                >
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Ăn ngoài
                </Button>
              </div>
            </div>

            {/* Quick Stats - Only for authenticated users */}
            {isAuthenticated && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">Hôm nay</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    1,450 / {dailyCalorieTarget} calo
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${dailyCalorieProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">Tuần này</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 mb-1">14/21 bữa</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${weeklyMealProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Nearby Restaurants */}
            {showRestaurants && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 md:mt-6 pt-4 md:pt-6 border-t"
              >
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                  Quán ăn gần đây
                </h3>
                <div className="space-y-3">
                  {nearbyRestaurants.slice(0, isMobile ? 2 : 3).map((restaurant) => (
                    <Card key={restaurant.id} className="p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full md:w-16 h-32 md:h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 w-full">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-sm md:text-base flex-1">{restaurant.name}</h4>
                            {restaurant.isOpen ? (
                              <Badge variant="default" className="text-xs px-2 py-0.5 ml-2">Mở cửa</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs px-2 py-0.5 ml-2">Đóng cửa</Badge>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                              {restaurant.rating}
                            </span>
                            <span>{restaurant.distance}</span>
                            <span>{restaurant.priceRange}</span>
                            <span className="hidden md:inline">{restaurant.deliveryTime}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 flex-1 md:flex-initial text-xs">
                              <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Gọi
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 flex-1 md:flex-initial text-xs">
                              <Navigation className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Đường đi
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Swipe hint - Moved inside motion.div but outside Card */}
        <div className="text-center mt-3 text-sm text-gray-500">
          <p>← Vuốt để xem bữa ăn khác →</p>
        </div>
      </motion.div>

      {/* Dish Selector Dialog */}
      <Dialog open={showDishSelector} onOpenChange={setShowDishSelector}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chọn món thay thế</DialogTitle>
            <DialogDescription>
              Chọn một món từ danh sách để thay thế
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {availableDishes.map((dish) => (
              <Card
                key={dish.id}
                className="p-3 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleReplaceDish(dish)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={dish.image}
                    alt={dish.nameVi}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{dish.nameVi}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{dish.calories} calo</span>
                      <span>•</span>
                      <span>{formatCurrency(dish.estimatedCost)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{dish.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
