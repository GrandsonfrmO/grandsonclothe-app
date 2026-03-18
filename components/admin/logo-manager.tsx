"use client"

import { useState, useEffect } from "react"
import { Upload, Save, RotateCcw, Image as ImageIcon, Loader2, History, Trash2, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/admin/image-upload"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { GifImage } from "@/components/gif-image"
import { optimizeImage, generateFavicon, getImageDimensions, formatFileSize } from "@/lib/image-optimizer"

interface LogoSettings {
  logoUrl: string
  siteName: string
  tagline: string
  faviconUrl?: string
}

interface LogoHistoryItem {
  id: number
  logoUrl: string
  siteName: string
  tagline: string
  faviconUrl?: string
  createdAt: string
}

export function LogoManager() {
  const [settings, setSettings] = useState<LogoSettings>({
    logoUrl: "",
    siteName: "GRANDSON CLOTHES",
    tagline: "Style & Qualité",
    faviconUrl: ""
  })
  const [originalSettings, setOriginalSettings] = useState<LogoSettings>(settings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<LogoHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [optimizing, setOptimizing] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings)
    setHasChanges(changed)
  }, [settings, originalSettings])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/logo', {
        cache: 'no-store',
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        setOriginalSettings(data)
      }
    } catch (error) {
      console.error('Error loading logo settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch('/api/settings/logo/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Error loading history:', error)
      toast.error('Erreur lors du chargement de l\'historique')
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleImageUpload = async (url: string) => {
    setOptimizing(true)
    try {
      // Générer automatiquement le favicon
      const faviconBlob = await generateFavicon(url, 32)
      const faviconUrl = URL.createObjectURL(faviconBlob)
      
      setSettings({ 
        ...settings, 
        logoUrl: url,
        faviconUrl: faviconUrl
      })
      
      toast.success('Logo et favicon générés!', {
        description: 'Le favicon a été créé automatiquement'
      })
    } catch (error) {
      console.error('Error generating favicon:', error)
      setSettings({ ...settings, logoUrl: url })
      toast.info('Logo ajouté', {
        description: 'Impossible de générer le favicon automatiquement'
      })
    } finally {
      setOptimizing(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        setOriginalSettings(data.settings)
        toast.success('Logo et informations enregistrés!', {
          description: 'Les changements sont visibles sur tout le site'
        })
        
        // Déclencher un événement pour rafraîchir le header
        window.dispatchEvent(new Event('logo-updated'))
      } else {
        toast.error('Erreur lors de l\'enregistrement')
      }
    } catch (error) {
      console.error('Error saving logo settings:', error)
      toast.error('Erreur lors de l\'enregistrement')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings(originalSettings)
    toast.info('Modifications annulées')
  }

  const handleRestoreFromHistory = (item: LogoHistoryItem) => {
    setSettings({
      logoUrl: item.logoUrl,
      siteName: item.siteName,
      tagline: item.tagline,
      faviconUrl: item.faviconUrl
    })
    setShowHistory(false)
    toast.success('Logo restauré depuis l\'historique')
  }

  const handleDeleteHistory = async (id: number) => {
    try {
      const response = await fetch(`/api/settings/logo/history?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setHistory(history.filter(item => item.id !== id))
        toast.success('Entrée supprimée de l\'historique')
      }
    } catch (error) {
      console.error('Error deleting history:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6" />
          <h2 className="text-xl font-bold">Logo et identité</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowHistory(!showHistory)
            if (!showHistory && history.length === 0) {
              loadHistory()
            }
          }}
          className="gap-2"
        >
          <History className="w-4 h-4" />
          Historique
        </Button>
      </div>

      {showHistory ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Historique des logos précédents
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(false)}
            >
              Retour
            </Button>
          </div>

          {loadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun historique disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-secondary rounded-xl"
                >
                  <div className="relative w-16 h-16 shrink-0 bg-background rounded-lg overflow-hidden">
                    <GifImage
                      src={item.logoUrl}
                      alt={item.siteName}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.siteName}</p>
                    {item.tagline && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.tagline}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreFromHistory(item)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteHistory(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            Personnalisez le logo et les informations de votre boutique. Ces éléments apparaissent dans le header et sur toutes les pages.
          </p>

          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Logo de la boutique</label>
            <ImageUpload
              value={settings.logoUrl}
              onChange={handleImageUpload}
            />
            <p className="text-xs text-muted-foreground mt-2">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Compression automatique et génération du favicon incluses
            </p>
          </div>

          {optimizing && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-500">Optimisation en cours...</p>
                <p className="text-xs text-muted-foreground">Génération du favicon</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {settings.logoUrl && (
            <div className="mb-6 p-6 bg-secondary rounded-xl">
              <p className="text-sm font-medium mb-3">Aperçu du logo</p>
              <div className="flex items-center gap-6">
                {/* Sur fond clair */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">Sur fond clair</p>
                  <div className="bg-white p-4 rounded-lg border border-border flex items-center justify-center">
                    <div className="relative w-16 h-16">
                      <GifImage
                        src={settings.logoUrl}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sur fond sombre */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">Sur fond sombre</p>
                  <div className="bg-black p-4 rounded-lg border border-border flex items-center justify-center">
                    <div className="relative w-16 h-16">
                      <GifImage
                        src={settings.logoUrl}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                {settings.faviconUrl && (
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">Favicon (32x32)</p>
                    <div className="bg-background p-4 rounded-lg border border-border flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <GifImage
                          src={settings.faviconUrl}
                          alt="Favicon"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Site Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nom de la boutique</label>
            <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="GRANDSON CLOTHES"
              className="bg-secondary border-0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Affiché à côté du logo dans le header
            </p>
          </div>

          {/* Tagline */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Slogan (optionnel)</label>
            <Input
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              placeholder="Style & Qualité"
              className="bg-secondary border-0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Court slogan affiché sous le nom
            </p>
          </div>

          {/* Preview Header */}
          {(settings.logoUrl || settings.siteName) && (
            <div className="mb-6 p-6 bg-secondary rounded-xl">
              <p className="text-sm font-medium mb-3">Aperçu dans le header</p>
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {settings.logoUrl && (
                    <div className="relative w-12 h-12 shrink-0">
                      <GifImage
                        src={settings.logoUrl}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-lg">{settings.siteName}</p>
                    {settings.tagline && (
                      <p className="text-xs text-muted-foreground">{settings.tagline}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-border">
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={saving}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Annuler
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="gap-2 flex-1"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>

          {hasChanges && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              💡 N'oubliez pas d'enregistrer vos modifications
            </p>
          )}
        </>
      )}
    </div>
  )
}
