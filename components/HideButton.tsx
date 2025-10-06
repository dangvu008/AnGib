"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Trash2,
  RotateCcw
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useHiddenItems } from '@/contexts/HiddenItemsContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface HideButtonProps {
  itemId: string
  itemName: string
  itemType: 'meal' | 'restaurant' | 'ingredient'
  itemImage?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline' | 'default'
  showLabel?: boolean
  className?: string
}

export function HideButton({
  itemId,
  itemName,
  itemType,
  itemImage,
  size = 'sm',
  variant = 'ghost',
  showLabel = false,
  className = ''
}: HideButtonProps) {
  const { isHidden, hideItem, showItem } = useHiddenItems()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const hidden = isHidden(itemId)

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleToggle = async () => {
    setIsLoading(true)
    
    try {
      if (hidden) {
        showItem(itemId)
        toast.success(`Đã hiện "${itemName}" trong gợi ý`)
      } else {
        hideItem({
          id: itemId,
          type: itemType,
          name: itemName,
          image: itemImage
        })
        toast.success(`Đã ẩn "${itemName}" khỏi gợi ý`)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickHide = () => {
    if (!hidden) {
      hideItem({
        id: itemId,
        type: itemType,
        name: itemName,
        image: itemImage
      })
      toast.success(`Đã ẩn "${itemName}"`)
    }
  }

  if (showLabel) {
    return (
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={`gap-2 ${hidden ? 'text-muted-foreground' : 'text-foreground'} ${className}`}
      >
        {hidden ? (
          <>
            <Eye className="h-4 w-4" />
            Hiện lại
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4" />
            Ẩn khỏi gợi ý
          </>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${hidden ? 'text-muted-foreground' : 'text-foreground'} ${className}`}
          disabled={isLoading}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {hidden ? (
          <DropdownMenuItem onClick={handleToggle} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Hiện lại trong gợi ý
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleQuickHide} className="gap-2 text-destructive">
            <EyeOff className="h-4 w-4" />
            Ẩn khỏi gợi ý
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Quick hide button for cards
export function QuickHideButton({
  itemId,
  itemName,
  itemType,
  itemImage,
  className = ''
}: Omit<HideButtonProps, 'size' | 'variant' | 'showLabel'>) {
  const { isHidden, hideItem } = useHiddenItems()
  const { isAuthenticated } = useAuth()
  const hidden = isHidden(itemId)

  // Don't render if user is not authenticated or item is already hidden
  if (!isAuthenticated || hidden) return null

  return (
    <Button
      onClick={() => {
        hideItem({
          id: itemId,
          type: itemType,
          name: itemName,
          image: itemImage
        })
        toast.success(`Đã ẩn "${itemName}"`)
      }}
      variant="ghost"
      size="sm"
      className={`opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
    >
      <EyeOff className="h-4 w-4" />
    </Button>
  )
}
