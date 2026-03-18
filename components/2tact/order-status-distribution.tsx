"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = {
  pending: '#eab308',
  processing: '#3b82f6',
  shipped: '#a855f7',
  delivered: '#10b981',
  cancelled: '#ef4444',
}

export function OrderStatusDistribution() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(analytics => {
        const chartData = (analytics.ordersByStatus || [])
          .filter((item: any) => item.count > 0)
          .map((item: any) => ({
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: item.count,
            status: item.status,
          }))
        setData(chartData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chargement...
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Distribution des statuts</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Aucune donnée disponible
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="font-bold text-lg">Distribution des statuts</h3>
        <p className="text-sm text-muted-foreground">État des commandes en cours</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.status as keyof typeof COLORS] || '#666'}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value} commande${value > 1 ? 's' : ''}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[item.status as keyof typeof COLORS] }}
            />
            <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
