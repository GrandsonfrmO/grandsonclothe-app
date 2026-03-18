"use client"

import { useEffect, useState } from "react"
import { Palette, X } from "lucide-react"

interface ThemeChangeToastProps {
  show: boolean
  color: string
  onClose: () => void
}

export function ThemeChangeToast({ show, color, onClose }: ThemeChangeToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[300px]">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: color }}
        >
          <Palette className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Thème mis à jour</p>
          <p className="text-xs text-muted-foreground">Changements appliqués avec succès</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
