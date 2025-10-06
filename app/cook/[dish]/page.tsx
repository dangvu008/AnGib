"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Flame,
  Users,
  ChefHat,
  ShoppingCart,
  PlayCircle,
  CheckCircle2,
  Lightbulb
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { AppHeader } from "@/components/AppHeader"
import { ShareButton } from "@/components/ShareButton"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { AddDishToShoppingButton } from "@/components/AddDishToShoppingButton"

// Database công thức chi tiết cho từng món
const recipesDatabase: any = {
  "dau-hu-sot-ca": {
    name: "Đậu hũ sốt cà chua",
    slug: "dau-hu-sot-ca",
    description: "Món chay đơn giản nhưng đậm đà, giàu protein thực vật",
    image: "/healthy-salad-bowl-colorful-vegetables.jpg",
    prepTime: "5 phút",
    cookTime: "15 phút",
    totalTime: "20 phút",
    servings: 2,
    calories: 180,
    protein: 12,
    carbs: 15,
    fat: 8,
    difficulty: "Dễ",
    tags: ["Chay", "Protein cao", "Dễ làm"],
    ingredients: [
      { name: "Đậu hũ", amount: "2 hộp (400g)", category: "Đạm" },
      { name: "Cà chua", amount: "3 quả", category: "Rau củ" },
      { name: "Tỏi", amount: "3 tép", category: "Gia vị" },
      { name: "Hành lá", amount: "2 cây", category: "Rau củ" },
      { name: "Dầu ăn", amount: "2 muỗng", category: "Gia vị" },
      { name: "Nước mắm chay", amount: "1 muỗng", category: "Gia vị" },
      { name: "Đường", amount: "1/2 muỗng", category: "Gia vị" },
    ],
    steps: [
      {
        title: "Chuẩn bị nguyên liệu",
        description: "Rửa sạch đậu hũ, thấm ráo nước. Cắt thành miếng vuông 2cm. Cà chua thái múi cau. Tỏi băm nhỏ, hành lá cắt khúc.",
        time: "5 phút",
      },
      {
        title: "Chiên đậu hũ",
        description: "Đun nóng dầu ăn trong chảo. Cho đậu hũ vào chiên trên lửa vừa đến khi vàng đều 2 mặt (khoảng 5 phút). Vớt ra để ráo dầu.",
        time: "5 phút",
      },
      {
        title: "Xào cà chua",
        description: "Phi thơm tỏi băm với dầu còn lại. Cho cà chua vào xào đến khi cà chua chín mềm, ra nước.",
        time: "3 phút",
      },
      {
        title: "Hoàn thiện món",
        description: "Thêm đậu hũ đã chiên vào đảo đều. Nêm nước mắm chay, đường vừa ăn. Rắc hành lá, đảo nhẹ 1 phút, tắt bếp.",
        time: "2 phút",
      },
    ],
    tips: "💡 Chiên đậu hũ trên lửa vừa để giòn ngoài mềm trong. Chọn cà chua chín đỏ để món ngon hơn và đẹp mắt.",
    notes: "Món này có thể ăn với cơm nóng hoặc bún. Bảo quản được 2 ngày trong tủ lạnh.",
  },
  "canh-bi-do": {
    name: "Canh bí đỏ thanh mát",
    slug: "canh-bi-do",
    description: "Canh ngọt thanh, bổ dưỡng, giàu vitamin A",
    image: "/healthy-salad-bowl-colorful-vegetables.jpg",
    prepTime: "3 phút",
    cookTime: "10 phút",
    totalTime: "13 phút",
    servings: 2,
    calories: 80,
    protein: 2,
    carbs: 18,
    fat: 0,
    difficulty: "Rất dễ",
    tags: ["Chay", "Healthy", "Nhanh"],
    ingredients: [
      { name: "Bí đỏ", amount: "300g", category: "Rau củ" },
      { name: "Nước", amount: "500ml", category: "Khác" },
      { name: "Muối", amount: "1 muỗng cà phê", category: "Gia vị" },
      { name: "Hành lá", amount: "1 cây", category: "Rau củ" },
      { name: "Tiêu", amount: "Chút xíu", category: "Gia vị" },
    ],
    steps: [
      {
        title: "Sơ chế bí đỏ",
        description: "Bí đỏ gọt vỏ, bỏ hạt, rửa sạch. Thái miếng vuông vừa ăn (khoảng 2-3cm).",
        time: "3 phút",
      },
      {
        title: "Đun nước",
        description: "Cho 500ml nước vào nồi, đun sôi trên lửa lớn.",
        time: "2 phút",
      },
      {
        title: "Nấu canh",
        description: "Cho bí đỏ vào nồi nước đang sôi. Giảm lửa vừa, đậy nắp nấu 8-10 phút đến khi bí mềm.",
        time: "10 phút",
      },
      {
        title: "Hoàn thiện",
        description: "Nêm muối vừa ăn. Rắc hành lá, tiêu. Tắt bếp, múc ra bát.",
        time: "1 phút",
      },
    ],
    tips: "💡 Chọn bí đỏ có màu đậm, vỏ láng để canh ngọt tự nhiên. Không nên nấu quá lâu kẻo bí bị nhão.",
    notes: "Canh có thể thêm rau ngót hoặc tôm khô (nếu không chay) để tăng vị umami.",
  },
  "rau-den-xao-toi": {
    name: "Rau dền xào tỏi thơm",
    slug: "rau-den-xao-toi",
    description: "Món rau giàu sắt, nhanh gọn, dễ làm",
    image: "/healthy-salad-bowl-colorful-vegetables.jpg",
    prepTime: "2 phút",
    cookTime: "5 phút",
    totalTime: "7 phút",
    servings: 2,
    calories: 55,
    protein: 3,
    carbs: 8,
    fat: 2,
    difficulty: "Rất dễ",
    tags: ["Chay", "Express", "Giàu sắt"],
    ingredients: [
      { name: "Rau dền", amount: "1 bó (300g)", category: "Rau củ" },
      { name: "Tỏi", amount: "3 tép", category: "Gia vị" },
      { name: "Dầu ăn", amount: "1 muỗng", category: "Gia vị" },
      { name: "Muối", amount: "1/2 muỗng", category: "Gia vị" },
      { name: "Nước mắm chay", amount: "1/2 muỗng (tuỳ chọn)", category: "Gia vị" },
    ],
    steps: [
      {
        title: "Sơ chế rau dền",
        description: "Rau dền nhặt bỏ lá già, thân cứng. Rửa sạch qua nước 2-3 lần. Để ráo.",
        time: "2 phút",
      },
      {
        title: "Phi tỏi",
        description: "Đun nóng chảo với 1 muỗng dầu ăn. Cho tỏi băm vào phi thơm trên lửa vừa đến khi tỏi vàng.",
        time: "1 phút",
      },
      {
        title: "Xào rau dền",
        description: "Bật lửa lớn, cho rau dền vào đảo nhanh tay trong 2-3 phút. Rau héo mềm là được.",
        time: "3 phút",
      },
      {
        title: "Nêm nếm",
        description: "Nêm muối, nước mắm chay (nếu có) vừa ăn. Đảo đều, tắt bếp ngay. Múc ra đĩa.",
        time: "1 phút",
      },
    ],
    tips: "💡 Xào rau dền trên lửa lớn để giữ màu xanh tươi. Không xào quá lâu kẻo rau nhũn và mất vitamin. Rau dền giàu sắt, rất tốt cho người thiếu máu.",
    notes: "Rau dền có 2 loại: dền đỏ và dền xanh. Cả 2 đều ngon, chọn loại nào tùy thích.",
  },
}

export default function CookDishPage() {
  const params = useParams()
  const dishSlug = params.dish as string
  const recipe = recipesDatabase[dishSlug]

  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(`angi-cook-progress-${dishSlug}`)
    if (saved) {
      setCompletedSteps(JSON.parse(saved))
    }
  }, [dishSlug])

  useEffect(() => {
    // Save progress
    if (completedSteps.length > 0) {
      localStorage.setItem(`angi-cook-progress-${dishSlug}`, JSON.stringify(completedSteps))
    }
  }, [completedSteps, dishSlug])

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const progress = recipe ? (completedSteps.length / recipe.steps.length) * 100 : 0

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <AppHeader />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy công thức</h1>
          <p className="text-muted-foreground mb-6">Món ăn này chưa có trong hệ thống</p>
          <Link href="/">
            <Button>Về trang chủ</Button>
          </Link>
        </main>
      </div>
    )
  }

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
              <ShareButton
                content={{
                  title: recipe.name,
                  description: recipe.description,
                  type: 'recipe',
                  data: {
                    prepTime: recipe.prepTime,
                    cookTime: recipe.cookTime,
                    servings: recipe.servings,
                    calories: recipe.calories,
                    ingredients: recipe.ingredients.map((ing: any) => `${ing.amount} ${ing.name}`),
                    steps: recipe.steps.map((step: any) => step.description),
                    tags: recipe.tags
                  }
                }}
                size="sm"
                variant="outline"
              />
              <AddDishToShoppingButton
                dish={{
                  id: recipe.slug,
                  name: recipe.name,
                  ingredients: (recipe.ingredients || []).map((ing: any) => ({
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
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/90 text-sm mb-2">{recipe.description}</p>
              <div className="flex gap-2 flex-wrap">
                {recipe.tags.map((tag: string, i: number) => (
                  <Badge key={i} className="bg-white/20 backdrop-blur-sm text-white">
                    {tag}
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
              <Link href="/shopping">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {Array.from(new Set(recipe.ingredients.map((i: any) => i.category))).map(category => (
                <div key={category}>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">{category}</p>
                  <div className="space-y-2">
                    {recipe.ingredients
                      .filter((i: any) => i.category === category)
                      .map((ingredient: any, i: number) => (
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
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-bold">👨‍🍳 Các bước thực hiện</h2>
          {recipe.steps.map((step: any, index: number) => (
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

        {/* Tips & Notes */}
        <div className="space-y-4 mb-6">
          <Card className="border-0 shadow-lg bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-base text-amber-900 dark:text-amber-100 mb-2">
                    Mẹo hay
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                    {recipe.tips}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {recipe.notes && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-2">📝 Ghi chú</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recipe.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Complete Buttons */}
        <div className="sticky bottom-0 pt-6 pb-6 bg-gradient-to-t from-background via-background to-transparent">
          {/* Quick Complete Button - Khi chưa hoàn thành */}
          {completedSteps.length < recipe.steps.length && completedSteps.length > 0 && (
            <div className="mb-3">
              <Button
                variant="secondary"
                size="sm"
                className="w-full h-10 gap-2"
                onClick={() => {
                  const allSteps = Array.from({ length: recipe.steps.length }, (_, i) => i)
                  setCompletedSteps(allSteps)
                  toast.success("⚡ Đã đánh dấu tất cả bước hoàn thành!", {
                    description: "Bạn có thể xem lại hoặc hoàn thành món"
                  })
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Hoàn thành nhanh (skip các bước còn lại)
              </Button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="lg"
              className="h-14"
              onClick={() => {
                setCompletedSteps([])
                localStorage.removeItem(`angi-cook-progress-${dishSlug}`)
                toast.info("🔄 Đã reset tiến trình")
              }}
            >
              Làm lại
            </Button>
            
            {/* Skip all button */}
            {completedSteps.length === 0 && (
              <Button
                variant="secondary"
                size="lg"
                className="h-14"
                onClick={() => {
                  const allSteps = Array.from({ length: recipe.steps.length }, (_, i) => i)
                  setCompletedSteps(allSteps)
                  toast.success("⚡ Đã tick tất cả bước!")
                }}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Tick tất cả
              </Button>
            )}
            
            <Button
              size="lg"
              className={`h-14 ${completedSteps.length === 0 ? 'col-span-2' : 'col-span-2'}`}
              disabled={completedSteps.length !== recipe.steps.length}
              onClick={() => {
                toast.success("🎉 Hoàn thành nấu món!", {
                  description: recipe.name,
                  duration: 3000
                })
                setTimeout(() => {
                  setCompletedSteps([])
                  localStorage.removeItem(`angi-cook-progress-${dishSlug}`)
                }, 2000)
              }}
            >
              {completedSteps.length === recipe.steps.length ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Hoàn thành món
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Đang nấu ({completedSteps.length}/{recipe.steps.length})
                </>
              )}
            </Button>
          </div>

          {/* Hint */}
          <p className="text-xs text-center text-muted-foreground mt-3">
            💡 Tick từng bước hoặc dùng "Tick tất cả" nếu đã biết cách làm
          </p>
        </div>
      </main>
    </div>
  )
}

