"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

export function StatsCards() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics').then(res => res.json()),
      fetch('/api/products').then(res => res.json()),
    ])
      .then(([analytics, productsResponse]) => {
        // Extract products count from paginated response
        const productsCount = productsResponse.data?.length || productsResponse.pagination?.total || 0;
        
        setStats({
          revenue: analytics.totalRevenue || 0,
          orders: analytics.totalOrders || 0,
          customers: analytics.totalCustomers || 0,
          products: productsCount,
        })
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur lors du chargement des stats:', err)
        setLoading(false)
      })
  }, [])

  const statsConfig = [
    {
      title: "Revenus Total",
      value: new Intl.NumberFormat('fr-GN').format(stats.revenue),
      unit: "GNF",
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Commandes",
      value: stats.orders.toString(),
      unit: "",
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Clients",
      value: stats.customers.toString(),
      unit: "",
      icon: Users,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Produits",
      value: stats.products.toString(),
      unit: "",
      icon: Package,
      color: "bg-orange-500/10 text-orange-500",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat) => (
        <div
          key={stat.title}
          className="bg-card border border-border rounded-2xl p-5 hover:border-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {stat.value}
            {stat.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
        </div>
      ))}
    </div>
  )
}
