"use client"

import { ProductCard } from "./product-card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Suspense } from "react"

const trendingProducts = [
  {
    id: 5,
    name: "Hoodie Olive",
    price: 420000,
    originalPrice: null,
    image: "/images/product-hoodie-green.jpg",
    category: "Hoodies",
    isNew: true,
  },
  {
    id: 6,
    name: "Tech Joggers",
    price: 320000,
    originalPrice: 400000,
    image: "/images/product-joggers.jpg",
    category: "Pantalons",
    isNew: false,
  },
  {
    id: 7,
    name: "Snapback Cap",
    price: 120000,
    originalPrice: null,
    image: "/images/product-cap.jpg",
    category: "Accessoires",
    isNew: false,
  },
  {
    id: 8,
    name: "Bomber Classic",
    price: 480000,
    originalPrice: null,
    image: "/images/product-bomber.jpg",
    category: "Vestes",
    isNew: true,
  },
]

function TrendingGrid({ products }: { products: typeof trendingProducts }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export function TrendingSection() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h3 className="text-xl font-bold">Tendances</h3>
          <p className="text-sm text-muted-foreground">Les plus populaires</p>
        </div>
        <Link
          href="/explorer?sort=popular"
          className="flex items-center gap-1 text-sm text-accent"
        >
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <Suspense fallback={<div className="px-4 py-8 text-center text-muted-foreground">Chargement...</div>}>
        <TrendingGrid products={trendingProducts} />
      </Suspense>
    </section>
  )
}
