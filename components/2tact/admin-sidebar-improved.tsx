"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Truck,
  Mail,
  Bell,
  UserCog,
  Image,
  Camera,
  Award
} from "lucide-react"
import { useState } from "react"
import { SiteLogo } from "@/components/site-logo"

const navItems = [
  { href: "/2tact/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/2tact/products", icon: Package, label: "Produits" },
  { href: "/2tact/orders", icon: ShoppingCart, label: "Commandes" },
  { href: "/2tact/customers", icon: Users, label: "Clients" },
  { href: "/2tact/delivery-zones", icon: Truck, label: "Zones de livraison" },
  { href: "/2tact/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/2tact/marketing", icon: Mail, label: "Marketing" },
  { href: "/2tact/notifications", icon: Bell, label: "Notifications" },
  { href: "/2tact/users", icon: UserCog, label: "Utilisateurs" },
  { href: "/2tact/ambassadors", icon: Award, label: "Ambassadeurs" },
  { href: "/2tact/customer-gallery", icon: Camera, label: "Galerie Clients" },
  { href: "/2tact/hero-images", icon: Image, label: "Images Hero" },
  { href: "/2tact/settings", icon: Settings, label: "Parametres" },
]

export function AdminSidebarImproved() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section - Improved */}
          <div className="flex items-center justify-between h-20 px-4 border-b border-border">
            <Link 
              href="/2tact/dashboard" 
              className="flex items-center gap-2 flex-1 hover:opacity-80 transition-opacity"
            >
              <SiteLogo className="text-sm" />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-secondary rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all
                    ${isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="font-semibold">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">admin@grandson.gn</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Deconnexion
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
