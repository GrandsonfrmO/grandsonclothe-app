"use client"

import { Bell, Menu, Home, ShoppingBag, Heart, User, Package, Settings, LogOut, ChevronRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { SiteLogo } from "@/components/site-logo"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
}

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

export function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const [hasNotification] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3 flex-1">
          {showBack ? (
            <Link 
              href="/" 
              className="p-2 -ml-2 rounded-xl hover:bg-secondary/80 active:bg-secondary transition-all touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl touch-manipulation active:scale-95 transition-all hover:bg-secondary/80"
                >
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm bg-background p-0 border-r border-border/50">
                <div className="flex flex-col h-full">
                  {/* Header du menu */}
                  <div className="p-6 pb-4 bg-gradient-to-br from-accent/10 to-transparent">
                    <div className="mb-4">
                      <SiteLogo showTagline />
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
                          onClick={() => setIsMenuOpen(false)}
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
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-sm font-medium flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                              0
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
                            onClick={() => setIsMenuOpen(false)}
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
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-sm font-medium">{item.name}</span>
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            logout()
                            setIsMenuOpen(false)
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
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button className="w-full rounded-xl touch-manipulation" size="lg">
                            Se connecter
                          </Button>
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsMenuOpen(false)}
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
          )}
          
          {title ? (
            <h1 className="text-base font-semibold truncate">{title}</h1>
          ) : (
            <SiteLogo linkTo="/" />
          )}
        </div>

        {/* Notifications */}
        <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl relative touch-manipulation active:scale-95 transition-all hover:bg-secondary/80 flex-shrink-0"
            >
              <Bell className="w-5 h-5" />
              {hasNotification && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse pointer-events-none shadow-lg shadow-accent/50" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm bg-background p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 pb-4 border-b border-border/50">
                <h2 className="text-xl font-bold">Notifications</h2>
                <p className="text-xs text-muted-foreground mt-1">Restez informé de vos commandes</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="p-4 bg-accent/10 rounded-xl border border-accent/20 touch-manipulation">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1">Bienvenue !</p>
                      <p className="text-xs text-muted-foreground">Découvrez nos dernières collections streetwear</p>
                      <p className="text-xs text-muted-foreground mt-2">Il y a 2 min</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Aucune autre notification</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
