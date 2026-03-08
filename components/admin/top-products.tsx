"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/products"

const topProducts = [
  {
    id: 1,
    name: "Hoodie Oversize Noir",
    image: "/images/product-hoodie-black.jpg",
    sold: 124,
    revenue: 55800000,
    stock: 45,
  },
  {
    id: 2,
    name: "T-Shirt Graphic GRANDSON",
    image: "/images/product-tshirt-graphic.jpg",
    sold: 89,
    revenue: 16020000,
    stock: 120,
  },
  {
    id: 3,
    name: "Cargo Pants Tactical",
    image: "/images/product-cargo.jpg",
    sold: 67,
    revenue: 25460000,
    stock: 32,
  },
  {
    id: 4,
    name: "Casquette Snapback Logo",
    image: "/images/product-cap.jpg",
    sold: 203,
    revenue: 19285000,
    stock: 78,
  },
]

export function TopProducts() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-lg">Produits Populaires</h3>
        <p className="text-sm text-muted-foreground">Les plus vendus ce mois</p>
      </div>

      <div className="p-4 space-y-4">
        {topProducts.map((product, index) => (
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
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.sold} vendus
              </p>
            </div>

            {/* Revenue */}
            <div className="text-right">
              <p className="font-semibold">{formatPrice(product.revenue)}</p>
              <p className="text-xs text-muted-foreground">
                Stock: {product.stock}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
