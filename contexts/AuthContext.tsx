"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    diet: string
    allergies: string[]
    dislikedIngredients: string[]
    dislikedDishes: string[]
    healthGoals: string[]
    budget: number
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem("angi-user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // Ensure preferences have all required fields
        const userWithDefaults = {
          ...userData,
          preferences: {
            diet: userData.preferences?.diet || "vegetarian",
            allergies: userData.preferences?.allergies || [],
            dislikedIngredients: userData.preferences?.dislikedIngredients || [],
            dislikedDishes: userData.preferences?.dislikedDishes || [],
            healthGoals: userData.preferences?.healthGoals || [],
            budget: userData.preferences?.budget || 1000000
          }
        }
        setUser(userWithDefaults)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error loading user data:", error)
        localStorage.removeItem("angi-user")
      }
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("angi-user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("angi-user")
    // Clear hidden items when logging out
    localStorage.removeItem("angi-hidden-items")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("angi-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
