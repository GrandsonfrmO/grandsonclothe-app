"use client"

import { AdminSidebar } from "@/components/2tact/admin-sidebar"
import { AdminGuard } from "@/components/admin-guard"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
  )
}

export default function TwoTactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </main>
      </div>
      <Toaster />
    </AdminGuard>
  )
}
