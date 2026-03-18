/**
 * Configuration du système de gestion de logo
 */

export const LOGO_CONFIG = {
  // Limites d'upload
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxDimensions: {
    width: 4000,
    height: 4000
  },

  // Paramètres d'optimisation
  optimization: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85,
    format: 'webp' as const
  },

  // Paramètres de favicon
  favicon: {
    size: 32,
    format: 'png' as const,
    quality: 1
  },

  // Formats acceptés
  acceptedFormats: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp'
  ],

  // Historique
  history: {
    maxEntries: 20,
    displayLimit: 10
  },

  // Cache
  cache: {
    ttl: 60, // secondes
    staleWhileRevalidate: 30 // secondes
  }
} as const

export type LogoConfig = typeof LOGO_CONFIG

/**
 * Valider un fichier image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Vérifier le type
  if (!LOGO_CONFIG.acceptedFormats.includes(file.type as any)) {
    return {
      valid: false,
      error: `Format non supporté. Utilisez: ${LOGO_CONFIG.acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`
    }
  }

  // Vérifier la taille
  if (file.size > LOGO_CONFIG.maxFileSize) {
    const maxSizeMB = LOGO_CONFIG.maxFileSize / (1024 * 1024)
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille maximale: ${maxSizeMB}MB`
    }
  }

  return { valid: true }
}

/**
 * Obtenir les dimensions recommandées pour un logo
 */
export function getRecommendedDimensions() {
  return {
    logo: {
      min: { width: 200, height: 200 },
      recommended: { width: 500, height: 500 },
      max: { width: 1200, height: 1200 }
    },
    favicon: {
      size: LOGO_CONFIG.favicon.size
    }
  }
}

/**
 * Calculer le ratio de compression
 */
export function calculateCompressionRatio(originalSize: number, optimizedSize: number): number {
  return Math.round((1 - optimizedSize / originalSize) * 100)
}
