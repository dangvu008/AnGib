"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Star,
  StarOff,
  Save,
  Trash2,
  Calendar,
  ChefHat,
  Copy,
  PlusCircle
} from "lucide-react"
import { toast } from "sonner"

interface MenuTemplatesProps {
  onApply?: (menu: any) => void
}

export default function MenuTemplates({ onApply }: MenuTemplatesProps) {
  const [templates, setTemplates] = useState<any[]>([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    try {
      const raw = localStorage.getItem("angi-menu-templates")
      setTemplates(raw ? JSON.parse(raw) : [])
    } catch {}
  }

  const saveTemplates = (next: any[]) => {
    localStorage.setItem("angi-menu-templates", JSON.stringify(next))
    setTemplates(next)
  }

  const toggleFavorite = (id: string) => {
    const next = templates.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t)
    saveTemplates(next)
  }

  const deleteTemplate = (id: string) => {
    const next = templates.filter(t => t.id !== id)
    saveTemplates(next)
    toast.success("Đã xóa mẫu thực đơn")
  }

  const duplicateTemplate = (id: string) => {
    const t = templates.find(t => t.id === id)
    if (!t) return
    const dup = { ...t, id: `${Date.now()}`, name: `${t.name} (bản sao)` }
    const next = [dup, ...templates]
    saveTemplates(next)
    toast.success("Đã nhân bản mẫu")
  }

  const applyTemplate = (t: any) => {
    try {
      // Reuse existing apply flow in app/menu/page.tsx if provided
      if (onApply) {
        onApply(t)
      } else {
        // Fallback: set active menu directly
        const appliedMenu = {
          id: t.id,
          name: t.name,
          description: t.description,
          startDate: new Date().toISOString(),
          days: t.days,
          schedule: t.schedule,
          appliedAt: new Date().toISOString()
        }
        localStorage.setItem("angi-active-menu", JSON.stringify(appliedMenu))
        toast.success("✅ Đã áp dụng mẫu thực đơn")
      }
    } catch {
      toast.error("Không thể áp dụng mẫu")
    }
  }

  const visible = templates
    .filter(t => !favoritesOnly || t.favorite)
    .filter(t => !filter || t.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Mẫu thực đơn đã lưu
          </span>
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm mẫu..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="h-9 w-48"
            />
            <Button
              variant={favoritesOnly ? "default" : "outline"}
              onClick={() => setFavoritesOnly(v => !v)}
              className="h-9 gap-2"
            >
              <Star className="h-4 w-4" />
              Yêu thích
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visible.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Chưa có mẫu nào. Hãy lưu mẫu từ trang chi tiết thực đơn.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {visible.map(t => (
              <div key={t.id} className="border rounded-lg p-3 bg-muted/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold mb-1">{t.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {t.days} ngày • {Object.values(t.schedule || {}).length || t.days} ngày lịch
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" /> {t.days} ngày
                      </Badge>
                      {t.favorite && (
                        <Badge className="text-xs">
                          <Star className="h-3 w-3 mr-1" /> Yêu thích
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(t.id)}
                    className="h-8 w-8 p-0"
                    title={t.favorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
                  >
                    {t.favorite ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="mt-2 flex gap-2">
                  <Button size="sm" className="gap-2" onClick={() => applyTemplate(t)}>
                    <Calendar className="h-4 w-4" /> Áp dụng
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => duplicateTemplate(t.id)}>
                    <Copy className="h-4 w-4" /> Nhân bản
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-2 text-red-600" onClick={() => deleteTemplate(t.id)}>
                    <Trash2 className="h-4 w-4" /> Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
