"use client"

import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import { HeroBanner } from "@/components/home/hero-banner"
import { QuickCategories } from "@/components/home/quick-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { PromoCard } from "@/components/home/promo-card"
import { TrendingSection } from "@/components/home/trending-section"
import { TopRatedSection } from "@/components/home/top-rated-section"
import { BrandAmbassadorsSection } from "@/components/home/brand-ambassadors-section"
import { CustomerGallerySection } from "@/components/home/customer-gallery-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      
      <main className="space-y-2">
        <HeroBanner />
        <QuickCategories />
        
        {/* Nouveautés - Produits récemment ajoutés */}
        <FeaturedProducts title="Nouveautés" sortBy="recent" />
        
        <PromoCard />
        
        {/* Tendances - Produits populaires/les plus achetés */}
        <TrendingSection />
        
        {/* Mieux Notés - Produits avec les meilleures notes */}
        <TopRatedSection />
        
        {/* Ambassadeurs de la marque */}
        <BrandAmbassadorsSection />
        
        {/* Galerie photos clients */}
        <CustomerGallerySection />
        
        {/* Sélection aléatoire */}
        <FeaturedProducts title="Découvrez aussi" sortBy="random" />
      </main>

      <BottomNav />
    </div>
  )
}
