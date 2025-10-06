import { useState, useEffect, useCallback } from 'react'

export interface ShoppingHistoryItem {
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

export interface SpendingSummary {
  totalAmount: number
  averagePerDay: number
  averagePerWeek: number
  averagePerMonth: number
  transactionCount: number
  shoppingCount: number
}

export interface CategoryBreakdown {
  [key: string]: number
}

export type Period = 'week' | 'month' | 'all'

export function useShoppingHistory(period: Period = 'week') {
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistoryItem[]>([])
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null)
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch shopping history
      const historyRes = await fetch(`/api/shopping-history?period=${period}`)
      if (!historyRes.ok) {
        throw new Error('Failed to fetch shopping history')
      }
      const historyData = await historyRes.json()
      setShoppingHistory(historyData.data || [])

      // Fetch spending summary
      const summaryRes = await fetch(`/api/spending-summary?period=${period}`)
      if (!summaryRes.ok) {
        throw new Error('Failed to fetch spending summary')
      }
      const summaryData = await summaryRes.json()
      setSpendingSummary(summaryData.data.summary)
      setCategoryBreakdown(summaryData.data.expensesByType || {})
    } catch (err) {
      console.error('Error loading shopping history:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refresh = useCallback(() => {
    loadData()
  }, [loadData])

  return {
    shoppingHistory,
    spendingSummary,
    categoryBreakdown,
    loading,
    error,
    refresh
  }
}

