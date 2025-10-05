"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Flame,
  Plus,
  TrendingUp,
  Leaf,
  ChefHat
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlobalSearch } from "@/components/GlobalSearch"
import { AppHeader } from "@/components/AppHeader"

export default function MenuPage() {
  const mealPlans = [
    {
      id: 1,
      name: "Thực đơn chay 7 ngày",
      description: "Kế hoạch ăn chay đầy đủ dinh dưỡng cho cả tuần",
      days: 7,
      meals: 21,
      calories: "1,400-1,600 calo/ngày",
      image: "/healthy-salad-bowl-colorful-vegetables.jpg",
      tags: ["Chay", "Cân bằng", "Tiết kiệm"],
    },
    {
      id: 2,
      name: "Thực đơn giảm cân",
      description: "Ăn ngon mà vẫn giữ dáng hiệu quả",
      days: 14,
      meals: 42,
      calories: "1,200-1,400 calo/ngày",
      image: "/grilled-chicken-rice-asian-meal.jpg",
      tags: ["Giảm cân", "Protein cao", "Ít carbs"],
    },
    {
      id: 3,
      name: "Thực đơn gia đình",
      description: "Bữa cơm sum vầy cho cả nhà",
      days: 7,
      meals: 21,
      calories: "1,800-2,200 calo/ngày",
      image: "/vietnamese-pho-bowl-steaming-fresh-herbs.jpg",
      tags: ["Gia đình", "Đa dạng", "Truyền thống"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">📋 Thực đơn</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kế hoạch bữa ăn cho từng mục tiêu</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-5 text-center">
              <div className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="text-xl md:text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Thực đơn</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-5 text-center">
              <div className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center">
                <ChefHat className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="text-xl md:text-2xl font-bold">84</p>
              <p className="text-xs text-muted-foreground">Bữa ăn</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-5 text-center">
              <div className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="text-xl md:text-2xl font-bold">92%</p>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </CardContent>
          </Card>
        </div>

        {/* Meal Plans */}
        <div className="space-y-4">
          {mealPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-transparent" />
                  </div>
                  <CardContent className="flex-1 p-5 md:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {plan.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag === "Chay" && <Leaf className="h-3 w-3 mr-1" />}
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Thời gian</p>
                        <p className="font-bold text-sm">{plan.days} ngày</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Bữa ăn</p>
                        <p className="font-bold text-sm">{plan.meals} món</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Calo/ngày</p>
                        <p className="font-bold text-sm flex items-center justify-center gap-1">
                          <Flame className="h-3 w-3" />
                          {plan.calories.split("-")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <ChefHat className="h-4 w-4 mr-2" />
                        Bắt đầu
                      </Button>
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

