"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface AddShoppingHistoryButtonProps {
  onSuccess?: () => void
}

export function AddShoppingHistoryButton({ onSuccess }: AddShoppingHistoryButtonProps) {
  const [loading, setLoading] = useState(false)

  const addSampleHistory = async () => {
    setLoading(true)
    try {
      // This would be replaced with actual ingredient IDs from your database
      const sampleData = {
        name: `Đi chợ ${new Date().toLocaleDateString('vi-VN')}`,
        shopping_date: new Date().toISOString().split('T')[0],
        actual_total: 150000,
        items: [
          // Note: You need to replace these with actual ingredient IDs
          // {
          //   ingredient_id: "uuid-here",
          //   quantity: 2,
          //   unit: "hộp",
          //   price: 30000,
          //   notes: "Đậu hũ tươi"
          // }
        ]
      }

      const response = await fetch('/api/shopping-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData)
      })

      if (!response.ok) {
        throw new Error('Failed to add shopping history')
      }

      toast.success('✅ Đã thêm lịch sử mua sắm mẫu')
      onSuccess?.()
    } catch (error) {
      console.error('Error adding sample history:', error)
      toast.error('❌ Không thể thêm lịch sử mẫu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={addSampleHistory}
      disabled={loading}
      className="gap-2"
    >
      <PlusCircle className="h-4 w-4" />
      {loading ? 'Đang thêm...' : 'Thêm dữ liệu mẫu'}
    </Button>
  )
}

