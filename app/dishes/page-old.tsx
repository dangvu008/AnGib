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
import { useState } from "react"
import { GlobalSearch } from "@/components/GlobalSearch"
import { AppHeader } from "@/components/AppHeader"
import { QuickHideButton } from "@/components/HideButton"

export default function DishesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const dishes = [
    {
      id: 1,
      name: "Đậu hũ sốt cà chua",
      description: "Món chay đơn giản, đậm đà hương vị",
      calo: 180,
      time: "15 phút",
      difficulty: "Dễ",
      rating: 4.5,
      image: "/healthy-salad-bowl-colorful-vegetables.jpg",
      tags: ["Chay", "Dễ làm", "Ít calo"],
      isVegetarian: true,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Canh bí đỏ",
      description: "Canh ngọt thanh, bổ dưỡng",
      calo: 80,
      time: "10 phút",
      difficulty: "Dễ",
      rating: 4.8,
      image: "/healthy-salad-bowl-colorful-vegetables.jpg",
      tags: ["Chay", "Nhanh", "Healthy"],
      isVegetarian: true,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Rau muống xào tỏi",
      description: "Món rau giòn ngon, đơn giản",
      calo: 60,
      time: "5 phút",
      difficulty: "Rất dễ",
      rating: 4.3,
      image: "/healthy-salad-bowl-colorful-vegetables.jpg",
      tags: ["Chay", "Express", "Tiết kiệm"],
      isVegetarian: true,
      isFavorite: false,
    },
    {
      id: 4,
      name: "Nấm xào rau củ",
      description: "Thơm ngon, giàu vitamin",
      calo: 150,
      time: "12 phút",
      difficulty: "Dễ",
      rating: 4.6,
      image: "/grilled-chicken-rice-asian-meal.jpg",
      tags: ["Chay", "Protein cao", "Ngon"],
      isVegetarian: true,
      isFavorite: true,
    },
  ]

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">🍲 Món ăn</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kho công thức nấu ăn</p>
        </div>

        {/* Local Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm món ăn trong trang này..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-6">
          <Badge variant="default" className="cursor-pointer whitespace-nowrap">
            Tất cả ({dishes.length})
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap">
            <Leaf className="h-3 w-3 mr-1" />
            Chay
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap">
            <Flame className="h-3 w-3 mr-1" />
            Ít calo
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap">
            <Clock className="h-3 w-3 mr-1" />
            Nhanh
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap">
            <Heart className="h-3 w-3 mr-1" />
            Yêu thích
          </Badge>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
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
                        itemName={dish.name}
                        itemType="meal"
                        itemImage={dish.image}
                        className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Heart
                          className={`h-4 w-4 ${dish.isFavorite ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1 text-white">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{dish.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-base mb-1 line-clamp-1">{dish.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {dish.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      {dish.calo} calo
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      {dish.time}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {dish.difficulty}
                    </Badge>
                  </div>
                  <Button className="w-full" size="sm">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Xem công thức
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy món ăn phù hợp</p>
          </div>
        )}
      </main>
    </div>
  )
}

