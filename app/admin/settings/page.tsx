"use client"

import { useState } from "react"
import { Store, Bell, CreditCard, Truck, Globe, Shield, Save, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const settingsSections = [
  { id: "store", label: "Boutique", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payment", label: "Paiement", icon: CreditCard },
  { id: "shipping", label: "Livraison", icon: Truck },
  { id: "localization", label: "Localisation", icon: Globe },
  { id: "security", label: "Securite", icon: Shield },
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

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="lg:pl-12 mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold">Parametres</h1>
        <p className="text-muted-foreground">Configurez votre boutique</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-2 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === section.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-secondary"
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
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Informations de la boutique</h2>
              
              {/* Logo */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Logo</label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                    className="bg-secondary border-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telephone</label>
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

              <div className="mt-6 pt-6 border-t border-border flex justify-end">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Notifications</h2>
              
              <div className="space-y-4">
                {[
                  { key: "newOrder", label: "Nouvelle commande", desc: "Recevoir une notification pour chaque nouvelle commande" },
                  { key: "lowStock", label: "Stock faible", desc: "Alerte quand un produit a moins de 10 unites" },
                  { key: "newCustomer", label: "Nouveau client", desc: "Notification lors d'une nouvelle inscription" },
                  { key: "orderShipped", label: "Commande expediee", desc: "Confirmation d'expedition" },
                  { key: "orderDelivered", label: "Commande livree", desc: "Confirmation de livraison" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                      })}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        notificationSettings[item.key as keyof typeof notificationSettings]
                          ? "bg-accent"
                          : "bg-secondary"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                        notificationSettings[item.key as keyof typeof notificationSettings]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "shipping" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Livraison</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Seuil de livraison gratuite (GNF)</label>
                  <Input
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })}
                    className="bg-secondary border-0"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Livraison gratuite au-dela de ce montant</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frais Conakry (GNF)</label>
                    <Input
                      value={shippingSettings.conakryFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, conakryFee: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frais autres villes (GNF)</label>
                    <Input
                      value={shippingSettings.otherCitiesFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, otherCitiesFee: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Delai Conakry (jours)</label>
                    <Input
                      value={shippingSettings.estimatedDaysConakry}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDaysConakry: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Delai autres villes (jours)</label>
                    <Input
                      value={shippingSettings.estimatedDaysOther}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDaysOther: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex justify-end">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          )}

          {activeSection === "payment" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Methodes de paiement</h2>
              
              <div className="space-y-4">
                {[
                  { name: "Orange Money", active: true, icon: "OM" },
                  { name: "MTN Money", active: true, icon: "MTN" },
                  { name: "Wave", active: true, icon: "W" },
                  { name: "Paiement a la livraison", active: true, icon: "COD" },
                ].map((method) => (
                  <div key={method.name} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center font-bold text-sm">
                        {method.icon}
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      method.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {method.active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeSection === "localization" || activeSection === "security") && (
            <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-center h-64">
              <p className="text-muted-foreground">Configuration {activeSection === "localization" ? "de localisation" : "de securite"} disponible prochainement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
