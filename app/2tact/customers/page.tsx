"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Eye, Users, DollarSign, TrendingUp, ShoppingBag, Filter, User, Calendar, Mail, MapPin, ArrowRight, Loader2, UserCheck, UserMinus, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/2tact/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Customer {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  orderCount?: number
  totalSpent?: string
  isGuest?: boolean
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
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 12

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/customers")
      
      if (!res.ok) {
        toast.error("Échec de la lecture de la base d'adhérents.")
        return
      }
      
      const data = await res.json()
      if (Array.isArray(data)) {
        setCustomers(data)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Relais serveur défaillant.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerOrders = async (customerId: string) => {
    try {
      setOrdersLoading(true)
      const res = await fetch(`/api/customers/${customerId}/orders`)
      const data = await res.json()
      setCustomerOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error:", error)
      setCustomerOrders([])
    } finally {
      setOrdersLoading(false)
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
  }, [filteredCustomers, currentPage])

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
    <div className="min-h-screen bg-background p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader
          title="ADHÉRENTS ÉLITE"
          description="Gérez la communauté et l'influence de Grandson."
        />
        
        <div className="flex items-center gap-4 bg-secondary/5 border border-white/5 p-2 rounded-full">
           <div className="flex -space-x-3 ml-2">
             {customers.slice(0, 4).map((c, i) => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-accent text-[8px] font-black flex items-center justify-center text-white uppercase">
                 {c.name.charAt(0)}
               </div>
             ))}
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest pr-4 opacity-40">
             {customers.length} Membres au total
           </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'LOYAUTÉ TOTALE', value: stats.totalCustomers, icon: Users, color: 'blue' },
          { label: 'VOLUME D\'INFLUENCE', value: `${stats.totalRevenue.toLocaleString()} GNF`, icon: DollarSign, color: 'emerald' },
          { label: 'ENGAGEMENT MOYEN', value: stats.avgOrdersPerCustomer.toFixed(1), icon: ShoppingBag, color: 'purple' },
          { label: 'TOP INFLUENCEUR', value: `${stats.topCustomers[0]?.totalSpent || "0"} GNF`, icon: TrendingUp, color: 'orange' },
        ].map((stat, i) => (
           <Card key={i} className="bg-secondary/5 border-white/5 rounded-[2rem] overflow-hidden group hover:border-accent/30 transition-all duration-500 shadow-xl">
             <CardContent className="p-8">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-secondary/10 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <p className="text-[10px] font-black opacity-30 tracking-[0.2em] mb-1">{stat.label}</p>
               <p className="text-2xl font-black italic tracking-tighter truncate">{stat.value}</p>
             </CardContent>
           </Card>
        ))}
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors opacity-40" />
            <input
              placeholder="Rechercher par nom ou empreinte email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary/5 border border-white/10 rounded-[2rem] h-16 pl-16 pr-8 text-sm focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold italic"
            />
          </div>

          <div className="w-full md:w-64">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-16 rounded-[2rem] bg-secondary/5 border-white/10 px-8 font-black uppercase text-[10px] tracking-widest focus:ring-accent/5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-accent" />
                  <SelectValue placeholder="Triage de l'Élite" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] bg-background border-white/10 p-2">
                <SelectItem value="recent" className="rounded-xl h-10 font-bold">Récence d'Adhésion</SelectItem>
                <SelectItem value="orders" className="rounded-xl h-10 font-bold">Nombre de Commandes</SelectItem>
                <SelectItem value="spent" className="rounded-xl h-10 font-bold">Volume Financier</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </div>

      {/* Customers Grid */}
      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center space-y-6">
           <Loader2 className="h-10 w-10 animate-spin text-accent" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 animate-pulse">Sondage de la communauté...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center space-y-8 border border-dashed border-white/10 rounded-[4rem] bg-secondary/5">
           <UserMinus className="h-16 w-16 opacity-5" />
           <p className="text-xl font-black tracking-tight uppercase italic opacity-40">Désert Social</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedCustomers.map((customer) => (
            <Card key={customer.id} className="group overflow-hidden rounded-[3rem] bg-secondary/5 border-white/5 border hover:border-accent/40 shadow-2xl transition-all duration-700">
               <CardContent className="p-0">
                  <div className="p-8 pb-6 border-b border-white/5 space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500">
                             <User className="w-8 h-8" />
                          </div>
                          <div>
                             <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-1 group-hover:text-accent transition-colors">{customer.name}</h3>
                             <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 opacity-30" />
                                <span className="text-[11px] font-bold text-muted-foreground/60">{customer.email}</span>
                             </div>
                          </div>
                       </div>
                       <Badge className={cn(
                          "rounded-full border text-[8px] font-black uppercase tracking-widest px-4 h-6",
                          customer.isGuest ? "bg-white/5 border-white/10 text-white/40" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                       )}>
                          {customer.isGuest ? 'PASSAGER' : 'ADHÉRENT'}
                       </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-secondary/5 border border-white/5">
                          <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">COMMANDES</p>
                          <p className="text-xl font-black italic tracking-tighter">{customer.orderCount || 0}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-secondary/5 border border-white/5">
                          <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">VOLUME GNF</p>
                          <p className="text-xl font-black italic tracking-tighter text-emerald-500">
                             {parseFloat(customer.totalSpent || "0").toLocaleString()}
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="px-8 py-6 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20">MEMBRE DEPUIS LE</span>
                        <span className="text-[10px] font-bold italic opacity-40">{new Date(customer.createdAt).toLocaleDateString("fr-FR")}</span>
                     </div>
                     
                     <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                             onClick={() => fetchCustomerOrders(customer.id)}
                             variant="ghost" 
                             className="rounded-full h-12 w-12 bg-white/5 hover:bg-accent hover:text-white transition-all duration-500"
                          >
                             <Eye className="w-5 h-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-2xl border-white/10 rounded-[3rem] p-12 shadow-2xl">
                          <DialogHeader className="mb-8 text-left">
                            <div className="flex items-center gap-4 mb-2">
                               <div className="w-1.5 h-10 bg-accent rounded-full" />
                               <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase">ARCHIVES DE {customer.name}</DialogTitle>
                            </div>
                            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-5">Journal des transactions et de loyauté</DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                            {ordersLoading ? (
                               <div className="py-12 flex flex-col items-center gap-4">
                                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                                  <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Scan des transactions...</p>
                               </div>
                            ) : customerOrders.length === 0 ? (
                              <div className="py-12 text-center bg-secondary/5 rounded-3xl border border-dashed border-white/10">
                                 <ShoppingBag className="h-12 w-12 mx-auto opacity-10 mb-4" />
                                 <p className="text-sm font-bold italic opacity-40 text-muted-foreground text-center">Aucune trace de mouvement commercial.</p>
                              </div>
                            ) : (
                              customerOrders.map((order) => (
                                <div key={order.id} className="group/order p-6 bg-secondary/5 border border-white/5 rounded-[2rem] hover:border-accent/30 transition-all duration-500">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center border border-accent/10 group-hover/order:bg-accent group-hover/order:text-white transition-colors">
                                          <Shield className="w-5 h-5" />
                                       </div>
                                       <div>
                                          <p className="font-black italic tracking-tight uppercase text-lg leading-none">ORDER #{order.id}</p>
                                          <p className="text-[10px] font-bold opacity-30 mt-1">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xl font-black italic tracking-tighter text-emerald-500 leading-none mb-2">{parseFloat(order.totalAmount).toLocaleString()} GNF</p>
                                      <Badge variant="outline" className="rounded-full text-[7px] font-black uppercase px-3 h-5 border-white/10 opacity-40">{order.status}</Badge>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="mt-8 pt-8 border-t border-white/5 text-center">
                              <Button onClick={(e) => {
                                 const el = e.currentTarget.closest('[role="dialog"]')?.querySelector('button[aria-label="Close"]');
                                 if (el instanceof HTMLButtonElement) el.click();
                              }} className="rounded-full px-12 h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90">Fermer Archive</Button>
                          </div>
                        </DialogContent>
                     </Dialog>
                  </div>
               </CardContent>
            </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 bg-secondary/5 border border-white/5 p-4 rounded-full w-fit mx-auto shadow-2xl">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-full h-12 px-6 font-black uppercase text-[10px] tracking-widest disabled:opacity-20 translate-y-[2px]"
              >
                Retours
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                   let page = i + 1;
                   if (totalPages > 5) {
                     if (currentPage > 3) page = currentPage - 2 + i;
                     if (currentPage > totalPages - 2) page = totalPages - 4 + i;
                   }
                   if (page > totalPages) return null;
                   return (
                     <Button
                       key={page}
                       onClick={() => setCurrentPage(page)}
                       className={cn(
                          "w-10 h-10 rounded-full font-black text-xs transition-all duration-500",
                          currentPage === page ? "bg-accent text-white shadow-xl shadow-accent/20 scale-110" : "bg-transparent text-muted-foreground hover:bg-white/5"
                       )}
                     >
                       {page}
                     </Button>
                   );
                })}
              </div>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full h-12 px-6 font-black uppercase text-[10px] tracking-widest disabled:opacity-20 translate-y-[2px]"
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
