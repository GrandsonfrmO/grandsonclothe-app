/**
 * Logo System - Exports centralisés
 */

// Configuration
export { LOGO_CONFIG, validateImageFile, getRecommendedDimensions, calculateCompressionRatio } from '../logo-config'
export type { LogoConfig } from '../logo-config'

// Optimisation
export { optimizeImage, generateFavicon, getImageDimensions, formatFileSize } from '../image-optimizer'

// Cache
export { getCachedLogoSettings, setCachedLogoSettings, invalidateLogoCache, getLogoSettings } from '../logo-cache'

// Types
export interface LogoSettings {
  logoUrl: string
  siteName: string
  tagline: string
  faviconUrl?: string
}

export interface LogoHistoryItem {
  id: number
  logoUrl: string
  siteName: string
  tagline: string
  faviconUrl?: string
  createdAt: string
  userId?: number
}

export interface OptimizationResult {
  optimizedUrl: string
  faviconUrl?: string
  originalSize: number
  optimizedSize: number
  dimensions: { width: number; height: number }
  compressionRatio: number
}
