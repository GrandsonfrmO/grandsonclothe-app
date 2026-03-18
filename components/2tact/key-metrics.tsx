"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown, TrendingUp, Clock, AlertCircle, CheckCircle } from "lucide-react"

export function KeyMetrics() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(analytics => {
        const ordersByStatus = analytics.ordersByStatus || []
        const pending = ordersByStatus.find((s: any) => s.status === 'pending')?.count || 0
        const delivered = ordersByStatus.find((s: any) => s.status === 'delivered')?.count || 0
        
        setMetrics({
          conversionRate: analytics.totalOrders > 0 ? ((delivered / analytics.totalOrders) * 100).toFixed(1) : 0,
          avgOrderValue: analytics.averageOrderValue,
          pendingOrders: pending,
          completionRate: analytics.totalOrders > 0 ? ((delivered / analytics.totalOrders) * 100).toFixed(1) : 0,
        })
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    )
  }

  const metricCards = [
    {
      title: "Taux de conversion",
      value: `${metrics?.conversionRate}%`,
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-500",
      trend: "+2.5%",
      trendUp: true,
    },
    {
      title: "Panier moyen",
      value: new Intl.NumberFormat('fr-GN').format(Math.round(metrics?.avgOrderValue || 0)),
      unit: "GNF",
      icon: CheckCircle,
      color: "bg-green-500/10 text-green-500",
      trend: "+5.2%",
      trendUp: true,
    },
    {
      title: "Commandes en attente",
      value: metrics?.pendingOrders,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-500",
      trend: "-1",
      trendUp: false,
    },
    {
      title: "Taux de complétion",
      value: `${metrics?.completionRate}%`,
      icon: CheckCircle,
      color: "bg-purple-500/10 text-purple-500",
      trend: "+3.1%",
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => (
        <div key={card.title} className="bg-card border border-border rounded-2xl p-4 hover:border-accent/50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold ${card.trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {card.trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {card.trend}
            </div>
          </div>
          <p className="text-2xl font-bold">
            {card.value}
            {card.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{card.unit}</span>}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
        </div>
      ))}
    </div>
  )
}
