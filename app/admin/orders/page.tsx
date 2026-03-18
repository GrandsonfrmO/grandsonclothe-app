"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Eye, CheckCircle, Clock, Truck, Package, DollarSign, Filter, Phone, Mail, MapPin, XCircle, ChevronDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/admin/page-header"
import { GifImage } from "@/components/gif-image"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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

  // Statistiques - Mémorisées
  const stats = useMemo(() => ({
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    pendingOrders: orders.filter(o => o.status === "pending").length,
    deliveredOrders: orders.filter(o => o.status === "delivered").length,
  }), [orders])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-3 sm:p-4 lg:p-8">
          <PageHeader
            title="Gestion des Commandes"
            description="Suivez et gérez toutes vos commandes"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Commandes</p>
                <p className="text-lg sm:text-xl font-bold">{stats.totalOrders}</p>
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En Attente</p>
                <p className="text-lg sm:text-xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Livrées</p>
                <p className="text-lg sm:text-xl font-bold">{stats.deliveredOrders}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <div className="mb-4 sm:mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ID, client ou adresse..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="text-sm">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processing">En traitement</SelectItem>
              <SelectItem value="shipped">Expédiée</SelectItem>
              <SelectItem value="delivered">Livrée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-8 sm:py-12 text-sm">Chargement...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-sm text-muted-foreground">
            Aucune commande trouvée
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {paginatedOrders.map((order: Order) => (
              <Card key={order.id} className="p-4 sm:p-6 hover:shadow-lg transition-all border-border">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Commande #{order.id}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[order.status]} text-sm px-3 py-1`}>
                      {statusIcons[order.status]}
                      <span className="ml-2">{statusLabels[order.status]}</span>
                    </Badge>
                  </div>

                  <Separator />

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Client Info */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Client</p>
                      <div className="space-y-1">
                        <p className="font-medium">{order.user?.name || order.guestName || 'Client inconnu'}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{order.user?.email || order.guestEmail || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{order.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Livraison</p>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span className="line-clamp-2">{order.deliveryAddress}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Paiement: {order.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : order.paymentMethod}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Résumé</p>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                        </p>
                        <p className="text-2xl font-bold text-accent">{order.totalAmount.toFixed(0)} GNF</p>
                      </div>
                    </div>
                  </div>

                  {/* Products Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-16 h-16 bg-secondary rounded-lg overflow-hidden relative">
                          {item.product?.image ? (
                            <GifImage
                              src={item.product.image}
                              alt={item.product.name || 'Produit'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          {item.quantity > 1 && (
                            <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                              {item.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-xs font-medium">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Dialog open={isDetailOpen && selectedOrder?.id === order.id} onOpenChange={(open) => {
                      setIsDetailOpen(open)
                      if (!open) {
                        setSelectedOrder(null)
                        setValidationNotes("")
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsDetailOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails de la commande #{selectedOrder?.id}</DialogTitle>
                          <DialogDescription>
                            {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Client Info */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg">Informations Client</h3>
                              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase">Nom</p>
                                  <p className="font-medium">{selectedOrder.user?.name || selectedOrder.guestName || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase">Email</p>
                                  <p className="font-medium text-sm">{selectedOrder.user?.email || selectedOrder.guestEmail || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase">Téléphone</p>
                                  <p className="font-medium">{selectedOrder.phoneNumber}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase">Statut</p>
                                  <Badge className={`${statusColors[selectedOrder.status]} text-xs`}>
                                    {statusLabels[selectedOrder.status]}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg">Adresse de Livraison</h3>
                              <div className="p-4 bg-secondary/50 rounded-lg">
                                <div className="flex gap-2">
                                  <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                                </div>
                              </div>
                            </div>

                            {/* Products */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg">Produits Commandés</h3>
                              <div className="space-y-2">
                                {selectedOrder.items?.map((item) => (
                                  <div key={item.id} className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
                                    {item.product?.image && (
                                      <div className="w-16 h-16 bg-secondary rounded overflow-hidden flex-shrink-0">
                                        <GifImage
                                          src={item.product.image}
                                          alt={item.product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium">{item.product?.name || `Produit #${item.productId}`}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Quantité: {item.quantity} × {item.price.toFixed(0)} GNF
                                      </p>
                                      <p className="font-semibold text-accent">
                                        {(item.quantity * item.price).toFixed(0)} GNF
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg">Résumé de la Commande</h3>
                              <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Sous-total:</span>
                                  <span className="font-medium">{selectedOrder.totalAmount.toFixed(0)} GNF</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Livraison:</span>
                                  <span className="font-medium">Incluse</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg">
                                  <span className="font-semibold">Total:</span>
                                  <span className="font-bold text-accent">{selectedOrder.totalAmount.toFixed(0)} GNF</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                  <span className="text-muted-foreground">Paiement:</span>
                                  <span className="font-medium">
                                    {selectedOrder.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : selectedOrder.paymentMethod}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Admin Notes - If exists */}
                            {selectedOrder.adminNotes && (
                              <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Notes Admin</h3>
                                <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap">{selectedOrder.adminNotes}</p>
                              </div>
                            )}

                            {/* Rejection Reason - If exists */}
                            {selectedOrder.rejectionReason && (
                              <div className="space-y-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                                <h3 className="font-semibold text-red-900 dark:text-red-100">Raison du Refus</h3>
                                <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap">{selectedOrder.rejectionReason}</p>
                              </div>
                            )}

                            {/* Validation Form - Only for pending orders */}
                            {selectedOrder.status === "pending" && (
                              <>
                                {!showRejectionForm ? (
                                  <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex gap-2">
                                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Valider cette commande</h3>
                                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                          Confirmez la commande et envoyez un email de confirmation au client
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">Notes (optionnel)</label>
                                        <Textarea
                                          placeholder="Ajoutez des notes internes sur cette commande..."
                                          value={validationNotes}
                                          onChange={(e) => setValidationNotes(e.target.value)}
                                          className="mt-2 text-sm"
                                          rows={3}
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleValidateOrder(selectedOrder.id)}
                                          disabled={isValidating}
                                          className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          {isValidating ? "Validation..." : "Valider et Confirmer"}
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => setShowRejectionForm(true)}
                                          disabled={isValidating}
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Refuser
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="flex gap-2">
                                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <h3 className="font-semibold text-red-900 dark:text-red-100">Refuser cette commande</h3>
                                        <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                                          Veuillez entrer une raison pour le refus. Un email sera envoyé au client.
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">Raison du refus *</label>
                                        <Textarea
                                          placeholder="Expliquez pourquoi cette commande est refusée..."
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          className="mt-2 text-sm"
                                          rows={3}
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleRejectOrder(selectedOrder.id)}
                                          disabled={isRejecting || !rejectionReason.trim()}
                                          className="flex-1 bg-red-600 hover:bg-red-700"
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          {isRejecting ? "Refus..." : "Confirmer le Refus"}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setShowRejectionForm(false)
                                            setRejectionReason("")
                                          }}
                                          disabled={isRejecting}
                                        >
                                          Annuler
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction(order.id, "confirm")}
                        disabled={actionLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmer
                      </Button>
                    )}

                    {order.status === "processing" && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction(order.id, "ship")}
                        disabled={actionLoading}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Expédier
                      </Button>
                    )}

                    {order.status === "shipped" && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction(order.id, "deliver")}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marquer livrée
                      </Button>
                    )}

                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionLoading}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Annuler
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Annuler la commande?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir annuler la commande #{order.id}? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Non, garder</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleQuickAction(order.id, "cancel")}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Oui, annuler
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
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
