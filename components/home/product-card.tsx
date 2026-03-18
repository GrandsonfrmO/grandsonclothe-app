"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { formatPriceNumber } from "@/lib/format-price"
import { GifImage } from "@/components/gif-image"
import { WishlistButton } from "@/components/wishlist-button"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number | null
  image: string
  category: string
  isNew?: boolean
  stock?: number
}

interface ProductCardProps {
  product: Product
  size?: "default" | "large"
}

export function ProductCard({ product, size = "default" }: ProductCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const isOutOfStock = product.stock !== undefined && product.stock === 0

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <Link
      href={isOutOfStock ? "#" : `/produit/${product.id}`}
      className={cn(
        "group block relative",
        size === "large" ? "min-w-[200px]" : "min-w-[160px]",
        isOutOfStock && "pointer-events-none opacity-60"
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-card transition-transform duration-200",
          size === "large" ? "aspect-[3/4]" : "aspect-square",
          isPressed && !isOutOfStock && "scale-[0.98]"
        )}
      >
        <GifImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white font-bold text-sm">Stock épuisé</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && !isOutOfStock && (
            <span className="px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full uppercase">
              New
            </span>
          )}
          {discount && !isOutOfStock && (
            <span className="px-2 py-0.5 bg-destructive text-white text-[10px] font-bold rounded-full">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-destructive text-white text-[10px] font-bold rounded-full">
              Épuisé
            </span>
          )}
        </div>

        {/* Favorite button */}
        {!isOutOfStock && (
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product.id} size="md" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>
        <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
        <div className="flex items-center gap-2">
          <span className="font-bold">
            {formatPriceNumber(product.price)} GNF
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPriceNumber(product.originalPrice)} GNF
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
