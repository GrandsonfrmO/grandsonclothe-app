"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = [
  { name: "HOODIES", icon: "H", num: "01", href: "/explorer?cat=hoodies" },
  { name: "T-SHIRTS", icon: "T", num: "02", href: "/explorer?cat=tshirts" },
  { name: "PANTALONS", icon: "P", num: "03", href: "/explorer?cat=pants" },
  { name: "KIMONOS", icon: "K", num: "04", href: "/explorer?cat=kimonos" },
  { name: "COFFRETS", icon: "C", num: "05", href: "/explorer?cat=sets" },
]

export function QuickCategories() {
  return (
    <section className="px-6 py-12 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section Premium */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-accent to-accent/20 rounded-full" />
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                ARCHIVES & COLLECTIONS
              </h2>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-5">
              Sélection par catalogue
            </p>
          </div>
          <Link href="/explorer" className="group flex items-center gap-3">
            <span className="text-[10px] font-black text-muted-foreground group-hover:text-accent uppercase tracking-widest transition-colors">
              Tout Explorer
            </span>
            <div className="w-8 h-[1px] bg-white/20 group-hover:bg-accent group-hover:w-12 transition-all duration-500" />
          </Link>
        </div>
        
        {/* Carrousel Streetwear */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex flex-col gap-3 min-w-[140px] sm:min-w-[160px] group snap-start"
            >
              {/* Carte Premium (Aspect Portrait) */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl group-hover:scale-[1.02] border border-white/5 bg-secondary/10 group-hover:bg-secondary/30 overflow-hidden">
                
                {/* Background gradient orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-accent/10 blur-[40px] group-hover:bg-accent/40 rounded-full transition-all duration-700" />
                
                {/* Top micro elements */}
                <div className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-accent/80 transition-colors">
                  {cat.num}
                </div>
                <div className="absolute top-4 right-4 text-muted-foreground/30 text-[10px] font-light">
                   +
                </div>
                <div className="absolute bottom-4 left-4 text-muted-foreground/30 text-[10px] font-light">
                   +
                </div>
                <div className="absolute bottom-4 right-4 text-muted-foreground/30 text-[10px] font-light">
                   +
                </div>

                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Monogramme Géant (avec padding pour ne pas couper l'italique) */}
                <span 
                  className="text-6xl md:text-7xl font-black italic relative z-10 transition-all duration-700 text-transparent bg-clip-text bg-gradient-to-br from-white/80 to-white/20 group-hover:scale-110 group-hover:from-accent group-hover:to-accent/40 group-hover:rotate-6 drop-shadow-2xl px-6 py-4" 
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {cat.icon}
                </span>
                
                {/* Reveal au survol */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out flex items-end justify-center pb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent animate-pulse">
                     Découvrir
                  </span>
                </div>
              </div>
              
              {/* Label de la collection */}
              <div className="flex items-center justify-between px-2">
                 <span className="text-xs md:text-sm font-black italic uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white transition-colors">
                   {cat.name}
                 </span>
                 <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-accent group-hover:scale-150 transition-all shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
