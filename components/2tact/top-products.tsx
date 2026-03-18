"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { formatPrice } from "@/lib/format-price"

export function TopProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Handle paginated response
        const productList = data.data || data;
        // Prendre les 4 premiers produits (à améliorer avec des stats de vente réelles)
        setProducts(productList.slice(0, 4))
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur lors du chargement des produits:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">Produits Populaires</h3>
          <p className="text-sm text-muted-foreground">Les plus vendus ce mois</p>
        </div>
        <div className="p-8 text-center text-muted-foreground">
          Chargement...
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">Produits Populaires</h3>
          <p className="text-sm text-muted-foreground">Les plus vendus ce mois</p>
        </div>
        <div className="p-8 text-center text-muted-foreground">
          <p>Aucun produit disponible.</p>
          <p className="text-sm mt-2">Ajoutez des produits pour commencer.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-lg">Produits Populaires</h3>
        <p className="text-sm text-muted-foreground">Les plus vendus ce mois</p>
      </div>

      <div className="p-4 space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-yellow-500/10 text-yellow-500' :
              index === 1 ? 'bg-gray-300/10 text-gray-400' :
              index === 2 ? 'bg-orange-500/10 text-orange-500' :
              'bg-secondary text-muted-foreground'
            }`}>
              {index + 1}
            </div>

            {/* Product Image */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
              <Image
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                Stock: {product.stock || 0}
              </p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-semibold">{formatPrice(parseFloat(product.price))}</p>
              <p className="text-xs text-muted-foreground">
                {product.category || 'Produit'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
