"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/products"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()
  
  const finalTotal = totalPrice

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-4 px-4 py-3">
            <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">Panier</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center px-8 py-20">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground text-center mb-8">
            Explorez notre collection et ajoutez des articles a votre panier
          </p>
          <Link href="/">
            <Button className="h-12 px-8">
              Decouvrir la collection
            </Button>
          </Link>
        </div>

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">Panier</h1>
          </div>
          <span className="text-sm text-muted-foreground">{totalItems} articles</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${item.size}-${item.color}`}
            className="bg-card rounded-2xl p-4 border border-border animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-24 h-24 bg-secondary rounded-xl overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.size} / {item.color}
                </p>
                <p className="text-lg font-bold text-accent mt-2">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              {/* Quantity */}
              <div className="flex items-center gap-3 bg-secondary rounded-full p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeItem(item.id, item.size)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>



      {/* Bottom Summary */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 space-y-4 z-40">
        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-accent">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        {/* Checkout Buttons */}
        <div className="space-y-2">
          <Link href="/checkout">
            <Button className="w-full h-14 text-lg font-bold">
              Commander avec compte
            </Button>
          </Link>
          <Link href="/checkout-guest">
            <Button variant="secondary" className="w-full h-14 text-lg font-bold border-2 border-accent">
              Commander sans compte
            </Button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
