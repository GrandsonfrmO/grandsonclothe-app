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
        "group block relative transition-all duration-500",
        size === "large" ? "min-w-[280px]" : "min-w-[180px]",
        isOutOfStock && "pointer-events-none opacity-40 grayscale"
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[2.5rem] bg-secondary/5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-xl group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-border/20 group-hover:border-accent/30",
          size === "large" ? "aspect-[3/4.5]" : "aspect-square",
          isPressed && !isOutOfStock && "scale-[0.96]"
        )}
      >
        <GifImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Overlay premium */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-6">
           <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
              <p className="text-[8px] font-black text-accent uppercase tracking-[0.3em] mb-1">{product.category}</p>
              <h4 className="text-white text-lg font-black tracking-tighter italic uppercase leading-tight line-clamp-1">{product.name}</h4>
           </div>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center p-6 text-center">
            <div className="space-y-2">
              <p className="text-foreground font-black text-[10px] uppercase tracking-[0.2em] italic">Sold Out</p>
            </div>
          </div>
        )}

        {/* Badges Premium */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {product.isNew && !isOutOfStock && (
            <span className="px-4 py-1.5 bg-accent/90 backdrop-blur-md text-white text-[8px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg">
              New Drop
            </span>
          )}
          {discount && !isOutOfStock && (
            <span className="px-3 py-1 bg-white text-black text-[9px] font-black rounded-full shadow-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite button */}
        {!isOutOfStock && (
          <div className="absolute top-5 right-5">
            <WishlistButton productId={product.id} size="md" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:text-white" />
          </div>
        )}
      </div>

      {/* Product info footer */}
      <div className="mt-5 px-2 space-y-1.5 group-hover:translate-x-1 transition-transform duration-500">
        <h4 className="font-black text-sm uppercase tracking-tighter italic group-hover:text-accent transition-colors truncate">{product.name}</h4>
        <div className="flex items-baseline gap-2">
          <span className="font-black text-lg tracking-tighter">
            {product.price.toLocaleString()} <span className="text-[10px] text-muted-foreground font-bold">GNF</span>
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground/40 line-through font-medium tracking-tighter">
              {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
