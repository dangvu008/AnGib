"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/AppHeader"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Shuffle,
  ChefHat,
  Store,
  ArrowRight,
  Leaf,
  Heart,
  Star,
  Flame,
  ShoppingCart,
  Calendar,
  Settings,
} from "lucide-react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"

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

interface Restaurant {
  id: string
  name: string
  description?: string
  cuisineType: string
  address: string
  latitude?: number
  longitude?: number
  phone?: string
  priceRange?: string
  priceMin?: number
  priceMax?: number
  ratingAvg: number
  isVegetarian: boolean
  isVegan: boolean
  openingHours?: string
  imageUrl?: string
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMeal, setGeneratedMeal] = useState<any>(null)
  const [showGeneratedMeal, setShowGeneratedMeal] = useState(false)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

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

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch dishes
      const dishesResponse = await fetch('/api/dishes?isVegetarian=true&limit=3')
      if (dishesResponse.ok) {
        const dishesData = await dishesResponse.json()
        setDishes(dishesData.dishes || [])
      }

      // Fetch restaurants
      const restaurantsResponse = await fetch('/api/restaurants?isVegetarian=true&limit=3')
      if (restaurantsResponse.ok) {
        const restaurantsData = await restaurantsResponse.json()
        setRestaurants(restaurantsData.restaurants || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRandomMeal = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      if (dishes.length > 0) {
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)]
        setGeneratedMeal(randomDish)
        setShowGeneratedMeal(true)
        toast.success("Đã tạo món ăn ngẫu nhiên!")
      } else {
        toast.error("Không có món ăn phù hợp")
      }
      setIsGenerating(false)
    }, 2000)
  }

  if (!mounted) {
    return null
  }

  if (loading) {
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
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
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
            {dishes.slice(0, 3).map((dish, index) => (
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
            {restaurants.slice(0, 3).map((restaurant, index) => (
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
      </div>

      {/* Generated Meal Modal */}
      {showGeneratedMeal && generatedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
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
          </div>
        </div>
      )}
    </div>
  )
}
