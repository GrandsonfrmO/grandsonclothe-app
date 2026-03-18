"use client"

import { SiteLogo } from "@/components/site-logo"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TestLogoLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Test Disposition Logo Admin</h1>
        <p className="text-muted-foreground mb-8">Vérification de la disposition du logo dans différents contextes</p>

        {/* Test 1: Logo dans la sidebar */}
        <Card className="p-8 mb-8 border-border">
          <h2 className="text-2xl font-bold mb-4">1. Logo dans la Sidebar</h2>
          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">GC</span>
                </div>
                <span className="font-bold text-lg">Admin</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Disposition actuelle: Logo simple avec initiales</p>
        </Card>

        {/* Test 2: Logo avec image */}
        <Card className="p-8 mb-8 border-border">
          <h2 className="text-2xl font-bold mb-4">2. Logo avec Image (Sidebar amélioré)</h2>
          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <SiteLogo className="flex-1" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Disposition avec composant SiteLogo</p>
        </Card>

        {/* Test 3: Logo dans le header */}
        <Card className="p-8 mb-8 border-border">
          <h2 className="text-2xl font-bold mb-4">3. Logo dans le Header Admin</h2>
          <div className="bg-background/80 backdrop-blur-md border border-border rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <SiteLogo showTagline={true} />
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-secondary border border-border rounded-lg hover:bg-secondary/80">
                  🔔
                </button>
                <Button className="bg-accent hover:bg-accent/90">+ Nouveau</Button>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Logo avec tagline dans le header</p>
        </Card>

        {/* Test 4: Logo responsive */}
        <Card className="p-8 mb-8 border-border">
          <h2 className="text-2xl font-bold mb-4">4. Logo Responsive (Mobile)</h2>
          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <div className="max-w-sm">
              <div className="flex items-center justify-between h-14 px-4 border-b border-border">
                <SiteLogo />
                <button className="p-2 hover:bg-secondary rounded">☰</button>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Disposition mobile avec logo compact</p>
        </Card>

        {/* Test 5: Logo dans les cartes */}
        <Card className="p-8 mb-8 border-border">
          <h2 className="text-2xl font-bold mb-4">5. Logo dans les Cartes de Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <SiteLogo className="text-sm" />
                </div>
                <p className="text-sm text-muted-foreground">Produit {i}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Logo dans les cartes de contenu</p>
        </Card>

        {/* Test 6: Logo avec différentes tailles */}
        <Card className="p-8 mb-8 border-border">
          <h2 className="text-2xl font-bold mb-4">6. Logo avec Différentes Tailles</h2>
          <div className="space-y-4 mb-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Petit (sidebar)</p>
              <SiteLogo className="text-xs" />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Moyen (header)</p>
              <SiteLogo className="text-base" />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Grand (page)</p>
              <SiteLogo className="text-lg" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Vérification de la scalabilité du logo</p>
        </Card>

        {/* Test 7: Logo avec lien */}
        <Card className="p-8 mb-8 border-border">
          <h2 className="text-2xl font-bold mb-4">7. Logo avec Lien (Clickable)</h2>
          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <SiteLogo linkTo="/2tact/dashboard" showTagline={true} />
          </div>
          <p className="text-sm text-muted-foreground">Logo cliquable qui redirige vers le dashboard</p>
        </Card>

        {/* Résumé */}
        <Card className="p-8 border-border bg-accent/5">
          <h2 className="text-2xl font-bold mb-4">Résumé des Tests</h2>
          <ul className="space-y-2 text-sm">
            <li>✓ Logo simple dans la sidebar (initiales)</li>
            <li>✓ Logo avec image dans la sidebar</li>
            <li>✓ Logo dans le header avec tagline</li>
            <li>✓ Logo responsive pour mobile</li>
            <li>✓ Logo dans les cartes de contenu</li>
            <li>✓ Logo avec différentes tailles</li>
            <li>✓ Logo cliquable avec lien</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Link href="/2tact/dashboard">
              <Button className="bg-accent hover:bg-accent/90">Retour au Dashboard</Button>
            </Link>
            <Link href="/2tact/settings">
              <Button variant="outline">Gérer le Logo</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
