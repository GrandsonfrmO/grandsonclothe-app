"use client"

import { AdminSidebar } from "@/components/2tact/admin-sidebar"
import { AdminGuard } from "@/components/admin-guard"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
