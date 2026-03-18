"use client"

import { useState } from "react"
import { Download, Trash2, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GifImage } from "@/components/gif-image"
import { toast } from "sonner"

interface LogoHistoryItem {
  id: number
  logoUrl: string
  siteName: string
  tagline: string
  faviconUrl?: string
  createdAt: string
}

interface LogoHistoryGalleryProps {
  items: LogoHistoryItem[]
  onRestore: (item: LogoHistoryItem) => void
  onDelete: (id: number) => void
}

export function LogoHistoryGallery({ items, onRestore, onDelete }: LogoHistoryGalleryProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await onDelete(id)
      toast.success('Entrée supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Aucun historique disponible</p>
        <p className="text-sm mt-1">Les logos sauvegardés apparaîtront ici</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative bg-secondary rounded-xl p-4 border border-border hover:border-accent/50 transition-all"
        >
          {/* Logo Preview */}
          <div className="flex items-start gap-4 mb-3">
            <div className="relative w-20 h-20 shrink-0 bg-background rounded-lg overflow-hidden border border-border">
              <GifImage
                src={item.logoUrl}
                alt={item.siteName}
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate mb-1">{item.siteName}</h3>
              {item.tagline && (
                <p className="text-sm text-muted-foreground truncate mb-2">
                  {item.tagline}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Favicon Preview */}
          {item.faviconUrl && (
            <div className="mb-3 p-2 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 shrink-0">
                  <GifImage
                    src={item.faviconUrl}
                    alt="Favicon"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-muted-foreground">Favicon inclus</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRestore(item)}
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              Restaurer
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
