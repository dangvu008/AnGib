/**
 * Database abstraction layer for local PostgreSQL
 * Use this instead of Supabase client when working offline
 */

import { PrismaClient } from '@prisma/client'

// Singleton pattern for Prisma client
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper functions for shopping history (to match Supabase API)
export async function getShoppingHistory(userId: string, period: 'week' | 'month' | 'all') {
  const now = new Date()
  let startDate = new Date()
  
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7)
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1)
  } else {
    startDate.setFullYear(now.getFullYear() - 1)
  }

  // Note: You'll need to create corresponding Prisma models
  // This is a placeholder that shows the pattern
  
  try {
    // Example query - adjust based on your Prisma schema
    const history = await prisma.$queryRaw`
      SELECT 
        sl.id,
        sl.name,
        sl.shopping_date,
        sl.actual_total,
        sl.estimated_total,
        sl.status,
        sl.created_at,
        sl.updated_at,
        json_agg(
          json_build_object(
            'id', sli.id,
            'quantity', sli.quantity,
            'unit', sli.unit,
            'actual_price', sli.actual_price,
            'ingredient', json_build_object(
              'name_vi', i.name_vi,
              'category', i.category
            )
          )
        ) as items
      FROM shopping_lists sl
      LEFT JOIN shopping_list_items sli ON sl.id = sli.shopping_list_id
      LEFT JOIN ingredients i ON sli.ingredient_id = i.id
      WHERE sl.user_id = ${userId}::uuid
        AND sl.status = 'completed'
        AND sl.shopping_date >= ${startDate}
        AND sl.shopping_date <= ${now}
      GROUP BY sl.id
      ORDER BY sl.shopping_date DESC
    `
    
    return history
  } catch (error) {
    console.error('Error fetching shopping history:', error)
    return []
  }
}

export async function getSpendingSummary(userId: string, period: 'week' | 'month' | 'all') {
  const now = new Date()
  let startDate = new Date()
  
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7)
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1)
  } else {
    startDate.setFullYear(now.getFullYear() - 1)
  }

  try {
    const expenses = await prisma.$queryRaw`
      SELECT 
        expense_date,
        amount,
        expense_type,
        description
      FROM expense_logs
      WHERE user_id = ${userId}::uuid
        AND expense_date >= ${startDate}
        AND expense_date <= ${now}
      ORDER BY expense_date DESC
    `
    
    return expenses
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return []
  }
}

export default prisma

