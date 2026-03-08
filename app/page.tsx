"use client"

import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import { HeroBanner } from "@/components/home/hero-banner"
import { QuickCategories } from "@/components/home/quick-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { PromoCard } from "@/components/home/promo-card"
import { TrendingSection } from "@/components/home/trending-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      
      <main className="space-y-2">
        <HeroBanner />
        <QuickCategories />
        <FeaturedProducts title="Nouveautes" />
        <PromoCard />
        <TrendingSection />
      </main>

      <BottomNav />
    </div>
  )
}
