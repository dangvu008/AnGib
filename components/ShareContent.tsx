"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Users, 
  ChefHat, 
  ShoppingCart, 
  Calendar,
  Leaf,
  Utensils,
  Flame
} from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface ShareContentProps {
  content: {
    title: string
    description: string
    type: 'recipe' | 'menu' | 'shopping' | 'weekly-plan'
    data: any
  }
}

export function ShareContent({ content }: ShareContentProps) {
  const { title, description, type, data } = content

  const renderRecipe = () => (
    <div id={`share-content-${type}`} className="w-[600px] h-[400px] bg-white p-6 font-sans">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ChefHat className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Công thức nấu ăn</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Clock className="h-6 w-6 text-primary mx-auto mb-1" />
          <p className="text-sm font-medium">{data.prepTime || '30 phút'}</p>
          <p className="text-xs text-gray-500">Thời gian</p>
        </div>
        <div className="text-center">
          <Users className="h-6 w-6 text-primary mx-auto mb-1" />
          <p className="text-sm font-medium">{data.servings || '2-3 người'}</p>
          <p className="text-xs text-gray-500">Khẩu phần</p>
        </div>
        <div className="text-center">
          <Flame className="h-6 w-6 text-primary mx-auto mb-1" />
          <p className="text-sm font-medium">{data.calories || '350 calo'}</p>
          <p className="text-xs text-gray-500">Calories</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Nguyên liệu:</h3>
          <div className="grid grid-cols-2 gap-1 text-sm text-gray-700">
            {data.ingredients?.slice(0, 6).map((ingredient: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Leaf className="h-4 w-4" />
          <span>AnGi - Trợ lý ẩm thực AI</span>
        </div>
      </div>
    </div>
  )

  const renderMenu = () => (
    <div id={`share-content-${type}`} className="w-[600px] h-[400px] bg-white p-6 font-sans">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Utensils className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Thực đơn tuần</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Món chính:</h3>
          {data.mainDishes?.slice(0, 3).map((dish: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-gray-700">{dish}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Món phụ:</h3>
          {data.sideDishes?.slice(0, 3).map((dish: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
              <span className="text-gray-700">{dish}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge className="bg-primary/10 text-primary">7 ngày</Badge>
          <Badge className="bg-chart-2/10 text-chart-2">Chay</Badge>
        </div>
        <div className="text-sm text-gray-500">
          {data.totalCalories || '1,400-1,600'} calo/ngày
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Leaf className="h-4 w-4" />
          <span>AnGi - Trợ lý ẩm thực AI</span>
        </div>
      </div>
    </div>
  )

  const renderShopping = () => (
    <div id={`share-content-${type}`} className="w-[600px] h-[400px] bg-white p-6 font-sans">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Danh sách mua sắm</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Rau củ:</h3>
          {data.vegetables?.slice(0, 4).map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Gia vị:</h3>
          {data.spices?.slice(0, 4).map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-primary">
          Tổng: {formatCurrency(data.totalPrice || 150000)}
        </div>
        <div className="text-sm text-gray-500">
          {data.itemCount || '12'} món
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Leaf className="h-4 w-4" />
          <span>AnGi - Trợ lý ẩm thực AI</span>
        </div>
      </div>
    </div>
  )

  const renderWeeklyPlan = () => (
    <div id={`share-content-${type}`} className="w-[600px] h-[400px] bg-white p-6 font-sans">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Kế hoạch tuần</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
          <div key={day} className="text-center">
            <div className="text-xs font-medium text-gray-500 mb-1">{day}</div>
            <div className="h-16 bg-primary/5 rounded-lg flex items-center justify-center">
              <div className="text-xs text-center">
                <div className="font-medium text-gray-900">
                  {data.days?.[index]?.breakfast || 'Bánh mì'}
                </div>
                <div className="text-gray-500 text-[10px] mt-1">
                  {data.days?.[index]?.dinner || 'Cơm chay'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge className="bg-primary/10 text-primary">7 ngày</Badge>
          <Badge className="bg-chart-2/10 text-chart-2">Chay</Badge>
        </div>
        <div className="text-sm text-gray-500">
          {data.totalMeals || '21'} bữa ăn
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Leaf className="h-4 w-4" />
          <span>AnGi - Trợ lý ẩm thực AI</span>
        </div>
      </div>
    </div>
  )

  switch (type) {
    case 'recipe':
      return renderRecipe()
    case 'menu':
      return renderMenu()
    case 'shopping':
      return renderShopping()
    case 'weekly-plan':
      return renderWeeklyPlan()
    default:
      return renderRecipe()
  }
}
