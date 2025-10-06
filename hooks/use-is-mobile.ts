"use client"

import { useState, useEffect } from "react"

function getIsMobile(): boolean {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}

export function useIsMobile() {
  // Initialize with actual window size if available
  const [isMobile, setIsMobile] = useState<boolean>(() => getIsMobile())

  useEffect(() => {
    // Update on mount in case initial state was incorrect
    setIsMobile(getIsMobile())

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Add event listener for resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Additional hook for tablet detection
export function useIsTablet() {
  const [isTablet, setIsTablet] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth >= 768 && window.innerWidth < 1024
  })

  useEffect(() => {
    setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)

    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    window.addEventListener("resize", checkTablet)
    return () => window.removeEventListener("resize", checkTablet)
  }, [])

  return isTablet
}

// Hook for all screen size breakpoints
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number
    height: number
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }>(() => {
    if (typeof window === "undefined") {
      return {
        width: 0,
        height: 0,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      }
    }
    
    const width = window.innerWidth
    const height = window.innerHeight
    
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    }
  })

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      })
    }

    // Update immediately on mount
    updateScreenSize()

    // Add event listener
    window.addEventListener("resize", updateScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  return screenSize
}

