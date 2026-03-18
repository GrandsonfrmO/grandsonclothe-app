"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles } from "lucide-react"
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (images.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [images.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe()
  }

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  if (loading || images.length === 0) {
    return null
  }

  const currentImage = images[currentSlide]
  const imageUrl = currentImage.imageUrl || currentImage.image_url || ''
  const customerName = currentImage.customerName || currentImage.customer_name || ''

  return (
    <section className="px-4 my-12">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Ils portent notre marque
          </h2>
        </div>
        <p className="text-sm text-muted-foreground ml-4">Swipe pour découvrir</p>
      </div>

      <Link href={`/gallery/${currentImage.id}`}>
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[600px] overflow-hidden rounded-3xl shadow-2xl group cursor-grab active:cursor-grabbing hover:shadow-3xl transition-shadow"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

          {images.map((image, index) => {
            const imgUrl = image.imageUrl || image.image_url || ''
            return (
              <div
                key={image.id}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  index === currentSlide
                    ? "opacity-100 scale-100 translate-x-0"
                    : index < currentSlide
                    ? "opacity-0 scale-95 -translate-x-full"
                    : "opacity-0 scale-95 translate-x-full"
                )}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
                
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )
          })}

          <div className="absolute inset-0 flex flex-col justify-start pt-12 px-8 z-10">
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {customerName}
            </h3>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentSlide(index)
                }}
                className={cn(
                  "transition-all duration-300 rounded-full backdrop-blur-sm",
                  index === currentSlide
                    ? "w-10 h-3 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg"
                    : "w-3 h-3 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute bottom-8 right-8 z-20">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-5 py-2.5 shadow-lg">
              <p className="text-white/90 text-sm font-bold">
                {currentSlide + 1}/{images.length}
              </p>
            </div>
          </div>

          <div className="absolute top-8 left-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
              <Sparkles className="w-4 h-4" />
              Swipe pour naviguer
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}
