"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ProductCard } from "./product-card"

const products = [
  {
    id: 1,
    name: "Hoodie Oversize Noir",
    price: 450000,
    originalPrice: null,
    image: "/images/product-hoodie-black.jpg",
    category: "Hoodies",
    isNew: true,
  },
  {
    id: 2,
    name: "T-Shirt Graphic",
    price: 180000,
    originalPrice: 220000,
    image: "/images/product-tshirt-graphic.jpg",
    category: "T-Shirts",
    isNew: false,
  },
  {
    id: 3,
    name: "Cargo Pants",
    price: 380000,
    originalPrice: null,
    image: "/images/product-cargo.jpg",
    category: "Pantalons",
    isNew: true,
  },
  {
    id: 4,
    name: "Bomber Jacket",
    price: 520000,
    originalPrice: 650000,
    image: "/images/product-bomber.jpg",
    category: "Vestes",
    isNew: false,
  },
]

interface FeaturedProductsProps {
  title: string
  showAll?: boolean
}

function ProductsGrid({ products }: { products: typeof products }) {
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

export function FeaturedProducts({ title, showAll = true }: FeaturedProductsProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {showAll && (
          <Link
            href="/explorer"
            className="flex items-center gap-1 text-sm text-accent hover:underline"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <Suspense fallback={<div className="px-4 py-8 text-center text-muted-foreground">Chargement...</div>}>
        <ProductsGrid products={products} />
      </Suspense>
    </section>
  )
}
