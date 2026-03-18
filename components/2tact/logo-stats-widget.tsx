"use client"

import { useEffect, useState } from "react"
import { Image, History, TrendingUp, Clock } from "lucide-react"

interface LogoStats {
  hasLogo: boolean
  hasFavicon: boolean
  historyCount: number
  lastUpdated?: string
}

export function LogoStatsWidget() {
  const [stats, setStats] = useState<LogoStats>({
    hasLogo: false,
    hasFavicon: false,
    historyCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Charger les paramètres actuels
      const settingsRes = await fetch('/api/settings/logo')
      if (settingsRes.ok) {
        const settings = await settingsRes.json()
        
        // Charger l'historique
        const historyRes = await fetch('/api/settings/logo/history')
        let historyCount = 0
        
        if (historyRes.ok) {
          const historyData = await historyRes.json()
          historyCount = historyData.history?.length || 0
        }

        setStats({
          hasLogo: !!settings.logoUrl,
          hasFavicon: !!settings.faviconUrl,
          historyCount,
          lastUpdated: historyCount > 0 ? new Date().toISOString() : undefined
        })
      }
    } catch (error) {
      console.error('Error loading logo stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Jamais'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    
    return date.toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-secondary rounded w-1/2" />
          <div className="h-8 bg-secondary rounded w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Image className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold">Logo & Identité</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Logo Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`
              w-2 h-2 rounded-full
              ${stats.hasLogo ? 'bg-green-500' : 'bg-gray-300'}
            `} />
            <p className="text-sm text-muted-foreground">Logo</p>
          </div>
          <p className="text-lg font-semibold">
            {stats.hasLogo ? 'Configuré' : 'Non défini'}
          </p>
        </div>

        {/* Favicon Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`
              w-2 h-2 rounded-full
              ${stats.hasFavicon ? 'bg-green-500' : 'bg-gray-300'}
            `} />
            <p className="text-sm text-muted-foreground">Favicon</p>
          </div>
          <p className="text-lg font-semibold">
            {stats.hasFavicon ? 'Généré' : 'Non défini'}
          </p>
        </div>

        {/* History Count */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-3 h-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Historique</p>
          </div>
          <p className="text-lg font-semibold">
            {stats.historyCount} {stats.historyCount > 1 ? 'versions' : 'version'}
          </p>
        </div>

        {/* Last Updated */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Mis à jour</p>
          </div>
          <p className="text-lg font-semibold">
            {formatDate(stats.lastUpdated)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Configuration</p>
          <p className="text-sm font-medium">
            {stats.hasLogo && stats.hasFavicon ? '100%' : stats.hasLogo ? '50%' : '0%'}
          </p>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ 
              width: stats.hasLogo && stats.hasFavicon ? '100%' : stats.hasLogo ? '50%' : '0%' 
            }}
          />
        </div>
      </div>
    </div>
  )
}
