"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function CategoryPerformance() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(analytics => {
        // Grouper les produits par catégorie (simulation)
        const topProducts = analytics.topProducts || []
        const categoryData = [
          { category: 'T-Shirts', sales: topProducts[0]?.sales || 0, revenue: (topProducts[0]?.sales || 0) * 50000 },
          { category: 'Jeans', sales: topProducts[1]?.sales || 0, revenue: (topProducts[1]?.sales || 0) * 120000 },
          { category: 'Chemises', sales: topProducts[2]?.sales || 0, revenue: (topProducts[2]?.sales || 0) * 80000 },
          { category: 'Vestes', sales: topProducts[3]?.sales || 0, revenue: (topProducts[3]?.sales || 0) * 150000 },
          { category: 'Accessoires', sales: topProducts[4]?.sales || 0, revenue: (topProducts[4]?.sales || 0) * 30000 },
        ]
        setData(categoryData)
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

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="font-bold text-lg">Performance par catégorie</h3>
        <p className="text-sm text-muted-foreground">Ventes et revenus par catégorie</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="category" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(value: number) => new Intl.NumberFormat('fr-GN').format(Math.round(value)) + ' GNF'}
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--accent))" name="Revenu" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
