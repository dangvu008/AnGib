"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  StickyNote,
  AlertCircle,
  Sparkles,
  Store,
  Image as ImageIcon,
  Tag,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface ShoppingItemNotesProps {
  itemId: string
  ingredientId: string
  ingredientName: string
  currentNotes?: string
  customName?: string
  brandPreference?: string
  storeLocation?: string
  priority?: number
  reminder?: string
  photoUrl?: string
  onUpdate?: () => void
}

export function ShoppingItemNotes({
  itemId,
  ingredientId,
  ingredientName,
  currentNotes = "",
  customName = "",
  brandPreference = "",
  storeLocation = "",
  priority = 0,
  reminder = "",
  photoUrl = "",
  onUpdate,
}: ShoppingItemNotesProps) {
  const [notes, setNotes] = useState(currentNotes)
  const [name, setName] = useState(customName)
  const [brand, setBrand] = useState(brandPreference)
  const [location, setLocation] = useState(storeLocation)
  const [priorityLevel, setPriorityLevel] = useState(priority.toString())
  const [reminderText, setReminderText] = useState(reminder)
  const [photo, setPhoto] = useState(photoUrl)
  const [loading, setLoading] = useState(false)
  const [defaultNotes, setDefaultNotes] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { toast } = useToast()

  // Load default notes và templates
  const loadSuggestions = async () => {
    // Load default notes cho ingredient này
    const { data: notes } = await supabase
      .rpc("get_ingredient_default_notes", {
        p_ingredient_id: ingredientId,
      })
    if (notes) setDefaultNotes(notes)

    // Load user's popular templates
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: temps } = await supabase
        .rpc("get_popular_note_templates", {
          p_user_id: user.id,
          p_limit: 5,
        })
      if (temps) setTemplates(temps)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("shopping_list_items")
        .update({
          notes,
          custom_name: name || null,
          brand_preference: brand || null,
          store_location: location || null,
          priority: parseInt(priorityLevel),
          reminder: reminderText || null,
          photo_url: photo || null,
        })
        .eq("id", itemId)

      if (error) throw error

      // Save tags
      if (selectedTags.length > 0) {
        // Delete existing tags
        await supabase
          .from("shopping_list_item_tags")
          .delete()
          .eq("shopping_list_item_id", itemId)

        // Insert new tags
        const tagInserts = selectedTags.map((tag) => ({
          shopping_list_item_id: itemId,
          tag,
        }))
        await supabase.from("shopping_list_item_tags").insert(tagInserts)
      }

      toast({
        title: "Đã lưu ghi chú",
        description: "Ghi chú cho nguyên liệu đã được cập nhật",
      })

      onUpdate?.()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyDefaultNote = (noteText: string) => {
    setNotes(notes ? `${notes}\n${noteText}` : noteText)
  }

  const applyTemplate = (templateText: string, templateId: string) => {
    setNotes(notes ? `${notes}\n${templateText}` : templateText)
    // Increment use count
    supabase.rpc("increment_template_use_count", {
      p_template_id: templateId,
    })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const availableTags = [
    { value: "urgent", label: "Khẩn cấp", icon: AlertCircle, color: "destructive" },
    { value: "optional", label: "Tùy chọn", icon: Sparkles, color: "secondary" },
    { value: "bulk_buy", label: "Mua số lượng lớn", icon: Store, color: "default" },
    { value: "fresh_only", label: "Chỉ mua tươi", icon: Sparkles, color: "default" },
    { value: "organic_preferred", label: "Ưu tiên hữu cơ", icon: Sparkles, color: "default" },
  ]

  return (
    <Dialog onOpenChange={(open) => open && loadSuggestions()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <StickyNote className="h-4 w-4" />
          {currentNotes ? "Sửa ghi chú" : "Thêm ghi chú"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Ghi chú cho: {customName || ingredientName}
          </DialogTitle>
          <DialogDescription>
            Thêm ghi chú, lời nhắc và thông tin chi tiết cho nguyên liệu này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Custom Name */}
          <div>
            <Label htmlFor="custom-name">Tên tùy chỉnh (tùy chọn)</Label>
            <Input
              id="custom-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`VD: ${ingredientName} hữu cơ`}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tên chi tiết hơn cho nguyên liệu này
            </p>
          </div>

          {/* Priority & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Mức độ ưu tiên</Label>
              <Select value={priorityLevel} onValueChange={setPriorityLevel}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Bình thường</SelectItem>
                  <SelectItem value="1">Quan trọng</SelectItem>
                  <SelectItem value="2">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag.value}
                    variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.value)}
                  >
                    <tag.icon className="h-3 w-3 mr-1" />
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú chính</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm ghi chú, lưu ý khi mua..."
              rows={4}
              className="mt-1.5"
            />

            {/* Default Notes Suggestions */}
            {defaultNotes.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Gợi ý:</p>
                {defaultNotes.map((note, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5 px-2 mr-2 mb-1"
                    onClick={() => applyDefaultNote(note.note_text)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {note.note_text}
                  </Button>
                ))}
              </div>
            )}

            {/* User Templates */}
            {templates.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Template của bạn:</p>
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5 px-2 mr-2 mb-1"
                    onClick={() => applyTemplate(template.note_text, template.id)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Brand Preference */}
          <div>
            <Label htmlFor="brand">Thương hiệu ưu tiên (tùy chọn)</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="VD: Vinamilk, Dalat Hasfarm..."
              className="mt-1.5"
            />
          </div>

          {/* Store Location */}
          <div>
            <Label htmlFor="location">Vị trí trong cửa hàng (tùy chọn)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="VD: Quầy rau tươi, Hàng 3, Kệ bên phải..."
              className="mt-1.5"
            />
          </div>

          {/* Reminder */}
          <div>
            <Label htmlFor="reminder">Lời nhắc đặc biệt (tùy chọn)</Label>
            <Input
              id="reminder"
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="VD: Hỏi nhân viên xem hàng mới về chưa..."
              className="mt-1.5"
            />
          </div>

          {/* Photo Reference */}
          <div>
            <Label htmlFor="photo">Hình ảnh tham khảo (tùy chọn)</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="photo"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="URL hình ảnh..."
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            {photo && (
              <img
                src={photo}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <DialogTrigger asChild>
            <Button variant="outline">Hủy</Button>
          </DialogTrigger>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu ghi chú"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

