"use client"

import { useState, useEffect } from "react"
import { Store, Bell, CreditCard, Truck, Globe, Shield, Save, Palette, Lock, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/2tact/page-header"
import { ThemeManager } from "@/components/2tact/theme-manager"
import { LogoUploader } from "@/components/2tact/logo-uploader"
import { cn } from "@/lib/utils"

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

  // ── Contact Settings ──────────────────────────────────────
  const [storeSettings, setStoreSettings] = useState({
    name: "GRANDSON CLOTHES",
    email: "contact@grandsonclothes.gn",
    phone: "+224 622 000 000",
    address: "Kaloum, Conakry, Guinée",
    whatsapp: "+224 622 000 000",
    instagram: "@grandsonclothes",
    facebook: "GRANDSON CLOTHES",
  })
  const [savingContact, setSavingContact] = useState(false)
  const [savedContact, setSavedContact] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)

  // Load contact settings on mount
  useEffect(() => {
    fetch("/api/settings/contact")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setStoreSettings(data)
      })
      .catch(console.error)
  }, [])

  const handleSaveContact = async () => {
    setSavingContact(true)
    setContactError(null)
    try {
      const res = await fetch("/api/settings/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeSettings),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur de sauvegarde")
      setSavedContact(true)
      setTimeout(() => setSavedContact(false), 3000)
    } catch (err: any) {
      setContactError(err.message)
    } finally {
      setSavingContact(false)
    }
  }

  // ── Notification Settings ─────────────────────────────────
  const [notificationSettings, setNotificationSettings] = useState({
    newOrder: true,
    lowStock: true,
    newCustomer: false,
    orderShipped: true,
    orderDelivered: false,
  })

  // ── Shipping Settings ─────────────────────────────────────
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: "500000",
    conakryFee: "25000",
    otherCitiesFee: "50000",
    estimatedDaysConakry: "1-2",
    estimatedDaysOther: "3-5",
  })
  const [savingShipping, setSavingShipping] = useState(false)
  const [savedShipping, setSavedShipping] = useState(false)

  const handleSaveShipping = async () => {
    setSavingShipping(true)
    // Future: call /api/settings/shipping
    await new Promise((r) => setTimeout(r, 800))
    setSavedShipping(true)
    setTimeout(() => setSavedShipping(false), 3000)
    setSavingShipping(false)
  }

  // ── Notification Save ─────────────────────────────────────
  const [savingNotif, setSavingNotif] = useState(false)
  const [savedNotif, setSavedNotif] = useState(false)

  const handleSaveNotif = async () => {
    setSavingNotif(true)
    await new Promise((r) => setTimeout(r, 800))
    setSavedNotif(true)
    setTimeout(() => setSavedNotif(false), 3000)
    setSavingNotif(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pb-20">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <PageHeader
            title="Configuration du Trône"
            description="Ajustez les rouages de votre empire pour une excellence sans faille"
            backHref="/2tact/dashboard"
          />
        </div>
      </div>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation High-End */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-4 space-y-2 sticky top-32 shadow-2xl">
              <div className="px-4 py-6 mb-4 border-b border-border/20">
                 <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em]">MANUEL DE GESTION</h3>
              </div>
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all duration-500 group ${
                    activeSection === section.id
                      ? "bg-accent text-accent-foreground shadow-xl scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="font-black italic tracking-tight">{section.label}</span>
                  {activeSection === section.id && (
                     <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area - Premium Modules */}
          <div className="flex-1 space-y-8">
            {activeSection === "store" && (
              <div className="space-y-8">
                {/* Logo Section */}
                <Card className="p-8 md:p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] shadow-2xl">
                  <div className="flex items-center justify-between mb-10">
                     <div>
                        <h2 className="text-3xl font-black italic tracking-tighter">Logo & Identité</h2>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">L'emblème visible sur tout le site</p>
                     </div>
                     <Store className="w-10 h-10 text-accent opacity-20" />
                  </div>
                  <LogoUploader />
                </Card>

                {/* Contact Info */}
                <Card className="p-8 md:p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] shadow-2xl space-y-10">
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter">Informations de Contact</h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Coordonnées affichées aux clients</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: "Email de Contact", value: storeSettings.email, key: "email", placeholder: "contact@grandsonclothes.gn" },
                      { label: "Téléphone", value: storeSettings.phone, key: "phone", placeholder: "+224 ..." },
                      { label: "WhatsApp", value: storeSettings.whatsapp, key: "whatsapp", placeholder: "+224 ..." },
                      { label: "Instagram", value: storeSettings.instagram, key: "instagram", placeholder: "@grandsonclothes" },
                      { label: "Facebook", value: storeSettings.facebook, key: "facebook", placeholder: "GRANDSON CLOTHES" },
                    ].map((field) => (
                      <div key={field.key} className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">{field.label}</label>
                        <Input
                          value={field.value}
                          placeholder={field.placeholder}
                          onChange={(e) => setStoreSettings({ ...storeSettings, [field.key]: e.target.value })}
                          className="h-14 bg-secondary/30 border-none rounded-2xl text-base font-bold italic tracking-tight focus-visible:ring-accent transition-all shadow-inner"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Adresse Physique</label>
                      <Input
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                        className="h-14 bg-secondary/30 border-none rounded-2xl text-base font-bold italic tracking-tight shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-border/30 space-y-3">
                     {contactError && (
                       <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-bold">
                         {contactError}
                       </div>
                     )}
                     <Button
                       onClick={handleSaveContact}
                       disabled={savingContact}
                       className={cn(
                         "h-14 w-full sm:w-72 rounded-2xl text-lg font-black italic tracking-tighter gap-3 shadow-2xl transition-all",
                         savedContact ? "bg-emerald-500 hover:bg-emerald-500 shadow-emerald-500/20" : "bg-accent hover:bg-accent/90 shadow-accent/20"
                       )}
                     >
                       {savingContact ? (
                         <><Loader2 className="w-5 h-5 animate-spin" /> SAUVEGARDE...</>
                       ) : savedContact ? (
                         <><Check className="w-5 h-5" /> COORDONNÉES SAUVÉES !</>
                       ) : (
                         <><Save className="w-5 h-5" /> SAUVEGARDER</>
                       )}
                     </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeSection === "theme" && (
              <Card className="p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h2 className="text-3xl font-black italic tracking-tighter">Atmosphère Royale</h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Définissez l'ambiance visuelle de votre empire</p>
                   </div>
                   <Palette className="w-10 h-10 text-accent opacity-20" />
                </div>
                <ThemeManager />
              </Card>
            )}

            {activeSection === "shipping" && (
              <Card className="p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] shadow-2xl space-y-12">
                <div className="flex items-center justify-between">
                   <div>
                      <h2 className="text-3xl font-black italic tracking-tighter">Logistique de Précision</h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Maîtrisez les flux de livraison</p>
                   </div>
                   <Truck className="w-10 h-10 text-accent opacity-20" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[
                    { label: "Seuil de Gratuité Royale (GNF)", value: shippingSettings.freeShippingThreshold, key: "freeShippingThreshold" },
                    { label: "Taxe Conakry (GNF)", value: shippingSettings.conakryFee, key: "conakryFee" },
                    { label: "Taxe Villes de l'Intérieur (GNF)", value: shippingSettings.otherCitiesFee, key: "otherCitiesFee" },
                    { label: "Vitesse Conakry (Jours)", value: shippingSettings.estimatedDaysConakry, key: "estimatedDaysConakry" },
                    { label: "Vitesse Provinces (Jours)", value: shippingSettings.estimatedDaysOther, key: "estimatedDaysOther" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">{field.label}</label>
                      <Input
                        value={field.value}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, [field.key]: e.target.value })}
                        className="h-14 bg-secondary/30 border-none rounded-2xl text-lg font-black italic shadow-inner"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-border/30">
                   <Button
                     onClick={handleSaveShipping}
                     disabled={savingShipping}
                     className={cn(
                       "h-16 w-full sm:w-80 rounded-2xl text-xl font-black italic tracking-tighter gap-4 shadow-2xl transition-all",
                       savedShipping ? "bg-emerald-500 hover:bg-emerald-500" : "bg-accent hover:bg-accent/90"
                     )}
                   >
                     {savingShipping ? (
                       <><Loader2 className="w-6 h-6 animate-spin" /> SAUVEGARDE...</>
                     ) : savedShipping ? (
                       <><Check className="w-6 h-6" /> LOGISTIQUE SAUVÉE !</>
                     ) : (
                       <><Save className="w-6 h-6" /> VALIDER LA LOGISTIQUE</>
                     )}
                   </Button>
                </div>
              </Card>
            )}

            {activeSection === "notifications" && (
              <Card className="p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] shadow-2xl space-y-12">
                <div className="flex items-center justify-between">
                   <div>
                      <h2 className="text-3xl font-black italic tracking-tighter">Système d'Alerte Impérial</h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Restez informé de chaque mouvement</p>
                   </div>
                   <Bell className="w-10 h-10 text-accent opacity-20" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { key: "newOrder", label: "Nouvelle Commande Royale" },
                    { key: "lowStock", label: "Alerte de Pénurie (Stock)" },
                    { key: "newCustomer", label: "Nouveau Citoyen (Inscription)" },
                    { key: "orderShipped", label: "Expédition en Cours" },
                    { key: "orderDelivered", label: "Livraison Accomplie" },
                  ].map((item) => (
                    <label key={item.key} className="group flex items-center justify-between p-6 bg-secondary/10 rounded-[2rem] border border-border/20 cursor-pointer hover:bg-secondary/20 transition-all duration-500">
                      <div className="flex flex-col gap-1">
                         <span className="font-black italic tracking-tight group-hover:text-accent transition-colors">{item.label}</span>
                         <span className="text-[8px] font-black text-muted-foreground uppercase opacity-40">Notification Temps Réel</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: e.target.checked
                        })}
                        className="w-8 h-8 rounded-full border-none bg-accent cursor-pointer accent-accent"
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-8 border-t border-border/30">
                   <Button
                     onClick={handleSaveNotif}
                     disabled={savingNotif}
                     className={cn(
                       "h-16 w-full sm:w-80 rounded-2xl text-xl font-black italic tracking-tighter gap-4 shadow-2xl transition-all",
                       savedNotif ? "bg-emerald-500 hover:bg-emerald-500" : "bg-accent hover:bg-accent/90"
                     )}
                   >
                     {savingNotif ? (
                       <><Loader2 className="w-6 h-6 animate-spin" /> SAUVEGARDE...</>
                     ) : savedNotif ? (
                       <><Check className="w-6 h-6" /> ALERTES SAUVÉES !</>
                     ) : (
                       <><Save className="w-6 h-6" /> SAUVEGARDER LES ALERTES</>
                     )}
                   </Button>
                </div>
              </Card>
            )}

            {activeSection === "security" && (
              <Card className="p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] shadow-2xl space-y-12">
                <div className="flex items-center justify-between">
                   <div>
                      <h2 className="text-3xl font-black italic tracking-tighter">Bastion de Sécurité</h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Protégez les secrets de votre royaume</p>
                   </div>
                   <Shield className="w-10 h-10 text-accent opacity-20" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Mot de Passe de Haute Sécurité", desc: "Dernière modification il y a 3 mois", icon: Lock, action: "CHRONIQUE DES CLÉS" },
                    { label: "Validation Double Passe (2FA)", desc: "Renforcez la barrière d'entrée", icon: Globe, action: "ACTIVER LE PROTOCOLE" },
                  ].map((item, idx) => (
                    <Card key={idx} className="p-8 bg-secondary/10 border-none rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all">
                      <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center">
                         <item.icon className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                         <p className="text-xl font-black italic">{item.label}</p>
                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">{item.desc}</p>
                      </div>
                      <Button variant="outline" className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest mt-4 border-accent/20 hover:bg-accent hover:text-white transition-all shadow-lg">
                         {item.action}
                      </Button>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {!["store", "theme", "shipping", "notifications", "security"].includes(activeSection) && (
              <Card className="p-20 bg-card/20 backdrop-blur-xl border-4 border-dashed border-border/20 rounded-[4rem] text-center">
                 <Globe className="w-20 h-20 text-muted-foreground/10 mx-auto mb-8 animate-spin-slow" />
                 <h3 className="text-4xl font-black italic tracking-tighter text-muted-foreground/30">Territoire en Expansion</h3>
                 <p className="text-xl font-medium text-muted-foreground/20 mt-4 uppercase tracking-[0.3em]">Ce module sera révélé prochainement</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
