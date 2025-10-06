"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, 
  Clock, 
  Flame,
  Users,
  ChefHat,
  ShoppingCart,
  PlayCircle,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { GlobalSearch } from "@/components/GlobalSearch"
import { AppHeader } from "@/components/AppHeader"
import { AddDishToShoppingButton } from "@/components/AddDishToShoppingButton"

export default function CookPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const recipe = {
    name: "Mâm cơm chay dinh dưỡng",
    description: "Bữa trưa hoàn hảo với 3 món chay đầy đủ dinh dưỡng",
    image: "/healthy-salad-bowl-colorful-vegetables.jpg",
    prepTime: "15 phút",
    cookTime: "35 phút",
    totalTime: "50 phút",
    servings: 2,
    calories: 520,
    difficulty: "Dễ",
    dishes: [
      { name: "Đậu hũ sốt cà", calo: 180, time: "15 phút" },
      { name: "Canh bí đỏ", calo: 80, time: "10 phút" },
      { name: "Rau muống xào", calo: 60, time: "5 phút" },
    ],
    ingredients: [
      { name: "Đậu hũ", amount: "2 hộp (400g)", category: "Đạm" },
      { name: "Cà chua", amount: "3 quả", category: "Rau củ" },
      { name: "Bí đỏ", amount: "300g", category: "Rau củ" },
      { name: "Rau muống", amount: "1 bó", category: "Rau củ" },
      { name: "Tỏi", amount: "3 tép", category: "Gia vị" },
      { name: "Dầu ăn", amount: "3 muỗng", category: "Gia vị" },
      { name: "Nước mắm chay", amount: "2 muỗng", category: "Gia vị" },
      { name: "Đường", amount: "1 muỗng", category: "Gia vị" },
    ],
    steps: [
      {
        title: "Chuẩn bị nguyên liệu",
        description: "Rửa sạch tất cả rau củ. Cắt đậu hũ thành miếng vuông. Cắt cà chua múi cau. Bí đỏ thái miếng.",
        time: "10 phút",
      },
      {
        title: "Nấu canh bí đỏ",
        description: "Cho bí đỏ vào nồi với 500ml nước. Nêm nếm vừa ăn. Đun sôi 10 phút.",
        time: "10 phút",
      },
      {
        title: "Chiên đậu hũ",
        description: "Đun nóng dầu. Chiên đậu hũ vàng cả 2 mặt. Vớt ra để ráo.",
        time: "5 phút",
      },
      {
        title: "Sốt cà chua",
        description: "Phi thơm tỏi. Cho cà chua vào xào. Thêm đậu hũ vào đảo đều. Nêm nếm.",
        time: "8 phút",
      },
      {
        title: "Xào rau muống",
        description: "Phi thơm tỏi. Cho rau muống vào đảo nhanh tay. Nêm vừa ăn.",
        time: "5 phút",
      },
      {
        title: "Hoàn thành và trình bày",
        description: "Bày món ra đĩa. Trang trí với rau thơm. Ăn kèm cơm nóng.",
        time: "2 phút",
      },
    ],
  }

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const progress = (completedSteps.length / recipe.steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{recipe.name}</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Bước {completedSteps.length}/{recipe.steps.length} • {progress.toFixed(0)}% hoàn thành
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AddDishToShoppingButton
                dish={{
                  id: "combo-cook",
                  name: recipe.name,
                  ingredients: (recipe.ingredients || []).map((ing) => ({
                    id: ing.name,
                    name: ing.name,
                    quantity: 1,
                    unit: "",
                    price: 0,
                    category: ing.category,
                  })),
                  estimatedCost: 0,
                }}
                variant="outline"
                size="sm"
                showText={true}
              />
              <Link href="/shopping">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Mở danh sách</span>
                </Button>
              </Link>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-chart-2"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Recipe Header */}
        <Card className="overflow-hidden border-0 shadow-xl mb-6">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/90 text-sm mb-2">{recipe.description}</p>
              <div className="flex gap-2 flex-wrap">
                {recipe.dishes.map((dish, i) => (
                  <Badge key={i} className="bg-white/20 backdrop-blur-sm text-white">
                    {dish.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <CardContent className="p-5 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Tổng thời gian</p>
                <p className="font-bold text-sm">{recipe.totalTime}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Khẩu phần</p>
                <p className="font-bold text-sm">{recipe.servings} người</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Calories</p>
                <p className="font-bold text-sm">{recipe.calories}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <ChefHat className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Độ khó</p>
                <p className="font-bold text-sm">{recipe.difficulty}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">🥕 Nguyên liệu</h2>
              <AddDishToShoppingButton
                dish={{
                  id: "combo-cook",
                  name: recipe.name,
                  ingredients: (recipe.ingredients || []).map((ing) => ({
                    id: ing.name,
                    name: ing.name,
                    quantity: 1,
                    unit: "",
                    price: 0,
                    category: ing.category,
                  })),
                  estimatedCost: 0,
                }}
                variant="outline"
                size="sm"
              />
            </div>
            <div className="space-y-3">
              {Array.from(new Set(recipe.ingredients.map(i => i.category))).map(category => (
                <div key={category}>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">{category}</p>
                  <div className="space-y-2">
                    {recipe.ingredients
                      .filter(i => i.category === category)
                      .map((ingredient, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                          <span className="text-sm">{ingredient.name}</span>
                          <span className="text-sm font-medium text-muted-foreground">{ingredient.amount}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">👨‍🍳 Các bước thực hiện</h2>
          {recipe.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`border-2 transition-all cursor-pointer ${
                  completedSteps.includes(index)
                    ? "border-chart-2 bg-chart-2/5"
                    : "border-transparent hover:border-border"
                }`}
                onClick={() => toggleStep(index)}
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {completedSteps.includes(index) ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-10 w-10 rounded-full bg-chart-2 flex items-center justify-center"
                        >
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </motion.div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                          <span className="text-lg font-bold text-primary">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-bold text-base ${completedSteps.includes(index) ? "line-through text-muted-foreground" : ""}`}>
                          {step.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.time}
                        </Badge>
                      </div>
                      <p className={`text-sm leading-relaxed ${completedSteps.includes(index) ? "text-muted-foreground" : "text-muted-foreground"}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Complete Button */}
        <div className="sticky bottom-0 pt-6 pb-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="h-14"
              onClick={() => setCompletedSteps([])}
            >
              Làm lại
            </Button>
            <Button
              size="lg"
              className="h-14"
              disabled={completedSteps.length !== recipe.steps.length}
            >
              {completedSteps.length === recipe.steps.length ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Hoàn thành
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Bắt đầu ({completedSteps.length}/{recipe.steps.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

