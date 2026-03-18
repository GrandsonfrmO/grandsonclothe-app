"use client"

import Link from "next/link"
import { Bell, Search, Plus, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { StatsCards } from "@/components/2tact/stats-cards"
import { SalesChart } from "@/components/2tact/sales-chart"
import { RecentOrders } from "@/components/2tact/recent-orders"
import { TopProducts } from "@/components/2tact/top-products"
import { KeyMetrics } from "@/components/2tact/key-metrics"
import { RevenueTrendChart } from "@/components/2tact/revenue-trend-chart"
import { OrderStatusDistribution } from "@/components/2tact/order-status-distribution"
import { CategoryPerformance } from "@/components/2tact/category-performance"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Bienvenue sur GRANDSON CLOTHES Admin</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 bg-secondary border-border"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Add Product */}
              <Link href="/2tact/products">
                <Button className="gap-2 bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nouveau produit</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        {/* Key Metrics */}
        <div className="mb-8">
          <KeyMetrics />
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/2tact/products">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-border hover:border-accent/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gérer les produits</p>
                  <p className="text-2xl font-bold mt-2">Produits</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/2tact/orders">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-border hover:border-accent/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Voir les commandes</p>
                  <p className="text-2xl font-bold mt-2">Commandes</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/2tact/customers">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-border hover:border-accent/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gérer les clients</p>
                  <p className="text-2xl font-bold mt-2">Clients</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Advanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueTrendChart />
          <OrderStatusDistribution />
        </div>

        {/* Category Performance */}
        <div className="mb-8">
          <CategoryPerformance />
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesChart />
          <TopProducts />
        </div>

        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </div>
  )
}
