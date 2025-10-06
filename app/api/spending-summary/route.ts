import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'week' // week, month, all
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Calculate date range
    const endDate = new Date()
    let startDate = new Date()
    
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1)
    } else if (period === 'all') {
      startDate.setFullYear(startDate.getFullYear() - 1)
    }

    // Get expense summary
    const { data: expenses, error: expenseError } = await supabase
      .from('expense_logs')
      .select('expense_date, amount, expense_type, description')
      .eq('user_id', user.id)
      .gte('expense_date', startDate.toISOString().split('T')[0])
      .lte('expense_date', endDate.toISOString().split('T')[0])
      .order('expense_date', { ascending: false })

    if (expenseError) {
      console.error('Error fetching expenses:', expenseError)
      return NextResponse.json(
        { error: 'Failed to fetch expenses' },
        { status: 500 }
      )
    }

    // Calculate totals
    const totalAmount = (expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0)
    
    // Group by date for chart
    const expensesByDate: { [key: string]: number } = {}
    ;(expenses || []).forEach(exp => {
      const date = exp.expense_date
      expensesByDate[date] = (expensesByDate[date] || 0) + (exp.amount || 0)
    })

    // Group by type
    const expensesByType: { [key: string]: number } = {}
    ;(expenses || []).forEach(exp => {
      const type = exp.expense_type || 'other'
      expensesByType[type] = (expensesByType[type] || 0) + (exp.amount || 0)
    })

    // Get shopping lists summary
    const { data: shoppingLists, error: listsError } = await supabase
      .from('shopping_lists')
      .select('id, name, shopping_date, actual_total, status')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('shopping_date', startDate.toISOString().split('T')[0])
      .lte('shopping_date', endDate.toISOString().split('T')[0])

    if (listsError) {
      console.error('Error fetching shopping lists:', listsError)
    }

    // Calculate averages
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const averagePerDay = totalDays > 0 ? totalAmount / totalDays : 0
    
    let averagePerWeek = 0
    let averagePerMonth = 0
    
    if (period === 'month') {
      averagePerWeek = totalAmount / 4 // Approximate 4 weeks per month
      averagePerMonth = totalAmount
    } else if (period === 'week') {
      averagePerWeek = totalAmount
      averagePerMonth = totalAmount * 4
    } else {
      // For 'all' period (1 year)
      const months = 12
      averagePerMonth = totalAmount / months
      averagePerWeek = averagePerMonth / 4
    }

    return NextResponse.json({
      success: true,
      data: {
        period,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        summary: {
          totalAmount,
          averagePerDay: Math.round(averagePerDay),
          averagePerWeek: Math.round(averagePerWeek),
          averagePerMonth: Math.round(averagePerMonth),
          transactionCount: (expenses || []).length,
          shoppingCount: (shoppingLists || []).length
        },
        expensesByDate,
        expensesByType,
        recentExpenses: (expenses || []).slice(0, 10)
      }
    })

  } catch (error) {
    console.error('Spending summary error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get detailed breakdown by category
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { startDate, endDate } = body
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all shopping lists in range
    const { data: shoppingLists, error: listsError } = await supabase
      .from('shopping_lists')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('shopping_date', startDate)
      .lte('shopping_date', endDate)

    if (listsError || !shoppingLists) {
      return NextResponse.json(
        { error: 'Failed to fetch shopping lists' },
        { status: 500 }
      )
    }

    const listIds = shoppingLists.map(list => list.id)

    if (listIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: { byCategory: {}, byIngredient: [] }
      })
    }

    // Get all items with ingredient info
    const { data: items, error: itemsError } = await supabase
      .from('shopping_list_items')
      .select(`
        actual_price,
        quantity,
        unit,
        ingredient:ingredients (
          name_vi,
          category
        )
      `)
      .in('shopping_list_id', listIds)
      .eq('is_purchased', true)

    if (itemsError) {
      console.error('Error fetching items:', itemsError)
      return NextResponse.json(
        { error: 'Failed to fetch items' },
        { status: 500 }
      )
    }

    // Group by category
    const byCategory: { [key: string]: number } = {}
    const byIngredient: { [key: string]: { amount: number, count: number } } = {}

    ;(items || []).forEach((item: any) => {
      const category = item.ingredient?.category || 'Khác'
      const ingredientName = item.ingredient?.name_vi || 'Unknown'
      const price = item.actual_price || 0

      byCategory[category] = (byCategory[category] || 0) + price
      
      if (!byIngredient[ingredientName]) {
        byIngredient[ingredientName] = { amount: 0, count: 0 }
      }
      byIngredient[ingredientName].amount += price
      byIngredient[ingredientName].count += 1
    })

    // Convert to sorted arrays
    const topIngredients = Object.entries(byIngredient)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        byCategory,
        topIngredients
      }
    })

  } catch (error) {
    console.error('Category breakdown error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

