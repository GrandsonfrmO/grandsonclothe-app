"use client"

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

const stats = [
  {
    title: "Revenus Total",
    value: "45,250,000",
    unit: "GNF",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Commandes",
    value: "156",
    unit: "",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Clients",
    value: "1,284",
    unit: "",
    change: "+24.1%",
    trend: "up",
    icon: Users,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Produits",
    value: "48",
    unit: "",
    change: "-2.4%",
    trend: "down",
    icon: Package,
    color: "bg-orange-500/10 text-orange-500",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-card border border-border rounded-2xl p-5 hover:border-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {stat.change}
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
