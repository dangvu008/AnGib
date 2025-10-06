"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User,
  Heart,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  ChefHat,
  ShoppingCart,
  Settings,
  LogOut,
  Edit3,
  Flame,
  Target,
  Leaf
} from "lucide-react"
import { AppHeader } from "@/components/AppHeader"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const [userStats, setUserStats] = useState({
    totalMeals: 0,
    favoriteDishes: 0,
    favoriteMeals: 0,
    shoppingTrips: 0,
    totalSpent: 0,
    currentStreak: 0,
    achievements: 0,
  })

  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    // Load user data
    const settings = JSON.parse(localStorage.getItem("angi-user-settings") || "{}")
    const favDishes = JSON.parse(localStorage.getItem("angi-favorite-dishes") || "[]")
    const favMeals = JSON.parse(localStorage.getItem("angi-favorite-meals") || "[]")
    const shopping = JSON.parse(localStorage.getItem("angi-shopping-list") || "[]")

    setUserStats({
      totalMeals: 42, // Mock data
      favoriteDishes: favDishes.length,
      favoriteMeals: favMeals.length,
      shoppingTrips: 8, // Mock
      totalSpent: 850000, // Mock
      currentStreak: 7, // Mock
      achievements: 5, // Mock
    })

    setFavorites([...favDishes, ...favMeals])

    // Recent activity
    setRecentActivity([
      { type: "cook", dish: "Đậu hũ sốt cà", time: "2 giờ trước", icon: ChefHat },
      { type: "shopping", item: "Hoàn thành đi chợ", time: "1 ngày trước", icon: ShoppingCart },
      { type: "menu", menu: "Áp dụng Thực đơn chay", time: "3 ngày trước", icon: Calendar },
      { type: "achievement", title: "Đạt 7 ngày streak!", time: "3 ngày trước", icon: Award },
    ])
  }, [])

  const achievements = [
    { id: 1, name: "🔥 Streak 7 ngày", desc: "Nấu ăn 7 ngày liên tục", unlocked: true },
    { id: 2, name: "🌱 Chay master", desc: "Nấu 10 món chay", unlocked: true },
    { id: 3, name: "💰 Tiết kiệm", desc: "Chi tiêu dưới budget 3 tuần", unlocked: true },
    { id: 4, name: "👨‍🍳 Chef pro", desc: "Hoàn thành 20 công thức", unlocked: false },
    { id: 5, name: "📅 Planner", desc: "Lên kế hoạch 1 tháng", unlocked: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        {/* Profile Header */}
        <Card className="border-0 shadow-xl mb-6 overflow-hidden">
          <div className="h-24 md:h-32 bg-gradient-to-r from-primary via-chart-1 to-chart-5" />
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 -mt-12 md:-mt-16 mb-6">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-card shadow-xl flex-shrink-0 ring-2 ring-primary/20">
                <AvatarImage src="/placeholder-user.jpg" alt="Anh Tuấn" />
                <AvatarFallback className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-chart-1 text-white">
                  AT
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left pt-0 sm:pt-2">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 mb-2">
                  <h1 className="text-xl md:text-2xl font-bold">Anh Tuấn</h1>
                  <Badge className="bg-chart-2 text-white h-6">
                    <Leaf className="h-3 w-3 mr-1" />
                    Chay
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Thành viên từ tháng 10/2025</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link href="/settings" className="flex-1 sm:flex-none">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Cài đặt</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-destructive flex-1 sm:flex-none">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-chart-1/10 to-transparent rounded-lg border border-chart-1/20">
                <ChefHat className="h-6 w-6 mx-auto mb-2 text-chart-1" />
                <p className="text-2xl font-bold">{userStats.totalMeals}</p>
                <p className="text-xs text-muted-foreground">Bữa ăn</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-chart-2/10 to-transparent rounded-lg border border-chart-2/20">
                <Heart className="h-6 w-6 mx-auto mb-2 text-chart-2" />
                <p className="text-2xl font-bold">{userStats.favoriteDishes + userStats.favoriteMeals}</p>
                <p className="text-xs text-muted-foreground">Yêu thích</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-chart-3/10 to-transparent rounded-lg border border-chart-3/20">
                <Flame className="h-6 w-6 mx-auto mb-2 text-chart-3" />
                <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Ngày streak</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-chart-4/10 to-transparent rounded-lg border border-chart-4/20">
                <Award className="h-6 w-6 mx-auto mb-2 text-chart-4" />
                <p className="text-2xl font-bold">{userStats.achievements}</p>
                <p className="text-xs text-muted-foreground">Thành tựu</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">
              <Clock className="h-4 w-4 mr-2" />
              Hoạt động
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Yêu thích
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="h-4 w-4 mr-2" />
              Thành tựu
            </TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <h2 className="font-bold text-lg mb-4">📊 Hoạt động gần đây</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{activity.dish || activity.item || activity.menu || activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <h2 className="font-bold text-lg mb-4">📈 Tuần này</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Bữa ăn đã nấu</span>
                      <span className="font-bold">14/21</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full" style={{ width: "67%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Ngân sách</span>
                      <span className="font-bold">850,000₫ / 1,200,000₫</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-chart-3 to-chart-5 rounded-full" style={{ width: "71%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <h2 className="font-bold text-lg mb-4">❤️ Món yêu thích ({favorites.length})</h2>
                {favorites.length > 0 ? (
                  <div className="space-y-3">
                    {favorites.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center flex-shrink-0">
                          <Heart className="h-6 w-6 text-chart-2 fill-chart-2" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Lưu vào {new Date(item.savedAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">Xem</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Chưa có món yêu thích</p>
                    <Link href="/dishes">
                      <Button size="sm">Khám phá món ăn</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <h2 className="font-bold text-lg mb-4">🏆 Thành tựu ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.unlocked
                          ? "border-chart-3 bg-chart-3/5 shadow-sm"
                          : "border-border/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{achievement.name.split(" ")[0]}</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{achievement.name.split(" ").slice(1).join(" ")}</p>
                          <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                        </div>
                        {achievement.unlocked && (
                          <Badge className="bg-chart-3">✓</Badge>
                        )}
                      </div>
                      {!achievement.unlocked && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-chart-3 rounded-full" style={{ width: "60%" }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">60% hoàn thành</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

