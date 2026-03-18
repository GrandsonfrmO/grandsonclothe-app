"use client"

import { useEffect, useState } from "react"

export function DynamicFavicon() {
  const [faviconUrl, setFaviconUrl] = useState<string>("")

  useEffect(() => {
    loadFavicon()

    // Écouter les mises à jour du logo
    const handleLogoUpdate = () => {
      loadFavicon()
    }

    window.addEventListener('logo-updated', handleLogoUpdate)
    return () => window.removeEventListener('logo-updated', handleLogoUpdate)
  }, [])

  const loadFavicon = async () => {
    try {
      const response = await fetch('/api/settings/logo', {
        cache: 'no-store',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.faviconUrl) {
          setFaviconUrl(data.faviconUrl)
          updateFavicon(data.faviconUrl)
        }
      }
    } catch (error) {
      console.error('Error loading favicon:', error)
    }
  }

  const updateFavicon = (url: string) => {
    // Mettre à jour le favicon dans le DOM
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
    
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    
    link.href = url
  }

  return null // Ce composant ne rend rien visuellement
}
