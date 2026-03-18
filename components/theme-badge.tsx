"use client"

import { useTheme } from "@/lib/theme-context"
import { Palette } from "lucide-react"

export function ThemeBadge() {
  const { colors } = useTheme()

  return (
    <div className="fixed bottom-4 left-4 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
        <Palette className="w-3 h-3 text-muted-foreground" />
        <div 
          className="w-4 h-4 rounded border border-border"
          style={{ background: colors.accent }}
        />
        <span className="text-xs text-muted-foreground">Thème actif</span>
      </div>
    </div>
  )
}
