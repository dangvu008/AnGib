import { NextRequest, NextResponse } from 'next/server'

interface UserPreferences {
  diet: string
  allergies: string[]
  dislikedIngredients: string[]
  dislikedDishes: string[]
  healthGoals: string[]
  budget: number
}

// Mock data storage (in production, this would be in a database)
const userPreferences: Record<string, UserPreferences> = {}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default'
    
    const preferences = userPreferences[userId] || {
      diet: "vegetarian",
      allergies: [],
      dislikedIngredients: [],
      dislikedDishes: [],
      healthGoals: [],
      budget: 1000000
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { preferences, userId = 'default' } = body

    // Validate preferences structure
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json({ error: 'Invalid preferences data' }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = ['diet', 'allergies', 'dislikedIngredients', 'dislikedDishes', 'healthGoals', 'budget']
    for (const field of requiredFields) {
      if (!(field in preferences)) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate data types
    if (typeof preferences.diet !== 'string') {
      return NextResponse.json({ error: 'Diet must be a string' }, { status: 400 })
    }
    if (!Array.isArray(preferences.allergies)) {
      return NextResponse.json({ error: 'Allergies must be an array' }, { status: 400 })
    }
    if (!Array.isArray(preferences.dislikedIngredients)) {
      return NextResponse.json({ error: 'Disliked ingredients must be an array' }, { status: 400 })
    }
    if (!Array.isArray(preferences.dislikedDishes)) {
      return NextResponse.json({ error: 'Disliked dishes must be an array' }, { status: 400 })
    }
    if (!Array.isArray(preferences.healthGoals)) {
      return NextResponse.json({ error: 'Health goals must be an array' }, { status: 400 })
    }
    if (typeof preferences.budget !== 'number' || preferences.budget < 0) {
      return NextResponse.json({ error: 'Budget must be a positive number' }, { status: 400 })
    }

    // Check for conflicts
    const conflicts = checkPreferenceConflicts(preferences)
    if (conflicts.length > 0) {
      return NextResponse.json({ 
        error: 'Preference conflicts detected', 
        conflicts 
      }, { status: 400 })
    }

    // Save preferences
    userPreferences[userId] = preferences

    return NextResponse.json({ 
      success: true, 
      preferences,
      message: 'Preferences saved successfully'
    })
  } catch (error) {
    console.error('Error saving user preferences:', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { updates, userId = 'default' } = body

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Invalid updates data' }, { status: 400 })
    }

    // Get existing preferences
    const existingPreferences = userPreferences[userId] || {
      diet: "vegetarian",
      allergies: [],
      dislikedIngredients: [],
      dislikedDishes: [],
      healthGoals: [],
      budget: 1000000
    }

    // Merge updates
    const updatedPreferences = { ...existingPreferences, ...updates }

    // Check for conflicts
    const conflicts = checkPreferenceConflicts(updatedPreferences)
    if (conflicts.length > 0) {
      return NextResponse.json({ 
        error: 'Preference conflicts detected', 
        conflicts 
      }, { status: 400 })
    }

    // Save updated preferences
    userPreferences[userId] = updatedPreferences

    return NextResponse.json({ 
      success: true, 
      preferences: updatedPreferences,
      message: 'Preferences updated successfully'
    })
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}

function checkPreferenceConflicts(preferences: UserPreferences): string[] {
  const conflicts: string[] = []

  // Check diet conflicts
  if (preferences.diet === "vegetarian" || preferences.diet === "vegan") {
    const meatIngredients = [
      "thịt bò", "thịt heo", "thịt gà", "cá", "tôm", "cua", "mực", "bạch tuộc",
      "thịt bò", "thịt heo", "thịt gà", "cá", "tôm", "cua", "mực", "bạch tuộc"
    ]
    
    const conflictingIngredients = preferences.dislikedIngredients.filter(ingredient => 
      meatIngredients.includes(ingredient.toLowerCase())
    )
    
    if (conflictingIngredients.length > 0) {
      conflicts.push(`Chế độ ăn ${preferences.diet} không phù hợp với việc loại bỏ các nguyên liệu: ${conflictingIngredients.join(", ")}`)
    }
  }

  // Check allergy conflicts
  const allergyConflicts = preferences.allergies.filter(allergy => 
    preferences.dislikedIngredients.includes(allergy)
  )
  
  if (allergyConflicts.length > 0) {
    conflicts.push(`Các nguyên liệu dị ứng đã được thêm vào danh sách loại bỏ: ${allergyConflicts.join(", ")}`)
  }

  // Check health goals conflicts
  if (preferences.healthGoals.includes("tăng cơ")) {
    const proteinSources = ["đậu phụ", "đậu nành", "đậu xanh", "đậu đỏ"]
    const conflictingProteins = preferences.dislikedIngredients.filter(ingredient => 
      proteinSources.includes(ingredient.toLowerCase())
    )
    
    if (conflictingProteins.length > 0) {
      conflicts.push(`Các nguồn protein tốt cho mục tiêu tăng cơ đã bị loại bỏ: ${conflictingProteins.join(", ")}`)
    }
  }

  if (preferences.healthGoals.includes("giảm cân")) {
    const healthyIngredients = ["rau muống", "rau cải", "bí đỏ", "cà rốt"]
    const conflictingHealthy = preferences.dislikedIngredients.filter(ingredient => 
      healthyIngredients.includes(ingredient.toLowerCase())
    )
    
    if (conflictingHealthy.length > 0) {
      conflicts.push(`Các nguyên liệu tốt cho giảm cân đã bị loại bỏ: ${conflictingHealthy.join(", ")}`)
    }
  }

  return conflicts
}
