import { useState, useCallback } from 'react'

interface LogoHistoryItem {
  id: number
  logoUrl: string
  siteName: string
  tagline: string
  faviconUrl?: string
  createdAt: string
}

export function useLogoHistory() {
  const [history, setHistory] = useState<LogoHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/settings/logo/history')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setHistory(data.history || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load history'
      setError(errorMessage)
      console.error('Error loading logo history:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEntry = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/settings/logo/history?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      // Mettre à jour l'état local
      setHistory(prev => prev.filter(item => item.id !== id))
      return true
    } catch (err) {
      console.error('Error deleting history entry:', err)
      return false
    }
  }, [])

  const clearHistory = useCallback(async () => {
    // Supprimer toutes les entrées une par une
    const deletePromises = history.map(item => deleteEntry(item.id))
    const results = await Promise.all(deletePromises)
    
    return results.every(result => result)
  }, [history, deleteEntry])

  return {
    history,
    loading,
    error,
    loadHistory,
    deleteEntry,
    clearHistory
  }
}
