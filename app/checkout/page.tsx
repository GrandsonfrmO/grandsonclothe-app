'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Truck, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/bottom-nav'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/products'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (user && !formData.fullName) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
      }))
    }
  }, [user])

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

  const deliveryFee = totalPrice > 500000 ? 0 : 25000
  const finalTotal = totalPrice + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitOrder = async () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.deliveryAddress) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          totalAmount: finalTotal,
          paymentMethod: 'cash_on_delivery',
          deliveryAddress: formData.deliveryAddress,
          phoneNumber: formData.phoneNumber,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        router.push(`/order-confirmation/${order.id}`)
      } else {
        alert('Erreur lors de la création de la commande')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href="/cart" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Commande</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Delivery Information */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold">Adresse de livraison</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Votre nom"
                className="mt-1 bg-secondary border-0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Numéro de téléphone</label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+224 XXX XXX XXX"
                className="mt-1 bg-secondary border-0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Adresse de livraison</label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                placeholder="Entrez votre adresse complète"
                className="mt-1 w-full bg-secondary border-0 rounded-lg p-3 text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold">Mode de paiement</h2>
          </div>
          <div className="bg-secondary rounded-xl p-4 border-2 border-accent">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-accent bg-accent flex items-center justify-center">
                <div className="w-2 h-2 bg-background rounded-full" />
              </div>
              <div>
                <p className="font-semibold">Paiement à la livraison</p>
                <p className="text-sm text-muted-foreground">Payez directement au livreur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold">Livraison</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Zone</span>
              <span className="font-medium">Conakry</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Délai estimé</span>
              <span className="font-medium">24-48h</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Frais de livraison</span>
              <span className="font-medium">{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-medium">{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
              <span>Total</span>
              <span className="text-accent">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4">
        <Button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full h-14 text-lg font-bold"
        >
          {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
