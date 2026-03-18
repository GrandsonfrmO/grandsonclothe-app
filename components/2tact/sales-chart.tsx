"use client"

import { useEffect, useMemo, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function SalesChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(analytics => {
        // Convertir les données d'analytics en format pour le graphique
        const chartData = (analytics.revenueByDay || []).map((item: any) => ({
          name: new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
          revenue: item.revenue,
        }))
        setData(chartData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur lors du chargement des données:', err)
        setLoading(false)
      })
  }, [])

  const total = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.revenue, 0)
  }, [data])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">Ventes de la semaine</h3>
            <p className="text-sm text-muted-foreground">Performance des 7 derniers jours</p>
          </div>
        </div>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          Chargement...
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">Ventes de la semaine</h3>
            <p className="text-sm text-muted-foreground">Performance des 7 derniers jours</p>
          </div>
        </div>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          <p>Aucune donnée de vente disponible.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Ventes de la semaine</h3>
          <p className="text-sm text-muted-foreground">Performance des 7 derniers jours</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-GN').format(Math.round(total))}</p>
          <p className="text-sm text-muted-foreground">GNF Total</p>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [
                new Intl.NumberFormat('fr-GN').format(Math.round(value)) + ' GNF',
                'Revenus'
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
