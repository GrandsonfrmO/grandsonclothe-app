"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, TrendingDown, Activity } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  revenueByDay: Array<{ date: string; revenue: number }>
  ordersByStatus: Array<{ status: string; count: number }>
  topProducts: Array<{ name: string; sales: number }>
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7days")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 lg:p-8">
        <div className="text-center py-12">Chargement des statistiques...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 lg:p-8">
        <div className="text-center py-12 text-muted-foreground">Erreur lors du chargement</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-4 lg:p-8">
          <PageHeader
            title="Statistiques"
            description="Analyse complète de vos performances"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {/* Filtre de période */}
        <div className="mb-6">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenu total</p>
                <p className="text-2xl font-bold mt-2">{stats.totalRevenue.toFixed(0)} GNF</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+8.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold mt-2">{stats.totalCustomers}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+15.3%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Panier moyen</p>
                <p className="text-2xl font-bold mt-2">{stats.averageOrderValue.toFixed(0)} GNF</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-500">-2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Évolution du revenu</h3>
              <Badge variant="outline" className="text-xs">
                {timeRange === "7days" ? "7 jours" : timeRange === "30days" ? "30 jours" : "90 jours"}
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.revenueByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(0)} GNF`, "Revenu"]}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString("fr-FR")
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Orders by Status */}
          <Card className="p-6 border-border">
            <h3 className="font-bold mb-4">Répartition des commandes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count, percent }) => 
                    `${STATUS_LABELS[name] || name}: ${count} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value} commandes`,
                    STATUS_LABELS[props.payload.status] || props.payload.status
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {stats.ordersByStatus.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{STATUS_LABELS[item.status] || item.status}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Produits les plus vendus</h3>
            <Badge variant="outline" className="text-xs">
              <Package className="w-3 h-3 mr-1" />
              Top {stats.topProducts.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => {
              const maxSales = Math.max(...stats.topProducts.map(p => p.sales))
              const percentage = (product.sales / maxSales) * 100
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">{product.name}</span>
                    </div>
                    <Badge variant="secondary" className="font-bold">
                      {product.sales} ventes
                    </Badge>
                  </div>
                  <div className="relative w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
