'use client'

import { useState } from 'react'
import { Check, MapPin } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface CitySelectorProps {
  selectedCity: string
  onCityChange: (city: string) => void
  className?: string
}

export function CitySelector({ selectedCity, onCityChange, className }: CitySelectorProps) {
  const [open, setOpen] = useState(false)

  const handleCitySelect = (city: string) => {
    onCityChange(city)
    setOpen(false)
  }

  const getDeliveryFee = (city: string) => {
    if (city === 'Conakry') {
      return siteConfig.shipping.conakryFee
    }
    return siteConfig.shipping.otherCitiesFee
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <MapPin className="w-4 h-4 mr-2" />
          {selectedCity || 'Sélectionner une ville'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choisir votre ville</DialogTitle>
          <DialogDescription>
            Sélectionnez votre ville pour calculer les frais de livraison
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {siteConfig.shipping.cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                selectedCity === city
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50 hover:bg-accent/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {getDeliveryFee(city).toLocaleString()} GNF
                </span>
                {selectedCity === city && (
                  <Check className="w-5 h-5 text-accent" />
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
