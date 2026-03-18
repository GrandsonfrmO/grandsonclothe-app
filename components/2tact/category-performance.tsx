"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316']

export function CategoryPerformance() {
  const [data, setData] = useState([
    { name: 'T-Shirts', sales: 45 },
    { name: 'Hoodies', sales: 32 },
    { name: 'Pantalons', sales: 24 },
    { name: 'Casquettes', sales: 18 },
    { name: 'Accessoires', sales: 12 },
  ])

  return (
    <Card className="p-6 border-border/40 bg-card/50 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl -ml-16 -mt-16 rounded-full" />
      <h3 className="font-bold text-xl tracking-tight mb-8 relative z-10">Performance par Catégorie</h3>
      <div className="h-[320px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="oklch(0.2 0 0 / 0.05)" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              fontSize={12} 
              width={100}
              tick={{ fill: 'currentColor', opacity: 0.7 }}
            />
            <Tooltip 
              cursor={{fill: 'oklch(0.2 0 0 / 0.05)'}}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-2xl">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{payload[0].payload.name}</p>
                      <p className="text-sm font-black text-accent">{payload[0].value} Ventes</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="sales" radius={[0, 10, 10, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
