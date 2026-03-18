'use client';

import { useState, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, Star, Minus, Plus, ShoppingBag, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { WishlistButton } from "@/components/wishlist-button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/format-price"
import { SchemaScript } from "@/components/schema-script"
import { generateProductSchema } from "@/lib/schema"

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
  stock: number
}

export function ProductPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  
  // Charger le produit depuis l'API
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          // Transformer les données de la DB en format Product
          const transformedProduct: Product = {
            id: data.id,
            name: data.name,
            category: data.category,
            price: parseFloat(data.price),
            originalPrice: null,
            image: data.image || '/placeholder.jpg',
            images: [data.image || '/placeholder.jpg'],
            isNew: false,
            colors: data.colors ? JSON.parse(data.colors) : [{ name: 'Noir', hex: '#000000' }],
            sizes: data.sizes ? JSON.parse(data.sizes) : ['M', 'L', 'XL'],
            description: data.description || 'Produit de qualité',
            rating: 4.5,
            reviews: 0,
            stock: data.stock || 0
          }
          setProduct(transformedProduct)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [reviewRefresh, setReviewRefresh] = useState(0)
  const { addItem } = useCart()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Produit non trouvé</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    rating: product.rating,
    reviews: product.reviews,
    category: product.category,
  })

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
    
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <>
      <SchemaScript schema={productSchema} />
      <div className="min-h-screen bg-background pb-32 sm:pb-36">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
            <Link href="/" className="p-2 -ml-2 hover:bg-secondary/80 rounded-full transition-all hover:scale-105">
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <WishlistButton productId={product.id} size="md" />
              <button className="p-2 hover:bg-secondary/80 rounded-full transition-all hover:scale-105">
                <Share2 className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="relative max-w-7xl mx-auto">
          <div className="aspect-square bg-gradient-to-br from-secondary/50 to-secondary overflow-hidden relative">
            <Image
              src={product.images[currentImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              unoptimized={product.images[currentImage]?.endsWith('.gif')}
              priority
            />
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                Nouveau
              </div>
            )}
            {product.originalPrice && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 text-xs font-bold rounded-full shadow-lg">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-2">
                  <AlertCircle className="w-12 h-12 text-white mx-auto" />
                  <p className="text-white font-bold text-xl">Stock épuisé</p>
                  <p className="text-white/80 text-sm">Ce produit n'est plus disponible</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Image Dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-3 py-2 rounded-full">
              {product.images.map((img, index) => (
                <button
                  key={`image-dot-${product.id}-${index}-${img}`}
                  onClick={() => setCurrentImage(index)}
                  className={`transition-all rounded-full ${
                    index === currentImage 
                      ? 'bg-white w-8 h-2' 
                      : 'bg-white/50 w-2 h-2 hover:bg-white/70'
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
          {/* Title & Price */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-medium">{product.category}</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg sm:text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {/* Stock indicator */}
            <div className="flex items-center gap-2 pt-2">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {product.stock} {product.stock === 1 ? 'article' : 'articles'} en stock
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-semibold">Stock épuisé</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 flex-wrap p-4 bg-secondary/50 rounded-xl border border-border/50">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i: number) => (
                <Star
                  key={`star-${product.id}-${i}`}
                  className={`w-4 sm:w-5 h-4 sm:h-5 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm sm:text-base font-bold">{product.rating}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">({product.reviews} avis)</span>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base font-semibold">
              Couleur: <span className="text-muted-foreground font-normal">{product.colors[selectedColor].name}</span>
            </p>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color: any, index: number) => (
                <button
                  key={`color-${product.id}-${index}-${color.name}`}
                  onClick={() => setSelectedColor(index)}
                  className={`relative w-12 sm:w-14 h-12 sm:h-14 rounded-xl transition-all hover:scale-110 ${
                    selectedColor === index 
                      ? 'ring-4 ring-accent ring-offset-2 ring-offset-background scale-110' 
                      : 'ring-2 ring-border hover:ring-accent/50'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                >
                  {selectedColor === index && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm sm:text-base font-semibold">Taille</p>
              <button className="text-xs sm:text-sm text-accent hover:underline font-medium">
                Guide des tailles
              </button>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {product.sizes.map((size: string, index: number) => (
                <button
                  key={`size-${product.id}-${index}-${size}`}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] sm:min-w-[56px] h-12 sm:h-14 px-4 sm:px-5 border-2 rounded-xl text-sm sm:text-base font-semibold transition-all hover:scale-105 ${
                    selectedSize === size
                      ? 'bg-foreground text-background border-foreground shadow-lg'
                      : 'border-border hover:border-foreground/50 hover:bg-secondary/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Veuillez sélectionner une taille</span>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base font-semibold">Quantité</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 sm:w-14 h-12 sm:h-14 border-2 border-border rounded-xl flex items-center justify-center hover:bg-secondary hover:border-foreground/50 transition-all hover:scale-105 active:scale-95"
              >
                <Minus className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
              <span className="text-2xl sm:text-3xl font-bold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 sm:w-14 h-12 sm:h-14 border-2 border-border rounded-xl flex items-center justify-center hover:bg-secondary hover:border-foreground/50 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 p-4 sm:p-6 bg-secondary/30 rounded-xl border border-border/50">
            <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full"></span>
              Description
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Add to Cart Button - Fixed at bottom, above BottomNav */}
        <div className="fixed bottom-16 sm:bottom-20 left-0 right-0 p-3 sm:p-4 bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize || product.stock === 0}
              className={`w-full h-12 sm:h-14 text-sm sm:text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-xl ${
                addedToCart 
                  ? 'bg-green-500 hover:bg-green-500 scale-[0.98]' 
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {product.stock === 0 ? (
                <>
                  <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Stock épuisé
                </>
              ) : addedToCart ? (
                <>
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Ajouter au panier - {formatPrice(product.price * quantity)}</span>
                  <span className="sm:hidden">Ajouter - {formatPrice(product.price * quantity)}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8 border-t border-border/50 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-accent rounded-full"></span>
            Avis clients
          </h2>
          
          {user ? (
            <ReviewForm
              productId={product.id}
              userId={user.id}
              onReviewSubmitted={() => setReviewRefresh(prev => prev + 1)}
            />
          ) : (
            <div className="p-6 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-xl border border-border/50 text-center">
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Connectez-vous pour laisser un avis sur ce produit
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full sm:w-auto px-8 h-12 rounded-xl font-semibold hover:scale-105 transition-transform">
                  Se connecter
                </Button>
              </Link>
            </div>
          )}

          <ReviewsList productId={product.id} refreshTrigger={reviewRefresh} />
        </div>

        <BottomNav />
      </div>
    </>
  )
}
