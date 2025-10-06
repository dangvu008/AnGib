"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { AppHeader } from "@/components/AppHeader"
import { formatCurrency } from "@/lib/currency"
import { toast } from "sonner"

interface ShoppingHistoryItem {
  id: string
  name: string
  shopping_date: string
  actual_total: number
  estimated_total: number
  status: string
  items: {
    id: string
    quantity: number
    unit: string
    actual_price: number
    ingredient: {
      name_vi: string
  category: string
    }
  }[]
}

interface SpendingSummary {
  totalAmount: number
  averagePerDay: number
  averagePerWeek: number
  averagePerMonth: number
  transactionCount: number
  shoppingCount: number
}

interface CategoryBreakdown {
  [key: string]: number
}

export default function ShoppingPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistoryItem[]>([])
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null)
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown>({})
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = async () => {
    setLoading(true)
    try {
      // Fetch shopping history
      const historyRes = await fetch(`/api/shopping-history?period=${period}`)
      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setShoppingHistory(historyData.data || [])
      }

      // Fetch spending summary
      const summaryRes = await fetch(`/api/spending-summary?period=${period}`)
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSpendingSummary(summaryData.data.summary)
        setCategoryBreakdown(summaryData.data.expensesByType || {})
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'Tuần này'
      case 'month': return 'Tháng này'
      case 'all': return 'Tất cả'
    }
  }

  if (loading && !spendingSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <AppHeader />
        <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Package className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">📊 Lịch sử mua sắm</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Theo dõi chi tiêu và thống kê nguyên liệu
              </p>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('week')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Tuần này
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
                size="sm"
              onClick={() => setPeriod('month')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Tháng này
            </Button>
              <Button 
              variant={period === 'all' ? 'default' : 'outline'}
                size="sm"
              onClick={() => setPeriod('all')}
              >
              <Filter className="h-4 w-4 mr-2" />
              Tất cả
              </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {spendingSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
              </div>
                <p className="text-xl md:text-2xl font-bold">{formatCurrency(spendingSummary.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
                <p className="text-xl md:text-2xl font-bold">{spendingSummary.shoppingCount}</p>
                <p className="text-xs text-muted-foreground">Lần đi chợ</p>
            </CardContent>
          </Card>

            <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <p className="text-xl md:text-2xl font-bold">{formatCurrency(spendingSummary.averagePerWeek)}</p>
                <p className="text-xs text-muted-foreground">TB/tuần</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-chart-4 to-chart-4/70 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <p className="text-xl md:text-2xl font-bold">{formatCurrency(spendingSummary.averagePerMonth)}</p>
                <p className="text-xs text-muted-foreground">TB/tháng</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Breakdown */}
        {Object.keys(categoryBreakdown).length > 0 && (
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Chi tiêu theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown).map(([category, amount]) => {
                  const percentage = spendingSummary 
                    ? Math.round((amount / spendingSummary.totalAmount) * 100)
                    : 0
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm font-bold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{percentage}% tổng chi tiêu</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shopping History List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Lịch sử đi chợ ({getPeriodLabel()})</h2>
            <Badge variant="secondary">{shoppingHistory.length} lần</Badge>
            </div>
            
          {shoppingHistory.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-2">Chưa có lịch sử mua sắm</p>
                <p className="text-sm text-muted-foreground">
                  Các lần đi chợ đã hoàn thành sẽ được hiển thị ở đây
                </p>
              </CardContent>
            </Card>
          ) : (
            shoppingHistory.map((history, index) => (
              <motion.div
                key={history.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => toggleExpanded(history.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{history.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {history.items.length} món
                              </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            📅 {new Date(history.shopping_date).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(history.actual_total)}
                          </p>
                            </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          {expandedItems.has(history.id) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                                </Button>
                              </div>
                            </div>

                    {/* Expanded Items */}
                    {expandedItems.has(history.id) && (
                      <div className="border-t bg-muted/20">
                        <div className="p-4 space-y-2">
                          <p className="text-sm font-semibold mb-3">Chi tiết nguyên liệu:</p>
                          {history.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2 bg-background rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.ingredient.name_vi}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity} {item.unit} • {item.ingredient.category}
                                </p>
                              </div>
                              <p className="text-sm font-bold">
                                {formatCurrency(item.actual_price)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
              </CardContent>
            </Card>
          </motion.div>
            ))
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
            💡 Lịch sử chỉ hiển thị các lần đi chợ đã hoàn thành và được ghi nhận
            </p>
        </div>
      </main>
    </div>
  )
}
