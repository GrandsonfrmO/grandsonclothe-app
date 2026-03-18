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
    <section className="py-2 md:py-4">
      <div className="flex items-center justify-between px-6 md:px-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-accent rounded-full" />
          <h3 className="text-lg md:text-xl font-black italic tracking-tighter uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h3>
        </div>
        {showAll && (
          <Link
            href={`/explorer?sort=${sortBy}`}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent/60 hover:text-accent transition-colors"
          >
            Voir tout
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto px-6 md:px-8 pb-4 scrollbar-hide">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductsGrid products={products} />
      )}
    </section>
  )
}
