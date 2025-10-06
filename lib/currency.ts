/**
 * Currency formatting utilities for consistent display across the app
 */

export type CurrencyFormat = 'full' | 'short' | 'compact'

/**
 * Format Vietnamese Dong currency consistently
 * @param amount - Amount in VND
 * @param format - Display format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, format: CurrencyFormat = 'full'): string {
  if (amount === 0) return '0₫'
  
  switch (format) {
    case 'full':
      // Full format: 1,200,000₫
      return `${amount.toLocaleString('vi-VN')}₫`
    
    case 'short':
      // Short format: 1.2M₫
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M₫`
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}k₫`
      }
      return `${amount}₫`
    
    case 'compact':
      // Compact format: 1.2M VNĐ
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M VNĐ`
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}k VNĐ`
      }
      return `${amount} VNĐ`
    
    default:
      return `${amount.toLocaleString('vi-VN')}₫`
  }
}

/**
 * Parse currency string back to number
 * @param currencyString - Formatted currency string
 * @returns Amount in VND
 */
export function parseCurrency(currencyString: string): number {
  // Remove all non-numeric characters except decimal point
  const cleanString = currencyString.replace(/[^\d.]/g, '')
  
  if (!cleanString) return 0
  
  const amount = parseFloat(cleanString)
  
  // Check if it's in thousands (k) or millions (M)
  if (currencyString.toLowerCase().includes('k')) {
    return Math.round(amount * 1000)
  } else if (currencyString.toLowerCase().includes('m')) {
    return Math.round(amount * 1000000)
  }
  
  return Math.round(amount)
}

/**
 * Get budget progress percentage
 * @param spent - Amount spent
 * @param budget - Total budget
 * @returns Progress percentage (0-100)
 */
export function getBudgetProgress(spent: number, budget: number): number {
  if (budget === 0) return 0
  return Math.min(Math.round((spent / budget) * 100), 100)
}

/**
 * Get budget status color class
 * @param spent - Amount spent
 * @param budget - Total budget
 * @returns CSS class for budget status
 */
export function getBudgetStatusColor(spent: number, budget: number): string {
  const progress = getBudgetProgress(spent, budget)
  
  if (progress >= 100) return 'text-red-600'
  if (progress >= 80) return 'text-orange-600'
  if (progress >= 60) return 'text-yellow-600'
  return 'text-green-600'
}

/**
 * Format budget range display
 * @param spent - Amount spent
 * @param budget - Total budget
 * @param format - Currency format
 * @returns Formatted budget range string
 */
export function formatBudgetRange(spent: number, budget: number, format: CurrencyFormat = 'short'): string {
  const spentFormatted = formatCurrency(spent, format)
  const budgetFormatted = formatCurrency(budget, format)
  return `${spentFormatted} / ${budgetFormatted}`
}
