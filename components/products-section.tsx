"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  image: string
  category: string
  stock: number
}

interface ProductsSectionProps {
  onAddToCart?: (productId: number) => void
}

export function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 8)) // Afficher les 8 premiers produits
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur lors du chargement des produits:', err)
        setLoading(false)
      })
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('fr-GN', {
      style: 'decimal',
    }).format(numPrice) + ' GNF'
  }

  if (loading) {
    return (
      <section id="nouveautes" className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section id="nouveautes" className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Les nouveaux produits seront bientôt disponibles !</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="nouveautes" className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="text-accent font-medium tracking-[0.3em] mb-2 text-sm">DROP 2026</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl text-foreground">
              NOUVEAUTES
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              Les dernieres pieces de notre collection streetwear
            </p>
          </div>
          <Button variant="outline" className="mt-6 sm:mt-0 tracking-wider text-sm border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent">
            VOIR TOUT
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.stock > 0 && (
                    <span className="bg-accent text-accent-foreground text-xs uppercase tracking-wider px-2 py-1 font-bold">
                      EN STOCK
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs uppercase tracking-wider px-2 py-1 font-bold">
                      ÉPUISÉ
                    </span>
                  )}
                </div>

                {/* Favorite button */}
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(product.id)
                          ? "fill-accent text-accent"
                          : "text-foreground"
                      }`}
                    />
                    <span className="sr-only">Ajouter aux favoris</span>
                  </Button>
                </div>

                {/* Add to cart overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button 
                    className="w-full text-sm tracking-wider bg-foreground text-background hover:bg-accent hover:text-accent-foreground font-bold"
                    onClick={() => onAddToCart?.(product.id)}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    AJOUTER
                  </Button>
                </div>
              </div>

              {/* Product info */}
              <div>
                <p className="text-xs text-accent tracking-[0.2em] mb-1">
                  {product.category?.toUpperCase() || 'PRODUIT'}
                </p>
                <h3 className="font-medium text-foreground mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
