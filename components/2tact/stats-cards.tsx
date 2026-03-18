"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, TrendingDown } from "lucide-react"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-secondary/50 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  const items = [
    {
      title: "Revenu total",
      value: `${stats.totalRevenue.toLocaleString()} GNF`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "blue",
    },
    {
      title: "Commandes",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      trend: "+8.2%",
      color: "green",
    },
    {
      title: "Clients",
      value: stats.totalCustomers.toString(),
      icon: Users,
      trend: "+15.3%",
      color: "purple",
    },
    {
      title: "Panier moyen",
      value: `${stats.averageOrderValue.toLocaleString()} GNF`,
      icon: Activity,
      trend: "-2.1%",
      color: "orange",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((stat, i) => (
        <Card key={i} className="p-6 border-border hover:shadow-lg transition-all group overflow-hidden relative">
          <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors`} />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <p className="text-2xl font-bold mt-2 tracking-tight">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-3 h-3 ${stat.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`} />
                <span className={`text-xs font-semibold ${stat.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{stat.trend}</span>
              </div>
            </div>
            <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
