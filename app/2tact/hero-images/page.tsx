"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Camera, Loader2, Image as ImageIcon, ExternalLink, Activity, Info, Link as LinkIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"
import { PageHeader } from "@/components/2tact/page-header"
import { cn } from "@/lib/utils"

interface HeroImage {
  id: number
  imageUrl: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  isActive: boolean
  displayOrder: number
}

export default function HeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    isActive: true,
    displayOrder: 0,
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/2tact/hero-images')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        toast.error("Échec du chargement des visuels.")
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur réseau - Impossible de contacter le serveur.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadToast = toast.loading("Impression du visuel sur le serveur...")
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
        toast.success("Visuel maîtrisé avec succès.", { id: uploadToast })
      } else {
        toast.error("Échec de l'upload visuel.", { id: uploadToast })
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error("Erreur technique lors du déploiement.", { id: uploadToast })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.imageUrl) {
      toast.error("Un visuel est impératif pour cette opération.")
      return
    }

    setActionLoading(true)
    const actionToast = toast.loading(editingImage ? "Mise à jour du manifeste..." : "Ajout au catalogue d'entrée...")

    try {
      const url = editingImage
        ? `/api/2tact/hero-images/${editingImage.id}`
        : '/api/2tact/hero-images'

      const response = await fetch(url, {
        method: editingImage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingImage ? "Configuration rectifiée." : "Nouveau visuel d'entrée établi.", { id: actionToast })
        setDialogOpen(false)
        resetForm()
        fetchImages()
      } else {
        toast.error("Opération refusée par le système.", { id: actionToast })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Défaut de synchronisation critique.", { id: actionToast })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image)
    setFormData({
      imageUrl: image.imageUrl,
      title: image.title || '',
      subtitle: image.subtitle || '',
      ctaText: image.ctaText || '',
      ctaLink: image.ctaLink || '',
      isActive: image.isActive,
      displayOrder: image.displayOrder,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Éradiquer définitivement ce visuel ?')) return

    const deleteToast = toast.loading("Nettoyage des archives...")
    try {
      const response = await fetch(`/api/2tact/hero-images/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Visuel éradiqué.", { id: deleteToast })
        fetchImages()
      } else {
        toast.error("Échec de l'éradication.", { id: deleteToast })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Serveur injoignable pour le nettoyage.", { id: deleteToast })
    }
  }

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      isActive: true,
      displayOrder: 0,
    })
    setEditingImage(null)
  }

  return (
    <div className="p-8 space-y-10 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="IMAGES HERO" 
          description="Gérez les visuels d'entrée de la plateforme Grandson."
        />

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-6 shadow-2xl shadow-accent/20">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Visuel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/90 backdrop-blur-2xl border-white/10 rounded-[3rem] p-10">
            <DialogHeader className="mb-8 text-left">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-1.5 h-10 bg-accent rounded-full" />
                 <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase">
                   {editingImage ? 'Rectifier Visuel' : 'Déploiement Hero'}
                 </DialogTitle>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-5">Configuration de l'identité visuelle d'entrée</p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                {/* Visual Preview */}
                <div className="md:col-span-2 space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Empreinte Visuelle</Label>
                  <div className="relative group aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-secondary/10 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all hover:border-accent/40">
                    {formData.imageUrl ? (
                      <>
                        <Image src={formData.imageUrl} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button type="button" variant="secondary" className="rounded-full h-12 w-12 p-0 shadow-2xl" onClick={() => document.getElementById('hero-upload')?.click()}>
                            <Camera className="h-5 w-5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-8 space-y-4">
                        <ImageIcon className={cn("h-12 w-12 mx-auto opacity-10", uploading && "animate-pulse text-accent opacity-100")} />
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Déposer archive visuelle</p>
                           <p className="text-[8px] opacity-20 italic">Format recommandé: 1920x1080px</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="rounded-full text-[9px] font-black uppercase px-6" onClick={() => document.getElementById('hero-upload')?.click()}>
                          Choisir Image
                        </Button>
                      </div>
                    )}
                    <input id="hero-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </div>
                </div>

                {/* Content Configuration */}
                <div className="md:col-span-3 space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 mb-1">
                          <Info className="h-3 w-3 text-accent" />
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Titre Majeur</Label>
                       </div>
                       <Input
                         value={formData.title}
                         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                         placeholder="L'ÉTENDARD DE VOTRE MARQUE"
                         className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40 text-sm font-bold uppercase"
                       />
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sous-Manifeste</Label>
                       <Input
                         value={formData.subtitle}
                         onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                         placeholder="L'histoire commence ici..."
                         className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40 text-sm italic"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                             <ExternalLink className="h-3 w-3 text-accent" />
                             <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Texte Action (CTA)</Label>
                          </div>
                          <Input
                            value={formData.ctaText}
                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                            placeholder="DÉCOUVRIR"
                            className="rounded-2xl h-14 bg-secondary/5 border-white/5 text-xs font-black"
                          />
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                             <LinkIcon className="h-3 w-3 text-accent" />
                             <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cible du Lien</Label>
                          </div>
                          <Input
                            value={formData.ctaLink}
                            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                            placeholder="/collections/new"
                            className="rounded-2xl h-14 bg-secondary/5 border-white/5 text-xs"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Poids d'Affichage</Label>
                          <Input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                            className="rounded-2xl h-14 bg-secondary/5 border-white/5"
                          />
                       </div>
                       <div className="space-y-2 flex flex-col justify-end">
                          <div className="flex items-center justify-between h-14 bg-secondary/5 rounded-2xl px-6 border border-white/5">
                             <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Statut Visuel</span>
                             <div className="flex items-center gap-3">
                                <span className={cn("text-[8px] font-black uppercase", formData.isActive ? "text-green-500" : "text-muted-foreground")}>
                                   {formData.isActive ? 'ACTIF' : 'LATENT'}
                                </span>
                                <Switch
                                  checked={formData.isActive}
                                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-8 border-t border-white/5 gap-4">
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-full px-8 font-black uppercase text-[10px] tracking-[0.2em] opacity-40 hover:opacity-100">
                  Abandonner
                </Button>
                <Button 
                   type="submit" 
                   disabled={uploading || !formData.imageUrl || actionLoading}
                   className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-[10px] uppercase tracking-[0.2em] px-12 h-14 shadow-xl shadow-accent/20"
                >
                  {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (editingImage ? 'Valider Rectification' : 'Inscrire au Manifeste')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
         <div className="h-[50vh] flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 animate-pulse">Scan de l'identité visuelle...</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
          {images.map((image) => (
            <Card key={image.id} className="group overflow-hidden rounded-[3.5rem] bg-secondary/5 border-white/5 border hover:border-accent/40 shadow-2xl transition-all duration-700 hover:shadow-accent/10">
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.title || 'Hero visuel'}
                    fill
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  
                  {/* Status Indicator */}
                  <div className="absolute top-6 left-6 z-10">
                     <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-2xl border text-[8px] font-black uppercase tracking-widest shadow-2xl",
                        image.isActive ? "bg-green-500/20 border-green-500/30 text-green-500" : "bg-white/5 border-white/10 text-white/40"
                     )}>
                        <Activity className={cn("h-3 w-3", image.isActive && "animate-pulse")} />
                        {image.isActive ? 'Déploiement Actif' : 'Archive Latente'}
                     </div>
                  </div>

                  <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full h-10 w-10 flex items-center justify-center text-[10px] font-black text-white">
                        #{image.displayOrder}
                     </div>
                  </div>
                  
                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-10 flex flex-col justify-end">
                     <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                        {image.subtitle && (
                           <p className="text-accent text-[9px] font-black uppercase tracking-[0.4em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-700">
                              {image.subtitle}
                           </p>
                        )}
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-6">
                           {image.title || "VISUEL SANS TITRE"}
                        </h3>
                        
                        <div className="flex gap-4">
                           <Button
                              variant="secondary"
                              onClick={() => handleEdit(image)}
                              className="flex-1 rounded-full h-12 text-[9px] font-black uppercase tracking-widest bg-white/10 text-white border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-500"
                           >
                              <Pencil className="h-4 w-4 mr-2" />
                              Rectifier
                           </Button>
                           <Button
                              variant="destructive"
                              onClick={() => handleDelete(image.id)}
                              className="h-12 w-12 rounded-full p-0 flex items-center justify-center bg-transparent border border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-all duration-500"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>
                  </div>
                </div>

                {image.ctaText && (
                   <div className="px-8 py-5 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest opacity-40 italic">
                      <span>Action programmée</span>
                      <div className="flex items-center gap-2 text-accent">
                         <span className="font-black normal-case not-italic">[{image.ctaText}]</span>
                         <ExternalLink className="h-3 w-3" />
                      </div>
                   </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
         <div className="h-[60vh] flex flex-col items-center justify-center space-y-8 border border-dashed border-white/10 rounded-[4rem] bg-secondary/5">
            <div className="relative">
               <ImageIcon className="h-24 w-24 opacity-5" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="h-10 w-10 text-accent opacity-20 animate-pulse" />
               </div>
            </div>
            <div className="text-center space-y-2">
               <p className="text-2xl font-black tracking-tight uppercase italic">Manifeste Vide</p>
               <p className="text-sm text-muted-foreground max-w-xs mx-auto">Votre plateforme n'a aucune identité d'entrée. Déployez votre premier visuel dès maintenant.</p>
            </div>
            <Button 
               variant="outline" 
               className="rounded-full px-12 h-14 border-accent/20 text-accent hover:bg-accent/10 font-black uppercase tracking-widest text-xs"
               onClick={() => setDialogOpen(true)}
            >
               Lancer Premier Visuel
            </Button>
         </div>
      )}
    </div>
  )
}
