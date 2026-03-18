"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SalesData {
  date: string
  revenue: number
}

export function SalesChart() {
  const [data, setData] = useState<SalesData[]>([])
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
      <h3 className="font-bold mb-6 text-lg">Ventes Quotidiennes</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.2 0 0 / 0.1)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="oklch(0.65 0.2 145)" 
              strokeWidth={4} 
              dot={{ r: 4, fill: "oklch(0.65 0.2 145)", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
