import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const mealType = searchParams.get('mealType')
    const difficulty = searchParams.get('difficulty')
    const isVegetarian = searchParams.get('isVegetarian')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (category) {
      where.categoryId = category
    }

    if (mealType) {
      where.mealType = mealType
    }

    if (difficulty) {
      where.difficultyLevel = difficulty
    }

    if (isVegetarian === 'true') {
      where.isVegetarian = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameVi: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get dishes with relations
    const dishes = await prisma.dish.findMany({
      where,
      include: {
        category: true,
        dishIngredients: {
          include: {
            ingredient: true
          }
        },
        dishTags: {
          include: {
            tag: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        popularityScore: 'desc'
      }
    })

    // Get total count for pagination
    const total = await prisma.dish.count({ where })

    return NextResponse.json({
      dishes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dishes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      nameVi,
      categoryId,
      mealType,
      cuisineType,
      difficultyLevel,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      calories,
      protein,
      carbs,
      fat,
      estimatedCost,
      isVegetarian,
      isVegan,
      imageUrl,
      instructions,
      ingredients,
      tags
    } = body

    // Create dish
    const dish = await prisma.dish.create({
      data: {
        name,
        nameVi,
        categoryId,
        mealType,
        cuisineType,
        difficultyLevel,
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        calories,
        protein,
        carbs,
        fat,
        estimatedCost,
        isVegetarian,
        isVegan,
        imageUrl,
        instructions
      }
    })

    // Add ingredients if provided
    if (ingredients && ingredients.length > 0) {
      await prisma.dishIngredient.createMany({
        data: ingredients.map((ingredient: any) => ({
          dishId: dish.id,
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          isOptional: ingredient.isOptional || false
        }))
      })
    }

    // Add tags if provided
    if (tags && tags.length > 0) {
      await prisma.dishTag.createMany({
        data: tags.map((tagId: string) => ({
          dishId: dish.id,
          tagId
        }))
      })
    }

    return NextResponse.json(dish, { status: 201 })
  } catch (error) {
    console.error('Error creating dish:', error)
    return NextResponse.json(
      { error: 'Failed to create dish' },
      { status: 500 }
    )
  }
}
