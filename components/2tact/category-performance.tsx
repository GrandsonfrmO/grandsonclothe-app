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
    <Card className="p-6 border-border">
      <h3 className="font-bold mb-6 text-lg">Performance par Catégorie</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.2 0 0 / 0.1)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip 
              cursor={{fill: 'oklch(0.2 0 0 / 0.05)'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
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
