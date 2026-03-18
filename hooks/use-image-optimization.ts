import { useState } from 'react'
import { optimizeImage, generateFavicon, getImageDimensions } from '@/lib/image-optimizer'

interface OptimizationResult {
  optimizedUrl: string
  faviconUrl: string
  originalSize: number
  compressedSize: number
  originalDimensions: { width: number; height: number }
  compressedDimensions: { width: number; height: number }
}

export function useImageOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const optimizeImageFile = async (file: File): Promise<OptimizationResult | null> => {
    setIsOptimizing(true)
    setError(null)

    try {
      // Get original dimensions
      const originalDimensions = await getImageDimensions(file)
      const originalSize = file.size

      // Optimize image
      const optimizedBlob = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        format: 'webp'
      })

      // Create URL for optimized image
      const optimizedUrl = URL.createObjectURL(optimizedBlob)

      // Get compressed dimensions
      const compressedFile = new File([optimizedBlob], 'optimized.webp', { type: 'image/webp' })
      const compressedDimensions = await getImageDimensions(compressedFile)
      const compressedSize = optimizedBlob.size

      // Generate favicon
      const faviconBlob = await generateFavicon(optimizedUrl, 32)
      const faviconUrl = URL.createObjectURL(faviconBlob)

      return {
        optimizedUrl,
        faviconUrl,
        originalSize,
        compressedSize,
        originalDimensions,
        compressedDimensions
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
    optimizeImageFile,
    isOptimizing,
    error
  }
}
