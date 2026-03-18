"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface GalleryImage {
  id: number
  imageUrl?: string
  image_url?: string
  customerName?: string
  customer_name?: string
  caption?: string
}

export function CustomerGallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/customer-gallery')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la galerie:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || images.length === 0) return null

  return (
    <section className="py-8 overflow-hidden w-full mt-4 container-spacing">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-8 bg-gradient-to-b from-accent to-accent/20 rounded-full" />
               <h2 className="text-3xl font-black italic tracking-tighter uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                 COMMUNAUTÉ & HÉRITAGE
               </h2>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-5">
              Ils portent l'étendard Grandson au quotidien
            </p>
          </div>
          <p className="text-[10px] font-black text-muted-foreground/40 mb-2 uppercase tracking-widest hidden sm:block">
             Génération {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 px-6 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Centering spacer for large screens */}
          <div className="hidden xl:block flex-none w-[calc((100vw-80rem)/2-1.5rem)]" />
          
          {images.map((image) => {
            const imgUrl = image.imageUrl || image.image_url || ''
            const customerName = image.customerName || image.customer_name || ''
            
            return (
              <Link 
                href={`/gallery/${image.id}`} 
                key={image.id} 
                className="relative flex-none w-[80vw] sm:w-[350px] md:w-[400px] h-[450px] sm:h-[500px] snap-center group rounded-[2rem] overflow-hidden shadow-2xl border border-white/5"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
                
                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                
                {/* Only the name on the image */}
                <div className="absolute bottom-8 left-8 right-8 z-10">
                   <h3 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                     {customerName}
                   </h3>
                </div>
              </Link>
            )
          })}
          
          {/* Right spacer for safe area */}
          <div className="flex-none w-[4vw] sm:w-[1rem] xl:w-[calc((100vw-80rem)/2)]" />
        </div>
      </div>
    </section>
  )
}
