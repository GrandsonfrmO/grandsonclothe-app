/**
 * Gestion du cache des paramètres de logo
 */

interface CachedLogoSettings {
  logoUrl: string
  siteName: string
  tagline: string
  faviconUrl?: string
  timestamp: number
}

const CACHE_KEY = 'logo_settings_cache'
const CACHE_TTL = 60 * 1000 // 60 secondes

/**
 * Récupérer les paramètres depuis le cache
 */
export function getCachedLogoSettings(): CachedLogoSettings | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data = JSON.parse(cached) as CachedLogoSettings
    const now = Date.now()

    // Vérifier si le cache est expiré
    if (now - data.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return data
  } catch (error) {
    console.error('Error reading logo cache:', error)
    return null
  }
}

/**
 * Sauvegarder les paramètres dans le cache
 */
export function setCachedLogoSettings(settings: Omit<CachedLogoSettings, 'timestamp'>): void {
  if (typeof window === 'undefined') return

  try {
    const data: CachedLogoSettings = {
      ...settings,
      timestamp: Date.now()
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error writing logo cache:', error)
  }
}

/**
 * Invalider le cache
 */
export function invalidateLogoCache(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.error('Error invalidating logo cache:', error)
  }
}

/**
 * Récupérer les paramètres avec cache
 */
export async function getLogoSettings(): Promise<CachedLogoSettings> {
  // Essayer le cache d'abord
  const cached = getCachedLogoSettings()
  if (cached) {
    return cached
  }

  // Sinon, récupérer depuis l'API
  const response = await fetch('/api/settings/logo', {
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch logo settings')
  }

  const settings = await response.json()
  
  // Mettre en cache
  setCachedLogoSettings(settings)

  return {
    ...settings,
    timestamp: Date.now()
  }
}
