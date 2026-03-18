"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GifImage } from "@/components/gif-image"

interface LogoSettings {
  logoUrl: string
  siteName: string
  tagline: string
}

interface SiteLogoProps {
  className?: string
  showTagline?: boolean
  linkTo?: string
}

export function SiteLogo({ className = "", showTagline = false, linkTo = "/" }: SiteLogoProps) {
  const [settings, setSettings] = useState<LogoSettings>({
    logoUrl: "",
    siteName: "GRANDSON CLOTHES",
    tagline: "Style & Qualité"
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()

    // Écouter les mises à jour du logo
    const handleLogoUpdate = () => {
      loadSettings()
    }

    window.addEventListener('logo-updated', handleLogoUpdate)
    return () => window.removeEventListener('logo-updated', handleLogoUpdate)
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/logo', {
        cache: 'no-store',
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading logo settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {settings.logoUrl ? (
        <div className="relative w-10 h-10 lg:w-12 lg:h-12 shrink-0">
          <GifImage
            src={settings.logoUrl}
            alt={settings.siteName}
            fill
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-accent rounded-xl flex items-center justify-center shrink-0">
          <span className="text-lg lg:text-xl font-bold text-accent-foreground">
            {settings.siteName.substring(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      
      <div className="flex flex-col">
        <span className="font-bold text-base lg:text-lg leading-tight">
          {settings.siteName}
        </span>
        {showTagline && settings.tagline && (
          <span className="text-xs text-muted-foreground leading-tight">
            {settings.tagline}
          </span>
        )}
      </div>
    </div>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="touch-manipulation hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
