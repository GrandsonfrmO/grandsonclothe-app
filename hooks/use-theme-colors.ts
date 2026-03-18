"use client"

import { useTheme } from "@/lib/theme-context"
import { useMemo } from "react"

/**
 * Hook personnalisé pour accéder facilement aux couleurs du thème
 * et obtenir des variations de couleurs
 */
export function useThemeColors() {
  const { colors, updateTheme, refreshTheme, isLoading } = useTheme()

  const colorVariants = useMemo(() => {
    // Extraire les valeurs OKLCH pour créer des variations
    const parseOklch = (color: string) => {
      const match = color.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/)
      if (!match) return null
      return {
        l: parseFloat(match[1]),
        c: parseFloat(match[2]),
        h: parseFloat(match[3])
      }
    }

    const accent = parseOklch(colors.accent)
    
    if (!accent) return {}

    return {
      accentLight: `oklch(${Math.min(accent.l + 0.1, 1)} ${accent.c} ${accent.h})`,
      accentDark: `oklch(${Math.max(accent.l - 0.1, 0)} ${accent.c} ${accent.h})`,
      accentMuted: `oklch(${accent.l} ${accent.c * 0.5} ${accent.h})`,
    }
  }, [colors])

  return {
    colors,
    colorVariants,
    updateTheme,
    refreshTheme,
    isLoading,
  }
}
