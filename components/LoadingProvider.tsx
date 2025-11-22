"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { LoadingScreen } from "./LoadingScreen"

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
})

export const useLoading = () => useContext(LoadingContext)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Simuler le chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Écouter les changements de route
  useEffect(() => {
    if (!mounted) return

    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Next.js navigation events
    window.addEventListener("beforeunload", handleStart)
    
    return () => {
      window.removeEventListener("beforeunload", handleStart)
    }
  }, [mounted])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  )
}
