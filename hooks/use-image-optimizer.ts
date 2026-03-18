import { useState } from 'react'
import { optimizeImage, generateFavicon, getImageDimensions, formatFileSize } from '@/lib/image-optimizer'

interface OptimizationResult {
  optimizedUrl: string
  faviconUrl?: string
  originalSize: number
  optimizedSize: number
  dimensions: { width: number; height: number }
  compressionRatio: number
}

export function useImageOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const optimize = async (file: File): Promise<OptimizationResult | null> => {
    setIsOptimizing(true)
    setError(null)

    try {
      // Get original dimensions
      const dimensions = await getImageDimensions(file)
      const originalSize = file.size

      // Optimize image
      const optimizedBlob = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        format: 'webp'
      })

      const optimizedSize = optimizedBlob.size
      const compressionRatio = Math.round((1 - optimizedSize / originalSize) * 100)

      // Create URL for optimized image
      const optimizedUrl = URL.createObjectURL(optimizedBlob)

      // Generate favicon
      let faviconUrl: string | undefined
      try {
        const faviconBlob = await generateFavicon(optimizedUrl, 32)
        faviconUrl = URL.createObjectURL(faviconBlob)
      } catch (err) {
        console.warn('Failed to generate favicon:', err)
      }

      return {
        optimizedUrl,
        faviconUrl,
        originalSize,
        optimizedSize,
        dimensions,
        compressionRatio
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize image'
      setError(errorMessage)
      return null
    } finally {
      setIsOptimizing(false)
    }
  }

  return {
    optimize,
    isOptimizing,
    error
  }
}
