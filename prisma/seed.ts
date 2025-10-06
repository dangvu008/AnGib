import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Vietnamese meal structure seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Rice',
        nameVi: 'Cơm',
        description: 'Các món cơm'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Soup',
        nameVi: 'Canh',
        description: 'Các món canh'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Stir-fry',
        nameVi: 'Xào',
        description: 'Các món xào'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Noodle Soup',
        nameVi: 'Bún/Phở',
        description: 'Các món bún, phở'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Main Dish',
        nameVi: 'Món chính',
        description: 'Các món chính'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Side Dish',
        nameVi: 'Món phụ',
        description: 'Các món phụ'
      }
    })
  ])

  console.log('✅ Categories created')

  // Create ingredients
  const ingredients = await Promise.all([
    prisma.ingredient.create({
      data: {
        name: 'Rice',
        nameVi: 'Gạo',
        category: 'Grain',
        unit: 'cup',
        caloriesPerUnit: 200,
        proteinPerUnit: 4,
        avgPrice: 5000
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Tofu',
        nameVi: 'Đậu hũ',
        category: 'Protein',
        unit: 'piece',
        caloriesPerUnit: 80,
        proteinPerUnit: 8,
        avgPrice: 15000
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Mushroom',
        nameVi: 'Nấm',
        category: 'Vegetable',
        unit: 'cup',
        caloriesPerUnit: 20,
        proteinPerUnit: 3,
        avgPrice: 25000
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Tomato',
        nameVi: 'Cà chua',
        category: 'Vegetable',
        unit: 'piece',
        caloriesPerUnit: 20,
        proteinPerUnit: 1,
        avgPrice: 8000
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Pumpkin',
        nameVi: 'Bí đỏ',
        category: 'Vegetable',
        unit: 'cup',
        caloriesPerUnit: 30,
        proteinPerUnit: 1,
        avgPrice: 12000
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Rice Noodles',
        nameVi: 'Bánh phở',
        category: 'Grain',
        unit: 'portion',
        caloriesPerUnit: 200,
        proteinPerUnit: 4,
        avgPrice: 10000
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Vegetable Broth',
        nameVi: 'Nước dùng rau củ',
        category: 'Liquid',
        unit: 'cup',
        caloriesPerUnit: 10,
        proteinPerUnit: 1,
        avgPrice: 5000
      }
    })
  ])

  console.log('✅ Ingredients created')

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: 'Vietnamese',
        nameVi: 'Việt Nam'
      }
    }),
    prisma.tag.create({
      data: {
        name: 'Vegetarian',
        nameVi: 'Chay'
      }
    }),
    prisma.tag.create({
      data: {
        name: 'Healthy',
        nameVi: 'Tốt cho sức khỏe'
      }
    }),
    prisma.tag.create({
      data: {
        name: 'Easy',
        nameVi: 'Dễ'
      }
    }),
    prisma.tag.create({
      data: {
        name: 'Traditional',
        nameVi: 'Truyền thống'
      }
    })
  ])

  console.log('✅ Tags created')

  // Create dishes with Vietnamese meal structure
  const dishes = await Promise.all([
    // Rice dishes
    prisma.dish.create({
      data: {
        name: 'Steamed Rice',
        nameVi: 'Cơm trắng',
        categoryId: categories[0].id, // Rice
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        difficultyLevel: 'easy',
        prepTimeMinutes: 5,
        cookTimeMinutes: 20,
        servings: 4,
        calories: 200,
        protein: 4,
        carbs: 45,
        fat: 0.5,
        estimatedCost: 5000,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/placeholder.jpg',
        instructions: 'Rửa gạo, cho vào nồi với nước, nấu 20 phút',
        dishType: 'rice',
        isStandaloneDish: false,
        isRiceAccompanied: false,
        vietnameseStyle: true,
        ratingAvg: 4.5
      }
    }),
    // Soup dishes
    prisma.dish.create({
      data: {
        name: 'Pumpkin Soup',
        nameVi: 'Canh bí đỏ',
        categoryId: categories[1].id, // Soup
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        difficultyLevel: 'easy',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: 4,
        calories: 80,
        protein: 2,
        carbs: 15,
        fat: 2,
        estimatedCost: 15000,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/placeholder.jpg',
        instructions: 'Cắt bí đỏ, nấu với nước dùng, nêm gia vị',
        dishType: 'soup',
        isStandaloneDish: false,
        isRiceAccompanied: true,
        vietnameseStyle: true,
        ratingAvg: 4.8
      }
    }),
    // Stir-fry dishes
    prisma.dish.create({
      data: {
        name: 'Mushroom Stir-fry',
        nameVi: 'Nấm xào rau củ',
        categoryId: categories[2].id, // Stir-fry
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        difficultyLevel: 'easy',
        prepTimeMinutes: 10,
        cookTimeMinutes: 12,
        servings: 4,
        calories: 150,
        protein: 5,
        carbs: 20,
        fat: 6,
        estimatedCost: 20000,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/placeholder.jpg',
        instructions: 'Xào nấm với rau củ, nêm gia vị',
        dishType: 'stir_fry',
        isStandaloneDish: false,
        isRiceAccompanied: true,
        vietnameseStyle: true,
        ratingAvg: 4.6
      }
    }),
    // Main dishes
    prisma.dish.create({
      data: {
        name: 'Tofu with Tomato Sauce',
        nameVi: 'Đậu hũ sốt cà chua',
        categoryId: categories[4].id, // Main Dish
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        difficultyLevel: 'easy',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: 4,
        calories: 180,
        protein: 12,
        carbs: 8,
        fat: 10,
        estimatedCost: 18000,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/placeholder.jpg',
        instructions: 'Chiên đậu hũ, sốt với cà chua',
        dishType: 'main',
        isStandaloneDish: false,
        isRiceAccompanied: true,
        vietnameseStyle: true,
        ratingAvg: 4.5
      }
    }),
    // Noodle soup dishes (standalone)
    prisma.dish.create({
      data: {
        name: 'Vegetarian Pho',
        nameVi: 'Phở chay',
        categoryId: categories[3].id, // Noodle Soup
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        difficultyLevel: 'medium',
        prepTimeMinutes: 20,
        cookTimeMinutes: 30,
        servings: 2,
        calories: 450,
        protein: 15,
        carbs: 70,
        fat: 8,
        estimatedCost: 35000,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/vietnamese-pho-bowl-steaming-fresh-herbs.jpg',
        instructions: 'Nấu nước dùng rau củ, luộc bánh phở, thêm rau thơm',
        dishType: 'noodle_soup',
        isStandaloneDish: true,
        isRiceAccompanied: false,
        vietnameseStyle: true,
        ratingAvg: 4.8
      }
    }),
    // Side dishes
    prisma.dish.create({
      data: {
        name: 'Pickled Vegetables',
        nameVi: 'Dưa chua',
        categoryId: categories[5].id, // Side Dish
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        difficultyLevel: 'easy',
        prepTimeMinutes: 5,
        cookTimeMinutes: 0,
        servings: 4,
        calories: 20,
        protein: 1,
        carbs: 4,
        fat: 0.1,
        estimatedCost: 8000,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/placeholder.jpg',
        instructions: 'Ngâm rau củ với giấm và đường',
        dishType: 'side',
        isStandaloneDish: false,
        isRiceAccompanied: true,
        vietnameseStyle: true,
        ratingAvg: 4.2
      }
    })
  ])

  console.log('✅ Dishes created')

  // Create meal compositions (complete Vietnamese meals)
  const mealCompositions = await Promise.all([
    // Traditional Vietnamese lunch set
    prisma.mealComposition.create({
      data: {
        name: 'Traditional Vietnamese Lunch',
        nameVi: 'Cơm trưa Việt Nam truyền thống',
        description: 'Bữa cơm trưa đầy đủ với cơm, canh, món xào và món chính',
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        totalCalories: 610,
        totalCost: 58000,
        prepTimeMinutes: 30,
        servings: 4,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/placeholder.jpg',
        popularityScore: 4.7
      }
    }),
    // Simple Vietnamese dinner
    prisma.mealComposition.create({
      data: {
        name: 'Simple Vietnamese Dinner',
        nameVi: 'Cơm tối Việt Nam đơn giản',
        description: 'Bữa cơm tối nhẹ nhàng với cơm, canh và món chính',
        mealType: 'dinner',
        cuisineType: 'vietnamese',
        totalCalories: 480,
        totalCost: 43000,
        prepTimeMinutes: 25,
        servings: 4,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/placeholder.jpg',
        popularityScore: 4.5
      }
    }),
    // Standalone noodle soup
    prisma.mealComposition.create({
      data: {
        name: 'Vegetarian Pho Set',
        nameVi: 'Phở chay đặc biệt',
        description: 'Phở chay thơm ngon với nước dùng từ rau củ',
        mealType: 'lunch',
        cuisineType: 'vietnamese',
        totalCalories: 450,
        totalCost: 35000,
        prepTimeMinutes: 50,
        servings: 2,
        isVegetarian: true,
        isVegan: true,
        imageUrl: '/vietnamese-pho-bowl-steaming-fresh-herbs.jpg',
        popularityScore: 4.8
      }
    })
  ])

  console.log('✅ Meal compositions created')

  // Create meal items (dishes in each meal composition)
  const mealItems = await Promise.all([
    // Traditional Vietnamese Lunch items
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[0].id,
        dishId: dishes[0].id, // Steamed Rice
        dishType: 'rice',
        quantity: 1,
        isRequired: true,
        order: 1
      }
    }),
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[0].id,
        dishId: dishes[1].id, // Pumpkin Soup
        dishType: 'soup',
        quantity: 1,
        isRequired: true,
        order: 2
      }
    }),
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[0].id,
        dishId: dishes[2].id, // Mushroom Stir-fry
        dishType: 'stir_fry',
        quantity: 1,
        isRequired: true,
        order: 3
      }
    }),
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[0].id,
        dishId: dishes[3].id, // Tofu with Tomato Sauce
        dishType: 'main',
        quantity: 1,
        isRequired: true,
        order: 4
      }
    }),
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[0].id,
        dishId: dishes[5].id, // Pickled Vegetables
        dishType: 'side',
        quantity: 1,
        isRequired: false,
        order: 5
      }
    }),
    // Simple Vietnamese Dinner items
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[1].id,
        dishId: dishes[0].id, // Steamed Rice
        dishType: 'rice',
        quantity: 1,
        isRequired: true,
        order: 1
      }
    }),
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[1].id,
        dishId: dishes[1].id, // Pumpkin Soup
        dishType: 'soup',
        quantity: 1,
        isRequired: true,
        order: 2
      }
    }),
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[1].id,
        dishId: dishes[3].id, // Tofu with Tomato Sauce
        dishType: 'main',
        quantity: 1,
        isRequired: true,
        order: 3
      }
    }),
    // Standalone noodle soup
    prisma.mealItem.create({
      data: {
        mealCompositionId: mealCompositions[2].id,
        dishId: dishes[4].id, // Vegetarian Pho
        dishType: 'noodle_soup',
        quantity: 1,
        isRequired: true,
        order: 1
      }
    })
  ])

  console.log('✅ Meal items created')

  // Create dish-ingredient relationships
  const dishIngredients = await Promise.all([
    // Rice ingredients
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[0].id,
        ingredientId: ingredients[0].id, // Rice
        quantity: 2,
        unit: 'cup',
        isOptional: false
      }
    }),
    // Pumpkin soup ingredients
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[1].id,
        ingredientId: ingredients[4].id, // Pumpkin
        quantity: 2,
        unit: 'cup',
        isOptional: false
      }
    }),
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[1].id,
        ingredientId: ingredients[6].id, // Vegetable Broth
        quantity: 4,
        unit: 'cup',
        isOptional: false
      }
    }),
    // Mushroom stir-fry ingredients
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[2].id,
        ingredientId: ingredients[2].id, // Mushroom
        quantity: 2,
        unit: 'cup',
        isOptional: false
      }
    }),
    // Tofu with tomato sauce ingredients
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[3].id,
        ingredientId: ingredients[1].id, // Tofu
        quantity: 4,
        unit: 'piece',
        isOptional: false
      }
    }),
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[3].id,
        ingredientId: ingredients[3].id, // Tomato
        quantity: 3,
        unit: 'piece',
        isOptional: false
      }
    }),
    // Pho ingredients
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[4].id,
        ingredientId: ingredients[5].id, // Rice Noodles
        quantity: 2,
        unit: 'portion',
        isOptional: false
      }
    }),
    prisma.dishIngredient.create({
      data: {
        dishId: dishes[4].id,
        ingredientId: ingredients[6].id, // Vegetable Broth
        quantity: 6,
        unit: 'cup',
        isOptional: false
      }
    })
  ])

  console.log('✅ Dish ingredients created')

  // Create dish-tag relationships
  const dishTags = await Promise.all([
    // All dishes are Vietnamese
    ...dishes.map(dish => 
      prisma.dishTag.create({
        data: {
          dishId: dish.id,
          tagId: tags[0].id // Vietnamese
        }
      })
    ),
    // Vegetarian dishes
    ...dishes.map(dish => 
      prisma.dishTag.create({
        data: {
          dishId: dish.id,
          tagId: tags[1].id // Vegetarian
        }
      })
    ),
    // Easy dishes
    ...dishes.filter(dish => dish.difficultyLevel === 'easy').map(dish =>
      prisma.dishTag.create({
        data: {
          dishId: dish.id,
          tagId: tags[3].id // Easy
        }
      })
    ),
    // Traditional dishes
    ...dishes.filter(dish => dish.vietnameseStyle).map(dish =>
      prisma.dishTag.create({
        data: {
          dishId: dish.id,
          tagId: tags[4].id // Traditional
        }
      })
    )
  ])

  console.log('✅ Dish tags created')

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      fullName: 'Anh Tuấn',
      avatarUrl: '/placeholder-user.jpg',
      phone: '0123456789'
    }
  })

  // Create user preferences
  await prisma.userPreferences.create({
    data: {
      userId: user.id,
      dietaryType: 'vegetarian',
      allergies: JSON.stringify(['nuts']),
      healthGoals: JSON.stringify(['weight_loss', 'muscle_gain']),
      dailyCalorieTarget: 2000,
      dailyProteinTarget: 80,
      weeklyBudget: 500000
    }
  })

  console.log('✅ User and preferences created')

  console.log('🎉 Vietnamese meal structure seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })