"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Twitter, Globe, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"

interface Ambassador {
  id: number
  name: string
  profileImage?: string
  profile_image?: string
  bio?: string
  role?: string
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
  website?: string
  isActive?: boolean
  displayOrder?: number
}

export default function AmbassadorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchAmbassador()
    }
  }, [params.id])

  const fetchAmbassador = async () => {
    try {
      const response = await fetch(`/api/ambassadors/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Ambassador data:', data)
        setAmbassador(data)
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

  if (!ambassador) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader />
        <div className="p-6 text-center">Ambassadeur non trouvé</div>
        <BottomNav />
      </div>
    )
  }

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
            <div className="relative w-full h-80">
              <Image
                src={ambassador.profileImage || ambassador.profile_image || ''}
                alt={ambassador.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Name and Role */}
              <div>
                <h1 className="text-4xl font-black mb-2">{ambassador.name}</h1>
                {ambassador.role && (
                  <p className="text-lg font-semibold text-amber-600">{ambassador.role}</p>
                )}
              </div>

              {/* Bio */}
              {ambassador.bio && (
                <div className="space-y-2">
                  <h2 className="text-lg font-bold">À propos</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {ambassador.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold">Suivez-moi</h2>
                <div className="flex flex-wrap gap-3">
                  {ambassador.instagram && (
                    <a
                      href={ambassador.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </Button>
                    </a>
                  )}
                  {ambassador.facebook && (
                    <a
                      href={ambassador.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Button>
                    </a>
                  )}
                  {ambassador.twitter && (
                    <a
                      href={ambassador.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                    </a>
                  )}
                  {ambassador.tiktok && (
                    <a
                      href={ambassador.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Globe className="h-4 w-4" />
                        TikTok
                      </Button>
                    </a>
                  )}
                  {ambassador.website && (
                    <a
                      href={ambassador.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Site Web
                      </Button>
                    </a>
                  )}
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
