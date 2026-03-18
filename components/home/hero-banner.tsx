"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    title: "NEW DROP",
    subtitle: "Collection 2026",
    image: "/images/hero-streetwear-1.jpg",
    cta: "Decouvrir",
    href: "/explorer",
  },
  {
    id: 2,
    title: "STREET VIBES",
    subtitle: "Made in Guinea",
    image: "/images/hero-streetwear-2.jpg",
    cta: "Explorer",
    href: "/explorer",
  },
]

import Image from "next/image"

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[65vh] min-h-[400px] overflow-hidden rounded-3xl mx-4 mt-4">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out",
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="95vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-accent text-sm font-semibold tracking-wider uppercase">
                {slide.subtitle}
              </p>
              <h2 className="text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {slide.title}
              </h2>
            </div>
            
            <Link href={slide.href}>
              <Button className="rounded-full px-6 h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                {slide.cta}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-8 bg-accent"
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}
