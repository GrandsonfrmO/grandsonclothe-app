"use client"

import { Card } from "@/components/ui/card"
import { Activity, Zap, Shield, Globe } from "lucide-react"

export function KeyMetrics() {
  const metrics = [
    { label: "Performance", value: "98%", icon: Zap, color: "yellow" },
    { label: "Uptime", value: "99.9%", icon: Activity, color: "green" },
    { label: "Security", value: "Locked", icon: Shield, color: "blue" },
    { label: "Reach", value: "Global", icon: Globe, color: "purple" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <Card key={i} className="p-4 border-border/50 bg-secondary/20 flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${metric.color}-500/10`}>
            <metric.icon className={`w-4 h-4 text-${metric.color}-500`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
            <p className="text-sm font-bold">{metric.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
