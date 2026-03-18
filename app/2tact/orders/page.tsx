"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Eye, CheckCircle, Clock, Truck, Package, DollarSign, Filter, Phone, Mail, MapPin, XCircle, ChevronDown, AlertCircle, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/2tact/page-header"
import { GifImage } from "@/components/gif-image"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  product?: {
    id: number
    name: string
    price: number
    image?: string
    category?: string
  }
}

interface Order {
  id: number
  userId: number | null
  guestEmail: string | null
  guestName: string | null
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  paymentStatus: string
  paymentMethod: string
  deliveryAddress: string
  phoneNumber: string
  deliveryZoneId?: number | null
  adminNotes?: string | null
  rejectionReason?: string | null
  createdAt: string
  updatedAt?: string
  items?: OrderItem[]
  user?: {
    id: number
    name: string
    email: string
  }
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  processing: <Package className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [validationNotes, setValidationNotes] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  const ordersPerPage = 10

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error("Invalid data format:", data)
        setOrders([])
      }
    } catch (error) {
      console.error("Error:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: number, status: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        toast.success(`Commande #${orderId} mise à jour vers "${statusLabels[status]}"`)
        await fetchOrders()
        // Mettre à jour la commande sélectionnée
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: status as any })
        }
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setActionLoading(false)
    }
  }

  const handleQuickAction = async (orderId: number, action: string) => {
    const statusMap: Record<string, string> = {
      confirm: "processing",
      ship: "shipped",
      deliver: "delivered",
      cancel: "cancelled",
    }
    
    if (statusMap[action]) {
      await handleStatusChange(orderId, statusMap[action])
    }
  }

  const handleValidateOrder = async (orderId: number) => {
    if (!selectedOrder) return
    
    setIsValidating(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "processing",
          adminNotes: validationNotes 
        }),
      })

      if (res.ok) {
        toast.success(`Commande #${orderId} validée et confirmée`)
        setValidationNotes("")
        setIsDetailOpen(false)
        await fetchOrders()
      } else {
        toast.error("Erreur lors de la validation")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Erreur lors de la validation")
    } finally {
      setIsValidating(false)
    }
  }

  const handleRejectOrder = async (orderId: number) => {
    if (!selectedOrder || !rejectionReason.trim()) {
      toast.error("Veuillez entrer une raison de refus")
      return
    }
    
    setIsRejecting(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "cancelled",
          rejectionReason: rejectionReason 
        }),
      })

      if (res.ok) {
        toast.success(`Commande #${orderId} refusée`)
        setRejectionReason("")
        setShowRejectionForm(false)
        setIsDetailOpen(false)
        await fetchOrders()
      } else {
        toast.error("Erreur lors du refus")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Erreur lors du refus")
    } finally {
      setIsRejecting(false)
    }
  }

  const filteredOrders = useMemo(() => orders.filter((order: Order) => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
      order.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.guestName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  }), [orders, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage)
  }, [filteredOrders, currentPage, ordersPerPage])

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    pendingOrders: orders.filter(o => o.status === "pending").length,
    deliveredOrders: orders.filter(o => o.status === "delivered").length,
  }), [orders])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pb-20">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <PageHeader
            title="Logistique Royale"
            description="Suivez et orchestrez vos expéditions de luxe"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
        {/* Statistiques Dynamiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-blue-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner text-blue-500">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Flux Total</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tighter">{stats.totalOrders}</p>
                  <span className="text-[10px] text-blue-500 font-bold">BONS</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-green-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-green-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner text-green-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Chiffre d'Affaires</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black tracking-tighter">{stats.totalRevenue.toLocaleString()}</p>
                  <span className="text-[10px] text-green-500 font-bold">GNF</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-orange-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-orange-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner text-orange-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">En Préparation</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tighter">{stats.pendingOrders}</p>
                  <span className="text-[10px] text-orange-500 font-bold">ATTENTE</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-purple-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner text-purple-500">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Succès Clients</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tighter">{stats.deliveredOrders}</p>
                  <span className="text-[10px] text-purple-500 font-bold">LIVRÉES</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtres et Recherche High-End */}
        <div className="bg-card/40 backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] border border-border/40 shadow-2xl space-y-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input
              placeholder="Chercher une expédition par ID, client ou destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 px-2 pb-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 bg-secondary/50 border-none rounded-xl text-xs font-black uppercase tracking-widest min-w-[200px]">
                <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    <SelectValue placeholder="Tous les statuts" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">⏳ En attente</SelectItem>
                <SelectItem value="processing">⚙️ En traitement</SelectItem>
                <SelectItem value="shipped">🚚 Expédiée</SelectItem>
                <SelectItem value="delivered">✅ Livrée</SelectItem>
                <SelectItem value="cancelled">❌ Annulée</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <div className="text-[10px] font-black text-muted-foreground flex items-center gap-2 uppercase tracking-widest bg-secondary/30 px-4 rounded-xl">
               <span className="w-2 h-2 rounded-full bg-accent" />
               {filteredOrders.length} COMMANDES FILTRÉES
            </div>
          </div>
        </div>

        {/* Liste des Commandes Premium */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent animate-pulse">Synchronisation des Flux...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-32 space-y-4 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border/20">
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <div>
              <h3 className="text-xl font-black">Archive vide</h3>
              <p className="text-muted-foreground text-sm">Le destin n'a pas encore frappé à cette porte</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {paginatedOrders.map((order: Order) => (
              <Card key={order.id} className="group overflow-hidden bg-card/40 backdrop-blur-md border border-border/40 hover:border-accent/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] p-6 sm:p-8">
                <div className="space-y-8">
                  {/* Header Order */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <Package className="w-8 h-8 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-black tracking-tighter italic">#{order.id}</h3>
                          <Badge className={`${statusColors[order.status]} border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm`}>
                            {statusIcons[order.status]}
                            <span className="ml-2">{statusLabels[order.status]}</span>
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 px-8 py-4 bg-secondary/30 rounded-2xl border border-border/30">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valeur Transactionnelle</p>
                          <p className="text-2xl font-black text-accent">{order.totalAmount.toLocaleString()} GNF</p>
                       </div>
                       <div className="w-[1px] h-10 bg-border/40" />
                       <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Articles</p>
                          <p className="text-2xl font-black">{order.items?.length || 0}</p>
                       </div>
                    </div>
                  </div>

                  {/* Body Order */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Client Intelligence */}
                    <Card className="p-6 bg-secondary/10 border-none rounded-3xl space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                        <UserIcon className="w-3 h-3" /> Clientèle d'Excellence
                      </p>
                      <div className="space-y-4">
                        <div>
                          <p className="text-lg font-black tracking-tight underline decoration-accent/20 underline-offset-4">{order.user?.name || order.guestName || 'Anonyme'}</p>
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-2">
                             <Mail className="w-3.5 h-3.5 opacity-50" />
                             <span className="truncate">{order.user?.email || order.guestEmail || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background/40 p-3 rounded-xl border border-border/20">
                          <Phone className="w-4 h-4 text-accent" />
                          <span className="text-sm font-black italic">{order.phoneNumber}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Logistics Intelligence */}
                    <Card className="p-6 bg-secondary/10 border-none rounded-3xl space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Destination Précise
                      </p>
                      <div className="space-y-4">
                        <div className="bg-background/40 p-4 rounded-xl border border-border/20 min-h-[80px]">
                           <p className="text-sm font-medium leading-relaxed italic">"{order.deliveryAddress}"</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                           <DollarSign className="w-3 h-3" /> Règlement: {order.paymentMethod === 'cash_on_delivery' ? 'À la réception' : order.paymentMethod}
                        </div>
                      </div>
                    </Card>

                    {/* Inventory Preview */}
                    <Card className="p-6 bg-secondary/10 border-none rounded-3xl space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Package className="w-3 h-3" /> Aperçu Collection
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex-shrink-0 group/img relative w-20 h-24 bg-background rounded-xl overflow-hidden shadow-sm border border-border/40">
                            {item.product?.image ? (
                              <GifImage src={item.product.image} alt="Art" fill className="object-cover group-hover/img:scale-125 transition-transform duration-700" />
                            ) : (
                              <div className="flex items-center justify-center h-full"><Package className="w-6 h-6 opacity-20" /></div>
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[8px] font-black text-center py-1">
                               x{item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Actions Bar Order */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Dialog open={isDetailOpen && selectedOrder?.id === order.id} onOpenChange={(open) => {
                      setIsDetailOpen(open)
                      if (!open) { setSelectedOrder(null); setValidationNotes(""); }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="h-12 px-8 rounded-2xl gap-3 font-black shadow-xl hover:bg-accent hover:text-white transition-all group/btn"
                          onClick={() => { setSelectedOrder(order); setIsDetailOpen(true); }}
                        >
                          <Eye className="w-5 h-5 group-hover/btn:scale-120" />
                          EXPLORER LE DOSSIER
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2.5rem] p-0 shadow-3xl">
                         {selectedOrder && (
                           <div className="space-y-0">
                              <div className="p-10 bg-gradient-to-br from-accent/10 via-secondary/10 to-transparent border-b border-border/30">
                                 <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-4xl font-black italic tracking-tighter">DOSSIER RA#{selectedOrder.id}</h2>
                                    <Badge className={`${statusColors[selectedOrder.status]} border-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]`}>
                                       {statusLabels[selectedOrder.status]}
                                    </Badge>
                                 </div>
                                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div><p className="text-[10px] font-black text-muted-foreground uppercase mb-2">DATE DE DÉPÔT</p><p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p></div>
                                    <div><p className="text-[10px] font-black text-muted-foreground uppercase mb-2">VALEUR NOMINALE</p><p className="font-black text-accent">{selectedOrder.totalAmount.toLocaleString()} GNF</p></div>
                                    <div><p className="text-[10px] font-black text-muted-foreground uppercase mb-2">TÉLÉPHONE</p><p className="font-medium italic">{selectedOrder.phoneNumber}</p></div>
                                    <div><p className="text-[10px] font-black text-muted-foreground uppercase mb-2">PAIEMENT</p><p className="font-medium">{selectedOrder.paymentMethod}</p></div>
                                 </div>
                              </div>
                              
                              <div className="p-10 space-y-12">
                                 <section>
                                    <h3 className="section-title mb-6 flex items-center gap-3"><Package className="w-5 h-5 text-accent" /> Manifeste d'Expédition</h3>
                                    <div className="space-y-4">
                                       {selectedOrder.items?.map((item) => (
                                          <div key={item.id} className="flex items-center gap-6 p-4 bg-secondary/20 rounded-2xl border border-border/20 group">
                                             <div className="w-20 h-24 bg-background rounded-xl overflow-hidden relative shadow-md">
                                                <GifImage src={item.product?.image || ""} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                             </div>
                                             <div className="flex-1">
                                                <p className="text-lg font-black tracking-tight">{item.product?.name || "Pièce de Collection"}</p>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Qté: {item.quantity} × {item.price.toLocaleString()} GNF</p>
                                             </div>
                                             <div className="text-right">
                                                <p className="text-xl font-black text-accent">{(item.quantity * item.price).toLocaleString()} GNF</p>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </section>

                                 <section className="bg-secondary/10 p-8 rounded-3xl border border-border/20">
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-4">Destination de Prestige</h3>
                                    <div className="flex gap-4">
                                       <MapPin className="w-6 h-6 text-accent mt-1" />
                                       <p className="text-lg font-medium italic leading-relaxed">"{selectedOrder.deliveryAddress}"</p>
                                    </div>
                                 </section>

                                 {/* Formulaire de Validation Premium */}
                                 {selectedOrder.status === "pending" && (
                                    <section className="p-8 bg-black/5 dark:bg-white/5 rounded-[2rem] border-2 border-accent/20 animate-in slide-in-from-bottom-5">
                                      <div className="flex items-center gap-4 mb-6">
                                         <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-xl">
                                            <CheckCircle className="w-6 h-6" />
                                         </div>
                                         <h3 className="text-xl font-black tracking-tight">Validation Impériale</h3>
                                      </div>
                                      {!showRejectionForm ? (
                                        <div className="space-y-6">
                                          <div className="space-y-3">
                                             <Label className="text-xs font-black uppercase tracking-widest ml-1">Notes de Validation (Sceau Privé)</Label>
                                             <Textarea
                                                placeholder="Instructions spéciales, modifications de stock..."
                                                value={validationNotes}
                                                onChange={(e) => setValidationNotes(e.target.value)}
                                                className="bg-background border-border/50 rounded-2xl h-32 focus:ring-accent"
                                             />
                                          </div>
                                          <div className="flex gap-4">
                                            <Button
                                              onClick={() => handleValidateOrder(selectedOrder.id)}
                                              disabled={isValidating}
                                              className="flex-1 h-14 bg-green-600 hover:bg-green-700 rounded-2xl font-black shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                              {isValidating ? "Signature électronique..." : "APPROUVER & SCELLER"}
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              onClick={() => setShowRejectionForm(true)}
                                              className="px-8 h-14 rounded-2xl font-bold text-red-500 hover:bg-red-500/10"
                                            >
                                               REFUSER
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-6 animate-in fade-in zoom-in-95">
                                           <div className="space-y-3">
                                              <Label className="text-xs font-black uppercase tracking-widest text-red-500 ml-1">Cause de Rétractation Royale</Label>
                                              <Textarea
                                                placeholder="Expliquez la raison du refus au client..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="bg-background border-red-500/20 rounded-2xl h-32"
                                              />
                                           </div>
                                           <div className="flex gap-4">
                                              <Button
                                                onClick={() => handleRejectOrder(selectedOrder.id)}
                                                disabled={isRejecting || !rejectionReason.trim()}
                                                className="flex-1 h-14 bg-red-600 hover:bg-red-700 rounded-2xl font-black shadow-xl"
                                              >
                                                {isRejecting ? "Destruction..." : "CONFIRMER L'ANNULATION"}
                                              </Button>
                                              <Button variant="outline" className="h-14 rounded-2xl px-8" onClick={() => setShowRejectionForm(false)}>RETOUR</Button>
                                           </div>
                                        </div>
                                      )}
                                    </section>
                                 )}

                                 <div className="flex justify-end pt-10 border-t border-border/30">
                                    <Button variant="ghost" onClick={() => setIsDetailOpen(false)} className="rounded-xl font-bold">Fermer le Dossier</Button>
                                 </div>
                              </div>
                           </div>
                         )}
                      </DialogContent>
                    </Dialog>

                    <div className="flex-1" />

                    {order.status === "pending" && (
                      <Button
                        onClick={() => handleQuickAction(order.id, "confirm")}
                        disabled={actionLoading}
                        className="h-12 px-6 rounded-2xl gap-2 font-black bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                      >
                        <CheckCircle className="w-4 h-4" /> CONFIRMER
                      </Button>
                    )}

                    {order.status === "processing" && (
                      <Button
                        onClick={() => handleQuickAction(order.id, "ship")}
                        disabled={actionLoading}
                        className="h-12 px-6 rounded-2xl gap-2 font-black bg-accent hover:bg-accent/90 shadow-lg"
                      >
                        <Truck className="w-4 h-4" /> EXPÉDIER
                      </Button>
                    )}

                    {order.status === "shipped" && (
                      <Button
                        onClick={() => handleQuickAction(order.id, "deliver")}
                        disabled={actionLoading}
                        className="h-12 px-6 rounded-2xl gap-2 font-black bg-purple-600 hover:bg-purple-700 shadow-lg"
                      >
                        <CheckCircle className="w-4 h-4" /> MARQUER LIVRÉE
                      </Button>
                    )}

                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="h-12 px-6 rounded-2xl font-bold text-red-500 hover:bg-red-500/10" disabled={actionLoading}>
                            ANNULER
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background/95 backdrop-blur-2xl rounded-3xl border-border/40">
                             <AlertDialogTitle className="text-2xl font-black">Révoquer cette Commande?</AlertDialogTitle>
                             <AlertDialogDescription className="text-muted-foreground font-medium">Cette décision impactera vos revenus et la satisfaction-client. Continuer?</AlertDialogDescription>
                             <div className="flex gap-4 justify-end mt-8">
                                <AlertDialogCancel className="rounded-xl font-bold">Rester Sage</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleQuickAction(order.id, "cancel")} className="bg-red-500 hover:bg-red-600 rounded-xl font-black px-8">PROCÉDER</AlertDialogAction>
                             </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Architecturale */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center p-8 bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border/40 shadow-2xl">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="rounded-2xl px-6 font-bold hover:bg-accent/10 transition-all disabled:opacity-30"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <div className="flex gap-2">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-black ${currentPage === page ? 'bg-accent shadow-lg shadow-accent/20' : ''}`}
                    >
                      {page}
                    </Button>
                 ))}
              </div>
              <Button
                variant="ghost"
                className="rounded-2xl px-6 font-bold hover:bg-accent/10 transition-all disabled:opacity-30"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
