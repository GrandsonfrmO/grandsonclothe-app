import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Composant d'image optimisé avec :
 * - Lazy loading par défaut
 * - Blur placeholder
 * - Gestion d'erreur
 * - Optimisation automatique
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fill = false,
  sizes,
  quality = 85,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Image de fallback en cas d'erreur
  const fallbackSrc = 'https://via.placeholder.com/400x400?text=Image+non+disponible';

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground text-sm">Image non disponible</p>
      </div>
    );
  }

  const imageProps = {
    src: src || fallbackSrc,
    alt,
    quality,
    className: `${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`,
    onLoadingComplete: () => setIsLoading(false),
    onError: () => {
      setHasError(true);
      setIsLoading(false);
    },
    priority,
    loading: priority ? undefined : ('lazy' as const),
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg==',
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 400}
      sizes={sizes}
    />
  );
}

/**
 * Composant pour les images de produits avec tailles optimisées
 */
export function ProductImage({
  src,
  alt,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={400}
      priority={priority}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
      quality={85}
    />
  );
}

/**
 * Composant pour les images hero avec priorité
 */
export function HeroImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      className={className}
      sizes="100vw"
      quality={90}
    />
  );
}

/**
 * Composant pour les thumbnails avec lazy loading agressif
 */
export function ThumbnailImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={128}
      height={128}
      className={className}
      sizes="128px"
      quality={75}
    />
  );
}
