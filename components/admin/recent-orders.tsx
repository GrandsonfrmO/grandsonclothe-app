"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/products"

const orders = [
  {
    id: "CMD-001",
    customer: "Mamadou Diallo",
    email: "mamadou@email.com",
    products: ["Hoodie Oversize Noir", "Casquette Snapback"],
    total: 545000,
    status: "delivered",
    date: "Il y a 2h",
    avatar: "/images/product-hoodie-black.jpg",
  },
  {
    id: "CMD-002",
    customer: "Fatoumata Barry",
    email: "fatoumata@email.com",
    products: ["T-Shirt Graphic GRANDSON"],
    total: 180000,
    status: "processing",
    date: "Il y a 4h",
    avatar: "/images/product-tshirt-graphic.jpg",
  },
  {
    id: "CMD-003",
    customer: "Ibrahima Sow",
    email: "ibrahima@email.com",
    products: ["Cargo Pants Tactical", "Bomber Jacket"],
    total: 900000,
    status: "shipped",
    date: "Il y a 6h",
    avatar: "/images/product-cargo.jpg",
  },
  {
    id: "CMD-004",
    customer: "Aissatou Camara",
    email: "aissatou@email.com",
    products: ["Joggers Tech Fleece"],
    total: 320000,
    status: "pending",
    date: "Il y a 8h",
    avatar: "/images/product-joggers.jpg",
  },
  {
    id: "CMD-005",
    customer: "Oumar Bah",
    email: "oumar@email.com",
    products: ["Hoodie Oversize Vert", "T-Shirt Basic"],
    total: 570000,
    status: "delivered",
    date: "Il y a 12h",
    avatar: "/images/product-hoodie-green.jpg",
  },
]

const statusConfig = {
  pending: { label: "En attente", class: "bg-yellow-500/10 text-yellow-500" },
  processing: { label: "Traitement", class: "bg-blue-500/10 text-blue-500" },
  shipped: { label: "Expedie", class: "bg-purple-500/10 text-purple-500" },
  delivered: { label: "Livre", class: "bg-green-500/10 text-green-500" },
}

export function RecentOrders() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-lg">Commandes Recentes</h3>
        <p className="text-sm text-muted-foreground">Les 5 dernieres commandes</p>
      </div>
      
      <div className="divide-y divide-border">
        {orders.map((order) => (
          <div key={order.id} className="p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-4">
              {/* Product Image */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                <Image
                  src={order.avatar}
                  alt={order.products[0]}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{order.customer}</p>
                  <span className="text-xs text-muted-foreground">{order.id}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {order.products.join(", ")}
                </p>
              </div>

              {/* Status & Price */}
              <div className="text-right shrink-0">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status as keyof typeof statusConfig].class}`}>
                  {statusConfig[order.status as keyof typeof statusConfig].label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-accent hover:underline">
          Voir toutes les commandes
        </button>
      </div>
    </div>
  )
}
