"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  ChefHat, 
  Edit3, 
  ArrowRight,
  Leaf,
  Utensils
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useHiddenItems } from "@/contexts/HiddenItemsContext"
import { HideButton } from "@/components/HideButton"

interface UpcomingMeal {
  id: string
  time: string
  timeLabel: string
  dish: string
  image: string
  category: 'breakfast' | 'lunch' | 'dinner'
  isVegetarian: boolean
  calories: number
  prepTime: string
}

export function UpcomingMeals() {
  const [upcomingMeals, setUpcomingMeals] = useState<UpcomingMeal[]>([])
  const [userSettings, setUserSettings] = useState<any>({})
  const { isHidden } = useHiddenItems()

  useEffect(() => {
    // Load user settings to filter meals
    const settings = JSON.parse(localStorage.getItem("angi-user-settings") || "{}")
    setUserSettings(settings)
    
    // Generate upcoming meals based on user preferences
    generateUpcomingMeals(settings)
  }, [isHidden]) // Re-run when hidden items change

  const generateUpcomingMeals = (settings: any) => {
    const dietaryType = settings.dietaryType || 'vegetarian'
    const isVegetarian = dietaryType === 'vegetarian' || dietaryType === 'vegan'
    const isVegan = dietaryType === 'vegan'
    
    // All meal options with proper categorization
    const allMeals = [
      // Vegetarian meals
      {
        id: "1",
        time: "19:00",
        timeLabel: "TÔI NAY",
        dish: "Canh chua chay",
        image: "/healthy-salad-bowl-colorful-vegetables.jpg",
        category: "dinner" as const,
        isVegetarian: true,
        isVegan: true,
        calories: 180,
        prepTime: "25 phút",
        ingredients: ["cà chua", "đậu hũ", "rau thơm", "nước dừa"]
      },
      {
        id: "2", 
        time: "07:00",
        timeLabel: "SÁNG MAI",
        dish: "Bánh mì chay",
        image: "/healthy-salad-bowl-colorful-vegetables.jpg",
        category: "breakfast" as const,
        isVegetarian: true,
        isVegan: false, // contains eggs/dairy
        calories: 320,
        prepTime: "15 phút",
        ingredients: ["bánh mì", "rau củ", "sốt chay"]
      },
      {
        id: "3",
        time: "12:00", 
        timeLabel: "TRƯA MAI",
        dish: "Bún chay Hà Nội",
        image: "/healthy-salad-bowl-colorful-vegetables.jpg",
        category: "lunch" as const,
        isVegetarian: true,
        isVegan: true,
        calories: 450,
        prepTime: "30 phút",
        ingredients: ["bún", "đậu hũ", "rau sống", "nước dùng chay"]
      },
      {
        id: "4",
        time: "19:30",
        timeLabel: "TỐI MAI", 
        dish: "Gà chay xào sả ớt",
        image: "/healthy-salad-bowl-colorful-vegetables.jpg",
        category: "dinner" as const,
        isVegetarian: true,
        isVegan: true,
        calories: 380,
        prepTime: "35 phút",
        ingredients: ["đậu hũ", "sả", "ớt", "rau củ"]
      },
      // Non-vegetarian meals
      {
        id: "5",
        time: "19:00",
        timeLabel: "TÔI NAY",
        dish: "Canh chua cá",
        image: "/vietnamese-pho-bowl-steaming-fresh-herbs.jpg",
        category: "dinner" as const,
        isVegetarian: false,
        isVegan: false,
        calories: 220,
        prepTime: "30 phút",
        ingredients: ["cá", "cà chua", "rau thơm", "nước dừa"]
      },
      {
        id: "6",
        time: "07:00", 
        timeLabel: "SÁNG MAI",
        dish: "Bánh mì trứng",
        image: "/vietnamese-pho-bowl-steaming-fresh-herbs.jpg",
        category: "breakfast" as const,
        isVegetarian: false,
        isVegan: false,
        calories: 380,
        prepTime: "10 phút",
        ingredients: ["bánh mì", "trứng", "rau củ"]
      },
      {
        id: "7",
        time: "12:00",
        timeLabel: "TRƯA MAI", 
        dish: "Bún chả Hà Nội",
        image: "/vietnamese-pho-bowl-steaming-fresh-herbs.jpg",
        category: "lunch" as const,
        isVegetarian: false,
        isVegan: false,
        calories: 520,
        prepTime: "45 phút",
        ingredients: ["bún", "thịt heo", "rau sống", "nước mắm"]
      },
      {
        id: "8",
        time: "19:30",
        timeLabel: "TỐI MAI",
        dish: "Gà xào sả ớt", 
        image: "/vietnamese-pho-bowl-steaming-fresh-herbs.jpg",
        category: "dinner" as const,
        isVegetarian: false,
        isVegan: false,
        calories: 420,
        prepTime: "40 phút",
        ingredients: ["gà", "sả", "ớt", "rau củ"]
      }
    ]

    // Filter meals based on dietary preferences
    let filteredMeals = allMeals.filter(meal => {
      if (isVegan) {
        return meal.isVegan
      } else if (isVegetarian) {
        return meal.isVegetarian
      } else {
        return true // omnivore - show all meals
      }
    })

    // Apply additional filters based on user settings
    // Filter by allergies
    if (settings.allergies && settings.allergies.length > 0) {
      filteredMeals = filteredMeals.filter(meal => {
        return !settings.allergies.some((allergy: string) => 
          meal.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(allergy.toLowerCase())
          )
        )
      })
    }

    // Filter by disliked ingredients
    if (settings.dislikedIngredients && settings.dislikedIngredients.length > 0) {
      filteredMeals = filteredMeals.filter(meal => {
        return !settings.dislikedIngredients.some((ingredient: string) =>
          meal.ingredients.some(mealIngredient =>
            mealIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      })
    }

    // Filter out hidden meals
    const visibleMeals = filteredMeals.filter(meal => !isHidden(meal.id))
    
    // Take first 4 meals for display
    const finalMeals = visibleMeals.slice(0, 4)
    setUpcomingMeals(finalMeals)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breakfast':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'lunch':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'dinner':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breakfast':
        return <Utensils className="h-3 w-3" />
      case 'lunch':
        return <Clock className="h-3 w-3" />
      case 'dinner':
        return <ChefHat className="h-3 w-3" />
      default:
        return <Utensils className="h-3 w-3" />
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bữa ăn sắp tới</h2>
          <p className="text-sm text-gray-600 mt-1">Lịch trình của bạn trong tuần</p>
        </div>
        <Link href="/weekly-plan">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Chỉnh sửa lịch
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {upcomingMeals.map((meal, index) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Image */}
              <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={meal.image}
                  alt={meal.dish}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <div className="p-1 bg-white/90 rounded-full">
                    {getCategoryIcon(meal.category)}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getCategoryColor(meal.category)}`}
                  >
                    {meal.category === 'breakfast' ? 'Sáng' : 
                     meal.category === 'lunch' ? 'Trưa' : 'Tối'}
                  </Badge>
                </div>
                {meal.isVegetarian && (
                  <div className="absolute top-2 right-2">
                    <div className="p-1 bg-green-500 rounded-full">
                      <Leaf className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                {/* Hide Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <HideButton
                    itemId={meal.id}
                    itemName={meal.dish}
                    itemType="meal"
                    itemImage={meal.image}
                    size="sm"
                    variant="ghost"
                    className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900"
                  />
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {meal.timeLabel}
                    </span>
                    <span className="text-xs text-gray-400">{meal.time}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    {meal.dish}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{meal.calories} cal</span>
                    <span>{meal.prepTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {upcomingMeals.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bữa ăn nào</h3>
          <p className="text-gray-500 mb-4">Hãy lên kế hoạch bữa ăn cho tuần này</p>
          <Link href="/weekly-plan">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Lập kế hoạch
            </Button>
          </Link>
        </div>
      )}

      {/* Filter Status */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Leaf className="h-4 w-4" />
            <span>
              Đang hiển thị món ăn phù hợp với chế độ 
              <span className="font-semibold"> {userSettings.dietaryType || 'ăn chay'}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {upcomingMeals.length} món
            </Badge>
            {userSettings.allergies && userSettings.allergies.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                Lọc dị ứng
              </Badge>
            )}
            {userSettings.dislikedIngredients && userSettings.dislikedIngredients.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                Lọc sở thích
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
