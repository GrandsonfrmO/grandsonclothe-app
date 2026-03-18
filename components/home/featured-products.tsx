"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"

interface FeaturedProductsProps {
  title: string
  showAll?: boolean
  sortBy?: 'recent' | 'popular' | 'top-rated' | 'random'
}

function ProductsGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-muted-foreground">
        <p>Aucun produit disponible pour le moment.</p>
        <p className="text-sm mt-2">Les nouveaux produits seront bientôt disponibles !</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory">
      {products.map((product) => (
        <div key={product.id} className="snap-start">
          <ProductCard product={product} size="large" />
        </div>
      ))}
    </div>
  )
}

export function FeaturedProducts({ title, showAll = true, sortBy = 'recent' }: FeaturedProductsProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products?sort=${sortBy}&limit=8`)
      .then(res => res.json())
      .then(response => {
        setProducts(response.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur lors du chargement des produits:', err)
        setLoading(false)
      })
  }, [sortBy])

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {showAll && (
          <Link
            href={`/explorer?sort=${sortBy}`}
            className="flex items-center gap-1 text-sm text-accent hover:underline"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="px-4 py-8 text-center text-muted-foreground">Chargement...</div>
      ) : (
        <ProductsGrid products={products} />
      )}
    </section>
  )
}
