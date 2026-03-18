'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck, MapPin, Phone, Clock, ChevronRight, Home, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BottomNav } from '@/components/bottom-nav'
import { formatPrice } from '@/lib/format-price'

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deliveryZone, setDeliveryZone] = useState<any>(null)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }
    
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
          
          if (data.deliveryZoneId) {
            const zoneRes = await fetch(`/api/delivery-zones/${data.deliveryZoneId}`)
            if (zoneRes.ok) {
              const zone = await zoneRes.json()
              setDeliveryZone(zone)
            }
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="flex flex-col items-center justify-center px-8 py-20">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Commande non trouvée</h2>
          <p className="text-muted-foreground text-center mb-8">
            Cette commande n'existe pas ou a été supprimée
          </p>
          <Link href="/">
            <Button className="h-12 px-8">Retour à l'accueil</Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      delivered: 'bg-accent/20 text-accent border-accent/30',
      cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
    }
    return colors[status] || 'bg-secondary text-foreground border-border'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    }
    return labels[status] || status
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent pt-8 pb-6 px-4">
        <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4 shadow-lg shadow-accent/20">
            <CheckCircle className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Commande confirmée !
          </h1>
          <p className="text-muted-foreground mb-1">Merci pour votre confiance</p>
          <Badge variant="secondary" className="text-xs">
            Commande #{order.id}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <main className="space-y-3 px-4 py-4">
        {/* Order Status Card */}
        <Card className="overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Statut de la commande</h2>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-sm font-medium">Statut actuel</span>
              <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                <Clock className="w-3 h-3" />
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-sm font-medium">Mode de paiement</span>
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                À la livraison
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-sm font-medium">Date de commande</span>
              <span className="text-sm font-medium">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            {order.adminNotes && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-3">
                <p className="text-xs text-blue-500 font-bold uppercase mb-1">Note de l'équipe</p>
                <p className="text-sm">{order.adminNotes}</p>
              </div>
            )}

            {order.status === 'cancelled' && order.rejectionReason && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl mt-3">
                <p className="text-xs text-destructive font-bold uppercase mb-1">Raison de l'annulation</p>
                <p className="text-sm font-medium">{order.rejectionReason}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Delivery Info Card */}
        <Card className="overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Informations de livraison</h2>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Adresse de livraison</p>
                  <p className="text-sm font-medium">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Numéro de téléphone</p>
                  <p className="text-sm font-medium">{order.phoneNumber}</p>
                </div>
              </div>
            </div>

            {deliveryZone && (
              <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Zone de livraison</p>
                    <p className="text-sm font-medium">{deliveryZone.name}</p>
                  </div>
                  <p className="text-sm font-bold text-accent">{formatPrice(deliveryZone.price)}</p>
                </div>
              </div>
            )}

            <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Délai de livraison estimé</p>
                  <p className="text-sm font-semibold">24-48 heures</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Order Summary Card */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h2 className="text-lg font-bold">Résumé de la commande</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3 mb-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product?.name || `Article #${item.productId}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold ml-3">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">
                  {formatPrice(order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0)}
                </span>
              </div>
              {deliveryZone && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">{formatPrice(deliveryZone.price)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-base font-bold">Total</span>
                <span className="text-lg font-bold text-accent">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card className="bg-accent/10 border-accent/20 overflow-hidden">
          <div className="p-4 border-b border-accent/20">
            <h3 className="font-bold">Prochaines étapes</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-3">
              {[
                { step: '1', text: 'Vous recevrez un SMS de confirmation' },
                { step: '2', text: 'Notre équipe prépare votre commande' },
                { step: '3', text: 'Vous serez contacté pour la livraison' },
                { step: '4', text: 'Payez le livreur à la réception' }
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <span className="text-sm pt-0.5">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 space-y-2 z-40 pb-20">
        {order.userId ? (
          <Link href="/profile" className="block touch-manipulation">
            <Button variant="secondary" className="w-full h-12 rounded-xl gap-2">
              <User className="w-4 h-4" />
              Voir mes commandes
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
        ) : (
          <div className="p-3 bg-secondary/30 rounded-xl mb-2">
            <p className="text-xs text-center text-muted-foreground italic">
              Un email de suivi a été envoyé à {order.guestEmail}
            </p>
          </div>
        )}
        <Link href="/" className="block touch-manipulation">
          <Button className="w-full h-12 rounded-xl gap-2">
            <Home className="w-4 h-4" />
            Continuer les achats
          </Button>
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
