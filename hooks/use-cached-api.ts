import { useState, useEffect, useCallback } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<any>>()
const CACHE_DURATION = 30000 // 30 secondes

interface UseCachedApiOptions {
  cacheDuration?: number
  enabled?: boolean
}

export function useCachedApi<T>(
  url: string,
  options: UseCachedApiOptions = {}
) {
  const { cacheDuration = CACHE_DURATION, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) {
      setLoading(false)
      return
    }

    try {
      // Vérifier le cache
      if (!force) {
        const cached = cache.get(url)
        if (cached && Date.now() - cached.timestamp < cacheDuration) {
          setData(cached.data)
          setLoading(false)
          return
        }
      }

      setLoading(true)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      // Mettre en cache
      cache.set(url, {
        data: result,
        timestamp: Date.now(),
      })
      
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [url, cacheDuration, enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    cache.delete(url)
  }, [url])

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  }
}

// Hook pour invalider le cache par pattern
export function useCacheClear() {
  return useCallback((pattern?: string) => {
    if (pattern) {
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      cache.clear()
    }
  }, [])
}
