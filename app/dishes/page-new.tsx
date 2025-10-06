"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Search,
  Clock, 
  Flame,
  Leaf,
  ChefHat,
  Heart,
  Star
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { GlobalSearch } from "@/components/GlobalSearch"
import { AppHeader } from "@/components/AppHeader"
import { QuickHideButton } from "@/components/HideButton"

interface Dish {
  id: string
  name: string
  nameVi: string
  category: {
    id: string
    name: string
    nameVi: string
  }
  mealType: string
  difficultyLevel: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  calories: number
  protein: number
  carbs: number
  fat: number
  isVegetarian: boolean
  isVegan: boolean
  imageUrl?: string
  ratingAvg: number
  dishTags: {
    tag: {
      id: string
      name: string
      nameVi: string
    }
  }[]
}

export default function DishesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  useEffect(() => {
    fetchDishes()
  }, [selectedCategory, selectedDifficulty])

  const fetchDishes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      if (selectedDifficulty !== "all") {
        params.append("difficulty", selectedDifficulty)
      }
      if (searchQuery) {
        params.append("search", searchQuery)
      }

      const response = await fetch(`/api/dishes?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch dishes')
      }
      const data = await response.json()
      setDishes(data.dishes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchDishes()
  }

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'easy': return 'Dễ'
      case 'medium': return 'Trung bình'
      case 'hard': return 'Khó'
      default: return 'Dễ'
    }
  }

  const getMealTypeText = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Sáng'
      case 'lunch': return 'Trưa'
      case 'dinner': return 'Tối'
      case 'snack': return 'Ăn vặt'
      default: return 'Trưa'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="max-w-6xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="max-w-6xl mx-auto p-4">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchDishes}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Trang chủ
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🍲 Món ăn</h1>
            <p className="text-gray-600">Kho công thức nấu ăn</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm món ăn trong trang này..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            Tất cả ({dishes.length})
          </Button>
          <Button
            variant={selectedCategory === "vegetarian" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("vegetarian")}
          >
            <Leaf className="h-4 w-4 mr-1" />
            Chay
          </Button>
          <Button
            variant={selectedDifficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(selectedDifficulty === "easy" ? "all" : "easy")}
          >
            Dễ
          </Button>
          <Button
            variant={selectedDifficulty === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(selectedDifficulty === "medium" ? "all" : "medium")}
          >
            Trung bình
          </Button>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dishes.map((dish, index) => (
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
                      <QuickHideButton
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
                    {dish.category.nameVi} • {getMealTypeText(dish.mealType)}
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
                      {getDifficultyText(dish.difficultyLevel)}
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

        {dishes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy món ăn nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
