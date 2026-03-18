"use client"

import Link from "next/link"
import { Bell, Search, Plus, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { NotificationsPanel } from "@/components/2tact/notifications-panel"
import { StatsCards } from "@/components/2tact/stats-cards"
import { KeyMetrics } from "@/components/2tact/key-metrics"
import {
  LazyRevenueTrendChart,
  LazyOrderStatusDistribution,
  LazyCategoryPerformance,
  LazySalesChart,
  LazyTopProducts,
  LazyRecentOrders,
} from "@/components/2tact/lazy-dashboard-components"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pb-12">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Système en ligne</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">Gestion intelligente de GRANDSON CLOTHES</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar Professional */}
              <div className="relative hidden xl:block w-72 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  placeholder="Rechercher une commande..."
                  className="pl-12 bg-secondary/50 border-border/50 focus:bg-background transition-all rounded-2xl h-12"
                />
              </div>

              {/* Notifications & Actions */}
              <div className="flex items-center gap-3 bg-secondary/30 p-1.5 rounded-2xl border border-border/50">
                <NotificationsPanel />
                <div className="w-[1px] h-6 bg-border/50 mx-1" />
                <Link href="/2tact/products">
                  <Button className="rounded-xl h-10 px-5 gap-2 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4" />
                    <span className="font-bold">Nouveau</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Spacing */}
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
        {/* Top Tier: Key Metrics & Stats */}
        <section className="space-y-6">
          <KeyMetrics />
          <StatsCards />
        </section>

        {/* Middle Tier: Quick Actions with Better Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/2tact/products">
            <Card className="p-8 hover:shadow-2xl transition-all cursor-pointer border-border/40 bg-card/60 backdrop-blur-md hover:border-accent/40 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Inventaire</p>
                  <p className="text-2xl font-black mt-2">Produits</p>
                </div>
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                  <Plus className="w-7 h-7 text-accent" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/2tact/orders">
            <Card className="p-8 hover:shadow-2xl transition-all cursor-pointer border-border/40 bg-card/60 backdrop-blur-md hover:border-blue-500/40 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Logistique</p>
                  <p className="text-2xl font-black mt-2">Commandes</p>
                </div>
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                  <TrendingUp className="w-7 h-7 text-blue-500" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/2tact/customers">
            <Card className="p-8 hover:shadow-2xl transition-all cursor-pointer border-border/40 bg-card/60 backdrop-blur-md hover:border-green-500/40 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-green-500/10 transition-colors" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Base de données</p>
                  <p className="text-2xl font-black mt-2">Clients</p>
                </div>
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                  <Users className="w-7 h-7 text-green-500" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Charts Tier: Modern Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LazyRevenueTrendChart />
          <LazyOrderStatusDistribution />
        </div>

        {/* Bottom Tier: Detailed Tables & Peformance */}
        <div className="space-y-8">
          <LazyCategoryPerformance />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LazySalesChart />
            <LazyTopProducts />
          </div>
          <Card className="border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-black text-xl tracking-tight">Commandes Récentes</h3>
              <Link href="/2tact/orders">
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider hover:bg-secondary">Voir tout</Button>
              </Link>
            </div>
            <LazyRecentOrders />
          </Card>
        </div>
      </div>
    </div>
  )
}
