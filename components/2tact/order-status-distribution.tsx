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
    <Card className="p-6 border-border h-full">
      <h3 className="font-bold mb-6 text-lg">Répartition des Commandes</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
