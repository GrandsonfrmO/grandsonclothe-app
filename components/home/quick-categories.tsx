"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = [
  { name: "Hoodies", icon: "H", color: "bg-accent", href: "/explorer?cat=hoodies" },
  { name: "T-Shirts", icon: "T", color: "bg-secondary", href: "/explorer?cat=tshirts" },
  { name: "Pants", icon: "P", color: "bg-secondary", href: "/explorer?cat=pants" },
  { name: "Caps", icon: "C", color: "bg-secondary", href: "/explorer?cat=caps" },
  { name: "New", icon: "N", color: "bg-accent", href: "/explorer?filter=new" },
]

export function QuickCategories() {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Link href="/explorer" className="text-sm text-accent">Voir tout</Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="flex flex-col items-center gap-2 min-w-[72px]"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform active:scale-95",
              cat.color,
              cat.color === "bg-accent" ? "text-accent-foreground" : "text-secondary-foreground"
            )}>
              <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {cat.icon}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
