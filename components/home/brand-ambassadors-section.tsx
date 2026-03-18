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
  const [showAll, setShowAll] = useState(false)

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

  if (loading || ambassadors.length === 0) return null

  const displayedAmbassadors = showAll ? ambassadors : ambassadors.slice(0, 4)

  return (
    <section className="px-6 py-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] -mr-64 -mt-64 rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-8 bg-accent rounded-full animate-pulse" />
             <h2 className="text-3xl font-black italic tracking-tighter uppercase" style={{ fontFamily: 'var(--font-display)' }}>
               ÉLITE & AMBASSADEURS
             </h2>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-5">
            Porte-étendards de l'excellence Grandson
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedAmbassadors.map((ambassador, idx) => (
            <Link 
              key={ambassador.id} 
              href={`/ambassadors/${ambassador.id}`}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-secondary/10 border border-white/5 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:-rotate-1 group-hover:border-accent/40 shadow-black/20 group-hover:shadow-accent/10">
                <Image
                  src={ambassador.profileImage || ambassador.profile_image || ''}
                  alt={ambassador.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">
                      {ambassador.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-3">
                       <p className="text-[8px] font-black text-accent uppercase tracking-widest truncate max-w-[100px]">
                         {ambassador.role || "Icône"}
                       </p>
                       <div className="flex gap-2">
                         {ambassador.instagram && <Instagram className="h-3 w-3 text-white/40 hover:text-accent transition-colors" />}
                         {ambassador.facebook && <Facebook className="h-3 w-3 text-white/40 hover:text-accent transition-colors" />}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {ambassadors.length > 4 && !showAll && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="px-10 py-5 bg-background border border-border/40 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-accent/20"
            >
              Voir la suite du Manifeste
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
