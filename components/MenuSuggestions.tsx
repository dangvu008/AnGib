"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Flame, 
  Users, 
  Star, 
  ChefHat, 
  Leaf, 
  Heart,
  ArrowRight,
  Plus,
  Eye
} from "lucide-react"
import Link from "next/link"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { useAuth } from "@/contexts/AuthContext"
import { formatCurrency } from "@/lib/currency"

interface MenuSuggestion {
  id: string
  name: string
  description: string
  duration: string // e.g., "7 ngày", "3 ngày"
  difficulty: "Dễ" | "Trung bình" | "Khó"
  caloriesPerDay: number
  mealsCount: number
  tags: string[]
  isVegetarian: boolean
  isPopular: boolean
  rating: number
  estimatedCost: number
  image: string
  targetAudience: string
  healthGoals: string[]
  prepTime: string
}

export function MenuSuggestions() {
  const [suggestions, setSuggestions] = useState<MenuSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const { preferences, filterItems } = useUserPreferences()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    loadMenuSuggestions()
  }, [preferences])

  const loadMenuSuggestions = async () => {
    try {
      setLoading(true)
      
      // Mock data - sẽ thay bằng API call
      const mockSuggestions: MenuSuggestion[] = [
        {
          id: "menu-1",
          name: "Thực đơn chay 7 ngày",
          description: "Thực đơn chay cân bằng dinh dưỡng cho 1 tuần, phù hợp với người mới bắt đầu ăn chay",
          duration: "7 ngày",
          difficulty: "Dễ",
          caloriesPerDay: 1400,
          mealsCount: 21,
          tags: ["Chay", "Cân bằng", "Dễ nấu"],
          isVegetarian: true,
          isPopular: true,
          rating: 4.8,
          estimatedCost: 350000,
          image: "/placeholder.jpg",
          targetAudience: "Người mới ăn chay",
          healthGoals: ["Giảm cân", "Tăng cường sức khỏe"],
          prepTime: "30 phút/ngày"
        },
        {
          id: "menu-2", 
          name: "Thực đơn giảm cân",
          description: "Thực đơn ít calo, giàu protein giúp giảm cân hiệu quả và an toàn",
          duration: "14 ngày",
          difficulty: "Trung bình",
          caloriesPerDay: 1200,
          mealsCount: 42,
          tags: ["Giảm cân", "Protein cao", "Ít calo"],
          isVegetarian: false,
          isPopular: true,
          rating: 4.6,
          estimatedCost: 450000,
          image: "/placeholder.jpg",
          targetAudience: "Người muốn giảm cân",
          healthGoals: ["Giảm cân", "Tăng cơ"],
          prepTime: "45 phút/ngày"
        },
        {
          id: "menu-3",
          name: "Thực đơn gia đình",
          description: "Thực đơn đa dạng, phù hợp cho cả gia đình với các món ăn truyền thống Việt Nam",
          duration: "7 ngày",
          difficulty: "Dễ",
          caloriesPerDay: 1800,
          mealsCount: 21,
          tags: ["Gia đình", "Truyền thống", "Đa dạng"],
          isVegetarian: false,
          isPopular: false,
          rating: 4.7,
          estimatedCost: 500000,
          image: "/placeholder.jpg",
          targetAudience: "Gia đình",
          healthGoals: ["Cân bằng dinh dưỡng"],
          prepTime: "60 phút/ngày"
        },
        {
          id: "menu-4",
          name: "Thực đơn tăng cơ",
          description: "Thực đơn giàu protein, phù hợp cho người tập gym và muốn tăng cơ bắp",
          duration: "10 ngày",
          difficulty: "Khó",
          caloriesPerDay: 2200,
          mealsCount: 30,
          tags: ["Tăng cơ", "Protein cao", "Tập luyện"],
          isVegetarian: false,
          isPopular: false,
          rating: 4.5,
          estimatedCost: 600000,
          image: "/placeholder.jpg",
          targetAudience: "Người tập gym",
          healthGoals: ["Tăng cơ", "Tăng cân"],
          prepTime: "90 phút/ngày"
        },
        {
          id: "menu-5",
          name: "Thực đơn healthy",
          description: "Thực đơn lành mạnh với nhiều rau xanh, ít dầu mỡ, tốt cho sức khỏe",
          duration: "5 ngày",
          difficulty: "Dễ",
          caloriesPerDay: 1500,
          mealsCount: 15,
          tags: ["Healthy", "Rau xanh", "Ít dầu mỡ"],
          isVegetarian: true,
          isPopular: true,
          rating: 4.9,
          estimatedCost: 280000,
          image: "/placeholder.jpg",
          targetAudience: "Người quan tâm sức khỏe",
          healthGoals: ["Tăng cường sức khỏe", "Cân bằng dinh dưỡng"],
          prepTime: "25 phút/ngày"
        },
        {
          id: "menu-6",
          name: "Thực đơn văn phòng",
          description: "Thực đơn nhanh gọn, dễ chuẩn bị cho dân văn phòng bận rộn",
          duration: "5 ngày",
          difficulty: "Dễ",
          caloriesPerDay: 1600,
          mealsCount: 15,
          tags: ["Văn phòng", "Nhanh gọn", "Dễ chuẩn bị"],
          isVegetarian: false,
          isPopular: false,
          rating: 4.4,
          estimatedCost: 320000,
          image: "/placeholder.jpg",
          targetAudience: "Dân văn phòng",
          healthGoals: ["Tiết kiệm thời gian"],
          prepTime: "20 phút/ngày"
        }
      ]

      // Apply user preferences filtering if authenticated
      let filteredSuggestions = mockSuggestions
      if (isAuthenticated && preferences && filterItems) {
        filteredSuggestions = filterItems(mockSuggestions, 'dishes')
      }

      // Sort by popularity and rating
      filteredSuggestions.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1
        if (!a.isPopular && b.isPopular) return 1
        return b.rating - a.rating
      })

      setSuggestions(filteredSuggestions.slice(0, 6)) // Show top 6
    } catch (error) {
      console.error('Error loading menu suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ": return "bg-green-100 text-green-800"
      case "Trung bình": return "bg-yellow-100 text-yellow-800"
      case "Khó": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTargetAudienceIcon = (audience: string) => {
    switch (audience) {
      case "Người mới ăn chay": return Leaf
      case "Người muốn giảm cân": return Flame
      case "Gia đình": return Users
      case "Người tập gym": return ChefHat
      case "Người quan tâm sức khỏe": return Heart
      case "Dân văn phòng": return Clock
      default: return Calendar
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-9 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse h-full">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded flex-1"></div>
                <div className="h-9 w-9 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Gợi ý thực đơn</h2>
            <p className="text-sm text-muted-foreground">
              Thực đơn phù hợp với sở thích và mục tiêu của bạn
            </p>
          </div>
        </div>
        <Link href="/menu">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Xem tất cả
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((menu) => {
          const AudienceIcon = getTargetAudienceIcon(menu.targetAudience)
          
          return (
            <Card key={menu.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {menu.name}
                      </h3>
                      {menu.isPopular && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          <Star className="h-3 w-3 mr-1" />
                          Phổ biến
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {menu.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{menu.rating}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{menu.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{menu.caloriesPerDay} calo/ngày</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{menu.mealsCount} bữa</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AudienceIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{menu.targetAudience}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge 
                    variant={menu.isVegetarian ? "default" : "secondary"}
                    className="text-xs px-2 py-1"
                  >
                    {menu.isVegetarian ? (
                      <>
                        <Leaf className="h-3 w-3 mr-1" />
                        Chay
                      </>
                    ) : (
                      "Mặn"
                    )}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-1 ${getDifficultyColor(menu.difficulty)}`}
                  >
                    {menu.difficulty}
                  </Badge>
                  {menu.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Cost and Prep Time */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="font-medium">💰 {formatCurrency(menu.estimatedCost)}</span>
                  <span>⏱️ {menu.prepTime}</span>
                </div>

                {/* Health Goals */}
                {menu.healthGoals.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {menu.healthGoals.map((goal) => (
                        <Badge key={goal} variant="secondary" className="text-xs px-2 py-1">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link href={`/menu/${menu.id}`} className="flex-1">
                    <Button className="w-full h-9" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/menu?filter=vegetarian">
          <Button variant="outline" size="sm">
            <Leaf className="h-4 w-4 mr-2" />
            Thực đơn chay
          </Button>
        </Link>
        <Link href="/menu?filter=weight-loss">
          <Button variant="outline" size="sm">
            <Flame className="h-4 w-4 mr-2" />
            Giảm cân
          </Button>
        </Link>
        <Link href="/menu?filter=family">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Gia đình
          </Button>
        </Link>
        <Link href="/menu?filter=healthy">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Healthy
          </Button>
        </Link>
      </div>
    </div>
  )
}
