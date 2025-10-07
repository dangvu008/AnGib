/**
 * Shopping List Utilities
 * Handles ingredient deduplication, aggregation, and smart merging
 */

export interface ShoppingItem {
  id: number
  name: string
  quantity: string
  price: number
  category: string
  checked: boolean
  note?: string
  sourceDishId?: string
  sourceMenuId?: string
  sourcePlanId?: string
}

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  price?: number
  category?: string
}

/**
 * Parse quantity string to extract number and unit
 * Examples: "500g" -> { amount: 500, unit: "g" }
 *           "2 quả" -> { amount: 2, unit: "quả" }
 */
export function parseQuantity(quantityStr: string): { amount: number; unit: string } {
  const match = quantityStr.match(/^([\d.]+)\s*(.*)$/)
  if (match) {
    return {
      amount: parseFloat(match[1]) || 0,
      unit: match[2] || ""
    }
  }
  return { amount: 0, unit: "" }
}

/**
 * Format quantity back to string
 */
export function formatQuantity(amount: number, unit: string): string {
  if (amount === 0) return "0"
  if (!unit) return amount.toString()
  return `${amount}${unit}`
}

/**
 * Smart ingredient deduplication and aggregation
 * Merges ingredients with same name, combines quantities and prices
 */
export function deduplicateIngredients(
  existingItems: ShoppingItem[],
  newIngredients: Ingredient[],
  sourceName: string,
  sourceId?: string
): {
  updatedItems: ShoppingItem[]
  addedCount: number
  updatedCount: number
  totalPrice: number
} {
  const ingredientMap = new Map<string, ShoppingItem>()
  let addedCount = 0
  let updatedCount = 0
  let totalPrice = 0

  // Load existing items into map
  existingItems.forEach(item => {
    ingredientMap.set(item.name, { ...item })
  })

  // Process new ingredients
  newIngredients.forEach(ing => {
    const existing = ingredientMap.get(ing.name)
    
    if (existing) {
      // Merge with existing item
      const existingQty = parseQuantity(existing.quantity)
      const newQty = parseQuantity(formatQuantity(ing.quantity, ing.unit))
      
      // Combine quantities (use existing unit if both have units)
      const combinedAmount = existingQty.amount + newQty.amount
      const finalUnit = existingQty.unit || newQty.unit
      
      existing.quantity = formatQuantity(combinedAmount, finalUnit)
      existing.price = (existing.price || 0) + (ing.price || 0)
      
      // Update note to track sources
      if (!existing.note?.includes(sourceName)) {
        existing.note = existing.note 
          ? `${existing.note}, ${sourceName}`
          : `Cho bữa: ${sourceName}`
      }
      
      // Update source tracking
      if (sourceId) {
        if (existing.sourceDishId && existing.sourceDishId !== sourceId) {
          existing.sourceDishId = `${existing.sourceDishId},${sourceId}`
        } else if (!existing.sourceDishId) {
          existing.sourceDishId = sourceId
        }
      }
      
      updatedCount++
    } else {
      // Add new item
      const newId = Math.max(...existingItems.map(i => i.id), 0) + ingredientMap.size + 1
      
      ingredientMap.set(ing.name, {
        id: newId,
        name: ing.name,
        quantity: formatQuantity(ing.quantity, ing.unit),
        price: ing.price || 0,
        category: ing.category || getCategoryFromIngredient(ing.name),
        checked: false,
        note: `Cho bữa: ${sourceName}`,
        sourceDishId: sourceId
      })
      
      addedCount++
    }
    
    totalPrice += ing.price || 0
  })

  return {
    updatedItems: Array.from(ingredientMap.values()),
    addedCount,
    updatedCount,
    totalPrice
  }
}

/**
 * Auto-categorize ingredients based on name
 */
export function getCategoryFromIngredient(ingredientName: string): string {
  const name = ingredientName.toLowerCase()
  
  // Protein sources
  if (name.includes('đậu') || name.includes('nấm') || name.includes('hũ') || 
      name.includes('thịt') || name.includes('cá') || name.includes('tôm') ||
      name.includes('cua') || name.includes('trứng') || name.includes('sữa')) {
    return 'Đạm'
  }
  
  // Vegetables
  if (name.includes('rau') || name.includes('củ') || name.includes('cà') || 
      name.includes('bí') || name.includes('su hào') || name.includes('su su') ||
      name.includes('khoai') || name.includes('cà rốt') || name.includes('bắp cải')) {
    return 'Rau củ'
  }
  
  // Seasonings
  if (name.includes('dầu') || name.includes('tỏi') || name.includes('hành') || 
      name.includes('muối') || name.includes('nước mắm') || name.includes('mắm') || 
      name.includes('tương') || name.includes('ớt') || name.includes('tiêu') ||
      name.includes('đường') || name.includes('bột ngọt')) {
    return 'Gia vị'
  }
  
  // Carbs
  if (name.includes('gạo') || name.includes('bún') || name.includes('phở') || 
      name.includes('bánh') || name.includes('mì') || name.includes('nui') ||
      name.includes('bánh mì') || name.includes('xôi')) {
    return 'Tinh bột'
  }
  
  return 'Khác'
}

/**
 * Check if a source (dish/menu/plan) is already in shopping list
 */
export function isSourceInCart(sourceId: string, sourceType: 'dish' | 'menu' | 'plan' = 'dish'): boolean {
  try {
    const saved = localStorage.getItem("angi-shopping-list")
    if (!saved) return false
    
    const list = JSON.parse(saved) as ShoppingItem[]
    const sourceKey = sourceType === 'dish' ? 'sourceDishId' : 
                     sourceType === 'menu' ? 'sourceMenuId' : 'sourcePlanId'
    
    return list.some(item => {
      const sourceValue = item[sourceKey as keyof ShoppingItem] as string
      return sourceValue && (
        sourceValue === sourceId || 
        sourceValue.includes(sourceId)
      )
    })
  } catch {
    return false
  }
}

/**
 * Add lightweight source entry to shopping list
 */
export function addSourceToCart(
  sourceName: string, 
  sourceId: string, 
  sourceType: 'dish' | 'menu' | 'plan' = 'dish'
): boolean {
  try {
    const saved = localStorage.getItem("angi-shopping-list")
    const list = saved ? JSON.parse(saved) : []
    
    // Check if already exists
    const sourceKey = sourceType === 'dish' ? 'sourceDishId' : 
                     sourceType === 'menu' ? 'sourceMenuId' : 'sourcePlanId'
    
    const exists = list.some((item: any) => {
      const sourceValue = item[sourceKey]
      return sourceValue && (
        sourceValue === sourceId || 
        sourceValue.includes(sourceId)
      )
    })
    
    if (exists) return false
    
    // Add new entry
    const newId = Math.max(...list.map((i: any) => i.id || 0), 0) + 1
    list.push({
      id: newId,
      name: sourceName,
      quantity: "1",
      price: 0,
      category: "Khác",
      checked: false,
      note: `Từ ${sourceType === 'dish' ? 'món' : sourceType === 'menu' ? 'thực đơn' : 'kế hoạch'}`,
      [sourceKey]: sourceId
    })
    
    localStorage.setItem("angi-shopping-list", JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
