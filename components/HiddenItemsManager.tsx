"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Eye, 
  EyeOff, 
  Search, 
  Trash2, 
  RotateCcw,
  Utensils,
  Building2,
  Leaf,
  Calendar
} from 'lucide-react'
import { useHiddenItems, HiddenItem } from '@/contexts/HiddenItemsContext'
import { toast } from 'sonner'
import Image from 'next/image'

export function HiddenItemsManager() {
  const { hiddenItems, showItem, clearAllHidden, getHiddenByType } = useHiddenItems()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredItems = hiddenItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || item.type === activeTab
    return matchesSearch && matchesTab
  })

  const handleShowItem = (item: HiddenItem) => {
    showItem(item.id)
    toast.success(`Đã hiện "${item.name}" trong gợi ý`)
  }

  const handleClearAll = () => {
    clearAllHidden()
    toast.success('Đã hiện tất cả món ăn và nhà hàng')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="h-4 w-4" />
      case 'restaurant': return <Building2 className="h-4 w-4" />
      case 'ingredient': return <Leaf className="h-4 w-4" />
      default: return <Utensils className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meal': return 'Món ăn'
      case 'restaurant': return 'Nhà hàng'
      case 'ingredient': return 'Nguyên liệu'
      default: return 'Khác'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (hiddenItems.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Chưa có món ăn nào bị ẩn</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Khi bạn ẩn món ăn hoặc nhà hàng, chúng sẽ xuất hiện ở đây để bạn có thể quản lý.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Món ăn đã ẩn</h2>
          <p className="text-muted-foreground">
            Quản lý những món ăn và nhà hàng bạn đã ẩn khỏi gợi ý
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <EyeOff className="h-3 w-3" />
            {hiddenItems.length} đã ẩn
          </Badge>
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Hiện tất cả
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn đã ẩn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            Tất cả ({hiddenItems.length})
          </TabsTrigger>
          <TabsTrigger value="meal" className="gap-2">
            <Utensils className="h-4 w-4" />
            Món ăn ({getHiddenByType('meal').length})
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="gap-2">
            <Building2 className="h-4 w-4" />
            Nhà hàng ({getHiddenByType('restaurant').length})
          </TabsTrigger>
          <TabsTrigger value="ingredient" className="gap-2">
            <Leaf className="h-4 w-4" />
            Nguyên liệu ({getHiddenByType('ingredient').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
                <p className="text-muted-foreground text-center">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            {getTypeIcon(item.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="gap-1">
                                {getTypeIcon(item.type)}
                                {getTypeLabel(item.type)}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(item.hiddenAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleShowItem(item)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Hiện lại
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
