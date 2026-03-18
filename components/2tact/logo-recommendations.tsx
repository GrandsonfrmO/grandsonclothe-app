"use client"

import { Info, CheckCircle2, AlertCircle } from "lucide-react"
import { getRecommendedDimensions } from "@/lib/logo-config"

interface LogoRecommendationsProps {
  currentDimensions?: { width: number; height: number }
}

export function LogoRecommendations({ currentDimensions }: LogoRecommendationsProps) {
  const recommended = getRecommendedDimensions()

  const getStatus = () => {
    if (!currentDimensions) return null

    const { width, height } = currentDimensions
    const { min, recommended: rec, max } = recommended.logo

    if (width < min.width || height < min.height) {
      return {
        type: 'warning',
        message: 'Dimensions trop petites - qualité réduite'
      }
    }

    if (width > max.width || height > max.height) {
      return {
        type: 'info',
        message: 'Dimensions élevées - sera redimensionné'
      }
    }

    if (width >= rec.width && height >= rec.height) {
      return {
        type: 'success',
        message: 'Dimensions optimales'
      }
    }

    return {
      type: 'info',
      message: 'Dimensions acceptables'
    }
  }

  const status = getStatus()

  return (
    <div className="space-y-3">
      {/* Current Status */}
      {status && currentDimensions && (
        <div className={`
          flex items-start gap-3 p-3 rounded-lg border
          ${status.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20' 
            : status.type === 'warning'
            ? 'bg-yellow-500/10 border-yellow-500/20'
            : 'bg-blue-500/10 border-blue-500/20'
          }
        `}>
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          ) : status.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">
              {currentDimensions.width} × {currentDimensions.height} px
            </p>
            <p className="text-xs text-muted-foreground">{status.message}</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="p-4 bg-secondary rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Recommandations</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Minimum:</span>
            <span className="font-medium">
              {recommended.logo.min.width} × {recommended.logo.min.height} px
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recommandé:</span>
            <span className="font-medium text-green-500">
              {recommended.logo.recommended.width} × {recommended.logo.recommended.height} px
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Maximum:</span>
            <span className="font-medium">
              {recommended.logo.max.width} × {recommended.logo.max.height} px
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 Format carré avec fond transparent (PNG) recommandé
          </p>
        </div>
      </div>
    </div>
  )
}
