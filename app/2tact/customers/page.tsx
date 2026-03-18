"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Eye, Users, DollarSign, TrendingUp, ShoppingBag, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/2tact/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: number
  email: string
  name: string
  createdAt: string
  orderCount?: number
  totalSpent?: string
}

interface Order {
  id: number
  status: string
  totalAmount: string
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 12

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers")
      
      if (!res.ok) {
        console.error("API error:", res.status)
        setCustomers([])
        return
      }
      
      const contentType = res.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        console.error("Invalid content type:", contentType)
        setCustomers([])
        return
      }
      
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setCustomers(data)
      } else {
        console.error("Invalid data format:", data)
        setCustomers([])
      }
    } catch (error) {
      console.error("Error:", error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerOrders = async (customerId: number) => {
    try {
      const res = await fetch(`/api/customers/${customerId}/orders`)
      const data = await res.json()
      setCustomerOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error:", error)
      setCustomerOrders([])
    }
  }

  const filteredCustomers = useMemo(() => customers
    .filter(customer =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "orders":
          return (b.orderCount || 0) - (a.orderCount || 0)
        case "spent":
          return parseFloat(b.totalSpent || "0") - parseFloat(a.totalSpent || "0")
        default:
          return 0
      }
    }), [customers, searchTerm, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage)
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * customersPerPage
    return filteredCustomers.slice(startIndex, startIndex + customersPerPage)
  }, [filteredCustomers, currentPage, customersPerPage])

  // Statistiques - Mémorisées
  const stats = useMemo(() => {
    const totalCustomers = customers.length
    const totalRevenue = customers.reduce((sum, c) => sum + parseFloat(c.totalSpent || "0"), 0)
    const avgOrdersPerCustomer = totalCustomers > 0 
      ? customers.reduce((sum, c) => sum + (c.orderCount || 0), 0) / totalCustomers 
      : 0
    const topCustomers = [...customers]
      .sort((a, b) => parseFloat(b.totalSpent || "0") - parseFloat(a.totalSpent || "0"))
      .slice(0, 5)
    
    return { totalCustomers, totalRevenue, avgOrdersPerCustomer, topCustomers }
  }, [customers])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-4 lg:p-8">
          <PageHeader
            title="Gestion des Clients"
            description="Consultez et gérez vos clients"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Clients</p>
                <p className="text-lg sm:text-xl font-bold">{stats.totalCustomers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenu Total</p>
                <p className="text-sm sm:text-base font-bold">{stats.totalRevenue.toFixed(0)} GNF</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Moy. Commandes</p>
                <p className="text-lg sm:text-xl font-bold">{stats.avgOrdersPerCustomer.toFixed(1)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Top Client</p>
                <p className="text-sm font-bold truncate">
                  {stats.topCustomers[0]?.totalSpent || "0"} GNF
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="text-sm">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="orders">Plus de commandes</SelectItem>
              <SelectItem value="spent">Plus dépensé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Customers Grid */}
        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucun client trouvé
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCustomers.map((customer) => (
              <Card key={customer.id} className="p-6 hover:shadow-lg transition-all border-border">
                <div className="mb-4">
                  <h3 className="font-bold text-lg">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Commandes</span>
                    <Badge variant="secondary" className="font-bold">
                      {customer.orderCount || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total dépensé</span>
                    <span className="font-bold text-green-600">
                      {parseFloat(customer.totalSpent || "0").toFixed(0)} GNF
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Panier moyen</span>
                    <span className="text-sm font-medium">
                      {customer.orderCount && customer.orderCount > 0
                        ? (parseFloat(customer.totalSpent || "0") / customer.orderCount).toFixed(0)
                        : "0"} GNF
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Inscrit le</span>
                    <span className="text-sm">
                      {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full gap-2"
                      onClick={() => fetchCustomerOrders(customer.id)}
                    >
                      <Eye className="w-4 h-4" />
                      Voir les commandes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Commandes de {customer.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      {customerOrders.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          Aucune commande
                        </p>
                      ) : (
                        customerOrders.map((order) => (
                          <div
                            key={order.id}
                            className="p-3 bg-secondary rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Commande #{order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{order.totalAmount} GNF</p>
                                <Badge variant="outline">{order.status}</Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1
                    if (totalPages > 5) {
                      if (currentPage > 3) page = currentPage - 2 + i
                      if (currentPage > totalPages - 2) page = totalPages - 4 + i
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
