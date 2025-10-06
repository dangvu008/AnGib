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

    // Calculate date range based on period
    let startDate = new Date()
    const endDate = new Date()
    
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1)
    } else if (period === 'all') {
      startDate.setFullYear(startDate.getFullYear() - 1) // Last year
    }

    // Fetch shopping lists with status 'completed'
    const { data: shoppingLists, error: listsError } = await supabase
      .from('shopping_lists')
      .select(`
        id,
        name,
        shopping_date,
        estimated_total,
        actual_total,
        status,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('shopping_date', startDate.toISOString().split('T')[0])
      .lte('shopping_date', endDate.toISOString().split('T')[0])
      .order('shopping_date', { ascending: false })

    if (listsError) {
      console.error('Error fetching shopping lists:', listsError)
      return NextResponse.json(
        { error: 'Failed to fetch shopping lists' },
        { status: 500 }
      )
    }

    // Fetch items for each shopping list
    const shoppingListsWithItems = await Promise.all(
      (shoppingLists || []).map(async (list) => {
        const { data: items, error: itemsError } = await supabase
          .from('shopping_list_items')
          .select(`
            id,
            quantity,
            unit,
            estimated_price,
            actual_price,
            is_purchased,
            notes,
            ingredient:ingredients (
              id,
              name_vi,
              category,
              unit
            )
          `)
          .eq('shopping_list_id', list.id)

        if (itemsError) {
          console.error('Error fetching items:', itemsError)
          return { ...list, items: [] }
        }

        return {
          ...list,
          items: items || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: shoppingListsWithItems,
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })

  } catch (error) {
    console.error('Shopping history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new shopping history entry (mark as completed)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      name,
      shopping_date,
      items,
      actual_total
    } = body

    // Create shopping list
    const { data: shoppingList, error: listError } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: user.id,
        name,
        shopping_date,
        actual_total,
        estimated_total: actual_total,
        status: 'completed'
      })
      .select()
      .single()

    if (listError) {
      console.error('Error creating shopping list:', listError)
      return NextResponse.json(
        { error: 'Failed to create shopping list' },
        { status: 500 }
      )
    }

    // Create shopping list items
    if (items && items.length > 0) {
      const { error: itemsError } = await supabase
        .from('shopping_list_items')
        .insert(
          items.map((item: any) => ({
            shopping_list_id: shoppingList.id,
            ingredient_id: item.ingredient_id,
            quantity: item.quantity,
            unit: item.unit,
            actual_price: item.price,
            estimated_price: item.price,
            is_purchased: true,
            notes: item.notes || null
          }))
        )

      if (itemsError) {
        console.error('Error creating items:', itemsError)
        // Rollback - delete the list
        await supabase
          .from('shopping_lists')
          .delete()
          .eq('id', shoppingList.id)
        
        return NextResponse.json(
          { error: 'Failed to create shopping items' },
          { status: 500 }
        )
      }
    }

    // Create expense log
    const { error: expenseError } = await supabase
      .from('expense_logs')
      .insert({
        user_id: user.id,
        shopping_list_id: shoppingList.id,
        expense_date: shopping_date,
        expense_type: 'groceries',
        amount: actual_total,
        description: name
      })

    if (expenseError) {
      console.error('Error creating expense log:', expenseError)
      // Continue even if expense log fails
    }

    return NextResponse.json({
      success: true,
      data: shoppingList
    })

  } catch (error) {
    console.error('Create shopping history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

