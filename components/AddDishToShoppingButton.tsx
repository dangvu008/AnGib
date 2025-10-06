"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ShoppingCart, Plus, Check } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/currency"

interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  price?: number
  category?: string
}

interface Dish {
  id: string
  name: string
  ingredients?: Ingredient[]
  estimatedCost?: number
}

interface AddDishToShoppingButtonProps {
  dish: Dish
  variant?: "default" | "outline" | "ghost" | "icon"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
  onAdded?: () => void
}

export function AddDishToShoppingButton({
  dish,
  variant = "outline",
  size = "sm",
  showText = true,
  className = "",
  onAdded
}: AddDishToShoppingButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToShopping = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding || isAdded) return

    setIsAdding(true)

    try {
      // Get current shopping list from localStorage
      const savedList = localStorage.getItem("angi-shopping-list")
      let shoppingList: any[] = []
      
      if (savedList) {
        try {
          shoppingList = JSON.parse(savedList)
        } catch (e) {
          console.error("Failed to parse shopping list", e)
        }
      }

      // Get or generate ID
      const newId = shoppingList.length > 0 
        ? Math.max(...shoppingList.map((item: any) => item.id || 0)) + 1 
        : 1

      // Add dish ingredients to shopping list
      const ingredientsToAdd = dish.ingredients || []
      
      if (ingredientsToAdd.length === 0) {
        toast.warning("⚠️ Món này chưa có thông tin nguyên liệu")
        setIsAdding(false)
        return
      }

      // Aggregate ingredients
      const ingredientMap = new Map()
      
      // Check existing items
      shoppingList.forEach((item: any) => {
        ingredientMap.set(item.name, {
          ...item,
          existingId: item.id
        })
      })

      // Add new ingredients or update quantities
      let addedCount = 0
      let updatedCount = 0

      ingredientsToAdd.forEach((ing) => {
        const existing = ingredientMap.get(ing.name)
        
        if (existing) {
          // Update existing item quantity
          const currentQty = parseFloat(existing.quantity) || 0
          const newQty = currentQty + ing.quantity
          
          existing.quantity = `${newQty}${ing.unit}`
          existing.price = (existing.price || 0) + (ing.price || 0)
          
          // Update note to show multiple sources
          if (!existing.note?.includes(dish.name)) {
            existing.note = existing.note 
              ? `${existing.note}, ${dish.name}`
              : `Cho bữa: ${dish.name}`
          }
          
          updatedCount++
        } else {
          // Add new item
          ingredientMap.set(ing.name, {
            id: newId + ingredientMap.size,
            name: ing.name,
            quantity: `${ing.quantity}${ing.unit}`,
            price: ing.price || 0,
            category: getCategoryFromIngredient(ing.name),
            checked: false,
            note: `Cho bữa: ${dish.name}`
          })
          addedCount++
        }
      })

      // Convert map back to array
      const updatedList = Array.from(ingredientMap.values()).map(item => {
        // Remove existingId helper field
        const { existingId, ...cleanItem } = item as any
        return cleanItem
      })

      // Save to localStorage
      localStorage.setItem("angi-shopping-list", JSON.stringify(updatedList))

      // Success feedback
      const totalPrice = dish.estimatedCost || ingredientsToAdd.reduce((sum, ing) => sum + (ing.price || 0), 0)
      
      toast.success(`✅ Đã thêm vào danh sách mua sắm`, {
        description: `${addedCount} nguyên liệu mới${updatedCount > 0 ? `, ${updatedCount} đã cập nhật` : ''} • ${formatCurrency(totalPrice)}`,
        duration: 3000
      })

      setIsAdded(true)
      onAdded?.()

      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)

    } catch (error) {
      console.error('Error adding to shopping list:', error)
      toast.error("❌ Không thể thêm vào danh sách")
    } finally {
      setIsAdding(false)
    }
  }

  const getCategoryFromIngredient = (ingredientName: string): string => {
    const name = ingredientName.toLowerCase()
    if (name.includes('đậu') || name.includes('nấm') || name.includes('hũ') || name.includes('thịt') || name.includes('cá')) return 'Đạm'
    if (name.includes('rau') || name.includes('củ') || name.includes('cà') || name.includes('bí') || name.includes('su hào') || name.includes('su su')) return 'Rau củ'
    if (name.includes('dầu') || name.includes('tỏi') || name.includes('hành') || name.includes('muối') || name.includes('nước mắm') || name.includes('mắm') || name.includes('tương') || name.includes('ớt')) return 'Gia vị'
    if (name.includes('gạo') || name.includes('bún') || name.includes('phở') || name.includes('bánh') || name.includes('mì')) return 'Tinh bột'
    return 'Khác'
  }

  const buttonContent = (
    <>
      {isAdded ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {showText && size !== "icon" && (
        <span className="ml-2">
          {isAdding ? "Đang thêm..." : isAdded ? "Đã thêm" : "Đi chợ"}
        </span>
      )}
    </>
  )

  if (!showText || size === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={handleAddToShopping}
              disabled={isAdding}
              className={`${isAdded ? 'bg-green-50 hover:bg-green-100 border-green-200' : ''} ${className}`}
            >
              {buttonContent}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thêm nguyên liệu vào danh sách mua sắm</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToShopping}
      disabled={isAdding}
      className={`${isAdded ? 'bg-green-50 hover:bg-green-100 border-green-200' : ''} ${className}`}
    >
      {buttonContent}
    </Button>
  )
}

