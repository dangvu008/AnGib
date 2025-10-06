"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChefHat,
  Menu,
  Home,
  BookOpen,
  Utensils,
  ShoppingCart,
  Calendar,
  Settings,
  Leaf,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { GlobalSearch } from "@/components/GlobalSearch"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { ClientOnly } from "@/components/ClientOnly"
import { useEffect, useState } from "react"

export function AppHeader() {
  const pathname = usePathname()
  const { isAuthenticated, user, login, logout } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  const isActive = (path: string) => pathname === path

  const handleDemoLogin = () => {
    const demoUser = {
      id: "demo-user-1",
      name: "Anh Tuấn",
      email: "anh.tuan@email.com",
      avatar: "/placeholder-user.jpg",
      preferences: {
        diet: "vegetarian",
        allergies: ["gluten"],
        budget: 1200000
      }
    }
    login(demoUser)
  }

  // Load shopping cart count from localStorage and keep it updated
  useEffect(() => {
    const computeCount = () => {
      try {
        const saved = localStorage.getItem("angi-shopping-list")
        if (!saved) {
          setCartCount(0)
          return
        }
        const items = JSON.parse(saved) as Array<any>
        // show count of unchecked items, fallback to total
        const unchecked = items.filter((i) => !i.checked)
        setCartCount(unchecked.length || items.length)
      } catch {
        setCartCount(0)
      }
    }

    computeCount()

    const onStorage = (e: StorageEvent) => {
      if (e.key === "angi-shopping-list") computeCount()
    }
    const onVisibility = () => {
      if (document.visibilityState === "visible") computeCount()
    }

    window.addEventListener("storage", onStorage)
    document.addEventListener("visibilitychange", onVisibility)
    const interval = window.setInterval(computeCount, 4000)

    return () => {
      window.removeEventListener("storage", onStorage)
      document.removeEventListener("visibilitychange", onVisibility)
      window.clearInterval(interval)
    }
  }, [])

  return (
    <header className="border-b border-border/40 bg-card/95 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-primary/20 ring-1 ring-black/5 overflow-hidden">
            <img src="/angi-logo.svg" alt="AnGi logo" className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-5 bg-clip-text text-transparent">
              AnGi
            </h1>
          </div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3">
          {/* Global Search */}
          <GlobalSearch />

          {/* Desktop Navigation */}
          <Link href="/menu" className="hidden md:block">
            <Button 
              variant={isActive("/menu") ? "default" : "ghost"} 
              size="sm" 
              className="font-medium hover:bg-primary/10 gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Thực đơn
            </Button>
          </Link>
        {/* Shopping Cart quick access */}
        <Link href="/shopping" className="hidden md:block relative">
          <Button 
            variant={isActive("/shopping") ? "default" : "ghost"}
            size="sm"
            className="font-medium hover:bg-primary/10 gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden lg:inline">Đi chợ</span>
          </Button>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[10px] flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </Link>
          <Link href="/dishes" className="hidden md:block">
            <Button 
              variant={isActive("/dishes") ? "default" : "ghost"} 
              size="sm" 
              className="font-medium hover:bg-primary/10 gap-2"
            >
              <Utensils className="h-4 w-4" />
              Món ăn
            </Button>
          </Link>
          <Link href="/shopping" className="hidden md:block">
            <Button 
              variant={isActive("/shopping") ? "default" : "ghost"} 
              size="sm" 
              className="font-medium hover:bg-primary/10 gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Đi chợ
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden h-9 w-9 p-0">
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
                  <Button 
                    variant={isActive("/") ? "default" : "ghost"} 
                    className="w-full justify-start h-12 text-base font-medium"
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Trang chủ
                  </Button>
                </Link>
                <Link href="/menu" className="w-full">
                  <Button 
                    variant={isActive("/menu") ? "default" : "ghost"} 
                    className="w-full justify-start h-12 text-base font-medium"
                  >
                    <BookOpen className="mr-3 h-5 w-5" />
                    Thực đơn
                  </Button>
                </Link>
                <Link href="/dishes" className="w-full">
                  <Button 
                    variant={isActive("/dishes") ? "default" : "ghost"} 
                    className="w-full justify-start h-12 text-base font-medium"
                  >
                    <Utensils className="mr-3 h-5 w-5" />
                    Món ăn
                  </Button>
                </Link>
                <Link href="/shopping" className="w-full">
                  <Button 
                    variant={isActive("/shopping") ? "default" : "ghost"} 
                    className="w-full justify-start h-12 text-base font-medium"
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Đi chợ
                    {cartCount > 0 && (
                      <span className="ml-auto inline-flex h-6 min-w-6 px-2 items-center justify-center rounded-full bg-primary text-white text-xs">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/cook" className="w-full">
                  <Button 
                    variant={isActive("/cook") ? "default" : "ghost"} 
                    className="w-full justify-start h-12 text-base font-medium"
                  >
                    <ChefHat className="mr-3 h-5 w-5" />
                    Hướng dẫn nấu
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start h-12 text-base font-medium opacity-50">
                  <Calendar className="mr-3 h-5 w-5" />
                  Lịch trình
                  <span className="ml-auto text-xs">Sớm có</span>
                </Button>
                <div className="border-t border-border my-2" />
                <Link href="/settings" className="w-full">
                  <Button 
                    variant={isActive("/settings") ? "default" : "ghost"} 
                    className="w-full justify-start h-12 text-base font-medium"
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Cài đặt
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Profile - Wrapped in ClientOnly to prevent hydration mismatch */}
          <ClientOnly fallback={
            <Button variant="ghost" className="h-9 md:h-10 w-9 md:w-auto px-1 md:px-3 gap-2">
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-muted animate-pulse" />
              <span className="hidden md:inline w-20 h-4 bg-muted animate-pulse rounded" />
            </Button>
          }>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 md:h-10 w-9 md:w-auto px-1 md:px-3 gap-2 hover:bg-primary/10 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-background group-hover:scale-105 transition-transform">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 md:h-3.5 md:w-3.5 rounded-full bg-chart-2 border-2 border-background flex items-center justify-center">
                        <Leaf className="h-1.5 w-1.5 md:h-2 md:w-2 text-white" />
                      </div>
                    </div>
                    <span className="hidden md:inline text-sm font-medium group-hover:text-primary transition-colors">{user?.name || "User"}</span>
                    <ChevronDown className="hidden md:inline h-3 w-3 ml-1 group-hover:rotate-180 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-primary/20">
                      AT
                    </div>
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">Anh Tuấn</p>
                    <p className="text-xs text-muted-foreground font-normal truncate">anh.tuan@email.com</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-5">
                        <Leaf className="h-2.5 w-2.5 mr-1" />
                        Chay
                      </Badge>
                      <Badge variant="outline" className="text-[10px] h-5 border-green-500 text-green-600">
                        <Sparkles className="h-2.5 w-2.5 mr-1" />
                        Pro
                      </Badge>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Trang cá nhân</div>
                    <div className="text-xs text-muted-foreground">Xem thống kê & hoạt động</div>
                  </div>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Cài đặt</div>
                    <div className="text-xs text-muted-foreground">Tùy chỉnh sở thích</div>
                  </div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">Thông báo</div>
                  <div className="text-xs text-muted-foreground">3 thông báo mới</div>
                </div>
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">3</Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">Đăng xuất</div>
                  <div className="text-xs text-muted-foreground">Thoát khỏi tài khoản</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Đăng nhập</span>
                </Button>
              </Link>
            )}
          </ClientOnly>
        </nav>
      </div>
    </header>
  )
}

