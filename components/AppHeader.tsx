"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
} from "lucide-react"
import Link from "next/link"
import { GlobalSearch } from "@/components/GlobalSearch"
import { usePathname } from "next/navigation"

export function AppHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b border-border/40 bg-card/95 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-chart-1 to-chart-5 flex items-center justify-center shadow-xl shadow-primary/30">
            <ChefHat className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-5 bg-clip-text text-transparent">
              MealPlan AI
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Trợ lý ẩm thực thông minh</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3">
          {/* Global Search */}
          <GlobalSearch />

          {/* Desktop Navigation */}
          <Link href="/" className="hidden lg:block">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              size="sm" 
              className="font-medium hover:bg-primary/10"
            >
              <Home className="mr-2 h-4 w-4" />
              Trang chủ
            </Button>
          </Link>
          <Link href="/menu" className="hidden lg:block">
            <Button 
              variant={isActive("/menu") ? "default" : "ghost"} 
              size="sm" 
              className="font-medium hover:bg-primary/10"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Thực đơn
            </Button>
          </Link>
          <Link href="/dishes" className="hidden lg:block">
            <Button 
              variant={isActive("/dishes") ? "default" : "ghost"} 
              size="sm" 
              className="font-medium hover:bg-primary/10"
            >
              <Utensils className="mr-2 h-4 w-4" />
              Món ăn
            </Button>
          </Link>
          <Link href="/shopping" className="hidden lg:block">
            <Button 
              variant={isActive("/shopping") ? "default" : "ghost"} 
              size="sm" 
              className="font-medium hover:bg-primary/10"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
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
                <Button variant="ghost" className="justify-start h-12 text-base font-medium opacity-50">
                  <Settings className="mr-3 h-5 w-5" />
                  Cài đặt
                  <span className="ml-auto text-xs">Sớm có</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Profile */}
          <div className="relative hidden md:block">
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
  )
}

