"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/AppHeader"
import { WeeklyPlanCard } from "@/components/WeeklyPlanCard"
import { MenuSuggestions } from "@/components/MenuSuggestions"
import { CurrentMealHighlight } from "@/components/CurrentMealHighlight"
import { Input } from "@/components/ui/input"
import {
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
  Clock,
} from "lucide-react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

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

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const quickActions = [
    {
      title: "Công thức nấu ăn",
      description: "Hàng ngàn công thức từ đơn giản đến phức tạp",
      icon: ChefHat,
      href: "/dishes",
      color: "bg-orange-500"
    },
    {
      title: "Danh sách mua sắm",
      description: "Tự động tạo danh sách đi chợ thông minh",
      icon: ShoppingCart,
      href: "/shopping",
      color: "bg-green-500"
    },
    {
      title: "Kế hoạch tuần",
      description: "Lên lịch bữa ăn cho cả tuần",
      icon: Calendar,
      href: "/weekly-plan",
      color: "bg-blue-500"
    },
    {
      title: "Theo dõi dinh dưỡng",
      description: "Quản lý calo, protein, vitamin hàng ngày",
      icon: Flame,
      href: "#",
      color: "bg-red-500"
    },
    {
      title: "Chia sẻ công thức",
      description: "Chia sẻ món ăn yêu thích với bạn bè",
      icon: Heart,
      href: "#",
      color: "bg-pink-500"
    },
    {
      title: "Tìm nhà hàng",
      description: "Khám phá quán ăn chay gần bạn",
      icon: Store,
      href: "/restaurants",
      color: "bg-indigo-500"
    },
    {
      title: "Cài đặt cá nhân",
      description: "Tùy chỉnh sở thích và chế độ ăn",
      icon: Settings,
      href: "/settings",
      color: "bg-gray-500"
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
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
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
        </div>

        {/* Quick Actions - Only for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-gray-600 mb-6 text-center">
              Khám phá tất cả tính năng hữu ích của AnGi - Trợ lý ẩm thực thông minh
            </p>
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
            <div className="text-center mt-6">
              <Link href="/settings">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Đăng nhập để sử dụng đầy đủ tính năng
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Current Meal Highlight - Most prominent section */}
        <CurrentMealHighlight />

        {/* Weekly Plan - Only for authenticated users */}
        {isAuthenticated && (
          <div className="mb-8">
            <WeeklyPlanCard />
          </div>
        )}

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

        {/* Menu Suggestions Section */}
        <div className="mb-8">
          <MenuSuggestions />
        </div>
      </div>
    </div>
  )
}
