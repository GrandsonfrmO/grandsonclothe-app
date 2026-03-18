"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar as BarComponent } from "recharts"
import { TrendingUp } from "lucide-react"

export function RevenueTrendChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trend, setTrend] = useState(0)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(analytics => {
        const chartData = (analytics.revenueByDay || []).map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' }),
          revenue: item.revenue,
          target: 2000000,
        }))
        setData(chartData)
        
        if (chartData.length >= 2) {
          const lastValue = chartData[chartData.length - 1].revenue
          const firstValue = chartData[0].revenue
          const trendPercent = ((lastValue - firstValue) / firstValue) * 100
          setTrend(trendPercent)
        }
        
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
        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
          Chargement...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Tendance des revenus</h3>
          <p className="text-sm text-muted-foreground">Comparaison avec la cible quotidienne</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value: number) => `${(value / 1000000).toFixed(0)}M`}
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
            <BarComponent dataKey="target" fill="hsl(var(--muted-foreground))" opacity={0.3} name="Cible" />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent))', r: 5 }}
              activeDot={{ r: 7 }}
              name="Revenu réel"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
