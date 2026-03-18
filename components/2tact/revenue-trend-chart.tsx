"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueData {
  date: string
  revenue: number
}

export function RevenueTrendChart() {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(json => {
        setData(json.revenueByDay || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-[300px] bg-secondary/10 animate-pulse rounded-xl" />

  return (
    <Card className="p-6 border-border h-full">
      <h3 className="font-bold mb-6 text-lg">Évolution du Revenu</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.2 145)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="oklch(0.65 0.2 145)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.2 0 0 / 0.1)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => new Date(val).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(val: number) => [`${val.toLocaleString()} GNF`, "Revenu"]}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="oklch(0.65 0.2 145)" 
              fillOpacity={1} 
              fill="url(#colorRev)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
