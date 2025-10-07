"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Clock, 
  Users, 
  ChefHat, 
  Settings,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface MenuCustomizerProps {
  menu: any
  onSave: (customizedMenu: any) => void
  onCancel: () => void
}

export function MenuCustomizer({ menu, onSave, onCancel }: MenuCustomizerProps) {
  const [customizedMenu, setCustomizedMenu] = useState(menu)
  const [servings, setServings] = useState(menu.servings || 2)
  const [prepTime, setPrepTime] = useState(menu.prepTime || 30)
  const [difficulty, setDifficulty] = useState(menu.difficulty || "medium")
  const [notes, setNotes] = useState(menu.notes || "")
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    const updatedMenu = {
      ...customizedMenu,
      servings,
      prepTime,
      difficulty,
      notes,
      customizedAt: new Date().toISOString()
    }
    
    onSave(updatedMenu)
    toast.success("✅ Đã lưu tùy chỉnh thực đơn")
  }

  const resetToOriginal = () => {
    setCustomizedMenu(menu)
    setServings(menu.servings || 2)
    setPrepTime(menu.prepTime || 30)
    setDifficulty(menu.difficulty || "medium")
    setNotes(menu.notes || "")
    toast.info("🔄 Đã khôi phục thực đơn gốc")
  }

  const addCustomMeal = (dayIndex: number, mealType: string) => {
    const newMenu = { ...customizedMenu }
    if (!newMenu.schedule[dayIndex].meals) {
      newMenu.schedule[dayIndex].meals = {}
    }
    
    newMenu.schedule[dayIndex].meals[mealType] = {
      name: "Món tự chế",
      description: "Món ăn do bạn tự chế biến",
      prepTime: "15 phút",
      calories: 300,
      ingredients: []
    }
    
    setCustomizedMenu(newMenu)
    toast.success("✅ Đã thêm món tự chế")
  }

  const removeMeal = (dayIndex: number, mealType: string) => {
    const newMenu = { ...customizedMenu }
    if (newMenu.schedule[dayIndex].meals) {
      delete newMenu.schedule[dayIndex].meals[mealType]
    }
    setCustomizedMenu(newMenu)
    toast.success("🗑️ Đã xóa món ăn")
  }

  const updateMeal = (dayIndex: number, mealType: string, field: string, value: any) => {
    const newMenu = { ...customizedMenu }
    if (newMenu.schedule[dayIndex].meals && newMenu.schedule[dayIndex].meals[mealType]) {
      newMenu.schedule[dayIndex].meals[mealType][field] = value
      setCustomizedMenu(newMenu)
    }
  }

  return (
    <div className="space-y-6">
      {/* Menu Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tùy chỉnh thực đơn: {menu.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="servings">Số người ăn</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                max="10"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="prepTime">Thời gian chuẩn bị (phút)</Label>
              <Input
                id="prepTime"
                type="number"
                min="5"
                max="180"
                value={prepTime}
                onChange={(e) => setPrepTime(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Thêm ghi chú cho thực đơn này..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule Customization */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Lịch trình bữa ăn
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {isEditing ? "Hoàn thành" : "Chỉnh sửa"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customizedMenu.schedule.map((day: any, dayIndex: number) => (
              <motion.div
                key={dayIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Ngày {dayIndex + 1}</h3>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addCustomMeal(dayIndex, 'breakfast')}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Sáng
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addCustomMeal(dayIndex, 'lunch')}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Trưa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addCustomMeal(dayIndex, 'dinner')}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Tối
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {Object.entries(day.meals || {}).map(([mealType, meal]: [string, any]) => (
                    <div key={mealType} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex-1">
                        <span className="font-medium capitalize">
                          {mealType === 'breakfast' ? 'Sáng' : 
                           mealType === 'lunch' ? 'Trưa' : 'Tối'}: 
                        </span>
                        {isEditing ? (
                          <Input
                            value={meal.name}
                            onChange={(e) => updateMeal(dayIndex, mealType, 'name', e.target.value)}
                            className="inline-block w-auto ml-2"
                          />
                        ) : (
                          <span className="ml-2">{meal.name}</span>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMeal(dayIndex, mealType)}
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={resetToOriginal} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Khôi phục
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Lưu tùy chỉnh
        </Button>
      </div>
    </div>
  )
}
