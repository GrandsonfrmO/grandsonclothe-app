"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const defaultSlides = [
  {
    id: 1,
    title: "NEW DROP",
    subtitle: "Collection 2026",
    imageUrl: "/images/hero-streetwear-1.jpg",
    ctaText: "Decouvrir",
    ctaLink: "/explorer",
  },
  {
    id: 2,
    title: "STREET VIBES",
    subtitle: "Made in Guinea",
    imageUrl: "/images/hero-streetwear-2.jpg",
    ctaText: "Explorer",
    ctaLink: "/explorer",
  },
]

import Image from "next/image"

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<any[]>(defaultSlides)

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch('/api/hero-images')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setSlides(data)
          }
        }
      } catch (error) {
        console.error('Failed to load hero images', error)
      }
    }
    fetchHero()
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative h-[65vh] md:h-[75vh] min-h-[450px] overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] mx-2 md:mx-4 mt-4 md:mt-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-white/5 bg-black group-banner">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)",
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          )}
        >
          <Image
            src={slide.imageUrl || slide.image || ''}
            alt={slide.title || 'HERO IMAGE'}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="95vw"
          />
          {/* Majestic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 right-6 md:right-12 space-y-4 md:space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-3">
                 <span className="w-6 md:w-8 h-[1px] bg-accent" />
                 <p className="text-accent text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase">
                   {slide.subtitle || ""}
                 </p>
              </div>
              <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter italic uppercase leading-[0.85] text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {(slide.title || "").split(' ')[0] || ""}<br />
                <span className="text-transparent border-t-text-accent [-webkit-text-stroke:1px_white] md:[-webkit-text-stroke:1.5px_white] opacity-60">{(slide.title || "").split(' ').slice(1).join(' ') || ""}</span>
              </h2>
            </div>
            
            {(slide.ctaLink || slide.href) && (
              <Link href={slide.ctaLink || slide.href || "/explorer"} className="inline-block">
                <Button className="rounded-full px-8 md:px-12 h-12 md:h-16 gap-3 md:gap-4 bg-accent text-white hover:bg-accent/90 shadow-2xl shadow-accent/20 group/btn transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-widest text-[9px] md:text-[10px]">
                  {slide.ctaText || slide.cta || "DÉCOUVRIR"}
                  <ChevronRight className="w-4 h-4 md:w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Modern Slide indicators */}
      <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 flex flex-col gap-3 md:gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group flex flex-col items-end gap-1.5 md:gap-2"
          >
            <div className={cn(
              "h-1 rounded-full transition-all duration-700",
              index === currentSlide
                ? "w-10 md:w-16 bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"
                : "w-3 md:w-4 bg-foreground/20 group-hover:bg-foreground/40"
            )} />
            {index === currentSlide && (
               <span className="text-[8px] md:text-[10px] font-black italic opacity-40">0{index + 1}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
