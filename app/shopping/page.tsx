"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, 
  ShoppingCart,
  Plus,
  Trash2,
  DollarSign,
  Package,
  Edit3,
  Save,
  X,
  MessageSquare
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { GlobalSearch } from "@/components/GlobalSearch"
import { AppHeader } from "@/components/AppHeader"
import { toast } from "sonner"
import { useEffect } from "react"

interface ShoppingItem {
  id: number
  name: string
  quantity: string
  price: number
  category: string
  checked: boolean
  note: string
}

export default function ShoppingPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: 1, name: "Đậu hũ", quantity: "2 hộp", price: 15000, category: "Đạm", checked: false, note: "" },
    { id: 2, name: "Cà chua", quantity: "500g", price: 20000, category: "Rau củ", checked: false, note: "Chọn quả chín đỏ" },
    { id: 3, name: "Bí đỏ", quantity: "1kg", price: 18000, category: "Rau củ", checked: true, note: "" },
    { id: 4, name: "Rau muống", quantity: "1 bó", price: 8000, category: "Rau củ", checked: false, note: "Tươi, non" },
    { id: 5, name: "Nấm hương", quantity: "200g", price: 25000, category: "Đạm", checked: false, note: "" },
    { id: 6, name: "Tỏi", quantity: "100g", price: 5000, category: "Gia vị", checked: true, note: "" },
    { id: 7, name: "Dầu ăn", quantity: "1 chai", price: 35000, category: "Gia vị", checked: false, note: "" },
  ])
  
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [tempPrice, setTempPrice] = useState<string>("")
  const [tempNote, setTempNote] = useState<string>("")

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("angi-shopping-list")
    if (saved) {
      try {
        setShoppingList(JSON.parse(saved))
        toast.success("Đã tải danh sách đã lưu")
      } catch (e) {
        console.error("Failed to load shopping list", e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("angi-shopping-list", JSON.stringify(shoppingList))
  }, [shoppingList])

  const toggleItem = (id: number) => {
    setShoppingList(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newChecked = !item.checked
          if (newChecked) {
            toast.success(`✅ Đã mua: ${item.name}`)
          }
          return { ...item, checked: newChecked }
        }
        return item
      })
    )
  }

  const updateNote = (id: number, note: string) => {
    setShoppingList(prev =>
      prev.map(item => (item.id === id ? { ...item, note } : item))
    )
    setEditingNote(null)
    if (note.trim()) {
      toast.success("💡 Đã lưu ghi chú")
    }
  }

  const updatePrice = (id: number) => {
    const price = parseInt(tempPrice.replace(/\D/g, ""))
    
    if (isNaN(price) || price < 0) {
      toast.error("❌ Giá không hợp lệ", {
        description: "Vui lòng nhập số dương"
      })
      return
    }

    if (price > 10000000) {
      toast.error("❌ Giá quá cao", {
        description: "Vui lòng kiểm tra lại"
      })
      return
    }

    setShoppingList(prev =>
      prev.map(item => (item.id === id ? { ...item, price } : item))
    )
    setEditingPrice(null)
    setTempPrice("")
    toast.success("💰 Đã cập nhật giá")
  }

  const startEditNote = (id: number, currentNote: string) => {
    setEditingNote(id)
    setTempNote(currentNote)
  }

  const startEditPrice = (id: number, currentPrice: number) => {
    setEditingPrice(id)
    setTempPrice(currentPrice.toString())
  }

  const totalPrice = shoppingList.reduce((sum, item) => sum + item.price, 0)
  const checkedPrice = shoppingList.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0)
  const uncheckedCount = shoppingList.filter(item => !item.checked).length

  const categories = Array.from(new Set(shoppingList.map(item => item.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">🛒 Danh sách đi chợ tổng hợp</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Tất cả nguyên liệu cho cả tuần • Còn {uncheckedCount} món
              </p>
            </div>
            <Button className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Thêm món</span>
            </Button>
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <ShoppingCart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">📦 Danh sách tổng hợp từ nhiều nguồn</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  • Từ <strong>"Chuẩn bị đi chợ"</strong> ở trang chủ (các bữa ăn riêng lẻ)<br/>
                  • Thêm thủ công từ công thức<br/>
                  • Tự động gom theo category, loại bỏ trùng lặp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{shoppingList.length}</p>
              <p className="text-xs text-muted-foreground">Tổng món</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{shoppingList.filter(i => i.checked).length}</p>
              <p className="text-xs text-muted-foreground">Đã mua</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{totalPrice.toLocaleString()}₫</p>
              <p className="text-xs text-muted-foreground">Tổng chi phí</p>
            </CardContent>
          </Card>
        </div>

        {/* Shopping List by Category */}
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">{category}</h2>
              <Badge variant="secondary">
                {shoppingList.filter(item => item.category === category).length} món
              </Badge>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                {shoppingList
                  .filter(item => item.category === category)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-3 md:p-4 border-b last:border-0 hover:bg-muted/30 transition-colors ${
                        item.checked ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="h-5 w-5 mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className={`font-semibold text-sm md:text-base ${item.checked ? "line-through" : ""}`}>
                              {item.name}
                            </p>
                            {item.note && !editingNote && item.note.startsWith("Cho bữa") && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1 border-primary/30 text-primary">
                                <Calendar className="h-2.5 w-2.5" />
                                {item.note}
                              </Badge>
                            )}
                            {item.note && !editingNote && !item.note.startsWith("Cho bữa") && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                                <MessageSquare className="h-2.5 w-2.5" />
                                Có ghi chú
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-2">{item.quantity}</p>
                          
                          {/* Note Section */}
                          {editingNote === item.id ? (
                            <div className="flex gap-2 mb-2">
                              <Input
                                value={tempNote}
                                onChange={(e) => setTempNote(e.target.value)}
                                placeholder="Ghi chú ngắn gọn..."
                                className="h-8 text-xs flex-1"
                                autoFocus
                                maxLength={50}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") updateNote(item.id, tempNote)
                                  if (e.key === "Escape") setEditingNote(null)
                                }}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => updateNote(item.id, tempNote)}
                              >
                                <Save className="h-3.5 w-3.5 text-chart-2" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setEditingNote(null)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : item.note ? (
                            <div
                              className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-2 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors"
                              onClick={() => startEditNote(item.id, item.note)}
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                              <p className="text-xs text-amber-700 dark:text-amber-500 flex-1">{item.note}</p>
                              <Edit3 className="h-3 w-3 text-amber-600 opacity-0 group-hover:opacity-100" />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground mb-2"
                              onClick={() => startEditNote(item.id, "")}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Thêm ghi chú
                            </Button>
                          )}
                        </div>

                        {/* Price Section */}
                        <div className="text-right flex-shrink-0">
                          {editingPrice === item.id ? (
                            <div className="flex flex-col gap-1">
                              <Input
                                type="text"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                placeholder="Giá..."
                                className="h-8 w-24 text-xs text-right"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") updatePrice(item.id)
                                  if (e.key === "Escape") setEditingPrice(null)
                                }}
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-full p-0"
                                  onClick={() => updatePrice(item.id)}
                                >
                                  <Save className="h-3 w-3 text-chart-2" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-full p-0"
                                  onClick={() => setEditingPrice(null)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer group"
                              onClick={() => startEditPrice(item.id, item.price)}
                            >
                              <p className={`font-bold text-sm md:text-base ${item.checked ? "line-through" : ""}`}>
                                {item.price.toLocaleString()}₫
                              </p>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                                  <Edit3 className="h-2.5 w-2.5" />
                                  Sửa
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setShoppingList(prev => prev.filter(i => i.id !== item.id))
                            toast.success("🗑️ Đã xóa món")
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Total Summary */}
        <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground">Đã mua ({shoppingList.filter(i => i.checked).length} món)</span>
              <span className="font-bold">{checkedPrice.toLocaleString()}₫</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground">Chưa mua ({uncheckedCount} món)</span>
              <span className="font-bold">{(totalPrice - checkedPrice).toLocaleString()}₫</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="text-lg font-bold">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()}₫</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12"
              onClick={() => {
                const removedCount = shoppingList.filter(item => item.checked).length
                if (removedCount === 0) {
                  toast.info("Chưa có món nào được đánh dấu đã mua")
                  return
                }
                setShoppingList(prev => prev.filter(item => !item.checked))
                toast.success(`🗑️ Đã xóa ${removedCount} món đã mua`)
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa đã mua ({shoppingList.filter(item => item.checked).length})
            </Button>
            <Button 
              size="lg" 
              className="h-12"
              onClick={() => {
                if (uncheckedCount > 0) {
                  toast.warning(`⚠️ Còn ${uncheckedCount} món chưa mua`, {
                    description: "Hãy hoàn thành trước khi kết thúc"
                  })
                } else {
                  toast.success("🎉 Hoàn thành đi chợ tuần này!", {
                    description: `Tổng chi: ${totalPrice.toLocaleString()}₫`,
                    duration: 4000
                  })
                  // Clear list after completion
                  setTimeout(() => {
                    setShoppingList([])
                    toast.info("Danh sách đã được reset cho tuần mới")
                  }, 2000)
                }
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Hoàn thành tuần
            </Button>
          </div>

          {/* Weekly Summary */}
          {shoppingList.length > 0 && (
            <Card className="border-0 bg-gradient-to-br from-muted/50 to-transparent">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  📊 Thống kê tuần này
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{shoppingList.length}</p>
                    <p className="text-[10px] text-muted-foreground">Tổng món</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-chart-2">{shoppingList.filter(i => i.checked).length}</p>
                    <p className="text-[10px] text-muted-foreground">Đã mua</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-chart-3">{Math.round((shoppingList.filter(i => i.checked).length / shoppingList.length) * 100)}%</p>
                    <p className="text-[10px] text-muted-foreground">Hoàn thành</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Notification */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              💾 Danh sách tự động lưu • Đồng bộ với "Chuẩn bị đi chợ" ở trang chủ
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

