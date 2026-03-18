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
    <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -mr-16 -mt-16 rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-xl tracking-tight">Flux de Revenus</h3>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">7 derniers jours</p>
          </div>
          <div className="px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
            <span className="text-xs font-bold text-accent">+12.5%</span>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="oklch(0.2 0 0 / 0.05)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => new Date(val).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
                tick={{ fill: 'currentColor', opacity: 0.5 }}
              />
              <YAxis 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                tick={{ fill: 'currentColor', opacity: 0.5 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{new Date(label).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <p className="text-sm font-black text-accent">{payload[0].value?.toLocaleString()} GNF</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorRev)" 
                strokeWidth={4}
                animationDuration={2000}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
