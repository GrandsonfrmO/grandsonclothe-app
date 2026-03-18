/**
 * Utilitaires pour la gestion des images et GIFs
 */

/**
 * Vérifie si une URL d'image est un GIF animé
 */
export function isGif(imageUrl: string): boolean {
  return imageUrl?.toLowerCase().endsWith('.gif') || false
}

/**
 * Détermine si une image doit être non-optimisée (pour les GIFs)
 */
export function shouldUnoptimize(imageUrl: string): boolean {
  return isGif(imageUrl)
}

/**
 * Props pour les composants Image avec support GIF
 */
export interface ImageWithGifSupportProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  loading?: 'lazy' | 'eager'
  quality?: number
  priority?: boolean
}

/**
 * Génère les props optimales pour next/image en fonction du type d'image
 */
export function getImageProps(src: string, baseProps: ImageWithGifSupportProps) {
  return {
    ...baseProps,
    unoptimized: shouldUnoptimize(src),
  }
}
