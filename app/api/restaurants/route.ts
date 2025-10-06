import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cuisineType = searchParams.get('cuisineType')
    const isVegetarian = searchParams.get('isVegetarian')
    const priceRange = searchParams.get('priceRange')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where: any = {}

    if (cuisineType) {
      where.cuisineType = cuisineType
    }

    if (isVegetarian === 'true') {
      where.isVegetarian = true
    }

    if (priceRange) {
      where.priceRange = priceRange
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        restaurantDishes: {
          include: {
            dish: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        ratingAvg: 'desc'
      }
    })

    const total = await prisma.restaurant.count({ where })

    return NextResponse.json({
      restaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}
