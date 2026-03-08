"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
}

export function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const [hasNotification] = useState(true)

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          {title ? (
            <h1 className="text-lg font-semibold">{title}</h1>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">GC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight leading-none">GRANDSON</span>
                <span className="text-[10px] text-muted-foreground tracking-widest">CLOTHES</span>
              </div>
            </Link>
          )}
        </div>

        <Button variant="ghost" size="icon" className="rounded-xl relative">
          <Bell className="w-5 h-5" />
          {hasNotification && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
          )}
        </Button>
      </div>
    </header>
  )
}
