"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface TopProduct {
  name: string
  sales: number
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(json => {
        setProducts(json.topProducts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-64 bg-secondary/10 animate-pulse rounded-xl" />

  return (
    <Card className="p-6 border-border h-full">
      <h3 className="font-bold mb-6 text-lg flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-accent" />
        Produits les plus vendus
      </h3>
      <div className="space-y-4">
        {products.map((product, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent">
                {i + 1}
              </div>
              <p className="text-sm font-medium">{product.name}</p>
            </div>
            <Badge variant="secondary" className="font-bold">
              {product.sales} ventes
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
