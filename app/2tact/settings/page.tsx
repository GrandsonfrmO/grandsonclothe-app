"use client"

import { useState } from "react"
import { Store, Bell, CreditCard, Truck, Globe, Shield, Save, Upload, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/2tact/page-header"
import { ThemeManager } from "@/components/2tact/theme-manager"

const settingsSections = [
  { id: "store", label: "Boutique", icon: Store },
  { id: "theme", label: "Couleurs", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payment", label: "Paiement", icon: CreditCard },
  { id: "shipping", label: "Livraison", icon: Truck },
  { id: "localization", label: "Localisation", icon: Globe },
  { id: "security", label: "Sécurité", icon: Shield },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("store")
  const [storeSettings, setStoreSettings] = useState({
    name: "GRANDSON CLOTHES",
    email: "contact@grandsonclothes.gn",
    phone: "+224 622 000 000",
    address: "Kaloum, Conakry, Guinee",
    whatsapp: "+224 622 000 000",
    instagram: "@grandsonclothes",
    facebook: "GRANDSON CLOTHES",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newOrder: true,
    lowStock: true,
    newCustomer: false,
    orderShipped: true,
    orderDelivered: false,
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: "500000",
    conakryFee: "25000",
    otherCitiesFee: "50000",
    estimatedDaysConakry: "1-2",
    estimatedDaysOther: "3-5",
  })

  const handleSave = () => {
    alert("Paramètres sauvegardés avec succès!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-4 lg:p-8">
          <PageHeader
            title="Paramètres"
            description="Configurez votre boutique"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-2 space-y-1 sticky top-24">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeSection === "store" && (
              <Card className="p-6 border-border">
                <h2 className="text-xl font-bold mb-6">Informations de la boutique</h2>
                
                {/* Logo */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent-foreground">GC</span>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Changer le logo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom de la boutique</label>
                    <Input
                      value={storeSettings.name}
                      onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      value={storeSettings.email}
                      onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <Input
                      value={storeSettings.phone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp</label>
                    <Input
                      value={storeSettings.whatsapp}
                      onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Adresse</label>
                    <Input
                      value={storeSettings.address}
                      onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    <Input
                      value={storeSettings.instagram}
                      onChange={(e) => setStoreSettings({ ...storeSettings, instagram: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Facebook</label>
                    <Input
                      value={storeSettings.facebook}
                      onChange={(e) => setStoreSettings({ ...storeSettings, facebook: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2 bg-accent hover:bg-accent/90">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </Card>
            )}

            {activeSection === "theme" && (
              <Card className="p-6 border-border">
                <ThemeManager />
              </Card>
            )}

            {activeSection === "shipping" && (
              <Card className="p-6 border-border">
                <h2 className="text-xl font-bold mb-6">Paramètres de livraison</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Livraison gratuite à partir de</label>
                    <Input
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frais Conakry</label>
                    <Input
                      value={shippingSettings.conakryFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, conakryFee: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frais autres villes</label>
                    <Input
                      value={shippingSettings.otherCitiesFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, otherCitiesFee: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Délai Conakry (jours)</label>
                    <Input
                      value={shippingSettings.estimatedDaysConakry}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDaysConakry: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Délai autres villes (jours)</label>
                    <Input
                      value={shippingSettings.estimatedDaysOther}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDaysOther: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2 bg-accent hover:bg-accent/90">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </Card>
            )}

            {activeSection === "notifications" && (
              <Card className="p-6 border-border">
                <h2 className="text-xl font-bold mb-6">Notifications</h2>
                
                <div className="space-y-4">
                  {[
                    { key: "newOrder", label: "Nouvelle commande" },
                    { key: "lowStock", label: "Stock faible" },
                    { key: "newCustomer", label: "Nouveau client" },
                    { key: "orderShipped", label: "Commande expédiée" },
                    { key: "orderDelivered", label: "Commande livrée" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>

                <Button onClick={handleSave} className="gap-2 bg-accent hover:bg-accent/90 mt-6">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </Card>
            )}

            {activeSection === "security" && (
              <Card className="p-6 border-border">
                <h2 className="text-xl font-bold mb-6">Sécurité</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Changer le mot de passe</p>
                    <Button variant="outline">Modifier le mot de passe</Button>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Authentification à deux facteurs</p>
                    <Button variant="outline">Activer 2FA</Button>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Sessions actives</p>
                    <Button variant="outline">Gérer les sessions</Button>
                  </div>
                </div>
              </Card>
            )}

            {!["store", "theme", "shipping", "notifications", "security"].includes(activeSection) && (
              <Card className="p-6 border-border text-center text-muted-foreground">
                <p>Section en développement</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
