'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Truck, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/bottom-nav'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/format-price'

interface FormData {
  fullName: string
  phoneNumber: string
  deliveryAddress: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
  })
  const [deliveryZones, setDeliveryZones] = useState<any[]>([])
  const [selectedZone, setSelectedZone] = useState<any>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  // Pré-remplir les champs avec les données de l'utilisateur
  useEffect(() => {
    if (user) {
      setFormData((prev: FormData) => ({
        fullName: prev.fullName || user.name || '',
        phoneNumber: prev.phoneNumber || '',
        deliveryAddress: prev.deliveryAddress || '',
      }))
      
      // Récupérer la dernière commande pour pré-remplir l'adresse et le téléphone
      const fetchLastOrder = async () => {
        try {
          const response = await fetch(`/api/orders?userId=${user.id}`)
          if (response.ok) {
            const orders = await response.json()
            if (orders && orders.length > 0) {
              const lastOrder = orders[0]
              setFormData((prev: FormData) => ({
                fullName: prev.fullName || user.name || '',
                phoneNumber: prev.phoneNumber || (lastOrder.phoneNumber ? lastOrder.phoneNumber.replace(/^\+224/, '') : ''),
                deliveryAddress: prev.deliveryAddress || lastOrder.deliveryAddress || '',
              }))
            }
          }
        } catch (error) {
          console.error('Failed to fetch last order:', error)
        }
      }
      
      fetchLastOrder()
    }
  }, [user])

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch('/api/delivery-zones')
        if (res.ok) {
          const zones = await res.json()
          setDeliveryZones(zones)
          if (zones.length > 0) {
            setSelectedZone(zones[0])
          }
        }
      } catch (error) {
        console.error('Error fetching zones:', error)
      }
    }
    fetchZones()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="flex items-center justify-center h-screen">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-4 px-4 py-3">
            <Link href="/cart" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">Commande</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-20">
          <p className="text-muted-foreground mb-8">Votre panier est vide</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  const deliveryFee = selectedZone?.price || 0
  const finalTotal = totalPrice + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitOrder = async () => {
    console.log('🛒 Starting order submission...')
    
    if (!formData.fullName || !formData.phoneNumber || !formData.deliveryAddress) {
      console.error('❌ Missing form data:', formData)
      alert('Veuillez remplir tous les champs')
      return
    }

    console.log('✅ Form data valid:', formData)
    setIsSubmitting(true)
    
    try {
      // Ajouter le préfixe +224 automatiquement si absent
      let phoneNumber = formData.phoneNumber.trim()
      if (!phoneNumber.startsWith('+224')) {
        phoneNumber = '+224' + phoneNumber.replace(/^\+?224/, '')
      }

      console.log('📞 Formatted phone:', phoneNumber)

      const orderData = {
        userId: user?.id,
        totalAmount: finalTotal,
        paymentMethod: 'cash_on_delivery',
        deliveryAddress: formData.deliveryAddress,
        phoneNumber: phoneNumber,
        deliveryZoneId: selectedZone?.id,
        items: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }

      console.log('📦 Sending order data:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      console.log('📥 Response status:', response.status)

      if (response.ok) {
        const order = await response.json()
        console.log('✅ Order created:', order)
        console.log('🧹 Clearing cart...')
        clearCart()
        console.log('🔄 Redirecting to:', `/order-confirmation/${order.id}`)
        // Utiliser window.location pour forcer un rechargement complet
        window.location.href = `/order-confirmation/${order.id}`
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Order creation failed:', response.status, errorData)
        alert('Erreur lors de la création de la commande')
      }
    } catch (error) {
      console.error('❌ Error:', error)
      alert('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3">
          <Link href="/cart" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </Link>
          <h1 className="text-lg sm:text-xl font-bold">Commande</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-6">
        {/* Delivery Information */}
        <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
            </div>
            <h2 className="text-base sm:text-lg font-bold">Adresse de livraison</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">Nom complet</label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Votre nom"
                className="mt-1 bg-secondary border-0 text-sm"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">Numéro de téléphone</label>
              <div className="flex items-center mt-1 gap-0">
                <span className="bg-secondary border-0 rounded-l-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap">+224</span>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="612345678"
                  className="mt-0 bg-secondary border-0 rounded-l-none text-sm"
                  maxLength={9}
                />
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">Adresse de livraison</label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                placeholder="Entrez votre adresse complète"
                className="mt-1 w-full bg-secondary border-0 rounded-lg p-2 sm:p-3 text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
            </div>
            <h2 className="text-base sm:text-lg font-bold">Mode de paiement</h2>
          </div>
          <div className="bg-secondary rounded-xl p-3 sm:p-4 border-2 border-accent">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-accent bg-accent flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-background rounded-full" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base">Paiement à la livraison</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Payez directement au livreur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Zone Selection */}
        <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
            </div>
            <h2 className="text-base sm:text-lg font-bold">Zone de livraison</h2>
          </div>
          <select
            value={selectedZone?.id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const zone = deliveryZones.find(z => z.id === parseInt(e.target.value))
              setSelectedZone(zone)
            }}
            className="w-full bg-secondary border-0 rounded-lg p-2 sm:p-3 text-xs sm:text-sm"
          >
            {deliveryZones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.name} - {formatPrice(zone.price)} GNF
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Info */}
        <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
            </div>
            <h2 className="text-base sm:text-lg font-bold">Livraison</h2>
          </div>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Zone</span>
              <span className="font-medium">Conakry</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Délai estimé</span>
              <span className="font-medium">24-48h</span>
            </div>
            <div className="flex justify-between pt-1 sm:pt-2 border-t border-border">
              <span className="text-muted-foreground">Frais de livraison</span>
              <span className="font-medium">{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border">
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Résumé de la commande</h2>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            {items.map((item: any) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between gap-2">
                <span className="text-muted-foreground truncate">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-1 sm:pt-2 border-t border-border gap-2">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-medium whitespace-nowrap">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-medium whitespace-nowrap">{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-1 sm:pt-2 border-t border-border text-sm sm:text-base font-bold gap-2">
              <span>Total</span>
              <span className="text-accent whitespace-nowrap">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-3 sm:p-4 z-40">
        <Button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full h-12 sm:h-14 text-sm sm:text-lg font-bold"
        >
          {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
