"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { ThemeChangeToast } from '@/components/theme-change-toast'

interface ThemeColors {
  primary: string
  accent: string
  background: string
  foreground: string
}

interface ThemeContextType {
  colors: ThemeColors
  updateTheme: (colors: ThemeColors) => void
  refreshTheme: () => Promise<void>
  isLoading: boolean
}

const defaultColors: ThemeColors = {
  primary: 'oklch(0.65 0.2 145)',
  accent: 'oklch(0.65 0.2 145)',
  background: 'oklch(0.08 0 0)',
  foreground: 'oklch(0.98 0 0)',
}

const CACHE_KEY = 'theme-colors'
const CACHE_TIMESTAMP_KEY = 'theme-colors-timestamp'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors)
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastColor, setToastColor] = useState('')
  const refreshTimeoutRef = useRef<NodeJS.Timeout>()

  const applyTheme = useCallback((themeColors: ThemeColors) => {
    const root = document.documentElement
    
    // Appliquer toutes les variables CSS en une seule fois
    requestAnimationFrame(() => {
      root.style.setProperty('--accent', themeColors.accent)
      root.style.setProperty('--ring', themeColors.primary)
      root.style.setProperty('--sidebar-ring', themeColors.primary)
      root.style.setProperty('--chart-1', themeColors.primary)
    })
  }, [])

  const getCachedTheme = useCallback((): ThemeColors | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp)
        if (age < CACHE_TTL) {
          return JSON.parse(cached)
        }
      }
    } catch (error) {
      console.error('Error reading cached theme:', error)
    }
    return null
  }, [])

  const setCachedTheme = useCallback((themeColors: ThemeColors) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(themeColors))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error('Error caching theme:', error)
    }
  }, [])

  const refreshTheme = useCallback(async () => {
    // Debounce: clear previous timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    // Check cache first
    const cached = getCachedTheme()
    if (cached) {
      setColors(cached)
      applyTheme(cached)
      setIsLoading(false)
      return
    }

    // Debounce API call
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/settings/theme', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setColors(data)
          applyTheme(data)
          setCachedTheme(data)
        }
      } catch (error) {
        console.error('Error loading theme:', error)
      } finally {
        setIsLoading(false)
      }
    }, 100) // 100ms debounce
  }, [applyTheme, getCachedTheme, setCachedTheme])

  const updateTheme = useCallback((newColors: ThemeColors) => {
    setColors(newColors)
    applyTheme(newColors)
    setCachedTheme(newColors)
    
    // Afficher le toast
    setToastColor(newColors.accent)
    setShowToast(true)
    
    // Broadcast le changement aux autres onglets
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme-update', Date.now().toString())
    }
  }, [applyTheme, setCachedTheme])

  useEffect(() => {
    // Charger le thème au démarrage
    refreshTheme()

    // Écouter les changements de thème depuis d'autres onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme-update') {
        // Invalidate cache and refresh
        localStorage.removeItem(CACHE_TIMESTAMP_KEY)
        refreshTheme()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [refreshTheme])

  return (
    <ThemeContext.Provider value={{ colors, updateTheme, refreshTheme, isLoading }}>
      {children}
      <ThemeChangeToast 
        show={showToast} 
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
