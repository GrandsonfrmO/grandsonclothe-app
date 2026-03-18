"use client"

import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home,      label: "Accueil",  href: "/",        center: false },
  { icon: Heart,     label: "Favoris",  href: "/wishlist", center: false },
  { icon: Compass,   label: "Explorer", href: "/explorer", center: true  },
  { icon: ShoppingBag, label: "Panier", href: "/cart",    center: false },
  { icon: User,      label: "Profil",   href: "/profile",  center: false },
]

export function BottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] w-full animate-in slide-in-from-bottom-5 duration-700 bg-background/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)]">
      <nav className="relative w-full max-w-md mx-auto">
        <div className="flex items-end justify-around px-2 pb-2 pt-1 h-[72px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const isCart = item.href === "/cart"

            if (item.center) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative -mt-5 flex flex-col items-center gap-1 pb-1 group active:scale-90 transition-transform duration-200"
                >
                  {/* Center pill button */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-[1.4rem] flex items-center justify-center shadow-xl transition-all duration-500",
                      isActive
                        ? "bg-accent shadow-accent/40 scale-105"
                        : "bg-accent/90 shadow-accent/20 group-hover:scale-105 group-hover:shadow-accent/40"
                    )}
                  >
                    <Icon className="w-6 h-6 text-white stroke-[1.8]" />
                  </div>
                  <span
                    className={cn(
                      "text-[8px] font-black uppercase tracking-[0.15em] transition-colors duration-300",
                      isActive ? "text-accent" : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-400 relative flex-1 group active:scale-90",
                  isActive ? "text-accent" : "text-muted-foreground/50 hover:text-muted-foreground/80"
                )}
              >
                {/* Active background pill */}
                {isActive && (
                  <div className="absolute inset-x-2 inset-y-1 bg-accent/10 rounded-xl -z-10 animate-in fade-in zoom-in-75 duration-300" />
                )}

                <div className="relative">
                  <Icon
                    className={cn(
                      "w-[21px] h-[21px] transition-all duration-400",
                      isActive ? "stroke-[2px]" : "stroke-[1.5px] group-hover:scale-110"
                    )}
                  />
                  {isCart && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] bg-accent text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-accent/40 ring-1 ring-background animate-in zoom-in-50 duration-300">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-[8px] font-black tracking-[0.12em] uppercase transition-all duration-300",
                    isActive ? "opacity-100 italic" : "opacity-30 group-hover:opacity-60"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
