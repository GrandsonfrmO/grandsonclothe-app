"use client"

import { useState } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { GifImage } from "@/components/gif-image"
import { Button } from "@/components/ui/button"

interface LogoPreviewAdvancedProps {
  logoUrl: string
  siteName: string
  tagline?: string
  faviconUrl?: string
}

type ViewMode = 'desktop' | 'tablet' | 'mobile'

export function LogoPreviewAdvanced({ 
  logoUrl, 
  siteName, 
  tagline,
  faviconUrl 
}: LogoPreviewAdvancedProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const getLogoSize = () => {
    switch (viewMode) {
      case 'desktop':
        return { width: 48, height: 48 }
      case 'tablet':
        return { width: 40, height: 40 }
      case 'mobile':
        return { width: 32, height: 32 }
    }
  }

  const getTextSize = () => {
    switch (viewMode) {
      case 'desktop':
        return 'text-lg'
      case 'tablet':
        return 'text-base'
      case 'mobile':
        return 'text-sm'
    }
  }

  const logoSize = getLogoSize()
  const textSize = getTextSize()

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            onClick={() => setViewMode('desktop')}
            className="gap-2"
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'tablet' ? 'default' : 'outline'}
            onClick={() => setViewMode('tablet')}
            className="gap-2"
          >
            <Tablet className="w-4 h-4" />
            Tablet
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            onClick={() => setViewMode('mobile')}
            className="gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
          >
            Clair
          </Button>
          <Button
            size="sm"
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
          >
            Sombre
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className={`
        p-6 rounded-xl border border-border transition-colors
        ${theme === 'dark' ? 'bg-black' : 'bg-white'}
      `}>
        <div className="flex items-center gap-3">
          {logoUrl && (
            <div 
              className="relative shrink-0"
              style={{ width: logoSize.width, height: logoSize.height }}
            >
              <GifImage
                src={logoUrl}
                alt={siteName}
                fill
                className="object-contain"
              />
            </div>
          )}
          
          <div>
            <p className={`
              font-bold leading-tight
              ${textSize}
              ${theme === 'dark' ? 'text-white' : 'text-black'}
            `}>
              {siteName}
            </p>
            {tagline && viewMode !== 'mobile' && (
              <p className={`
                text-xs leading-tight mt-0.5
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}>
                {tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Favicon Preview */}
      {faviconUrl && (
        <div className="p-4 bg-secondary rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0">
              <GifImage
                src={faviconUrl}
                alt="Favicon"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Favicon (32×32)</p>
              <p className="text-xs text-muted-foreground">
                Affiché dans l'onglet du navigateur
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
