"use client"

import { ProductCard } from "./product-card"
import Link from "next/link"
import { ChevronRight, Star } from "lucide-react"
import { useEffect, useState } from "react"

function TopRatedGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-muted-foreground">
        <p>Aucun produit noté pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export function TopRatedSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?sort=top-rated&limit=4')
      .then(res => res.json())
      .then(response => {
        setProducts(response.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur lors du chargement des produits:', err)
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <h3 className="text-xl font-bold">Mieux Notés</h3>
          </div>
          <p className="text-sm text-muted-foreground">Les favoris de nos clients</p>
        </div>
        <Link
          href="/explorer?sort=top-rated"
          className="flex items-center gap-1 text-sm text-accent"
        >
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="px-4 py-8 text-center text-muted-foreground">Chargement...</div>
      ) : (
        <TopRatedGrid products={products} />
      )}
    </section>
  )
}
