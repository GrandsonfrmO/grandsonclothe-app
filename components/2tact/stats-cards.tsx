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
      color: "#3B82F6", // Blue
      bg: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Commandes",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      trend: "+8.2%",
      color: "#10B981", // Green
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Clients",
      value: stats.totalCustomers.toString(),
      icon: Users,
      trend: "+15.3%",
      color: "#8B5CF6", // Purple
      bg: "rgba(139, 92, 246, 0.1)",
    },
    {
      title: "Panier moyen",
      value: `${stats.averageOrderValue.toLocaleString()} GNF`,
      icon: Activity,
      trend: "-2.1%",
      color: "#F59E0B", // Orange
      bg: "rgba(245, 158, 11, 0.1)",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((stat, i) => (
        <Card key={i} className="p-6 border-border/40 bg-card/40 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden relative border-l-4" style={{ borderLeftColor: stat.color }}>
          <div className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: stat.color }} />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-3">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.title}</p>
              <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${stat.trend.startsWith("+") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {stat.trend.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">vs mois dernier</span>
              </div>
            </div>
            
            <div className="p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg" style={{ backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
