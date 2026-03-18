"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#6366F1', '#EF4444']

interface StatusData {
  status: string
  count: number
}

export function OrderStatusDistribution() {
  const [data, setData] = useState<StatusData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(json => {
        setData(json.ordersByStatus || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-[300px] bg-secondary/10 animate-pulse rounded-xl" />

  return (
    <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl -ml-16 -mb-16 rounded-full" />
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="font-bold text-xl tracking-tight mb-8">Status des Commandes</h3>
        <div className="flex-1 min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="count"
                nameKey="status"
                strokeWidth={0}
                animationBegin={200}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-2xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{payload[0].name}</p>
                        <p className="text-sm font-black" style={{ color: payload[0].payload.fill }}>{payload[0].value} Commandes</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
