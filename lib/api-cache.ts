// Cache simple pour les requêtes API côté client
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 secondes

export async function cachedFetch(url: string, options?: RequestInit) {
  const cacheKey = `${url}-${JSON.stringify(options)}`
  const cached = cache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  const response = await fetch(url, options)
  const data = await response.json()
  
  cache.set(cacheKey, { data, timestamp: Date.now() })
  
  return data
}

export function clearCache(pattern?: string) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}
