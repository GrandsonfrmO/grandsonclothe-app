"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ShoppingBag, Heart, User, Package, Settings, LogOut, ChevronRight, Home, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/user-menu"
import { SearchBar } from "@/components/search-bar"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"
import { SiteLogo } from "@/components/site-logo"

const navigation = [
  { name: "NOUVEAUTES", href: "/search?category=nouveautes" },
  { name: "HOODIES", href: "/search?category=hoodies" },
  { name: "T-SHIRTS", href: "/search?category=tshirts" },
  { name: "PANTALONS", href: "/search?category=pantalons" },
  { name: "ACCESSOIRES", href: "/search?category=accessoires" },
]

const quickLinks = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Panier", href: "/cart", icon: ShoppingBag, badge: true },
  { name: "Favoris", href: "/wishlist", icon: Heart, badge: true },
]

const accountLinks = [
  { name: "Mon Profil", href: "/profile", icon: User },
  { name: "Mes Commandes", href: "/orders", icon: Package },
  { name: "Paramètres", href: "/profile/settings", icon: Settings },
]

interface HeaderProps {
  cartCount?: number
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { wishlistItems } = useWishlist()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile menu */}
          <div className="flex lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden text-foreground touch-manipulation active:scale-95 transition-all hover:bg-secondary/80 rounded-xl"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm bg-background p-0 border-r border-border/50">
                <div className="flex flex-col h-full">
                  {/* Header du menu */}
                  <div className="p-6 pb-4 bg-gradient-to-br from-accent/10 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-accent-foreground font-bold text-lg">GC</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-[family-name:var(--font-display)] text-2xl tracking-wider">GRANDSON</span>
                        <span className="text-xs text-muted-foreground tracking-widest">CLOTHES</span>
                      </div>
                    </div>
                    {user && (
                      <div className="mt-4 p-3 bg-background/50 rounded-xl backdrop-blur-sm border border-border/50">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation principale */}
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-1 mb-6">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                        Collections
                      </p>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/80 active:bg-secondary transition-all touch-manipulation group"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-sm font-bold tracking-wide flex-1">{item.name}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Liens rapides */}
                    <div className="space-y-1 mb-6">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                        Accès rapide
                      </p>
                      {quickLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/80 active:bg-secondary transition-all touch-manipulation group"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-sm font-medium flex-1">{item.name}</span>
                          {item.badge && item.name === "Panier" && cartCount > 0 && (
                            <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                              {cartCount}
                            </Badge>
                          )}
                          {item.badge && item.name === "Favoris" && wishlistItems.length > 0 && (
                            <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                              {wishlistItems.length}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Compte */}
                    {user ? (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                          Mon compte
                        </p>
                        {user.role === 'admin' && (
                          <Link
                            href="/2tact/dashboard"
                            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-accent/10 hover:bg-accent/20 active:bg-accent/30 transition-all touch-manipulation group mb-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <Shield className="w-5 h-5 text-accent" />
                            <span className="text-sm font-semibold text-accent">Tableau de bord Admin</span>
                          </Link>
                        )}
                        {accountLinks.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/80 active:bg-secondary transition-all touch-manipulation group"
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-sm font-medium">{item.name}</span>
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 active:bg-destructive/20 transition-all touch-manipulation group text-destructive"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          href="/auth/login"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full rounded-xl touch-manipulation" size="lg">
                            Se connecter
                          </Button>
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button variant="outline" className="w-full rounded-xl touch-manipulation" size="lg">
                            Créer un compte
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Footer du menu */}
                  <div className="p-4 border-t border-border/50 bg-secondary/20">
                    <p className="text-xs text-center text-muted-foreground">
                      © 2024 GRANDSON CLOTHES
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex lg:flex-1">
            <SiteLogo linkTo="/" />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wider relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Link href="/search" className="hidden sm:flex flex-1 max-w-xs">
              <SearchBar />
            </Link>
            <UserMenu />
            <Link href="/wishlist" className="touch-manipulation">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-foreground hover:text-accent active:scale-95 transition-all rounded-xl hover:bg-secondary/80"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground pointer-events-none shadow-lg shadow-accent/30"
                  >
                    {wishlistItems.length}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            <Link href="/cart" className="touch-manipulation">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-foreground hover:text-accent active:scale-95 transition-all rounded-xl hover:bg-secondary/80"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground pointer-events-none shadow-lg shadow-accent/30"
                  >
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Panier</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
