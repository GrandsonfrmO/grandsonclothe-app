/**
 * Image optimization utilities
 * Handles compression and format conversion
 */

export interface OptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'png' | 'jpeg'
}

export async function optimizeImage(
  file: File,
  options: OptimizationOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'webp'
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      // Calculate new dimensions
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Draw image
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        `image/${format}`,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

export async function generateFavicon(
  imageUrl: string,
  size: number = 32
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Draw image centered and scaled
      const scale = Math.min(size / img.width, size / img.height)
      const x = (size - img.width * scale) / 2
      const y = (size - img.height * scale) / 2

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create favicon'))
          }
        },
        'image/png',
        1
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = imageUrl
  })
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
