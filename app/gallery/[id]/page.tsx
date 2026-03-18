"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"

interface GalleryImage {
  id: number
  imageUrl?: string
  image_url?: string
  customerName?: string
  customer_name?: string
  caption?: string
  productId?: number
  isApproved?: boolean
  isActive?: boolean
  displayOrder?: number
}

export default function GalleryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [image, setImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchImage()
    }
  }, [params.id])

  const fetchImage = async () => {
    try {
      const response = await fetch(`/api/customer-gallery/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Gallery image data:', data)
        setImage(data)
      } else {
        console.error('API error:', response.status)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader />
        <div className="p-6 text-center">Chargement...</div>
        <BottomNav />
      </div>
    )
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader />
        <div className="p-6 text-center">Photo non trouvée</div>
        <BottomNav />
      </div>
    )
  }

  const imageUrl = image.imageUrl || image.image_url || ''
  const customerName = image.customerName || image.customer_name || 'Client'

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      
      <main className="p-4 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Image */}
            <div className="relative w-full h-96">
              <Image
                src={imageUrl}
                alt={customerName}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Name */}
              <div>
                <h1 className="text-4xl font-black mb-2">{customerName}</h1>
                <p className="text-sm text-amber-600 font-semibold">Client satisfait</p>
              </div>

              {/* Caption */}
              {image.caption && (
                <div className="space-y-2">
                  <h2 className="text-lg font-bold">À propos de cette photo</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {image.caption}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="space-y-2 pt-4 border-t">
                <h2 className="text-lg font-bold">Statut</h2>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Approuvée</p>
                    <p className="font-semibold">
                      {image.isApproved ? '✓ Oui' : '✗ Non'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="font-semibold">
                      {image.isActive ? '✓ Oui' : '✗ Non'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
