"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, TrendingDown, Activity } from "lucide-react"
import { PageHeader } from "@/components/2tact/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pb-20">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <PageHeader
            title="Vision Stratégique"
            description="Décryptez les tendances et optimisez votre empire commercial"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
        {/* Filtre de période High-End */}
        <div className="bg-card/40 backdrop-blur-xl p-3 sm:p-4 rounded-[2.5rem] border border-border/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 px-6">
             <Activity className="w-6 h-6 text-accent animate-pulse" />
             <h2 className="text-xl font-black italic tracking-tighter uppercase">Rapport de Performance</h2>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-14 bg-secondary/50 border-none rounded-2xl text-xs font-black uppercase tracking-[0.2em] min-w-[240px] shadow-inner">
                <SelectValue placeholder="Horizon Temporel" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
                <SelectItem value="7days">⚡ 7 Derniers Jours</SelectItem>
                <SelectItem value="30days">📅 30 Derniers Jours</SelectItem>
                <SelectItem value="90days">🏛️ 90 Derniers Jours</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" className="h-14 w-14 rounded-2xl p-0 shadow-lg hover:rotate-12 transition-transform">
               <TrendingUp className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Stats Royal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Revenu Impérial", value: `${stats.totalRevenue.toLocaleString()} GNF`, icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12.5%" },
            { label: "Volume d'Ordres", value: stats.totalOrders.toString(), icon: ShoppingCart, color: "text-green-500", bg: "bg-green-500/10", trend: "+8.2%" },
            { label: "Base Citoyenne", value: stats.totalCustomers.toString(), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+15.3%" },
            { label: "Panier de Luxe", value: `${stats.averageOrderValue.toLocaleString()} GNF`, icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10", trend: "-2.1%" },
          ].map((item, idx) => (
            <Card key={idx} className="group relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/40 hover:border-accent/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
              
              <div className="relative z-10 flex flex-col gap-6">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{item.label}</p>
                  <p className="text-3xl font-black italic tracking-tighter truncate">{item.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`border-none ${item.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} rounded-full px-3 py-1 text-[10px] font-black`}>
                    {item.trend}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">vs hier</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Visual Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart - Ultra Modern */}
          <Card className="lg:col-span-2 relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl rounded-[3rem] p-8 group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-2xl font-black italic tracking-tighter">Trajectoire Financière</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Évolution du flux de trésorerie</p>
               </div>
               <Badge className="bg-accent/10 text-accent border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">Temps Réel</Badge>
            </div>
            
            <div className="h-[400px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueByDay}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                       if (active && payload && payload.length) {
                          return (
                             <div className="bg-background/90 backdrop-blur-xl border border-border/40 p-4 rounded-2xl shadow-3xl">
                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{new Date(label).toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                <p className="text-xl font-black text-accent">{payload[0].value?.toLocaleString()} GNF</p>
                             </div>
                          )
                       }
                       return null
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Distribution Chart - High End */}
          <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl rounded-[3rem] p-8">
            <h3 className="text-2xl font-black italic tracking-tighter mb-8">Écosystème des Commandes</h3>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="count"
                    animationDuration={2000}
                  >
                    {stats.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                          return (
                             <div className="bg-background/90 backdrop-blur-xl border border-border/40 p-3 rounded-xl shadow-2xl">
                                <p className="text-xs font-black uppercase text-accent mb-1">{STATUS_LABELS[payload[0].payload.status] || payload[0].payload.status}</p>
                                <p className="text-lg font-black">{payload[0].value} UNITÉS</p>
                             </div>
                          )
                       }
                       return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 space-y-3">
              {stats.ordersByStatus.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between p-3 bg-secondary/10 rounded-2xl border border-border/20 group hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full shadow-lg" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{STATUS_LABELS[item.status] || item.status}</span>
                  </div>
                  <span className="text-sm font-black italic">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Best Sellers - Premium Rank */}
        <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl rounded-[3rem] p-10">
          <div className="flex items-center justify-between mb-12">
            <div>
               <h3 className="text-3xl font-black italic tracking-tighter">Panthéon des Produits</h3>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1">Le sommet de votre catalogue</p>
            </div>
            <div className="flex items-center gap-3 bg-accent/10 px-6 py-3 rounded-2xl border border-accent/20">
               <Package className="w-5 h-5 text-accent" />
               <span className="text-lg font-black italic">TOP {stats.topProducts.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {stats.topProducts.map((product, index) => {
              const maxSales = Math.max(...stats.topProducts.map(p => p.sales))
              const percentage = (product.sales / maxSales) * 100
              
              return (
                <div key={index} className="group p-6 bg-secondary/5 rounded-[2rem] border border-border/30 hover:border-accent/40 hover:bg-secondary/10 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center text-sm font-black italic shadow-xl group-hover:rotate-12 transition-transform">
                        #{index + 1}
                      </div>
                      <span className="text-lg font-black italic tracking-tight truncate max-w-[180px]">{product.name}</span>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">VENTES</p>
                       <Badge variant="secondary" className="bg-accent/10 text-accent border-none rounded-lg font-black text-sm px-3">
                         {product.sales}
                       </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                     <div className="relative w-full bg-secondary/30 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent via-accent/60 to-accent transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${percentage}%` }}
                        />
                     </div>
                     <div className="flex justify-between text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">
                        <span>Pénétration Marché</span>
                        <span>{percentage.toFixed(0)}%</span>
                     </div>
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
