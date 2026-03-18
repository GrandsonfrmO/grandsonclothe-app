"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { formatPrice } from "@/lib/format-price"

const statusConfig = {
  pending: { label: "En attente", class: "bg-yellow-500/10 text-yellow-500" },
  processing: { label: "Traitement", class: "bg-blue-500/10 text-blue-500" },
  shipped: { label: "Expedie", class: "bg-purple-500/10 text-purple-500" },
  delivered: { label: "Livre", class: "bg-green-500/10 text-green-500" },
  cancelled: { label: "Annule", class: "bg-red-500/10 text-red-500" },
}

export function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        // Trier par date décroissante et prendre les 5 dernières
        const sortedOrders = (Array.isArray(data) ? data : [])
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);
        setOrders(sortedOrders)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur lors du chargement des commandes:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">Commandes Recentes</h3>
          <p className="text-sm text-muted-foreground">Les 5 dernieres commandes</p>
        </div>
        <div className="p-8 text-center text-muted-foreground">
          Chargement...
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">Commandes Recentes</h3>
          <p className="text-sm text-muted-foreground">Les 5 dernieres commandes</p>
        </div>
        <div className="p-8 text-center text-muted-foreground">
          <p>Aucune commande pour le moment.</p>
          <p className="text-sm mt-2">Les commandes apparaîtront ici.</p>
        </div>
      </div>
    )
  }

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
              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">
                    {order.guestName || order.user?.name || 'Client'}
                  </p>
                  <span className="text-xs text-muted-foreground">#{order.id}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {order.guestEmail || order.user?.email || ''}
                </p>
              </div>

              {/* Status & Price */}
              <div className="text-right shrink-0">
                <p className="font-semibold">{formatPrice(parseFloat(order.totalAmount))}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status as keyof typeof statusConfig]?.class || 'bg-secondary'}`}>
                  {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
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
