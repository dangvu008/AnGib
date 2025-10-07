"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ShoppingCart, Check } from "lucide-react"
import { toast } from "sonner"
import { deduplicateIngredients, isSourceInCart, formatCurrency, type ShoppingItem, type Ingredient } from "@/lib/shopping-utils"

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
  const [isInCart, setIsInCart] = useState(false)

  // Determine if this dish already exists in shopping list (by sourceDishId)
  useEffect(() => {
    const exists = isSourceInCart(dish.id, 'dish')
    setIsInCart(exists)
    if (exists) setIsAdded(true)
  }, [dish.id])

  const handleAddToShopping = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding) return
    if (isInCart) {
      toast.info("Món này đã có trong giỏ", {
        description: "Bạn có thể tăng số lượng trong trang Đi chợ"
      })
      return
    }

    setIsAdding(true)

    try {
      // Get current shopping list from localStorage
      const savedList = localStorage.getItem("angi-shopping-list")
      let existingItems: ShoppingItem[] = []
      
      if (savedList) {
        try {
          existingItems = JSON.parse(savedList)
        } catch (e) {
          console.error("Failed to parse shopping list", e)
        }
      }

      // Convert dish ingredients to Ingredient format
      const ingredientsToAdd: Ingredient[] = (dish.ingredients || []).map(ing => ({
        id: ing.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        price: ing.price,
        category: ing.category
      }))
      
      if (ingredientsToAdd.length === 0) {
        toast.warning("⚠️ Món này chưa có thông tin nguyên liệu")
        setIsAdding(false)
        return
      }

      // Use enhanced deduplication logic
      const result = deduplicateIngredients(
        existingItems,
        ingredientsToAdd,
        dish.name,
        dish.id
      )

      // Save to localStorage
      localStorage.setItem("angi-shopping-list", JSON.stringify(result.updatedItems))
      setIsInCart(true)

      // Success feedback
      const totalPrice = dish.estimatedCost || result.totalPrice
      
      toast.success(`✅ Đã thêm vào danh sách mua sắm`, {
        description: `${result.addedCount} nguyên liệu mới${result.updatedCount > 0 ? `, ${result.updatedCount} đã cập nhật` : ''} • ${formatCurrency(totalPrice)}`,
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

  const buttonContent = (
    <>
      {isAdded || isInCart ? (
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

