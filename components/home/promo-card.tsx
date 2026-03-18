"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function PromoCard() {
  return (
    <div className="mx-4 md:mx-6 my-4 md:my-8 text-white">
      <Link
        href="/explorer?filter=promo"
        className="block relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-accent via-accent/80 to-accent/90 p-6 md:p-10 min-h-[140px] md:min-h-[220px] group active:scale-[0.98] transition-all shadow-2xl shadow-accent/20"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white rounded-full blur-[60px] md:blur-[100px] transform translate-x-10 md:translate-x-20 -translate-y-10 md:-translate-y-20" />
          <div className="absolute bottom-0 left-0 w-24 md:w-48 h-24 md:h-48 bg-black rounded-full blur-[40px] md:blur-[80px] transform -translate-x-10 md:-translate-x-16 translate-y-10 md:translate-y-16" />
        </div>

        <div className="relative z-10 h-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 md:space-y-2">
            <p className="text-white/70 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
              OFFRE LIMITÉE
            </p>
            <h3 className="text-2xl md:text-5xl font-black leading-[0.9] italic uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              -20% <span className="text-transparent [-webkit-text-stroke:1px_white] opacity-60">GLOBAL</span>
              <br />
              <span className="text-xs md:text-xl tracking-widest font-bold opacity-80 uppercase">SUR TOUT LE SITE</span>
            </h3>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="px-3 md:px-5 py-2 md:py-3 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 flex items-center gap-3 group-hover:bg-white/20 transition-all">
               <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">CODE: GRANDSON20</span>
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-12 md:w-20 h-12 md:h-20 border border-white/10 rounded-full" />
      </Link>
    </div>
  )
}
