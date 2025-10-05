"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Shuffle,
  ChefHat,
  Store,
  TrendingUp,
  Flame,
  DollarSign,
  Calendar,
  ArrowRight,
  Utensils,
  Sparkles,
  Leaf,
  Settings,
  CheckCircle2,
  Info,
  Menu,
  Home,
  BookOpen,
  ShoppingCart,
  RefreshCw,
  Target,
  Users,
  Heart,
  MessageCircle,
  Lightbulb,
  Sun,
  Snowflake,
  CloudRain,
  Check,
  Plus,
  Minus,
  X,
} from "lucide-react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import { GlobalSearch } from "@/components/GlobalSearch"

// Hàm detect mùa dựa trên tháng
const getSeason = () => {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) return "spring"
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 9 && month <= 11) return "autumn"
  return "winter"
}

// Gợi ý món ăn theo mùa
const seasonalDishes = {
  summer: {
    savory: [
      { name: "Gỏi cuốn chay", calo: 120, time: "10 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "summer" },
      { name: "Đậu hũ lạnh sốt cà", calo: 160, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "summer" },
      { name: "Salad rau trộn", calo: 90, time: "8 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "summer" },
    ],
    soup: [
      { name: "Canh chua chay", calo: 90, time: "15 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "summer" },
      { name: "Canh rau ngót", calo: 60, time: "8 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "summer" },
    ],
  },
  winter: {
    savory: [
      { name: "Đậu hũ sốt cà", calo: 180, time: "15 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "winter" },
      { name: "Nấm xào rau củ", calo: 150, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "winter" },
      { name: "Cà ri chay", calo: 200, time: "25 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "winter" },
    ],
    soup: [
      { name: "Canh bí đỏ", calo: 80, time: "10 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "winter" },
      { name: "Canh nấm hương", calo: 70, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "winter" },
      { name: "Lẩu chay nóng", calo: 150, time: "30 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "winter" },
    ],
  },
  spring: {
    savory: [
      { name: "Đậu hũ sốt cà", calo: 180, time: "15 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "spring" },
      { name: "Nấm xào rau củ", calo: 150, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "spring" },
    ],
    soup: [
      { name: "Canh bí đỏ", calo: 80, time: "10 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "spring" },
      { name: "Canh rau ngót", calo: 60, time: "8 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "spring" },
    ],
  },
  autumn: {
    savory: [
      { name: "Đậu hũ sốt cà", calo: 180, time: "15 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "autumn" },
      { name: "Nấm xào rau củ", calo: 150, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "autumn" },
    ],
    soup: [
      { name: "Canh bí đỏ", calo: 80, time: "10 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "autumn" },
      { name: "Canh nấm hương", calo: 70, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg", seasonality: "autumn" },
    ],
  },
}

export default function HomePage() {
  const [currentSeason, setCurrentSeason] = useState(getSeason())
  const [currentDishes, setCurrentDishes] = useState({
    savory: "Đậu hũ sốt cà",
    soup: "Canh bí đỏ",
    vegetable: "Rau muống xào",
  })
  const [mealCompleted, setMealCompleted] = useState(false)
  const [missions, setMissions] = useState([
    { id: 1, title: "Nấu 1 món mới", completed: false },
    { id: 2, title: "Ăn ngoài ≤2 lần", completed: true },
    { id: 3, title: "Dùng lại nguyên liệu dư", completed: true },
  ])
  
  // Filter states for dish selection sheets
  const [savoryFilter, setSavoryFilter] = useState<"all" | "low-cal" | "fast" | "popular">("all")
  const [soupFilter, setSoupFilter] = useState<"all" | "low-cal" | "fast" | "popular">("all")
  const [vegetableFilter, setVegetableFilter] = useState<"all" | "low-cal" | "fast" | "popular">("all")
  
  // Dish detail view
  const [selectedDish, setSelectedDish] = useState<{name: string, category: string, details: any} | null>(null)
  
  // Sheet states for changing dishes
  const [changeSavoryOpen, setChangeSavoryOpen] = useState(false)
  const [changeSoupOpen, setChangeSoupOpen] = useState(false)
  const [changeVegetableOpen, setChangeVegetableOpen] = useState(false)
  const [cookMenuOpen, setCookMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Meal times settings (có thể customize)
  const mealTimes = {
    breakfast: { hour: 7, minute: 0, label: "Bữa sáng" },
    lunch: { hour: 12, minute: 30, label: "Bữa trưa" },
    dinner: { hour: 18, minute: 30, label: "Bữa tối" },
  }

  // Detect current meal based on time
  const getCurrentMeal = () => {
    const hour = currentTime.getHours()
    
    if (hour >= 5 && hour < 11) {
      return { type: "breakfast", label: "Bữa sáng", time: "07:00" }
    } else if (hour >= 11 && hour < 16) {
      return { type: "lunch", label: "Bữa trưa", time: "12:30" }
    } else if (hour >= 16 && hour < 21) {
      return { type: "dinner", label: "Bữa tối", time: "18:30" }
    } else {
      return { type: "dinner", label: "Bữa tối", time: "18:30" } // Đêm khuya → bữa tối tiếp theo
    }
  }

  const currentMeal = getCurrentMeal()
  
  // Shopping preparation state
  const [shoppingItems, setShoppingItems] = useState([
    { id: 1, name: "Đậu hũ", amount: "2 hộp (400g)", baseAmount: "2 hộp", quantity: 1, price: 15000, category: "Đạm", available: true, note: "" },
    { id: 2, name: "Cà chua", amount: "3 quả", baseAmount: "3 quả", quantity: 1, price: 20000, category: "Rau củ", available: false, note: "Chọn quả chín đỏ" },
    { id: 3, name: "Bí đỏ", amount: "300g", baseAmount: "300g", quantity: 1, price: 18000, category: "Rau củ", available: true, note: "" },
    { id: 4, name: "Rau muống", amount: "1 bó", baseAmount: "1 bó", quantity: 1, price: 8000, category: "Rau củ", available: false, note: "Tươi, non" },
    { id: 5, name: "Nấm (nếu dùng)", amount: "200g", baseAmount: "200g", quantity: 1, price: 25000, category: "Đạm", available: false, note: "" },
    { id: 6, name: "Tỏi", amount: "5 tép", baseAmount: "5 tép", quantity: 1, price: 5000, category: "Gia vị", available: true, note: "" },
    { id: 7, name: "Dầu ăn", amount: "3 muỗng", baseAmount: "3 muỗng", quantity: 1, price: 0, category: "Gia vị", available: true, note: "" },
    { id: 8, name: "Nước mắm chay", amount: "2 muỗng", baseAmount: "2 muỗng", quantity: 1, price: 0, category: "Gia vị", available: true, note: "" },
  ])
  
  const [editingShoppingNote, setEditingShoppingNote] = useState<number | null>(null)
  const [editingShoppingPrice, setEditingShoppingPrice] = useState<number | null>(null)
  const [tempShoppingNote, setTempShoppingNote] = useState("")
  const [tempShoppingPrice, setTempShoppingPrice] = useState("")

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

  // Check meal time notifications
  useEffect(() => {
    const checkMealTime = () => {
      const now = currentTime
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentSecond = now.getSeconds()

      // Chỉ thông báo đúng phút, giây = 0
      if (currentSecond !== 0) return

      // Check từng bữa ăn
      Object.entries(mealTimes).forEach(([meal, time]) => {
        if (currentHour === time.hour && currentMinute === time.minute) {
          // Lấy món ăn từ thực đơn nếu có
          let mealDescription = "Đã đến giờ ăn!"
          
          if (activeMenu && activeMenu.schedule) {
            const startDate = new Date(activeMenu.startDate)
            const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            
            if (daysPassed >= 0 && daysPassed < activeMenu.days && activeMenu.schedule[daysPassed]) {
              const todayMeal = activeMenu.schedule[daysPassed]
              const mealKey = meal as keyof typeof todayMeal
              mealDescription = todayMeal[mealKey] || mealDescription
            }
          }

          toast.info(`🍽️ ${time.label}!`, {
            description: mealDescription,
            duration: 10000,
            action: {
              label: "Xem món",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" })
            }
          })

          // Play notification sound (optional)
          if (typeof Audio !== 'undefined') {
            try {
              const audio = new Audio('/notification.mp3')
              audio.volume = 0.3
              audio.play().catch(() => {}) // Ignore errors
            } catch (e) {}
          }
        }
      })
    }

    checkMealTime()
  }, [currentTime, activeMenu, mealTimes])

  useEffect(() => {
    setCurrentSeason(getSeason())
    
    // Load active menu from localStorage
    const savedMenu = localStorage.getItem("angi-active-menu")
    if (savedMenu) {
      try {
        const menu = JSON.parse(savedMenu)
        setActiveMenu(menu)
        
        // Tính ngày hiện tại trong kế hoạch
        const startDate = new Date(menu.startDate)
        const today = new Date()
        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        // Nếu còn trong khoảng thời gian thực đơn
        if (daysPassed >= 0 && daysPassed < menu.days && menu.schedule && menu.schedule[daysPassed]) {
          const todayMeal = menu.schedule[daysPassed]
          
          // Cập nhật món ăn từ thực đơn (giả lập - cần map với database thực)
          // Tạm thời dùng món mặc định nhưng hiển thị từ schedule
          toast.info(`📅 Hôm nay là Ngày ${daysPassed + 1} của ${menu.name}`, {
            description: `Trưa: ${todayMeal.lunch}`,
            duration: 4000
          })
        } else if (daysPassed >= menu.days) {
          // Thực đơn đã hết hạn
          toast.warning("⏰ Thực đơn đã hoàn thành!", {
            description: "Hãy chọn thực đơn mới hoặc gia hạn",
            action: {
              label: "Xem thực đơn",
              onClick: () => window.location.href = "/menu"
            }
          })
        }
      } catch (e) {
        console.error("Failed to load active menu", e)
      }
    }
    
    // Load shopping status from localStorage
    const savedStatus = localStorage.getItem("angi-shopping-status")
    if (savedStatus) {
      try {
        const status = JSON.parse(savedStatus)
        setShoppingItems(prev => 
          prev.map(item => {
            const saved = status.find((s: any) => s.id === item.id)
            return saved ? { ...item, available: saved.available } : item
          })
        )
      } catch (e) {
        console.error("Failed to load shopping status", e)
      }
    }
  }, [])

  // Save shopping status when changed
  useEffect(() => {
    const status = shoppingItems.map(item => ({ id: item.id, available: item.available }))
    localStorage.setItem("angi-shopping-status", JSON.stringify(status))
  }, [shoppingItems])

  const dishAlternatives = {
    savory: [
      { name: "Đậu hũ sốt cà", calo: 180, time: "15 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Nấm xào rau củ", calo: 150, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Đậu phụ chiên giòn", calo: 220, time: "18 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Cà tím xào tỏi", calo: 140, time: "10 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
    ],
    soup: [
      { name: "Canh bí đỏ", calo: 80, time: "10 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Canh chua chay", calo: 90, time: "15 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Canh rau ngót", calo: 60, time: "8 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Canh nấm hương", calo: 70, time: "12 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
    ],
    vegetable: [
      { name: "Rau muống xào", calo: 60, time: "5 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Cải xanh luộc", calo: 40, time: "5 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Đậu cove xào", calo: 50, time: "6 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
      { name: "Rau dền xào tỏi", calo: 55, time: "7 phút", image: "/healthy-salad-bowl-colorful-vegetables.jpg" },
    ],
  }

  const handleDishChange = (category: "savory" | "soup" | "vegetable", dishName: string) => {
    setCurrentDishes((prev) => ({
      ...prev,
      [category]: dishName,
    }))
    
    // Show toast notification
    const categoryText = category === "savory" ? "món mặn" : category === "soup" ? "món canh" : "món rau"
    toast.success(`Đã chọn ${categoryText}: ${dishName}`, {
      duration: 2000,
    })
  }

  const handleMealComplete = () => {
    setMealCompleted(true)
    setTimeout(() => setMealCompleted(false), 2000)
    
    toast.success("🍽️ Chúc ngon miệng!", {
      description: "Bữa ăn đã hoàn thành",
      duration: 2000,
    })
  }

  const toggleMission = (id: number) => {
    const mission = missions.find((m) => m.id === id)
    const willBeCompleted = mission ? !mission.completed : false
    
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)))
    
    if (willBeCompleted && mission) {
      toast.success(`✅ Hoàn thành: ${mission.title}`, {
        duration: 2000,
      })
    }
  }

  const toggleShoppingItem = (id: number) => {
    setShoppingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    )
  }

  const updateShoppingQuantity = (id: number, delta: number) => {
    setShoppingItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQty, amount: `${item.baseAmount} x${newQty}` }
        }
        return item
      })
    )
  }

  const updateShoppingNote = (id: number, note: string) => {
    setShoppingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    )
    setEditingShoppingNote(null)
    setTempShoppingNote("")
    if (note.trim()) {
      toast.success("💡 Đã lưu ghi chú")
    }
  }

  const updateShoppingPrice = (id: number) => {
    const price = parseInt(tempShoppingPrice.replace(/\D/g, ""))
    
    if (isNaN(price) || price < 0) {
      toast.error("❌ Giá không hợp lệ", {
        description: "Vui lòng nhập số dương"
      })
      return
    }

    if (price > 1000000) {
      toast.error("❌ Giá quá cao", {
        description: "Vui lòng kiểm tra lại"
      })
      return
    }

    setShoppingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price } : item))
    )
    setEditingShoppingPrice(null)
    setTempShoppingPrice("")
    toast.success("💰 Đã cập nhật giá")
  }

  const getShoppingStats = () => {
    const total = shoppingItems.length
    const available = shoppingItems.filter((item) => item.available).length
    const percentage = Math.round((available / total) * 100)
    const totalCost = shoppingItems.reduce((sum, item) => sum + item.price, 0)
    const needToBuy = shoppingItems.filter((item) => !item.available)
    const costToBuy = needToBuy.reduce((sum, item) => sum + item.price, 0)
    
    return { total, available, percentage, totalCost, needToBuy, costToBuy }
  }

  // Get dish details
  const getDishDetails = (dishName: string, category: string) => {
    const dishDatabase: any = {
      "Đậu hũ sốt cà": {
        name: "Đậu hũ sốt cà chua",
        description: "Món chay đơn giản nhưng đậm đà, giàu protein thực vật",
        image: "/healthy-salad-bowl-colorful-vegetables.jpg",
        calo: 180,
        protein: 12,
        carbs: 15,
        fat: 8,
        time: "15 phút",
        difficulty: "Dễ",
        servings: 2,
        tags: ["Chay", "Protein cao", "Dễ làm"],
        ingredients: [
          { name: "Đậu hũ", amount: "2 hộp (400g)" },
          { name: "Cà chua", amount: "3 quả" },
          { name: "Tỏi", amount: "3 tép" },
          { name: "Hành lá", amount: "2 cây" },
          { name: "Dầu ăn", amount: "2 muỗng" },
          { name: "Nước mắm chay", amount: "1 muỗng" },
          { name: "Đường", amount: "1/2 muỗng" },
        ],
        steps: [
          "Cắt đậu hũ thành miếng vuông 2cm, chiên vàng",
          "Phi thơm tỏi băm, cho cà chua vào xào",
          "Thêm đậu hũ đã chiên, nêm nếm vừa ăn",
          "Thêm hành lá, đảo đều, tắt bếp",
        ],
        tips: "Chiên đậu hũ trên lửa vừa để giòn ngoài mềm trong. Chọn cà chua chín đỏ để món ngon hơn.",
      },
      "Canh bí đỏ": {
        name: "Canh bí đỏ thanh mát",
        description: "Canh ngọt thanh, bổ dưỡng, giàu vitamin A",
        image: "/healthy-salad-bowl-colorful-vegetables.jpg",
        calo: 80,
        protein: 2,
        carbs: 18,
        fat: 0,
        time: "10 phút",
        difficulty: "Rất dễ",
        servings: 2,
        tags: ["Chay", "Healthy", "Nhanh"],
        ingredients: [
          { name: "Bí đỏ", amount: "300g" },
          { name: "Nước", amount: "500ml" },
          { name: "Muối", amount: "1 muỗng" },
          { name: "Hành lá", amount: "1 cây" },
        ],
        steps: [
          "Bí đỏ gọt vỏ, thái miếng vừa ăn",
          "Đun sôi nước, cho bí đỏ vào nấu",
          "Nêm muối vừa ăn, đun 8-10 phút",
          "Rắc hành lá, tắt bếp",
        ],
        tips: "Chọn bí đỏ có màu đậm, vỏ láng để canh ngọt tự nhiên.",
      },
      "Rau dền xào tỏi": {
        name: "Rau dền xào tỏi thơm",
        description: "Món rau giàu sắt, nhanh gọn, dễ làm",
        image: "/healthy-salad-bowl-colorful-vegetables.jpg",
        calo: 55,
        protein: 3,
        carbs: 8,
        fat: 2,
        time: "7 phút",
        difficulty: "Rất dễ",
        servings: 2,
        tags: ["Chay", "Express", "Giàu sắt"],
        ingredients: [
          { name: "Rau dền", amount: "1 bó" },
          { name: "Tỏi", amount: "3 tép" },
          { name: "Dầu ăn", amount: "1 muỗng" },
          { name: "Muối", amount: "1/2 muỗng" },
        ],
        steps: [
          "Rau dền nhặt sạch, rửa qua nước",
          "Phi thơm tỏi băm với dầu ăn",
          "Cho rau dền vào đảo nhanh tay",
          "Nêm muối, đảo đều, tắt bếp ngay",
        ],
        tips: "Xào rau dền trên lửa lớn để giữ màu xanh tươi. Không xào quá lâu kẻo rau nhũn.",
      },
    }

    return dishDatabase[dishName] || null
  }

  const handleViewDishDetail = (dishName: string, category: string) => {
    const details = getDishDetails(dishName, category)
    if (details) {
      setSelectedDish({ name: dishName, category, details })
    } else {
      toast.info("📖 Công thức đang được cập nhật")
    }
  }

  // Convert dish name to slug
  const getSlugFromDishName = (dishName: string) => {
    const slugMap: any = {
      "Đậu hũ sốt cà": "dau-hu-sot-ca",
      "Canh bí đỏ": "canh-bi-do",
      "Rau dền xào tỏi": "rau-den-xao-toi",
      "Rau muống xào": "rau-muong-xao",
    }
    return slugMap[dishName] || dishName.toLowerCase().replace(/\s+/g, "-")
  }

  const getSeasonIcon = () => {
    switch (currentSeason) {
      case "summer":
        return <Sun className="h-4 w-4 text-orange-500" />
      case "winter":
        return <Snowflake className="h-4 w-4 text-blue-400" />
      case "spring":
        return <Sparkles className="h-4 w-4 text-green-500" />
      case "autumn":
        return <Leaf className="h-4 w-4 text-amber-600" />
      default:
        return <CloudRain className="h-4 w-4" />
    }
  }

  const getSeasonText = () => {
    switch (currentSeason) {
      case "summer":
        return "Mùa hè - Gợi ý món mát, nhẹ nhàng"
      case "winter":
        return "Mùa đông - Gợi ý món hầm, canh nóng"
      case "spring":
        return "Mùa xuân - Gợi ý món tươi mới"
      case "autumn":
        return "Mùa thu - Gợi ý món ấm áp"
      default:
        return "Gợi ý theo thời tiết"
    }
  }

  // Filter functions
  const filterDishes = (dishes: any[], filterType: string) => {
    switch (filterType) {
      case "low-cal":
        return [...dishes].sort((a, b) => a.calo - b.calo)
      case "fast":
        return [...dishes].sort((a, b) => {
          const timeA = parseInt(a.time)
          const timeB = parseInt(b.time)
          return timeA - timeB
        })
      case "popular":
        // Giả lập "phổ biến" - có thể thay bằng data thực
        return [...dishes].reverse()
      default:
        return dishes
    }
  }

  // Random dish for entire meal
  const handleRandomMeal = () => {
    const randomSavory = dishAlternatives.savory[Math.floor(Math.random() * dishAlternatives.savory.length)]
    const randomSoup = dishAlternatives.soup[Math.floor(Math.random() * dishAlternatives.soup.length)]
    const randomVegetable = dishAlternatives.vegetable[Math.floor(Math.random() * dishAlternatives.vegetable.length)]
    
    setCurrentDishes({
      savory: randomSavory.name,
      soup: randomSoup.name,
      vegetable: randomVegetable.name,
    })
    
    toast.success("🎲 Đã đổi bữa ăn ngẫu nhiên!", {
      description: `${randomSavory.name} • ${randomSoup.name} • ${randomVegetable.name}`,
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/40 bg-card/95 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-chart-1 to-chart-5 flex items-center justify-center shadow-xl shadow-primary/30">
              <ChefHat className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-5 bg-clip-text text-transparent">
                MealPlan AI
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Trợ lý ẩm thực thông minh</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 md:gap-3">
            <GlobalSearch />
            
            <Link href="/menu">
            <Button variant="ghost" size="sm" className="hidden md:flex font-medium hover:bg-primary/10">
              Thực đơn
            </Button>
            </Link>
            <Link href="/dishes">
            <Button variant="ghost" size="sm" className="hidden md:flex font-medium hover:bg-primary/10">
              Món ăn
            </Button>
            </Link>
            <Link href="/shopping">
            <Button variant="ghost" size="sm" className="hidden md:flex font-medium hover:bg-primary/10">
              Đi chợ
            </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-chart-1 to-chart-5 flex items-center justify-center">
                      <ChefHat className="h-4 w-4 text-primary-foreground" />
                    </div>
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  <Link href="/" className="w-full">
                    <Button variant="ghost" className="w-full justify-start h-12 text-base font-medium">
                    <Home className="mr-3 h-5 w-5" />
                    Trang chủ
                  </Button>
                  </Link>
                  <Link href="/menu" className="w-full">
                    <Button variant="ghost" className="w-full justify-start h-12 text-base font-medium">
                    <BookOpen className="mr-3 h-5 w-5" />
                    Thực đơn
                  </Button>
                  </Link>
                  <Link href="/dishes" className="w-full">
                    <Button variant="ghost" className="w-full justify-start h-12 text-base font-medium">
                    <Utensils className="mr-3 h-5 w-5" />
                    Món ăn
                  </Button>
                  </Link>
                  <Link href="/shopping" className="w-full">
                    <Button variant="ghost" className="w-full justify-start h-12 text-base font-medium">
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Đi chợ
                  </Button>
                  </Link>
                  <Button variant="ghost" className="justify-start h-12 text-base font-medium">
                    <Calendar className="mr-3 h-5 w-5" />
                    Lịch trình
                  </Button>
                  <div className="border-t border-border my-2" />
                  <Button variant="ghost" className="justify-start h-12 text-base font-medium">
                    <Settings className="mr-3 h-5 w-5" />
                    Cài đặt
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="relative">
              <Button className="font-medium shadow-lg shadow-primary/25 pl-2 pr-3 md:pl-3 md:pr-4 gap-1.5 md:gap-2 text-sm md:text-base h-9 md:h-10">
                <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-xs md:text-sm font-bold">A</span>
                </div>
                <span className="hidden sm:inline">Anh Tuấn</span>
              </Button>
              <div className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full bg-chart-2 border-2 border-card flex items-center justify-center">
                <Leaf className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-white" />
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        <div className="mb-6 md:mb-8 p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-chart-2/15 via-chart-2/10 to-transparent border border-chart-2/30">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center shadow-lg flex-shrink-0">
                <Leaf className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Chế độ ăn của bạn</h3>
                <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                  <Badge className="bg-chart-2 text-white shadow-md px-2.5 py-0.5 md:px-3 md:py-1 text-xs md:text-sm">
                    Ăn chay có trứng sữa
                  </Badge>
                  <Badge variant="secondary" className="shadow-sm px-2.5 py-0.5 md:px-3 md:py-1 text-xs md:text-sm">
                    Không gluten
                  </Badge>
                  <Badge variant="secondary" className="shadow-sm px-2.5 py-0.5 md:px-3 md:py-1 text-xs md:text-sm">
                    Giảm đường
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Tất cả gợi ý đã được lọc theo sở thích của bạn
                </p>
              </div>
            </div>
            <Link href="/settings">
            <Button variant="ghost" size="sm" className="gap-2 self-start sm:self-auto">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Cài đặt</span>
            </Button>
            </Link>
          </div>
        </div>

        {/* Active Menu Badge */}
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8 p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border border-primary/30"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-sm md:text-base">📋 {activeMenu.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">
                      Ngày {(() => {
                        const startDate = new Date(activeMenu.startDate)
                        const today = new Date()
                        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        return Math.min(daysPassed + 1, activeMenu.days)
                      })()}/{activeMenu.days}
                    </Badge>
                    {(() => {
                      const startDate = new Date(activeMenu.startDate)
                      const today = new Date()
                      const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                      const daysLeft = activeMenu.days - daysPassed - 1
                      if (daysLeft > 0 && daysLeft <= 3) {
                        return (
                          <Badge variant="outline" className="text-[10px] border-orange-500 text-orange-500">
                            Còn {daysLeft} ngày
                          </Badge>
                        )
                      }
                      if (daysPassed >= activeMenu.days) {
                        return (
                          <Badge variant="outline" className="text-[10px] border-red-500 text-red-500">
                            Đã hết hạn
                          </Badge>
                        )
                      }
                      return null
                    })()}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Bắt đầu từ {new Date(activeMenu.startDate).toLocaleDateString("vi-VN")}
                    {activeMenu.schedule && (() => {
                      const startDate = new Date(activeMenu.startDate)
                      const today = new Date()
                      const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                      if (daysPassed >= 0 && daysPassed < activeMenu.days && activeMenu.schedule[daysPassed]) {
                        return ` • Hôm nay: ${activeMenu.schedule[daysPassed].lunch}`
                      }
                      return ""
                    })()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("angi-active-menu")
                  setActiveMenu(null)
                  toast.success("Đã hủy áp dụng thực đơn")
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30"
        >
          <div className="flex items-center gap-3">
            {getSeasonIcon()}
            <div>
              <h3 className="font-bold text-sm md:text-base mb-1">{getSeasonText()}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Các món ăn được chọn phù hợp với thời tiết hiện tại
              </p>
            </div>
          </div>
        </motion.div>

        <section className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary animate-pulse" />
                <p className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wide">
                  Bữa ăn tiếp theo
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                {activeMenu ? `Ngày ${(() => {
                  const startDate = new Date(activeMenu.startDate)
                  const today = new Date()
                  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                  return daysPassed + 1
                })()} - ${currentMeal.label}` : `${currentMeal.label} hôm nay`}
              </h2>
            </div>
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-3 bg-gradient-to-br from-card to-muted/50 rounded-xl md:rounded-2xl border border-border shadow-lg">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span className="text-base md:text-lg font-bold tabular-nums">
                {currentTime.toLocaleTimeString("vi-VN", { 
                  hour: "2-digit", 
                  minute: "2-digit",
                  hour12: false 
                })}
              </span>
            </div>
          </div>

          {/* Hero Card với Swipe Gesture */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x
              if (swipe < -10000) {
                // Vuốt trái = Đổi món
                console.log("Đổi món khác")
              } else if (swipe > 10000) {
                // Vuốt phải = Đã ăn
                handleMealComplete()
              }
            }}
            className="md:cursor-grab md:active:cursor-grabbing"
          >
            <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 hover:shadow-3xl hover:shadow-primary/15 transition-all duration-500 relative">
              {/* Swipe hints cho mobile */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 md:hidden opacity-30">
                <div className="flex flex-col items-center gap-1 text-white">
                  <ArrowRight className="h-6 w-6 rotate-180" />
                  <span className="text-xs font-bold">Đổi món</span>
                </div>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 md:hidden opacity-30">
                <div className="flex flex-col items-center gap-1 text-white">
                  <ArrowRight className="h-6 w-6" />
                  <span className="text-xs font-bold">Đã ăn</span>
                </div>
              </div>

              <AnimatePresence>
                {mealCompleted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                        <CheckCircle2 className="h-12 w-12 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-white">Đã ăn xong! 🍽️</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 hover:shadow-3xl hover:shadow-primary/15 transition-all duration-500 border-none">
            <div className="relative">
              <div className="absolute top-3 left-3 md:top-6 md:left-6 z-10 flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground shadow-xl text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 backdrop-blur-sm">
                  Cơm gia đình truyền thống
                </Badge>
                <Badge className="bg-chart-2 text-white shadow-xl text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 backdrop-blur-sm">
                  <Leaf className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                  Chay
                </Badge>
              </div>

              {/* Quick Action Icons ở góc phải */}
              <div className="absolute top-3 right-3 md:top-6 md:right-6 z-10 flex gap-2">
                {/* Icon Chuẩn bị đi chợ */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    // Mở sheet chuẩn bị đi chợ bằng cách trigger từ nút dưới
                    const shoppingButton = document.getElementById('shopping-prep-trigger')
                    shoppingButton?.click()
                  }}
                  className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white transition-all group"
                  title="Chuẩn bị đi chợ"
                >
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-foreground group-hover:text-primary transition-colors" />
                  {getShoppingStats().percentage < 100 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-chart-1 border-2 border-white flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{getShoppingStats().needToBuy.length}</span>
                    </div>
                  )}
                </motion.button>

                {/* Icon Lưu bữa này */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    const mealData = {
                      name: "Mâm cơm chay dinh dưỡng",
                      dishes: [currentDishes.savory, currentDishes.soup, currentDishes.vegetable],
                      calo: 520,
                      time: "35 phút",
                      cost: "45,000₫"
                    }
                    
                    const favorites = JSON.parse(localStorage.getItem("angi-favorite-meals") || "[]")
                    favorites.push({
                      id: Date.now(),
                      ...mealData,
                      savedAt: new Date().toISOString()
                    })
                    localStorage.setItem("angi-favorite-meals", JSON.stringify(favorites))
                    
                    toast.success("⭐ Đã lưu bữa ăn yêu thích!", {
                      description: `${currentDishes.savory} • ${currentDishes.soup} • ${currentDishes.vegetable}`,
                      action: {
                        label: "Xem danh sách",
                        onClick: () => toast.info("📋 Xem tại mục Thực đơn")
                      }
                    })
                  }}
                  className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white transition-all group"
                  title="Lưu bữa yêu thích"
                >
                  <Heart className="h-4 w-4 md:h-5 md:w-5 text-foreground group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                </motion.button>
              </div>

              <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
                <div className="relative h-56 sm:h-64 md:h-[400px] overflow-hidden group">
                  <img
                    src="/healthy-salad-bowl-colorful-vegetables.jpg"
                    alt="Mâm cơm gia đình"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                    <p className="text-white/90 text-xs md:text-sm font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Info className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      Cấu trúc bữa ăn
                    </p>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {/* Món mặn card */}
                      <div 
                        className="bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-lg cursor-pointer hover:bg-white transition-all hover:scale-105 group relative"
                        onClick={() => handleViewDishDetail(currentDishes.savory, "savory")}
                      >
                        <div 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            setChangeSavoryOpen(true)
                          }}
                        >
                          <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform">
                                <RefreshCw className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary-foreground" />
                              </div>
                            </div>
                            <p className="text-[10px] md:text-xs text-muted-foreground mb-1 font-medium">Món mặn</p>
                            <p className="font-bold text-xs md:text-sm leading-tight pr-6">{currentDishes.savory}</p>
                        <p className="text-[9px] md:text-[10px] text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Xem chi tiết →
                        </p>
                          </div>

                      {/* Sheet chọn món mặn khác */}
                      <Sheet open={changeSavoryOpen} onOpenChange={setChangeSavoryOpen}>
                        <SheetContent side="bottom" className="h-[92vh] flex flex-col p-0">
                          {/* Header với Search */}
                          <div className="p-4 pb-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <SheetTitle className="text-lg font-bold mb-0.5">Chọn món mặn khác</SheetTitle>
                                <p className="text-xs text-muted-foreground">
                                  {dishAlternatives.savory.length} món • Chay
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-8"
                                onClick={() => {
                                  const randomDish = dishAlternatives.savory[Math.floor(Math.random() * dishAlternatives.savory.length)]
                                  handleDishChange("savory", randomDish.name)
                                }}
                              >
                                <Shuffle className="h-3.5 w-3.5" />
                                <span className="text-xs">Ngẫu nhiên</span>
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 overflow-y-auto">
                            {/* Quick Filters */}
                            <div className="px-4 py-3 border-b bg-muted/30">
                              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                <Badge
                                  variant={savoryFilter === "all" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSavoryFilter(savoryFilter === "all" ? "all" : "all")}
                                >
                                  Tất cả
                                </Badge>
                                <Badge
                                  variant={savoryFilter === "low-cal" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSavoryFilter(savoryFilter === "low-cal" ? "all" : "low-cal")}
                                >
                                  <Flame className="h-3 w-3 mr-1" />
                                  Ít calo
                                </Badge>
                                <Badge
                                  variant={savoryFilter === "fast" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSavoryFilter(savoryFilter === "fast" ? "all" : "fast")}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Nhanh
                                </Badge>
                                <Badge
                                  variant={savoryFilter === "popular" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSavoryFilter(savoryFilter === "popular" ? "all" : "popular")}
                                >
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Phổ biến
                                </Badge>
                              </div>
                            </div>

                            {/* Món đang chọn */}
                            <div className="px-4 py-3 bg-primary/5 border-b">
                              <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Đang chọn
                              </p>
                              <div className="flex gap-2.5 items-center">
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-primary">
                                  <img
                                    src={dishAlternatives.savory.find((d) => d.name === currentDishes.savory)?.image || "/placeholder.svg"}
                                    alt={currentDishes.savory}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{currentDishes.savory}</p>
                                  <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Flame className="h-3 w-3" />
                                      {dishAlternatives.savory.find((d) => d.name === currentDishes.savory)?.calo} calo
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {dishAlternatives.savory.find((d) => d.name === currentDishes.savory)?.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* List các món khác */}
                            <div className="px-4 py-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-2.5">
                                Món khác {savoryFilter !== "all" && `• ${savoryFilter === "low-cal" ? "Ít calo" : savoryFilter === "fast" ? "Nhanh nhất" : "Phổ biến"}`}
                              </p>
                              <div className="space-y-2">
                                {filterDishes(dishAlternatives.savory, savoryFilter)
                                  .filter((dish) => dish.name !== currentDishes.savory)
                                  .map((dish, index) => (
                                    <motion.div
                                key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.03 }}
                                    >
                                      <div
                                        className="flex gap-2.5 items-center p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-all active:scale-[0.98] border border-transparent hover:border-border"
                                onClick={() => handleDishChange("savory", dish.name)}
                              >
                                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={dish.image || "/placeholder.svg"}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                  />
                                      </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm truncate mb-0.5">{dish.name}</p>
                                          <div className="flex gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                              <Flame className="h-3 w-3 text-orange-500" />
                                              {dish.calo}
                                    </span>
                                    <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3 text-blue-500" />
                                      {dish.time}
                                    </span>
                                  </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                                      </div>
                                    </motion.div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>

                      {/* Món canh card */}
                      <div 
                        className="bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-lg cursor-pointer hover:bg-white transition-all hover:scale-105 group relative"
                        onClick={() => handleViewDishDetail(currentDishes.soup, "soup")}
                      >
                        <div 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            setChangeSoupOpen(true)
                          }}
                        >
                          <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform">
                                <RefreshCw className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary-foreground" />
                              </div>
                            </div>
                            <p className="text-[10px] md:text-xs text-muted-foreground mb-1 font-medium">Món canh</p>
                            <p className="font-bold text-xs md:text-sm leading-tight pr-6">{currentDishes.soup}</p>
                        <p className="text-[9px] md:text-[10px] text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Xem chi tiết →
                        </p>
                          </div>

                      {/* Sheet chọn món canh khác */}
                      <Sheet open={changeSoupOpen} onOpenChange={setChangeSoupOpen}>
                        <SheetContent side="bottom" className="h-[92vh] flex flex-col p-0">
                          <div className="p-4 pb-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <SheetTitle className="text-lg font-bold mb-0.5">Chọn món canh khác</SheetTitle>
                                <p className="text-xs text-muted-foreground">
                                  {dishAlternatives.soup.length} món • Chay
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-8"
                                onClick={() => {
                                  const randomDish = dishAlternatives.soup[Math.floor(Math.random() * dishAlternatives.soup.length)]
                                  handleDishChange("soup", randomDish.name)
                                }}
                              >
                                <Shuffle className="h-3.5 w-3.5" />
                                <span className="text-xs">Ngẫu nhiên</span>
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto">
                            <div className="px-4 py-3 border-b bg-muted/30">
                              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                <Badge
                                  variant={soupFilter === "all" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSoupFilter("all")}
                                >
                                  Tất cả
                                </Badge>
                                <Badge
                                  variant={soupFilter === "low-cal" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSoupFilter(soupFilter === "low-cal" ? "all" : "low-cal")}
                                >
                                  <Flame className="h-3 w-3 mr-1" />
                                  Ít calo
                                </Badge>
                                <Badge
                                  variant={soupFilter === "fast" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSoupFilter(soupFilter === "fast" ? "all" : "fast")}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Nhanh
                                </Badge>
                                <Badge
                                  variant={soupFilter === "popular" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setSoupFilter(soupFilter === "popular" ? "all" : "popular")}
                                >
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Phổ biến
                                </Badge>
                              </div>
                            </div>

                            <div className="px-4 py-3 bg-primary/5 border-b">
                              <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Đang chọn
                              </p>
                              <div className="flex gap-2.5 items-center">
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-primary">
                                  <img
                                    src={dishAlternatives.soup.find((d) => d.name === currentDishes.soup)?.image || "/placeholder.svg"}
                                    alt={currentDishes.soup}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{currentDishes.soup}</p>
                                  <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Flame className="h-3 w-3" />
                                      {dishAlternatives.soup.find((d) => d.name === currentDishes.soup)?.calo} calo
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {dishAlternatives.soup.find((d) => d.name === currentDishes.soup)?.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-2.5">
                                Món khác {soupFilter !== "all" && `• ${soupFilter === "low-cal" ? "Ít calo" : soupFilter === "fast" ? "Nhanh nhất" : "Phổ biến"}`}
                              </p>
                              <div className="space-y-2">
                                {filterDishes(dishAlternatives.soup, soupFilter)
                                  .filter((dish) => dish.name !== currentDishes.soup)
                                  .map((dish, index) => (
                                    <motion.div
                                key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.03 }}
                                    >
                                      <div
                                        className="flex gap-2.5 items-center p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-all active:scale-[0.98] border border-transparent hover:border-border"
                                onClick={() => handleDishChange("soup", dish.name)}
                              >
                                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={dish.image || "/placeholder.svg"}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                  />
                                      </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm truncate mb-0.5">{dish.name}</p>
                                          <div className="flex gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                              <Flame className="h-3 w-3 text-orange-500" />
                                              {dish.calo}
                                    </span>
                                    <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3 text-blue-500" />
                                      {dish.time}
                                    </span>
                                  </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                                      </div>
                                    </motion.div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>

                      {/* Món rau card */}
                      <div 
                        className="bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-lg cursor-pointer hover:bg-white transition-all hover:scale-105 group relative"
                        onClick={() => handleViewDishDetail(currentDishes.vegetable, "vegetable")}
                      >
                        <div 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            setChangeVegetableOpen(true)
                          }}
                        >
                          <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform">
                                <RefreshCw className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary-foreground" />
                              </div>
                            </div>
                            <p className="text-[10px] md:text-xs text-muted-foreground mb-1 font-medium">Món rau</p>
                            <p className="font-bold text-xs md:text-sm leading-tight pr-6">{currentDishes.vegetable}</p>
                        <p className="text-[9px] md:text-[10px] text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Xem chi tiết →
                        </p>
                          </div>

                      {/* Sheet chọn món rau khác */}
                      <Sheet open={changeVegetableOpen} onOpenChange={setChangeVegetableOpen}>
                        <SheetContent side="bottom" className="h-[92vh] flex flex-col p-0">
                          <div className="p-4 pb-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <SheetTitle className="text-lg font-bold mb-0.5">Chọn món rau khác</SheetTitle>
                                <p className="text-xs text-muted-foreground">
                                  {dishAlternatives.vegetable.length} món • Chay
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-8"
                                onClick={() => {
                                  const randomDish = dishAlternatives.vegetable[Math.floor(Math.random() * dishAlternatives.vegetable.length)]
                                  handleDishChange("vegetable", randomDish.name)
                                }}
                              >
                                <Shuffle className="h-3.5 w-3.5" />
                                <span className="text-xs">Ngẫu nhiên</span>
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto">
                            <div className="px-4 py-3 border-b bg-muted/30">
                              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                <Badge
                                  variant={vegetableFilter === "all" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setVegetableFilter("all")}
                                >
                                  Tất cả
                                </Badge>
                                <Badge
                                  variant={vegetableFilter === "low-cal" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setVegetableFilter(vegetableFilter === "low-cal" ? "all" : "low-cal")}
                                >
                                  <Flame className="h-3 w-3 mr-1" />
                                  Ít calo
                                </Badge>
                                <Badge
                                  variant={vegetableFilter === "fast" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setVegetableFilter(vegetableFilter === "fast" ? "all" : "fast")}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Nhanh
                                </Badge>
                                <Badge
                                  variant={vegetableFilter === "popular" ? "default" : "secondary"}
                                  className="cursor-pointer hover:bg-primary/90 whitespace-nowrap transition-all"
                                  onClick={() => setVegetableFilter(vegetableFilter === "popular" ? "all" : "popular")}
                                >
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Phổ biến
                                </Badge>
                              </div>
                            </div>

                            <div className="px-4 py-3 bg-primary/5 border-b">
                              <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Đang chọn
                              </p>
                              <div className="flex gap-2.5 items-center">
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-primary">
                                  <img
                                    src={dishAlternatives.vegetable.find((d) => d.name === currentDishes.vegetable)?.image || "/placeholder.svg"}
                                    alt={currentDishes.vegetable}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{currentDishes.vegetable}</p>
                                  <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Flame className="h-3 w-3" />
                                      {dishAlternatives.vegetable.find((d) => d.name === currentDishes.vegetable)?.calo} calo
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {dishAlternatives.vegetable.find((d) => d.name === currentDishes.vegetable)?.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-2.5">
                                Món khác {vegetableFilter !== "all" && `• ${vegetableFilter === "low-cal" ? "Ít calo" : vegetableFilter === "fast" ? "Nhanh nhất" : "Phổ biến"}`}
                              </p>
                              <div className="space-y-2">
                                {filterDishes(dishAlternatives.vegetable, vegetableFilter)
                                  .filter((dish) => dish.name !== currentDishes.vegetable)
                                  .map((dish, index) => (
                                    <motion.div
                                key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.03 }}
                                    >
                                      <div
                                        className="flex gap-2.5 items-center p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-all active:scale-[0.98] border border-transparent hover:border-border"
                                onClick={() => handleDishChange("vegetable", dish.name)}
                              >
                                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={dish.image || "/placeholder.svg"}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                  />
                                      </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm truncate mb-0.5">{dish.name}</p>
                                          <div className="flex gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                              <Flame className="h-3 w-3 text-orange-500" />
                                              {dish.calo}
                                    </span>
                                    <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3 text-blue-500" />
                                      {dish.time}
                                    </span>
                                  </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                                      </div>
                                    </motion.div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                    <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-2.5 shadow-lg flex items-center justify-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <p className="font-bold text-xs md:text-sm">Cơm trắng</p>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 md:p-8 flex flex-col justify-between bg-gradient-to-br from-card via-card to-primary/5">
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-2xl font-bold mb-2 md:mb-3 text-balance leading-tight">
                      {activeMenu && activeMenu.schedule && (() => {
                        const startDate = new Date(activeMenu.startDate)
                        const daysPassed = Math.floor((currentTime.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        if (daysPassed >= 0 && daysPassed < activeMenu.days && activeMenu.schedule[daysPassed]) {
                          const todayMeal = activeMenu.schedule[daysPassed]
                          const mealKey = currentMeal.type as keyof typeof todayMeal
                          return todayMeal[mealKey] || "Mâm cơm chay dinh dưỡng"
                        }
                        return "Mâm cơm chay dinh dưỡng"
                      })() || "Mâm cơm chay dinh dưỡng"}
                    </h3>
                    <p className="text-sm md:text-sm text-muted-foreground mb-4 md:mb-5 leading-relaxed">
                      {activeMenu ? `Theo ${activeMenu.name} • ` : ""}Bữa cơm với {currentDishes.savory}, {currentDishes.soup}, và{" "}
                      {currentDishes.vegetable}. Hoàn hảo cho người ăn chay!
                    </p>

                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5 md:mb-6">
                      <div className="text-center p-2.5 md:p-4 bg-gradient-to-br from-chart-1/15 to-chart-1/5 rounded-lg md:rounded-xl border-2 border-chart-1/30 hover:border-chart-1/50 transition-all hover:shadow-lg">
                        <div className="h-7 w-7 md:h-9 md:w-9 mx-auto mb-1.5 md:mb-2 rounded-lg bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center shadow-md">
                          <Flame className="h-3.5 w-3.5 md:h-5 md:w-5 text-white" />
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5 font-medium">Calo</p>
                        <p className="font-bold text-sm md:text-lg">520</p>
                      </div>
                      <div className="text-center p-2.5 md:p-4 bg-gradient-to-br from-chart-2/15 to-chart-2/5 rounded-lg md:rounded-xl border-2 border-chart-2/30 hover:border-chart-2/50 transition-all hover:shadow-lg">
                        <div className="h-7 w-7 md:h-9 md:w-9 mx-auto mb-1.5 md:mb-2 rounded-lg bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center shadow-md">
                          <Clock className="h-3.5 w-3.5 md:h-5 md:w-5 text-white" />
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5 font-medium">Thời gian</p>
                        <p className="font-bold text-sm md:text-lg">35 phút</p>
                      </div>
                      <div className="text-center p-2.5 md:p-4 bg-gradient-to-br from-chart-3/15 to-chart-3/5 rounded-lg md:rounded-xl border-2 border-chart-3/30 hover:border-chart-3/50 transition-all hover:shadow-lg">
                        <div className="h-7 w-7 md:h-9 md:w-9 mx-auto mb-1.5 md:mb-2 rounded-lg bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center shadow-md">
                          <DollarSign className="h-3.5 w-3.5 md:h-5 md:w-5 text-white" />
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5 font-medium">Chi phí</p>
                        <p className="font-bold text-sm md:text-lg">45k</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5 md:mb-6 p-2.5 md:p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs md:text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-chart-2" />
                        <span className="font-medium">Chay có trứng sữa</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs md:text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-chart-2" />
                        <span className="font-medium">Không gluten</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs md:text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-chart-2" />
                        <span className="font-medium">Ít đường</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 md:gap-3">
                    <Button
                      className="flex-1 h-11 md:h-12 text-sm md:text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                      size="lg"
                      onClick={() => setCookMenuOpen(true)}
                    >
                      <ChefHat className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Nấu bữa này
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleRandomMeal}
                      className="h-11 md:h-12 w-11 md:w-12 p-0 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all hover:scale-110 border-2 bg-transparent"
                    >
                      <Shuffle className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
            </Card>
          </motion.div>

          {/* Hidden trigger for shopping sheet - triggered by icon */}
          <Sheet>
            <SheetTrigger asChild>
              <button id="shopping-prep-trigger" className="hidden">Trigger</button>
            </SheetTrigger>
              <SheetContent side="bottom" className="h-[92vh] flex flex-col p-0">
                {/* Header */}
                <div className="p-4 pb-3 border-b bg-background/95 backdrop-blur">
                  <SheetTitle className="text-lg font-bold mb-3">🛒 Chuẩn bị đi chợ</SheetTitle>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Đã có</p>
                      <p className="font-bold text-sm">{getShoppingStats().available}/{getShoppingStats().total}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Hoàn thành</p>
                      <p className="font-bold text-sm text-primary">{getShoppingStats().percentage}%</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Cần mua</p>
                      <p className="font-bold text-sm text-orange-500">{getShoppingStats().costToBuy.toLocaleString()}₫</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Nguyên liệu sẵn sàng</span>
                      <span className="font-semibold">{getShoppingStats().percentage}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-chart-2 to-chart-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getShoppingStats().percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Status Message */}
                  {getShoppingStats().percentage === 100 ? (
                    <div className="px-4 py-3 bg-chart-2/10 border-b border-chart-2/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-chart-2" />
                        <div>
                          <p className="font-semibold text-sm text-chart-2">✅ Đã đủ nguyên liệu!</p>
                          <p className="text-xs text-muted-foreground">Bạn có thể bắt đầu nấu ngay</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-orange-500/10 border-b border-orange-500/30">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-semibold text-sm text-orange-600">Còn thiếu {getShoppingStats().needToBuy.length} nguyên liệu</p>
                          <p className="text-xs text-muted-foreground">Chi phí ước tính: {getShoppingStats().costToBuy.toLocaleString()}₫</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ingredients by category */}
                  <div className="px-4 py-3">
                    {Array.from(new Set(shoppingItems.map((item) => item.category))).map((category) => (
                      <div key={category} className="mb-5 last:mb-0">
                        <div className="flex items-center justify-between mb-2.5">
                          <h3 className="font-bold text-sm">{category}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {shoppingItems.filter((item) => item.category === category && item.available).length}/
                            {shoppingItems.filter((item) => item.category === category).length}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {shoppingItems
                            .filter((item) => item.category === category)
                            .map((item) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-lg border transition-all ${
                                  item.available
                                    ? "bg-chart-2/5 border-chart-2/30"
                                    : "bg-background border-border/50"
                                }`}
                              >
                                {/* Main row với checkbox và tên */}
                                <div className="flex items-start gap-3 mb-2">
                                  <div
                                    className={`flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all mt-0.5 ${
                                      item.available
                                        ? "bg-chart-2 border-chart-2"
                                        : "border-muted-foreground/30 hover:border-primary"
                                    }`}
                                    onClick={() => toggleShoppingItem(item.id)}
                                  >
                                    {item.available && <Check className="h-3.5 w-3.5 text-white" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className={`font-semibold text-sm ${item.available ? "line-through text-muted-foreground" : ""}`}>
                                        {item.name}
                                      </p>
                                      {item.note && editingShoppingNote !== item.id && (
                                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                          💬
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-2 mb-2">
                                      <p className="text-xs text-muted-foreground">{item.amount}</p>
                                      {item.quantity > 1 && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                          x{item.quantity}
                                        </Badge>
                                      )}
                                      <div className="flex gap-1 ml-auto">
            <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            updateShoppingQuantity(item.id, -1)
                                          }}
                                          disabled={item.quantity <= 1}
                                        >
                                          <span className="text-xs">-</span>
            </Button>
                                        <span className="text-xs font-bold w-6 text-center leading-6">{item.quantity}</span>
            <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            updateShoppingQuantity(item.id, 1)
                                          }}
                                        >
                                          <span className="text-xs">+</span>
            </Button>
                                      </div>
                                    </div>

                                    {/* Note section */}
                                    {editingShoppingNote === item.id ? (
                                      <div className="flex gap-2 mb-2">
                                        <Input
                                          value={tempShoppingNote}
                                          onChange={(e) => setTempShoppingNote(e.target.value)}
                                          placeholder="Ghi chú ngắn..."
                                          className="h-7 text-xs flex-1"
                                          autoFocus
                                          maxLength={40}
                                          onClick={(e) => e.stopPropagation()}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") updateShoppingNote(item.id, tempShoppingNote)
                                            if (e.key === "Escape") setEditingShoppingNote(null)
                                          }}
                                        />
            <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            updateShoppingNote(item.id, tempShoppingNote)
                                          }}
                                        >
                                          <CheckCircle2 className="h-3 w-3 text-chart-2" />
            </Button>
          </div>
                                    ) : item.note ? (
                                      <div
                                        className="p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-700 dark:text-amber-400 mb-2 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setEditingShoppingNote(item.id)
                                          setTempShoppingNote(item.note)
                                        }}
                                      >
                                        💬 {item.note}
                                      </div>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground mb-2"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setEditingShoppingNote(item.id)
                                          setTempShoppingNote("")
                                        }}
                                      >
                                        <Plus className="h-2.5 w-2.5 mr-1" />
                                        Thêm ghi chú
                                      </Button>
                                    )}
                                  </div>

                                  {/* Price section */}
                                  {item.price > 0 && (
                                    <div className="text-right flex-shrink-0">
                                      {editingShoppingPrice === item.id ? (
                                        <div className="flex flex-col gap-1">
                                          <Input
                                            type="text"
                                            value={tempShoppingPrice}
                                            onChange={(e) => setTempShoppingPrice(e.target.value)}
                                            placeholder="Giá..."
                                            className="h-7 w-20 text-xs text-right"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") updateShoppingPrice(item.id)
                                              if (e.key === "Escape") setEditingShoppingPrice(null)
                                            }}
                                          />
                                          <div className="flex gap-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-5 w-full p-0"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                updateShoppingPrice(item.id)
                                              }}
                                            >
                                              <CheckCircle2 className="h-2.5 w-2.5 text-chart-2" />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          className="cursor-pointer group"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setEditingShoppingPrice(item.id)
                                            setTempShoppingPrice((item.price * item.quantity).toString())
                                          }}
                                        >
                                          <p className={`text-sm font-bold ${item.available ? "line-through text-muted-foreground" : "text-orange-600"}`}>
                                            {(item.price * item.quantity).toLocaleString()}₫
                                          </p>
                                          <p className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100">
                                            ✏️ Sửa
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-background/95 backdrop-blur space-y-3">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
            <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShoppingItems((prev) => prev.map((item) => ({ ...item, available: false })))
                        toast.info("Đã đặt lại trạng thái nguyên liệu")
                      }}
                    >
                      Đặt lại
            </Button>
            <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShoppingItems((prev) => prev.map((item) => ({ ...item, available: true })))
                        toast.success("✅ Đánh dấu tất cả!")
                      }}
                    >
                      Có tất cả
            </Button>
                  </div>

                  {/* Main Action */}
                  {getShoppingStats().percentage === 100 ? (
                    <Link href="/cook" className="w-full block">
                      <Button className="w-full h-12 gap-2 bg-chart-2" size="lg">
                        <ChefHat className="h-5 w-5" />
                        Bắt đầu nấu ngay
                      </Button>
                    </Link>
                  ) : (
            <Button
                      className="w-full h-12 gap-2" 
                      size="lg"
                      onClick={() => {
                        // Thêm vào shopping list tổng
                        const needToBuyItems = getShoppingStats().needToBuy
                        const existingList = JSON.parse(localStorage.getItem("angi-shopping-list") || "[]")
                        
                        const newItems = needToBuyItems.map((item: any, index: number) => ({
                          id: Date.now() + index,
                          name: item.name,
                          quantity: item.amount,
                          price: item.price,
                          category: item.category,
                          checked: false,
                          note: `Cho bữa ${currentDishes.savory}`
                        }))
                        
                        const merged = [...existingList, ...newItems]
                        localStorage.setItem("angi-shopping-list", JSON.stringify(merged))
                        
                        toast.success(`📝 Đã thêm ${needToBuyItems.length} món vào danh sách đi chợ!`, {
                          description: "Xem trong trang Đi chợ",
                          action: {
                            label: "Xem ngay",
                            onClick: () => window.location.href = "/shopping"
                          }
                        })
                      }}
                    >
                      <Plus className="h-5 w-5" />
                      Thêm vào danh sách đi chợ ({getShoppingStats().needToBuy.length} món)
            </Button>
                  )}

                  {/* Info */}
                  <p className="text-[10px] text-center text-muted-foreground">
                    💡 Chỉ cho <strong>bữa ăn này</strong> • Danh sách tổng hợp xem ở trang Đi chợ
                  </p>
          </div>
              </SheetContent>
            </Sheet>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-12 md:mb-16">
          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-card to-chart-1/5">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <h3 className="font-bold text-base md:text-lg">Dinh dưỡng hôm nay</h3>
                <div className="h-9 w-9 md:h-11 md:w-11 rounded-lg bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center shadow-lg">
                  <Flame className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Calo</span>
                    <span className="font-bold text-base md:text-lg">1,450 / 2,000</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-chart-1 to-chart-5 rounded-full shadow-sm"
                      style={{ width: "72%" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-3 pt-2">
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg md:rounded-xl">
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Protein</p>
                    <p className="font-bold text-sm md:text-base">65g</p>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg md:rounded-xl">
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Carbs</p>
                    <p className="font-bold text-sm md:text-base">180g</p>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-background/50 rounded-lg md:rounded-xl">
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Fat</p>
                    <p className="font-bold text-sm md:text-base">45g</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-card to-chart-3/5">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <h3 className="font-bold text-base md:text-lg">Chi tiêu tuần này</h3>
                <div className="h-9 w-9 md:h-11 md:w-11 rounded-lg bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center shadow-lg">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl md:text-4xl font-bold mb-1">850,000₫</p>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">/ 1,200,000₫ ngân sách</p>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-chart-3 to-chart-5 rounded-full shadow-sm"
                    style={{ width: "71%" }}
                  />
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1 text-xs md:text-sm">Đi chợ</p>
                    <p className="font-bold text-sm md:text-base">520k</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1 text-xs md:text-sm">Ăn ngoài</p>
                    <p className="font-bold text-sm md:text-base">330k</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-card to-chart-2/5">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <h3 className="font-bold text-base md:text-lg">Lịch tuần này</h3>
                <div className="h-9 w-9 md:h-11 md:w-11 rounded-lg bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center shadow-lg">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-muted-foreground font-medium">Đã lên kế hoạch</span>
                  <span className="font-bold text-xl md:text-2xl">18/21</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-chart-2 to-chart-4 rounded-full shadow-sm"
                    style={{ width: "86%" }}
                  />
                </div>
                <Link href="/menu" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 md:h-11 bg-background/50 hover:bg-background font-medium mt-2 text-xs md:text-sm"
                >
                  <Calendar className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                  Xem lịch đầy đủ
                </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Gợi ý cho bạn</h2>
              <p className="text-sm md:text-base text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                Được AI lọc theo sở thích ăn chay của bạn
              </p>
            </div>
            <Link href="/menu">
            <Button variant="ghost" size="sm" className="font-medium hover:bg-primary/10 text-sm">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
            <Link href="/menu" className="h-full">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }} className="h-full">
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                  src="/healthy-salad-bowl-colorful-vegetables.jpg"
                  alt="Thực đơn chay"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2">
                  <Badge className="bg-chart-2 text-white shadow-lg px-2.5 py-1 md:px-3 md:py-1.5 text-xs">
                    <Leaf className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                    Chay
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground shadow-lg px-2.5 py-1 md:px-3 md:py-1.5 text-xs">
                    7 ngày
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 md:p-5 bg-gradient-to-br from-card to-chart-2/5 flex-1 flex flex-col">
                <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">Thực đơn chay thanh đạm</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed line-clamp-2 flex-1">
                  Kế hoạch 7 ngày với các món chay giàu protein thực vật và vitamin
                </p>
                <div className="flex items-center justify-between text-xs md:text-sm mt-auto">
                  <span className="font-medium text-muted-foreground">1,400-1,600 calo/ngày</span>
                  <span className="font-bold text-primary">21 món</span>
                </div>
              </CardContent>
            </Card>
              </motion.div>
            </Link>

            <Link href="/dishes" className="h-full">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3, delay: 0.1 }} className="h-full">
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                  src="/grilled-chicken-rice-asian-meal.jpg"
                  alt="Món thịnh hành"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                  </div>
                  <Badge className="bg-chart-2 text-white shadow-lg px-2.5 py-1 md:px-3 md:py-1.5 text-xs">
                    <Leaf className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                    Chay
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 md:p-5 bg-gradient-to-br from-card to-chart-1/5 flex-1 flex flex-col">
                <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">Đậu hũ sốt nấm hương</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed line-clamp-2 flex-1">
                  Món ăn chay được yêu thích nhất tuần này
                </p>
                <div className="flex items-center justify-between text-xs md:text-sm mt-auto">
                  <span className="font-medium text-muted-foreground">380 calo</span>
                  <span className="font-bold text-primary">25 phút</span>
                </div>
              </CardContent>
            </Card>
              </motion.div>
            </Link>

            <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3, delay: 0.2 }} className="h-full">
              <Card 
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
                onClick={() => toast.info("🍜 Tính năng đang phát triển", {
                  description: "Danh sách quán ăn gần bạn sẽ sớm có"
                })}
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                  src="/restaurant-interior-cozy-dining.jpg"
                  alt="Quán ăn chay"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2">
                  <Badge className="bg-chart-2 text-white shadow-lg px-2.5 py-1 md:px-3 md:py-1.5 text-xs">
                    <Leaf className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                    Chay
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground shadow-lg px-2.5 py-1 md:px-3 md:py-1.5 text-xs">
                    4.9 ⭐
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 md:p-5 bg-gradient-to-br from-card to-chart-2/5 flex-1 flex flex-col">
                <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">Quán Chay Tịnh Tâm</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed line-clamp-2 flex-1">
                  Quán chay thuần túy, món ăn đa dạng gần bạn
                </p>
                <div className="flex items-center justify-between text-xs md:text-sm mt-auto">
                  <span className="font-medium text-muted-foreground">40,000₫ - 70,000₫</span>
                  <span className="font-bold text-primary">0.8 km</span>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </section>

        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Bữa ăn sắp tới</h2>
              <p className="text-sm md:text-base text-muted-foreground">Lịch trình của bạn trong tuần</p>
            </div>
            <Link href="/menu">
            <Button variant="ghost" size="sm" className="font-medium text-sm">
              Chỉnh sửa lịch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              {
                time: "Tối nay",
                meal: "Canh chua cá",
                image: "vietnamese+sour+fish+soup",
                color: "from-chart-1/20 to-chart-1/5",
              },
              {
                time: "Sáng mai",
                meal: "Bánh mì trứng",
                image: "banh+mi+sandwich+egg",
                color: "from-chart-2/20 to-chart-2/5",
              },
              {
                time: "Trưa mai",
                meal: "Bún chả Hà Nội",
                image: "bun+cha+hanoi+grilled+pork",
                color: "from-chart-3/20 to-chart-3/5",
              },
              {
                time: "Tối mai",
                meal: "Gà xào sả ớt",
                image: "lemongrass+chicken+stir+fry",
                color: "from-chart-4/20 to-chart-4/5",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="relative h-32 md:h-40 overflow-hidden">
                  <img
                    src={`/.jpg?height=200&width=300&query=${item.image}`}
                    alt={item.meal}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <CardContent className={`p-4 md:p-5 bg-gradient-to-br ${item.color}`}>
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-1 md:mb-2 font-medium uppercase tracking-wide">
                    {item.time}
                  </p>
                  <p className="font-bold text-sm md:text-base">{item.meal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mini Missions Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-primary/5 via-card to-chart-1/5">
            <CardContent className="p-5 md:p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl mb-1">🎯 Thử thách tuần này</h3>
                    <p className="text-sm text-muted-foreground">
                      Hoàn thành {missions.filter((m) => m.completed).length}/{missions.length} nhiệm vụ
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {missions.filter((m) => m.completed).length}/{missions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Hoàn thành</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {missions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleMission(mission.id)}
                    className="flex items-center gap-3 p-3.5 bg-background/50 rounded-lg cursor-pointer hover:bg-background transition-all border border-border/50"
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: mission.completed ? [1, 1.2, 1] : 1,
                        rotate: mission.completed ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {mission.completed ? (
                        <div className="h-6 w-6 rounded-full bg-chart-2 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-muted-foreground" />
                      )}
                    </motion.div>
                    <p
                      className={`flex-1 font-medium ${
                        mission.completed ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {mission.title}
                    </p>
                    {mission.id === 1 && <span className="text-2xl">🍲</span>}
                    {mission.id === 2 && <span className="text-2xl">🍜</span>}
                    {mission.id === 3 && <span className="text-2xl">♻️</span>}
                  </motion.div>
                ))}
              </div>

              {missions.every((m) => m.completed) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3.5 bg-gradient-to-r from-chart-2/20 to-chart-2/10 rounded-lg border border-chart-2/30 text-center"
                >
                  <p className="text-base font-bold text-chart-2">🎉 Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ!</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Community Feed Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center shadow-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl md:text-2xl">👨‍👩‍👧 Mọi người đang nấu gì hôm nay?</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Cộng đồng MealPlan AI</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-medium"
              onClick={() => toast.info("🎉 Sắp ra mắt!", {
                description: "Tính năng Community Feed đang được phát triển"
              })}
            >
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Hương",
                avatar: "H",
                meal: "Bữa cơm 3 món miền Trung",
                likes: 325,
                comments: 42,
                time: "30 phút trước",
                image: "/vietnamese-pho-bowl-steaming-fresh-herbs.jpg",
              },
              {
                name: "Minh",
                avatar: "M",
                meal: "Bún chay Huế cay nồng",
                likes: 218,
                comments: 31,
                time: "1 giờ trước",
                image: "/healthy-salad-bowl-colorful-vegetables.jpg",
              },
            ].map((post, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <div className="relative h-40 md:h-44 overflow-hidden">
                    <img src={post.image} alt={post.meal} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="text-white font-bold text-base md:text-lg">{post.meal}</p>
                    </div>
                  </div>
                  <CardContent className="p-3.5 md:p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center text-white font-bold text-sm">
                          {post.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{post.name}</p>
                          <p className="text-xs text-muted-foreground">{post.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span className="font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-medium">{post.comments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Daily Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500/10 via-card to-orange-500/5">
            <CardContent className="p-5 md:p-7">
              <div className="flex items-start gap-3.5">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <Lightbulb className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                    🧂 Mẹo hôm nay
                  </h3>
                  <div className="space-y-2">
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="text-sm md:text-base leading-relaxed"
                    >
                      • Khi luộc rau, thêm chút muối để rau xanh hơn 🌿
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="text-sm md:text-base leading-relaxed"
                    >
                      • Ngâm đậu phụ trong nước muối 10 phút trước khi chiên để giòn lâu hơn 🍳
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="text-sm md:text-base leading-relaxed"
                    >
                      • Bảo quản rau trong túi zip có khăn ẩm để giữ tươi lâu hơn 3-5 ngày 🥬
                    </motion.p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      {/* Cook Menu Sheet - Chọn món để nấu */}
      <Sheet open={cookMenuOpen} onOpenChange={setCookMenuOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh]">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold mb-2">Chọn món để nấu</SheetTitle>
            <p className="text-sm text-muted-foreground">Bữa ăn gồm 3 món, bạn muốn nấu món nào trước?</p>
          </SheetHeader>
          
          <div className="space-y-3 mt-5">
            <Link 
              href={`/cook/${getSlugFromDishName(currentDishes.savory)}`} 
              className="block"
              onClick={() => setCookMenuOpen(false)}
            >
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center flex-shrink-0">
                        <ChefHat className="h-6 w-6 text-chart-1" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Món mặn</p>
                        <p className="font-bold text-base">{currentDishes.savory}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            <Flame className="h-2.5 w-2.5 mr-1" />
                            180 calo
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            15 phút
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
            
            <Link 
              href={`/cook/${getSlugFromDishName(currentDishes.soup)}`} 
              className="block"
              onClick={() => setCookMenuOpen(false)}
            >
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                        <Utensils className="h-6 w-6 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Món canh</p>
                        <p className="font-bold text-base">{currentDishes.soup}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            <Flame className="h-2.5 w-2.5 mr-1" />
                            80 calo
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            10 phút
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
            
            <Link 
              href={`/cook/${getSlugFromDishName(currentDishes.vegetable)}`} 
              className="block"
              onClick={() => setCookMenuOpen(false)}
            >
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-6 w-6 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Món rau</p>
                        <p className="font-bold text-base">{currentDishes.vegetable}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            <Flame className="h-2.5 w-2.5 mr-1" />
                            55 calo
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            7 phút
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>

          {/* Nấu tất cả */}
          <div className="mt-5 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-3 text-center">Hoặc nấu theo thứ tự</p>
            <Link href={`/cook/${getSlugFromDishName(currentDishes.savory)}`} onClick={() => setCookMenuOpen(false)}>
              <Button className="w-full h-12" size="lg">
                <ChefHat className="h-5 w-5 mr-2" />
                Nấu cả 3 món (35 phút)
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dish Detail Sheet */}
      <Sheet open={selectedDish !== null} onOpenChange={(open) => !open && setSelectedDish(null)}>
        <SheetContent side="right" className="w-full sm:w-[540px] md:w-[600px] p-0 overflow-y-auto">
          {selectedDish && selectedDish.details && (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{selectedDish.details.name}</SheetTitle>
              </SheetHeader>
              <div>
                {/* Hero Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={selectedDish.details.image}
                    alt={selectedDish.details.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {selectedDish.details.tags.map((tag: string) => (
                        <Badge key={tag} className="bg-white/20 backdrop-blur-sm text-white border-0">
                          {tag === "Chay" && <Leaf className="h-3 w-3 mr-1" />}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {selectedDish.details.name}
                    </h2>
                    <p className="text-sm text-white/90">{selectedDish.details.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                    <p className="text-lg font-bold">{selectedDish.details.calo}</p>
                    <p className="text-[10px] text-muted-foreground">calo</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                    <p className="text-lg font-bold">{selectedDish.details.time.replace(" phút", "")}</p>
                    <p className="text-[10px] text-muted-foreground">phút</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-1 text-green-500" />
                    <p className="text-lg font-bold">{selectedDish.details.servings}</p>
                    <p className="text-[10px] text-muted-foreground">người</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <ChefHat className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                    <p className="text-sm font-bold">{selectedDish.details.difficulty}</p>
                    <p className="text-[10px] text-muted-foreground">độ khó</p>
                    </div>
                  </div>

                  {/* Nutrition */}
                  <div>
                  <h3 className="font-bold text-base mb-3">🥗 Dinh dưỡng</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="font-bold text-lg text-chart-1">{selectedDish.details.protein}g</p>
                    </div>
                    <div className="p-2 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="font-bold text-lg text-chart-2">{selectedDish.details.carbs}g</p>
                    </div>
                    <div className="p-2 bg-chart-3/10 border border-chart-3/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fat</p>
                      <p className="font-bold text-lg text-chart-3">{selectedDish.details.fat}g</p>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base">🥕 Nguyên liệu</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast.success("Đã thêm nguyên liệu vào danh sách đi chợ")
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Thêm vào giỏ
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedDish.details.ingredients.map((ing: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">{ing.name}</span>
                        <span className="text-sm text-muted-foreground">{ing.amount}</span>
                      </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                  <h3 className="font-bold text-base mb-3">👨‍🍳 Cách làm</h3>
                  <div className="space-y-3">
                    {selectedDish.details.steps.map((step: string, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{i + 1}</span>
                        </div>
                        <p className="text-sm leading-relaxed pt-1">{step}</p>
                      </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-amber-900 dark:text-amber-100 mb-1">
                        💡 Mẹo hay
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                        {selectedDish.details.tips}
                      </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link href={`/cook/${getSlugFromDishName(selectedDish.name)}`} className="w-full">
                      <Button className="w-full h-12" size="lg">
                        <ChefHat className="h-5 w-5 mr-2" />
                        Nấu ngay
                      </Button>
                    </Link>
                  <Button 
                    variant="outline" 
                    className="w-full h-12" 
                    size="lg"
                    onClick={() => {
                      const favorites = JSON.parse(localStorage.getItem("angi-favorite-dishes") || "[]")
                      favorites.push({
                        id: Date.now(),
                        ...selectedDish.details,
                        savedAt: new Date().toISOString()
                      })
                      localStorage.setItem("angi-favorite-dishes", JSON.stringify(favorites))
                      toast.success("⭐ Đã lưu món yêu thích!")
                    }}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Yêu thích
                  </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
