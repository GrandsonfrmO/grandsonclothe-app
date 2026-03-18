"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Instagram, Facebook, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Ambassador {
  id: number
  name: string
  profileImage?: string
  profile_image?: string
  role?: string
  bio?: string
  instagram?: string
  facebook?: string
  twitter?: string
}

export function BrandAmbassadorsSection() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAmbassadors()
  }, [])

  const fetchAmbassadors = async () => {
    try {
      const response = await fetch('/api/ambassadors')
      if (response.ok) {
        const data = await response.json()
        setAmbassadors(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ambassadeurs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || ambassadors.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-6 bg-muted/30">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Nos Ambassadeurs</h2>
        <p className="text-sm text-muted-foreground">Découvrez ceux qui représentent notre marque</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ambassadors.map((ambassador) => (
          <Link key={ambassador.id} href={`/ambassadors/${ambassador.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="relative aspect-square">
                <Image
                  src={ambassador.profileImage || ambassador.profile_image || ''}
                  alt={ambassador.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">{ambassador.name}</h3>
                {ambassador.role && (
                  <p className="text-xs text-muted-foreground mb-2">{ambassador.role}</p>
                )}
                <div className="flex gap-2">
                  {ambassador.instagram && <Instagram className="h-4 w-4 text-muted-foreground" />}
                  {ambassador.facebook && <Facebook className="h-4 w-4 text-muted-foreground" />}
                  {ambassador.twitter && <Twitter className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
