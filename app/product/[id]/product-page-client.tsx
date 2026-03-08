'use client';

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, Star, Minus, Plus, ShoppingBag, Check, Truck, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { WishlistButton } from "@/components/wishlist-button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/products"

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number | null
  image: string
  images: string[]
  isNew?: boolean
  colors: Array<{ name: string; hex: string }>
  sizes: string[]
  description: string
  rating: number
  reviews: number
}

export function ProductPageClient({ product }: { product: Product }) {
  const { user } = useAuth()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [reviewRefresh, setReviewRefresh] = useState(0)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!selectedSize) return
    
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: product.colors[selectedColor].name,
    };
    
    // Add item multiple times for quantity
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <WishlistButton productId={product.id} size="lg" />
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative">
        <div className="aspect-square bg-secondary overflow-hidden">
          <Image
            src={product.images[currentImage]}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.isNew && (
            <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Nouveau
            </div>
          )}
          {product.originalPrice && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs font-bold">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}
        </div>
        
        {/* Image Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImage ? 'bg-foreground w-6' : 'bg-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-6 space-y-6">
        {/* Title & Price */}
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-accent">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
        </div>

        {/* Colors */}
        <div>
          <p className="text-sm font-medium mb-3">Couleur: <span className="text-muted-foreground">{product.colors[selectedColor].name}</span></p>
          <div className="flex gap-3">
            {product.colors.map((color, index) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(index)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === index ? 'border-accent scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Taille</p>
            <button className="text-sm text-accent">Guide des tailles</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] h-12 px-4 border rounded-lg font-medium transition-all ${
                  selectedSize === size
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="text-sm text-red-500 mt-2">Selectionnez une taille</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <p className="text-sm font-medium mb-3">Quantite</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-medium mb-2">Description</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
          <div className="flex flex-col items-center gap-2 text-center">
            <Truck className="w-6 h-6 text-accent" />
            <span className="text-xs text-muted-foreground">Livraison Guinee</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <RotateCcw className="w-6 h-6 text-accent" />
            <span className="text-xs text-muted-foreground">Retour 14 jours</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield className="w-6 h-6 text-accent" />
            <span className="text-xs text-muted-foreground">Paiement securise</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border">
        <Button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`w-full h-14 text-lg font-bold transition-all ${
            addedToCart ? 'bg-green-500 hover:bg-green-500' : ''
          }`}
        >
          {addedToCart ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Ajoute au panier
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 mr-2" />
              Ajouter au panier - {formatPrice(product.price * quantity)}
            </>
          )}
        </Button>
      </div>

      {/* Reviews Section */}
      <div className="px-4 py-8 space-y-6 border-t border-border">
        <h2 className="text-2xl font-bold">Avis clients</h2>
        
        {user ? (
          <ReviewForm
            productId={product.id}
            userId={user.id}
            onReviewSubmitted={() => setReviewRefresh(prev => prev + 1)}
          />
        ) : (
          <div className="p-4 bg-secondary rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Connectez-vous pour laisser un avis
            </p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Se connecter
              </Button>
            </Link>
          </div>
        )}

        <ReviewsList productId={product.id} refreshTrigger={reviewRefresh} />
      </div>

      <BottomNav />
    </div>
  )
}
