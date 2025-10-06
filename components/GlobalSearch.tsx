"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { useAuth } from "@/contexts/AuthContext"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [detectedType, setDetectedType] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { preferences, filterItems } = useUserPreferences()
  const { isAuthenticated } = useAuth()

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('angi-search-history')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Detect current page context and set appropriate tab
  useEffect(() => {
    if (pathname === '/dishes') {
      setActiveTab('dishes')
    } else if (pathname === '/menu') {
      setActiveTab('menus')
    } else if (pathname === '/restaurants') {
      setActiveTab('restaurants')
    } else if (pathname === '/shopping') {
      setActiveTab('shopping')
    } else if (pathname === '/weekly-plan') {
      setActiveTab('planning')
    } else {
      setActiveTab('all')
    }
  }, [pathname])

  // Smart search type detection
  const detectSearchType = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase()
    
    // Dish-related keywords
    const dishKeywords = ['món', 'ăn', 'nấu', 'công thức', 'chế biến', 'nướng', 'xào', 'luộc', 'hấp', 'chiên', 'canh', 'súp', 'salad', 'gỏi']
    const dishNames = ['bún', 'phở', 'cơm', 'bánh', 'chả', 'nem', 'gỏi', 'canh', 'súp', 'salad', 'pizza', 'pasta', 'sushi']
    
    // Restaurant-related keywords
    const restaurantKeywords = ['nhà hàng', 'quán', 'cửa hàng', 'địa chỉ', 'địa điểm', 'gần đây', 'khu vực', 'quận', 'phường']
    
    // Menu/Plan-related keywords
    const menuKeywords = ['thực đơn', 'kế hoạch', 'lịch', 'tuần', 'ngày', 'bữa', 'sáng', 'trưa', 'tối', 'lunch', 'dinner', 'breakfast']
    
    // Shopping-related keywords
    const shoppingKeywords = ['mua', 'chợ', 'siêu thị', 'nguyên liệu', 'thành phần', 'gia vị', 'rau', 'củ', 'quả', 'thịt', 'cá']
    
    // Ingredient-related keywords
    const ingredientKeywords = ['nguyên liệu', 'thành phần', 'gia vị', 'rau', 'củ', 'quả', 'thịt', 'cá', 'tôm', 'cua', 'đậu', 'nấm']
    
    if (dishKeywords.some(keyword => lowerQuery.includes(keyword)) || 
        dishNames.some(name => lowerQuery.includes(name))) {
      return 'dishes'
    }
    
    if (restaurantKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'restaurants'
    }
    
    if (menuKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'menus'
    }
    
    if (shoppingKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'shopping'
    }
    
    if (ingredientKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'ingredients'
    }
    
    return null
  }, [])

  // Update detected type when search changes
  useEffect(() => {
    if (search.trim()) {
      const detected = detectSearchType(search)
      setDetectedType(detected)
      if (detected && detected !== activeTab) {
        setActiveTab(detected)
      }
    } else {
      setDetectedType(null)
    }
  }, [search, detectSearchType, activeTab])

  // Save search to history
  const saveToHistory = useCallback((query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory.slice(0, 4)] // Keep last 5 searches
      setSearchHistory(newHistory)
      localStorage.setItem('angi-search-history', JSON.stringify(newHistory))
    }
  }, [searchHistory])

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
    ],
    restaurants: [
      { id: 1, name: "Quán Chay Tịnh Tâm", type: "restaurant", rating: 4.9, distance: "0.8 km", price: "40-70k", icon: Store },
      { id: 2, name: "Nhà hàng Chay Bồ Đề", type: "restaurant", rating: 4.7, distance: "1.2 km", price: "50-100k", icon: Store },
      { id: 3, name: "Cơm Chay An Nhiên", type: "restaurant", rating: 4.6, distance: "2.0 km", price: "35-60k", icon: Store },
    ],
  }

  // Filter data based on active tab, search query, and user preferences
  const getFilteredData = useCallback(() => {
    let filteredData = []
    
    // Get data based on active tab
    if (activeTab === "all" || activeTab === "menus") {
      filteredData = [...filteredData, ...searchData.menus]
    }
    if (activeTab === "all" || activeTab === "dishes") {
      filteredData = [...filteredData, ...searchData.dishes]
    }
    if (activeTab === "all" || activeTab === "restaurants") {
      filteredData = [...filteredData, ...searchData.restaurants]
    }

    // Apply user preferences filtering if authenticated
    if (isAuthenticated && preferences && filterItems) {
      filteredData = filterItems(filteredData, 'dishes')
    }

    // Apply search query filtering
    if (search.trim()) {
      const query = search.toLowerCase()
      filteredData = filteredData.filter(item => {
        // Basic name matching
        const nameMatch = item.name.toLowerCase().includes(query)
        
        // Tag matching
        const tagMatch = item.tags && item.tags.some((tag: string) => 
          tag.toLowerCase().includes(query)
        )
        
        // Description matching
        const descMatch = item.description && 
          item.description.toLowerCase().includes(query)
        
        // Ingredient matching
        const ingredientMatch = item.ingredients && 
          item.ingredients.some((ingredient: string) => 
            ingredient.toLowerCase().includes(query)
          )
        
        // Category matching
        const categoryMatch = item.category && 
          item.category.toLowerCase().includes(query)
        
        return nameMatch || tagMatch || descMatch || ingredientMatch || categoryMatch
      })
    }

    return filteredData
  }, [activeTab, search, isAuthenticated, preferences, filterItems])

  // Get context-aware suggestions
  const getContextSuggestions = useCallback(() => {
    const baseSuggestions = {
      all: {
        title: "Tìm kiếm phổ biến",
        suggestions: [
          { query: "món chay", icon: Leaf, badge: "Chay" },
          { query: "ăn sáng", icon: Clock, badge: "Thời gian" },
          { query: "món Việt", icon: ChefHat, badge: "Quốc gia" },
          { query: "canh chua", icon: Utensils, badge: "Món ăn" },
          { query: "bún bò", icon: Flame, badge: "Phổ biến" },
        ]
      },
      dishes: {
        title: "Gợi ý món ăn",
        suggestions: [
          { query: "món chay dễ nấu", icon: Leaf, badge: "Dễ" },
          { query: "canh chua", icon: Utensils, badge: "Canh" },
          { query: "bún chay", icon: Flame, badge: "Bún" },
          { query: "rau xào", icon: ChefHat, badge: "Xào" },
          { query: "đậu hũ", icon: Leaf, badge: "Chay" },
        ]
      },
      menus: {
        title: "Gợi ý thực đơn",
        suggestions: [
          { query: "thực đơn chay 7 ngày", icon: Calendar, badge: "Tuần" },
          { query: "ăn sáng healthy", icon: Clock, badge: "Sáng" },
          { query: "lunch văn phòng", icon: Utensils, badge: "Trưa" },
          { query: "dinner gia đình", icon: ChefHat, badge: "Tối" },
          { query: "meal prep", icon: Calendar, badge: "Chuẩn bị" },
        ]
      },
      restaurants: {
        title: "Gợi ý nhà hàng",
        suggestions: [
          { query: "quán chay gần đây", icon: MapPin, badge: "Gần" },
          { query: "nhà hàng chay", icon: Store, badge: "Chay" },
          { query: "quán ăn vặt", icon: Utensils, badge: "Vặt" },
          { query: "restaurant view đẹp", icon: Store, badge: "View" },
          { query: "buffet chay", icon: ChefHat, badge: "Buffet" },
        ]
      },
      shopping: {
        title: "Gợi ý mua sắm",
        suggestions: [
          { query: "nguyên liệu nấu canh", icon: ShoppingCart, badge: "Canh" },
          { query: "rau củ tươi", icon: Leaf, badge: "Tươi" },
          { query: "gia vị cơ bản", icon: Utensils, badge: "Gia vị" },
          { query: "đậu phụ", icon: Leaf, badge: "Chay" },
          { query: "nấm các loại", icon: ChefHat, badge: "Nấm" },
        ]
      },
      planning: {
        title: "Gợi ý kế hoạch",
        suggestions: [
          { query: "kế hoạch tuần", icon: Calendar, badge: "Tuần" },
          { query: "meal prep", icon: Clock, badge: "Chuẩn bị" },
          { query: "thực đơn giảm cân", icon: Leaf, badge: "Giảm cân" },
          { query: "ăn healthy", icon: ChefHat, badge: "Healthy" },
          { query: "lịch nấu ăn", icon: Calendar, badge: "Lịch" },
        ]
      }
    }

    return baseSuggestions[activeTab as keyof typeof baseSuggestions] || baseSuggestions.all
  }, [activeTab])

  // Get context-aware search placeholder
  const getSearchPlaceholder = useCallback(() => {
    const placeholders = {
      all: "Tìm thực đơn, món ăn, nguyên liệu, nhà hàng...",
      dishes: "Tìm món ăn, công thức, nguyên liệu...",
      menus: "Tìm thực đơn, kế hoạch bữa ăn...",
      restaurants: "Tìm nhà hàng, quán ăn gần đây...",
      shopping: "Tìm nguyên liệu, gia vị cần mua...",
      planning: "Tìm kế hoạch, lịch nấu ăn...",
    }
    
    return placeholders[activeTab as keyof typeof placeholders] || placeholders.all
  }, [activeTab])

  // Get context-aware label for search button
  const getContextLabel = useCallback(() => {
    const labels = {
      all: "Tìm kiếm...",
      dishes: "Tìm món ăn...",
      menus: "Tìm thực đơn...",
      restaurants: "Tìm nhà hàng...",
      shopping: "Tìm mua sắm...",
      planning: "Tìm kế hoạch...",
    }
    
    return labels[activeTab as keyof typeof labels] || labels.all
  }, [activeTab])

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
      toast.info("Đang nghe...", {
        description: "Nói từ khóa tìm kiếm của bạn"
      })
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearch(transcript)
      saveToHistory(transcript)
      toast.success("Đã nhận diện giọng nói", {
        description: `Tìm kiếm: "${transcript}"`
      })
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      toast.error("Lỗi nhận diện giọng nói", {
        description: event.error
      })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [saveToHistory])

  const handleSelect = (type: string, item: any) => {
    setOpen(false)
    saveToHistory(search)
    
    switch (type) {
      case "menu":
        router.push("/menu")
        toast.success("Đã chọn thực đơn", {
          description: item.name
        })
        break
      case "dish":
        router.push(`/cook/${item.id}`)
        toast.success("Đã chọn món ăn", {
          description: item.name
        })
        break
      case "restaurant":
        router.push("/restaurants")
        toast.success("Đã chọn nhà hàng", {
          description: item.name
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
                <span className="hidden md:inline">
                  {activeTab === 'all' ? 'Tìm kiếm...' : getContextLabel()}
                </span>
                <span className="md:hidden">Tìm...</span>
                {detectedType && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                    AI
                  </Badge>
                )}
                <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput
                    placeholder={getSearchPlaceholder()}
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
                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 p-2 border-b">
                    {[
                      { id: "all", label: "Tất cả", icon: Search },
                      { id: "dishes", label: "Món ăn", icon: Utensils },
                      { id: "menus", label: "Thực đơn", icon: Calendar },
                      { id: "restaurants", label: "Nhà hàng", icon: Store },
                      { id: "shopping", label: "Mua sắm", icon: ShoppingCart },
                      { id: "planning", label: "Kế hoạch", icon: Clock },
                    ].map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <tab.icon className="h-3 w-3 mr-1" />
                        {tab.label}
                        {detectedType === tab.id && (
                          <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                            AI
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>

          {/* Search History */}
          {!search && searchHistory.length > 0 && (
            <CommandGroup heading="Tìm kiếm gần đây">
              {searchHistory.map((query, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setSearch(query)
                    saveToHistory(query)
                  }}
                  className="cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{query}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

                  {/* Smart Suggestions based on context */}
                  {!search && (
                    <CommandGroup heading={getContextSuggestions().title}>
                      {getContextSuggestions().suggestions.map((suggestion, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            setSearch(suggestion.query)
                            saveToHistory(suggestion.query)
                          }}
                          className="cursor-pointer"
                        >
                          <suggestion.icon className="mr-2 h-4 w-4" />
                          <span>{suggestion.query}</span>
                          {suggestion.badge && (
                            <Badge variant="outline" className="ml-auto text-[10px]">
                              {suggestion.badge}
                            </Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

          <CommandEmpty>
            <div className="py-6 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Không tìm thấy kết quả</p>
              <p className="text-xs text-muted-foreground mt-1">Thử từ khóa khác hoặc dùng voice search</p>
            </div>
          </CommandEmpty>

          {/* Search Results */}
          {search && getFilteredData().length > 0 && (
            <CommandGroup heading={`Kết quả tìm kiếm (${getFilteredData().length})`}>
              {getFilteredData().map((item) => (
                <CommandItem
                  key={`${item.type}-${item.id}`}
                  onSelect={() => {
                    handleSelect(item.type, item)
                    saveToHistory(search)
                  }}
                  className="flex items-center gap-3 py-3"
                >
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.type === 'menu' ? 'bg-chart-1/10' :
                    item.type === 'dish' ? 'bg-chart-2/10' :
                    'bg-chart-4/10'
                  }`}>
                    <item.icon className={`h-4 w-4 ${
                      item.type === 'menu' ? 'text-chart-1' :
                      item.type === 'dish' ? 'text-chart-2' :
                      'text-chart-4'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      {item.tags && item.tags.includes("Chay") && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          <Leaf className="h-2.5 w-2.5 mr-0.5" />
                          Chay
                        </Badge>
                      )}
                      {item.rating && (
                        <span className="text-xs">⭐ {item.rating}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {item.calo && (
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {item.calo} calo
                        </span>
                      )}
                      {item.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </span>
                      )}
                      {item.distance && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.distance}
                        </span>
                      )}
                      {item.price && (
                        <span>{item.price}</span>
                      )}
                      {item.tags && (
                        <div className="flex gap-1">
                          {item.tags.slice(0, 2).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
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
                Xem tất cả món ăn
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
                  router.push("/weekly-plan")
                }}
              >
                <ChefHat className="mr-3 h-4 w-4" />
                Kế hoạch tuần
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}