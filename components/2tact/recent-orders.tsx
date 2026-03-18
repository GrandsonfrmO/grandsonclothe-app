"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

interface RecentOrder {
  id: number
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

export function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      setOrders(data.slice(0, 5))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="h-64 bg-secondary/20 animate-pulse rounded-2xl" />
  }

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-accent" />
          Commandes Récentes
        </h3>
        <Link href="/2tact/orders" className="text-sm text-accent hover:underline flex items-center gap-1 font-medium">
          Voir tout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Aucune commande récente</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs uppercase">
                  {order.customerName ? order.customerName.substring(0, 2) : "GC"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{order.customerName || "Invite"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{order.totalAmount.toLocaleString()} GNF</p>
                <Badge variant="outline" className="text-[10px] h-5 capitalize">
                  {order.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
