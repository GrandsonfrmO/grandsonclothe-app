"use client"

import Image from "next/image"
import { isGif } from "@/lib/image-utils"

interface GifImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  loading?: "lazy" | "eager"
  quality?: number
  priority?: boolean
  onLoad?: () => void
}

/**
 * Composant Image intelligent qui détecte automatiquement les GIFs
 * et applique les bonnes propriétés pour préserver l'animation
 */
export function GifImage({ src, alt, ...props }: GifImageProps) {
  const isAnimatedGif = isGif(src)

  return (
    <Image
      src={src}
      alt={alt}
      {...props}
      unoptimized={isAnimatedGif}
    />
  )
}
