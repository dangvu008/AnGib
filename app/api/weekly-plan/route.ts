import { NextRequest, NextResponse } from 'next/server'

interface MealPlan {
  id: string
  day: string
  breakfast: {
    name: string
    calories: number
    prepTime: number
    isVegetarian: boolean
  } | null
  lunch: {
    name: string
    calories: number
    prepTime: number
    isVegetarian: boolean
  } | null
  dinner: {
    name: string
    calories: number
    prepTime: number
    isVegetarian: boolean
  } | null
}

interface WeeklyPlan {
  id: string
  weekStart: string
  weekEnd: string
  totalMeals: number
  completedMeals: number
  totalCalories: number
  averageCalories: number
  days: MealPlan[]
}

// Mock data storage (in production, this would be in a database)
let weeklyPlans: WeeklyPlan[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default'
    
    // Find the current week's plan
    const today = new Date()
    const currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Monday
    
    let currentPlan = weeklyPlans.find(plan => 
      plan.weekStart === currentWeekStart.toISOString().split('T')[0]
    )

    // If no plan exists, create a default one
    if (!currentPlan) {
      currentPlan = generateDefaultWeeklyPlan()
      weeklyPlans.push(currentPlan)
    }

    return NextResponse.json({ plan: currentPlan })
  } catch (error) {
    console.error('Error fetching weekly plan:', error)
    return NextResponse.json({ error: 'Failed to fetch weekly plan' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan } = body

    // Validate the plan structure
    if (!plan || !plan.weekStart || !plan.weekEnd || !plan.days) {
      return NextResponse.json({ error: 'Invalid plan data' }, { status: 400 })
    }

    // Update or create the plan
    const existingIndex = weeklyPlans.findIndex(p => p.id === plan.id)
    if (existingIndex >= 0) {
      weeklyPlans[existingIndex] = plan
    } else {
      weeklyPlans.push(plan)
    }

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error('Error saving weekly plan:', error)
    return NextResponse.json({ error: 'Failed to save weekly plan' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, updates } = body

    const planIndex = weeklyPlans.findIndex(p => p.id === planId)
    if (planIndex === -1) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Update the plan with new data
    weeklyPlans[planIndex] = { ...weeklyPlans[planIndex], ...updates }

    return NextResponse.json({ success: true, plan: weeklyPlans[planIndex] })
  } catch (error) {
    console.error('Error updating weekly plan:', error)
    return NextResponse.json({ error: 'Failed to update weekly plan' }, { status: 500 })
  }
}

function generateDefaultWeeklyPlan(): WeeklyPlan {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1) // Monday
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6) // Sunday

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
  
  const sampleMeals = [
    { name: "Bánh mì chay", calories: 320, prepTime: 10, isVegetarian: true },
    { name: "Phở chay", calories: 450, prepTime: 20, isVegetarian: true },
    { name: "Cơm chay", calories: 380, prepTime: 15, isVegetarian: true },
    { name: "Bún chay", calories: 420, prepTime: 25, isVegetarian: true },
    { name: "Canh chua chay", calories: 180, prepTime: 30, isVegetarian: true },
    { name: "Đậu hũ sốt cà chua", calories: 250, prepTime: 20, isVegetarian: true },
    { name: "Rau muống xào tỏi", calories: 120, prepTime: 10, isVegetarian: true },
    { name: "Nấm xào rau củ", calories: 200, prepTime: 15, isVegetarian: true },
    { name: "Gỏi cuốn chay", calories: 150, prepTime: 25, isVegetarian: true },
    { name: "Chả cá chay", calories: 300, prepTime: 30, isVegetarian: true },
    { name: "Bánh xèo chay", calories: 400, prepTime: 35, isVegetarian: true },
    { name: "Lẩu chay", calories: 350, prepTime: 40, isVegetarian: true },
    { name: "Cơm tấm chay", calories: 500, prepTime: 20, isVegetarian: true },
    { name: "Bún bò Huế chay", calories: 480, prepTime: 45, isVegetarian: true },
    { name: "Bánh canh chay", calories: 380, prepTime: 25, isVegetarian: true },
    { name: "Hủ tiếu chay", calories: 420, prepTime: 30, isVegetarian: true },
    { name: "Mì Quảng chay", calories: 450, prepTime: 35, isVegetarian: true },
    { name: "Bún riêu chay", calories: 400, prepTime: 40, isVegetarian: true },
    { name: "Cháo chay", calories: 280, prepTime: 20, isVegetarian: true },
    { name: "Xôi chay", calories: 350, prepTime: 15, isVegetarian: true },
    { name: "Bánh ướt chay", calories: 200, prepTime: 25, isVegetarian: true }
  ]

  const weeklyDays: MealPlan[] = days.map((day, index) => {
    const dayMeals = sampleMeals.slice(index * 3, (index + 1) * 3)
    return {
      id: `day-${index + 1}`,
      day,
      breakfast: dayMeals[0] || null,
      lunch: dayMeals[1] || null,
      dinner: dayMeals[2] || null
    }
  })

  const totalMeals = weeklyDays.reduce((total, day) => {
    return total + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0)
  }, 0)

  const completedMeals = Math.floor(totalMeals * 0.3) // 30% completed

  const totalCalories = weeklyDays.reduce((total, day) => {
    return total + 
      (day.breakfast?.calories || 0) + 
      (day.lunch?.calories || 0) + 
      (day.dinner?.calories || 0)
  }, 0)

  return {
    id: `week-${weekStart.toISOString().split('T')[0]}`,
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
    totalMeals,
    completedMeals,
    totalCalories,
    averageCalories: Math.round(totalCalories / 7),
    days: weeklyDays
  }
}
