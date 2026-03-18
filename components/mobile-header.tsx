"use client"

import {
  Bell, Menu, Home, ShoppingBag, Heart, User, Package,
  Settings, LogOut, ChevronRight, Shield, X, Check,
  Trash2, Search, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/hooks/use-notifications"
import { SiteLogo } from "@/components/site-logo"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
}

const navigation = [
  { name: "NOUVEAUTÉS", href: "/search?category=nouveautes", emoji: "N" },
  { name: "HOODIES", href: "/search?category=hoodies", emoji: "H" },
  { name: "T-SHIRTS", href: "/search?category=tshirts", emoji: "T" },
  { name: "PANTALONS", href: "/search?category=pantalons", emoji: "P" },
  { name: "ACCESSOIRES", href: "/search?category=accessoires", emoji: "A" },
]

const quickLinks = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Panier", href: "/cart", icon: ShoppingBag },
  { name: "Favoris", href: "/wishlist", icon: Heart },
]

const accountLinks = [
  { name: "Mon Profil", href: "/profile", icon: User },
  { name: "Mes Commandes", href: "/orders", icon: Package },
  { name: "Paramètres", href: "/profile/settings", icon: Settings },
]

const notificationIcons: Record<string, string> = {
  order_created: "📦",
  order_processing: "⏳",
  order_shipped: "🚚",
  order_delivered: "✅",
  order_cancelled: "❌",
  payment_received: "💰",
  product_review: "⭐",
}

export function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const router = useRouter()

  const recentNotifications = useMemo(() => notifications.slice(0, 10), [notifications])

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Glass layer */}
      <div className="absolute inset-0 bg-background/75 backdrop-blur-2xl border-b border-white/5" />

      <div className="relative flex items-center justify-between h-[60px] px-4 max-w-7xl mx-auto">
        {/* LEFT — Menu or Back */}
        <div className="flex items-center gap-1 w-16">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-secondary/60 active:scale-90 transition-all"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          ) : (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-secondary/50 active:scale-90 transition-all group">
                  <div className="flex flex-col gap-[5px]">
                    <span className="block w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 group-hover:w-4" />
                    <span className="block w-4 h-[1.5px] bg-current rounded-full transition-all duration-300 group-hover:w-5" />
                    <span className="block w-5 h-[1.5px] bg-current rounded-full transition-all duration-300" />
                  </div>
                </button>
              </SheetTrigger>

              {/* ─── SIDE MENU ─── */}
              <SheetContent
                side="left"
                className="w-[82vw] max-w-xs bg-background/95 backdrop-blur-3xl p-0 border-r border-white/5 shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  {/* Menu header */}
                  <div className="p-7 pb-5 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-4">
                      <SiteLogo showTagline />
                      {user && (
                        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-sm font-black italic truncate">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground/50 font-bold tracking-widest uppercase truncate mt-0.5">{user.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 scrollbar-hide">
                    {/* Collections */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] px-2 mb-3">Collections</p>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-base font-black italic text-accent/80" style={{ fontFamily: 'var(--font-display)' }}>{item.emoji}</span>
                          <span className="text-sm font-black tracking-widest italic flex-1 group-hover:translate-x-0.5 transition-transform">{item.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-accent transition-colors" />
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Quick links */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] px-2 mb-3">Navigation</p>
                      {quickLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-9 h-9 rounded-xl bg-secondary/40 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                            <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors stroke-[1.5]" />
                          </div>
                          <span className="text-sm font-bold flex-1">{item.name}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Account */}
                    {user ? (
                      <div className="space-y-1 pb-6">
                        <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] px-2 mb-3">Compte</p>
                        {user.role === "admin" && (
                          <Link
                            href="/2tact/dashboard"
                            className="flex items-center gap-3 px-3 py-3.5 rounded-2xl bg-accent/10 border border-accent/20 text-accent active:scale-95 transition-all mb-3 group"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                              <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">Admin</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                          </Link>
                        )}
                        {accountLinks.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="w-9 h-9 rounded-xl bg-secondary/40 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                              <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors stroke-[1.5]" />
                            </div>
                            <span className="text-sm font-bold">{item.name}</span>
                          </Link>
                        ))}
                        <button
                          onClick={() => { logout(); setIsMenuOpen(false) }}
                          className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-rose-500/10 active:scale-95 transition-all group text-rose-500 mt-2"
                        >
                          <div className="w-9 h-9 rounded-xl bg-rose-500/5 flex items-center justify-center">
                            <LogOut className="w-4 h-4 stroke-[1.5]" />
                          </div>
                          <span className="text-sm font-bold">Déconnexion</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 pb-6">
                        <Link href="/auth/login" className="block" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-accent shadow-xl shadow-accent/20">
                            Se connecter
                          </Button>
                        </Link>
                        <Link href="/auth/signup" className="block" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-white/10 hover:bg-white/5">
                            Créer un compte
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-t border-white/5">
                    <p className="text-[9px] font-black text-center text-muted-foreground/20 uppercase tracking-[0.4em]">
                      © 2026 GRANDSON CLOTHES
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* CENTER — Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          {title ? (
            <h1 className="text-sm font-black uppercase tracking-[0.2em] italic">{title}</h1>
          ) : (
            <SiteLogo linkTo="/" />
          )}
        </div>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-0.5 w-16 justify-end">
          {/* Search */}
          <Link href="/search">
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-secondary/50 active:scale-90 transition-all">
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
          </Link>

          {/* Notifications */}
          <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <SheetTrigger asChild>
              <button className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-secondary/50 active:scale-90 transition-all relative">
                <Bell className="w-[18px] h-[18px] stroke-[1.5]" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full ring-2 ring-background animate-pulse" />
                )}
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[82vw] max-w-xs bg-background/95 backdrop-blur-3xl p-0 border-l border-white/5 shadow-2xl">
              <div className="flex flex-col h-full">
                <div className="p-7 pb-5 border-b border-white/5 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-black italic tracking-tighter uppercase">Alertes</h2>
                    {unreadCount > 0 && (
                      <p className="text-[9px] text-accent font-black uppercase tracking-widest mt-0.5">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent/10 rounded-xl px-3 py-1.5 transition-colors"
                    >
                      Tout lire
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-hide">
                  {recentNotifications.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-secondary/30 rounded-3xl flex items-center justify-center mx-auto">
                        <Bell className="w-7 h-7 text-muted-foreground/20" />
                      </div>
                      <p className="text-sm font-black italic tracking-tight">Silence Radio</p>
                      <p className="text-[9px] text-muted-foreground/30 uppercase font-black tracking-widest">Aucune notification</p>
                    </div>
                  ) : (
                    recentNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "group relative p-4 rounded-2xl border transition-all duration-300",
                          !notification.isRead ? "bg-accent/[0.04] border-accent/20" : "bg-white/[0.02] border-white/5"
                        )}
                      >
                        {!notification.isRead && (
                          <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-accent rounded-full" />
                        )}
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                            {notificationIcons[notification.type] || "📢"}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-black italic text-sm tracking-tight mb-0.5">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{notification.message}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                              </span>
                              <div className="flex gap-1">
                                {!notification.isRead && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1.5 hover:bg-accent/10 rounded-lg text-accent transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 5 && (
                  <div className="p-5 border-t border-white/5">
                    <button
                      onClick={() => { router.push("/notifications"); setIsNotificationOpen(false) }}
                      className="w-full h-11 rounded-2xl border border-white/10 font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent" /> Toutes les archives
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
