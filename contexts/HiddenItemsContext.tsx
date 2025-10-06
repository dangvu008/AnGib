"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

export interface HiddenItem {
  id: string
  type: 'meal' | 'restaurant' | 'ingredient'
  name: string
  image?: string
  hiddenAt: Date
}

interface HiddenItemsContextType {
  hiddenItems: HiddenItem[]
  hideItem: (item: Omit<HiddenItem, 'hiddenAt'>) => void
  showItem: (id: string) => void
  isHidden: (id: string) => boolean
  clearAllHidden: () => void
  getHiddenByType: (type: 'meal' | 'restaurant' | 'ingredient') => HiddenItem[]
}

const HiddenItemsContext = createContext<HiddenItemsContextType | undefined>(undefined)

export function HiddenItemsProvider({ children }: { children: React.ReactNode }) {
  const [hiddenItems, setHiddenItems] = useState<HiddenItem[]>([])
  const { isAuthenticated, user } = useAuth()

  // Load from localStorage on mount and when user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setHiddenItems([])
      return
    }

    const stored = localStorage.getItem(`angi-hidden-items-${user.id}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setHiddenItems(parsed.map((item: any) => ({
          ...item,
          hiddenAt: new Date(item.hiddenAt)
        })))
      } catch (error) {
        console.error('Error loading hidden items:', error)
      }
    }
  }, [isAuthenticated, user])

  // Save to localStorage whenever hiddenItems changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`angi-hidden-items-${user.id}`, JSON.stringify(hiddenItems))
    }
  }, [hiddenItems, isAuthenticated, user])

  const hideItem = (item: Omit<HiddenItem, 'hiddenAt'>) => {
    if (!isAuthenticated) return
    
    setHiddenItems(prev => {
      // Check if already hidden
      if (prev.some(hidden => hidden.id === item.id)) {
        return prev
      }
      return [...prev, { ...item, hiddenAt: new Date() }]
    })
  }

  const showItem = (id: string) => {
    if (!isAuthenticated) return
    
    setHiddenItems(prev => prev.filter(item => item.id !== id))
  }

  const isHidden = (id: string) => {
    if (!isAuthenticated) return false
    
    return hiddenItems.some(item => item.id === id)
  }

  const clearAllHidden = () => {
    if (!isAuthenticated) return
    
    setHiddenItems([])
  }

  const getHiddenByType = (type: 'meal' | 'restaurant' | 'ingredient') => {
    return hiddenItems.filter(item => item.type === type)
  }

  return (
    <HiddenItemsContext.Provider
      value={{
        hiddenItems,
        hideItem,
        showItem,
        isHidden,
        clearAllHidden,
        getHiddenByType,
      }}
    >
      {children}
    </HiddenItemsContext.Provider>
  )
}

export function useHiddenItems() {
  const context = useContext(HiddenItemsContext)
  if (context === undefined) {
    throw new Error('useHiddenItems must be used within a HiddenItemsProvider')
  }
  return context
}
