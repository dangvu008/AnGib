"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Search,
  Mic,
  Calendar,
  Utensils,
  Store,
  ShoppingCart,
  ChefHat,
  Flame,
  Clock,
  Leaf,
  TrendingUp,
  MapPin,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isListening, setIsListening] = useState(false)
  const router = useRouter()

  // Mock data - sẽ thay bằng API call
  const searchData = {
    menus: [
      { id: 1, name: "Thực đơn chay 7 ngày", type: "menu", calo: "1,400-1,600", meals: 21, icon: Calendar },
      { id: 2, name: "Thực đơn giảm cân", type: "menu", calo: "1,200-1,400", meals: 42, icon: Calendar },
      { id: 3, name: "Thực đơn gia đình", type: "menu", calo: "1,800-2,200", meals: 21, icon: Calendar },
    ],
    dishes: [
      { id: 1, name: "Đậu hũ sốt cà chua", type: "dish", calo: 180, time: "15 phút", tags: ["Chay", "Dễ"], icon: Utensils },
      { id: 2, name: "Canh bí đỏ", type: "dish", calo: 80, time: "10 phút", tags: ["Chay", "Nhanh"], icon: Utensils },
      { id: 3, name: "Rau muống xào tỏi", type: "dish", calo: 60, time: "5 phút", tags: ["Chay", "Express"], icon: Utensils },
      { id: 4, name: "Nấm xào rau củ", type: "dish", calo: 150, time: "12 phút", tags: ["Chay"], icon: Utensils },
      { id: 5, name: "Gỏi cuốn chay", type: "dish", calo: 120, time: "10 phút", tags: ["Chay", "Mát"], icon: Utensils },
      { id: 6, name: "Cà ri chay", type: "dish", calo: 200, time: "25 phút", tags: ["Chay", "Ấm"], icon: Utensils },
    ],
    ingredients: [
      { id: 1, name: "Đậu hũ", type: "ingredient", category: "Đạm", price: "7,500₫/hộp", icon: ShoppingCart },
      { id: 2, name: "Cà chua", type: "ingredient", category: "Rau củ", price: "40,000₫/kg", icon: ShoppingCart },
      { id: 3, name: "Bí đỏ", type: "ingredient", category: "Rau củ", price: "18,000₫/kg", icon: ShoppingCart },
      { id: 4, name: "Nấm hương", type: "ingredient", category: "Đạm", price: "125,000₫/kg", icon: ShoppingCart },
      { id: 5, name: "Rau muống", type: "ingredient", category: "Rau củ", price: "8,000₫/bó", icon: ShoppingCart },
    ],
    restaurants: [
      { id: 1, name: "Quán Chay Tịnh Tâm", type: "restaurant", rating: 4.9, distance: "0.8 km", price: "40-70k", icon: Store },
      { id: 2, name: "Nhà hàng Chay Bồ Đề", type: "restaurant", rating: 4.7, distance: "1.2 km", price: "50-100k", icon: Store },
      { id: 3, name: "Cơm Chay An Nhiên", type: "restaurant", rating: 4.6, distance: "2.0 km", price: "35-60k", icon: Store },
    ],
  }

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Voice Search với Web Speech API
  const startVoiceSearch = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Trình duyệt không hỗ trợ Voice Search", {
        description: "Vui lòng dùng Chrome hoặc Edge"
      })
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = "vi-VN"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      toast.info("🎤 Đang lắng nghe...", {
        description: "Hãy nói tên món ăn hoặc nguyên liệu"
      })
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearch(transcript)
      toast.success(`Đã nghe: "${transcript}"`)
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      toast.error("Lỗi voice search", {
        description: event.error
      })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [])

  // Filter results
  const filterResults = (data: any[], query: string) => {
    if (!query) return data
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  const filteredMenus = filterResults(searchData.menus, search)
  const filteredDishes = filterResults(searchData.dishes, search)
  const filteredIngredients = filterResults(searchData.ingredients, search)
  const filteredRestaurants = filterResults(searchData.restaurants, search)

  const handleSelect = (type: string, item: any) => {
    setOpen(false)
    setSearch("")
    
    switch (type) {
      case "menu":
        router.push("/menu")
        toast.success(`Đã chọn: ${item.name}`)
        break
      case "dish":
        router.push("/dishes")
        toast.success(`Đã chọn món: ${item.name}`)
        break
      case "ingredient":
        router.push("/shopping")
        toast.success(`Đã thêm vào giỏ: ${item.name}`)
        break
      case "restaurant":
        toast.info("🍜 Đang mở bản đồ...", {
          description: `${item.name} - ${item.distance}`
        })
        break
    }
  }

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className="relative justify-start text-sm text-muted-foreground h-9 md:h-10 w-32 md:w-64 pr-3"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden md:inline">Tìm kiếm...</span>
        <span className="md:hidden">Tìm...</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Tìm thực đơn, món ăn, nguyên liệu, nhà hàng..."
            value={search}
            onValueChange={setSearch}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            className={`ml-2 gap-2 ${isListening ? "text-red-500" : ""}`}
            onClick={startVoiceSearch}
          >
            <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
            <span className="text-xs hidden sm:inline">{isListening ? "Đang nghe..." : "Voice"}</span>
          </Button>
        </div>

        <CommandList>
          <CommandEmpty>
            <div className="py-6 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Không tìm thấy kết quả</p>
              <p className="text-xs text-muted-foreground mt-1">Thử từ khóa khác hoặc dùng voice search</p>
            </div>
          </CommandEmpty>

          {/* Menus */}
          {filteredMenus.length > 0 && (
            <>
              <CommandGroup heading="📋 Thực đơn">
                {filteredMenus.map((menu) => (
                  <CommandItem
                    key={menu.id}
                    onSelect={() => handleSelect("menu", menu)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="h-9 w-9 rounded-lg bg-chart-1/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-chart-1" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{menu.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {menu.meals} bữa • {menu.calo} calo/ngày
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Dishes */}
          {filteredDishes.length > 0 && (
            <>
              <CommandGroup heading="🍲 Món ăn">
                {filteredDishes.map((dish) => (
                  <CommandItem
                    key={dish.id}
                    onSelect={() => handleSelect("dish", dish)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="h-9 w-9 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                      <ChefHat className="h-4 w-4 text-chart-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{dish.name}</p>
                        {dish.tags.includes("Chay") && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            <Leaf className="h-2.5 w-2.5 mr-0.5" />
                            Chay
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {dish.calo} calo
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          {dish.time}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Ingredients */}
          {filteredIngredients.length > 0 && (
            <>
              <CommandGroup heading="🥕 Nguyên liệu">
                {filteredIngredients.map((ingredient) => (
                  <CommandItem
                    key={ingredient.id}
                    onSelect={() => handleSelect("ingredient", ingredient)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="h-9 w-9 rounded-lg bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-4 w-4 text-chart-3" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{ingredient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ingredient.category} • {ingredient.price}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Restaurants */}
          {filteredRestaurants.length > 0 && (
            <>
              <CommandGroup heading="🏪 Nhà hàng">
                {filteredRestaurants.map((restaurant) => (
                  <CommandItem
                    key={restaurant.id}
                    onSelect={() => handleSelect("restaurant", restaurant)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="h-9 w-9 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                      <Store className="h-4 w-4 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{restaurant.name}</p>
                        <span className="text-xs">⭐ {restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {restaurant.distance}
                        </span>
                        <span>{restaurant.price}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Quick Actions */}
          {!search && (
            <CommandGroup heading="⚡ Thao tác nhanh">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/menu")
                }}
              >
                <Calendar className="mr-3 h-4 w-4" />
                Xem tất cả thực đơn
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dishes")
                }}
              >
                <Utensils className="mr-3 h-4 w-4" />
                Khám phá món ăn
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/shopping")
                }}
              >
                <ShoppingCart className="mr-3 h-4 w-4" />
                Danh sách mua sắm
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  toast.info("🎲 Đang tạo thực đơn ngẫu nhiên...")
                }}
              >
                <TrendingUp className="mr-3 h-4 w-4" />
                Tạo thực đơn ngẫu nhiên
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer */}
        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
                ↵
              </kbd>
              <span>Chọn</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
                ESC
              </kbd>
              <span>Đóng</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 gap-1 text-xs"
            onClick={startVoiceSearch}
          >
            <Mic className={`h-3 w-3 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
            Voice
          </Button>
        </div>
      </CommandDialog>
    </>
  )
}

