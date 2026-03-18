"use client"

import { AdminSidebarImproved as AdminSidebar } from "@/components/2tact/admin-sidebar-improved"
import { AdminGuard } from "@/components/2tact-guard"
import { Toaster } from "@/components/ui/sonner"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/2tact/login'

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background">
        <main className="min-h-screen w-full">
          {children}
        </main>
        <Toaster />
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </AdminGuard>
  )
}
