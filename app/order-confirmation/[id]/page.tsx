'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BottomNav } from '@/components/bottom-nav'
import { formatPrice } from '@/lib/products'

interface OrderConfirmation {
  id: number
  totalAmount: string
  status: string
  paymentMethod: string
  deliveryAddress: string
  phoneNumber: string
  createdAt: string
  items: Array<{
    productId: number
    quantity: number
    price: string
  }>
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderConfirmation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="flex items-center justify-center h-screen">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="flex flex-col items-center justify-center px-8 py-20">
          <p className="text-muted-foreground mb-8">Commande non trouvée</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-accent/10 to-transparent pt-12 pb-8 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-4 animate-in zoom-in">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Commande confirmée</h1>
          <p className="text-muted-foreground">Commande #{order.id}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Order Status */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold">Statut de la commande</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm font-medium">Statut</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm font-medium">Paiement</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                À la livraison
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold">Informations de livraison</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Adresse</p>
              <p className="text-sm font-medium">{order.deliveryAddress}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
              <p className="text-sm font-medium">{order.phoneNumber}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Délai estimé</p>
              <p className="text-sm font-medium">24-48 heures</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold">Mode de paiement</h2>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-900 mb-2">Paiement à la livraison</p>
            <p className="text-xs text-yellow-800">
              Vous paierez directement au livreur lors de la réception de votre commande.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>
          <div className="space-y-2 text-sm">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-muted-foreground">Article x{item.quantity}</span>
                <span className="font-medium">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border font-bold">
              <span>Total</span>
              <span className="text-accent">{formatPrice(parseFloat(order.totalAmount))}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
          <h3 className="font-bold mb-3">Prochaines étapes</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-accent font-bold">1.</span>
              <span>Vous recevrez un SMS de confirmation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent font-bold">2.</span>
              <span>Notre équipe prépare votre commande</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent font-bold">3.</span>
              <span>Vous serez contacté pour la livraison</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent font-bold">4.</span>
              <span>Payez le livreur à la réception</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 space-y-2">
        <Link href="/orders" className="block">
          <Button variant="secondary" className="w-full h-12">
            Voir mes commandes
          </Button>
        </Link>
        <Link href="/" className="block">
          <Button className="w-full h-12">
            Continuer les achats
          </Button>
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
