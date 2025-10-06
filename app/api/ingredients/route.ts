import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const isVegetarian = searchParams.get('isVegetarian')

    const where: any = {}

    if (category) {
      where.category = category
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

    const ingredients = await prisma.ingredient.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(ingredients)
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    )
  }
}
