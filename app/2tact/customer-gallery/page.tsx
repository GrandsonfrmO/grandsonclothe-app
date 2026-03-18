"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Check, X, Camera, Loader2, User, Image as ImageIcon, ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"
import { PageHeader } from "@/components/2tact/page-header"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface GalleryImage {
  id: number
  imageUrl: string
  customerName?: string
  caption?: string
  productId?: number
  isApproved: boolean
  isActive: boolean
  displayOrder: number
}

export default function CustomerGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    imageUrl: '',
    customerName: '',
    caption: '',
    productId: '',
    isApproved: false,
    isActive: true,
    displayOrder: 0,
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/2tact/customer-gallery')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        toast.error("Échec du chargement de la galerie.")
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur réseau lors du chargement.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadToast = toast.loading("Téléversement de la preuve de style...")
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
        toast.success("Image intégrée avec succès.", { id: uploadToast })
      } else {
        toast.error("Échec du téléversement.", { id: uploadToast })
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error("Erreur système lors de l'upload.", { id: uploadToast })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    const actionToast = toast.loading(editingImage ? "Mise à jour de l'archive..." : "Ajout au manifeste visuel...")

    const payload = {
      imageUrl: formData.imageUrl,
      customerName: formData.customerName || null,
      caption: formData.caption || null,
      productId: formData.productId ? parseInt(formData.productId) : null,
      isApproved: formData.isApproved,
      isActive: formData.isActive,
      displayOrder: formData.displayOrder,
    }

    try {
      const url = editingImage
        ? `/api/2tact/customer-gallery/${editingImage.id}`
        : '/api/2tact/customer-gallery'

      const response = await fetch(url, {
        method: editingImage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editingImage ? "Données rectifiées." : "Image ajoutée à la galerie d'élite.", { id: actionToast })
        setDialogOpen(false)
        resetForm()
        fetchImages()
      } else {
        const err = await response.json()
        toast.error(`Échec: ${err.error || "Opération refusée"}`, { id: actionToast })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Catastrophe technique lors de l'enregistrement.", { id: actionToast })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      imageUrl: image.imageUrl,
      customerName: image.customerName || '',
      caption: image.caption || '',
      productId: image.productId?.toString() || '',
      isApproved: image.isApproved,
      isActive: image.isActive,
      displayOrder: image.displayOrder,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer définitivement cette archive ?')) return

    const deleteToast = toast.loading("Éradication en cours...")
    try {
      const response = await fetch(`/api/2tact/customer-gallery/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Image bannie de l'élite.", { id: deleteToast })
        fetchImages()
      } else {
        toast.error("La suppression a échoué.", { id: deleteToast })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur serveur fatale.", { id: deleteToast })
    }
  }

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    const statusToast = toast.loading(currentStatus ? "Retrait de l'approbation..." : "Validation de l'image...")
    try {
      const response = await fetch(`/api/2tact/customer-gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
      })

      if (response.ok) {
        toast.success(!currentStatus ? "Approbation accordée." : "Image désactivée du site public.", { id: statusToast })
        fetchImages()
      } else {
        toast.error("Échec de la modération.", { id: statusToast })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur réseau.", { id: statusToast })
    }
  }

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      customerName: '',
      caption: '',
      productId: '',
      isApproved: false,
      isActive: true,
      displayOrder: 0,
    })
    setEditingImage(null)
  }

  return (
    <div className="p-8 space-y-10 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="GALERIE D'ÉLITE" 
          description="Photos des membres de la communauté Grandson."
        />

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-6 shadow-2xl shadow-accent/20">
              <Plus className="h-4 w-4 mr-2" />
              Soumettre une Preuve
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/90 backdrop-blur-2xl border-white/10 rounded-[3rem] p-10">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                <div className="w-1.5 h-8 bg-accent rounded-full" />
                {editingImage ? 'Raffiner l\'Archive' : 'Nouvelle Soumission'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capture Visuelle</Label>
                  <div className="relative group aspect-square rounded-[2.5rem] overflow-hidden bg-secondary/10 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all hover:border-accent/40">
                    {formData.imageUrl ? (
                      <>
                        <Image src={formData.imageUrl} alt="Preview" fill className="object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button type="button" variant="secondary" className="rounded-full h-12 w-12 p-0" onClick={() => document.getElementById('gallery-upload')?.click()}>
                            <Camera className="h-5 w-5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <ImageIcon className={cn("h-10 w-10 mx-auto opacity-20", uploading && "animate-pulse text-accent opacity-100")} />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Déposer portrait client</p>
                        <Button type="button" variant="outline" size="sm" className="rounded-full text-[9px] font-black uppercase" onClick={() => document.getElementById('gallery-upload')?.click()}>
                          Choisir Fichier
                        </Button>
                      </div>
                    )}
                    <input id="gallery-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </div>
                </div>

                {/* Main Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identité du Client</Label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Nom de l'icône"
                      className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lien Produit ID</Label>
                    <Input
                      type="number"
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      placeholder="ID du vêtement lié"
                      className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ordre</Label>
                        <Input
                          type="number"
                          value={formData.displayOrder}
                          onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                          className="rounded-2xl h-14 bg-secondary/5 border-white/5"
                        />
                     </div>
                     <div className="space-y-2 text-right">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Modération</Label>
                        <div className="flex items-center justify-end gap-3 h-14 bg-secondary/5 rounded-2xl px-4 border border-white/5">
                           <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Approuvér</span>
                           <Switch
                              checked={formData.isApproved}
                              onCheckedChange={(checked) => setFormData({ ...formData, isApproved: checked })}
                           />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Légende & Contexte</Label>
                <Textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  rows={3}
                  placeholder="Décrivez l'instant capturé..."
                  className="rounded-[2rem] bg-secondary/5 border-white/5 focus:border-accent/40 p-6 resize-none"
                />
              </div>

              <DialogFooter className="pt-6 border-t border-white/5 gap-4">
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-full px-8 font-black uppercase text-[10px] tracking-widest">
                  Annuler
                </Button>
                <Button 
                   type="submit" 
                   disabled={uploading || !formData.imageUrl || actionLoading}
                   className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-[10px] uppercase tracking-widest px-10 shadow-xl shadow-accent/20"
                >
                  {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (editingImage ? 'Valider Rectification' : 'Inscrire au Manifeste')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
         <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Scan des archives visuelles...</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {images.map((image) => (
            <Card key={image.id} className="group overflow-hidden rounded-[2.5rem] bg-secondary/5 border-white/5 border hover:border-accent/40 shadow-xl transition-all duration-700 hover:shadow-accent/10">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.customerName || 'Client'}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Approval Status Badge */}
                  <div className="absolute top-4 right-4">
                     {image.isApproved ? (
                        <div className="bg-green-500/80 backdrop-blur-md text-white p-2 rounded-full shadow-lg">
                           <ShieldCheck className="h-4 w-4" />
                        </div>
                     ) : (
                        <div className="bg-orange-500/80 backdrop-blur-md text-white p-2 rounded-full shadow-lg">
                           <ShieldAlert className="h-4 w-4" />
                        </div>
                     )}
                  </div>
                  
                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                     <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-secondary text-[8px] font-black uppercase tracking-[0.4em] mb-1">
                           #{image.productId || "Style Libéré"}
                        </p>
                        <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none mb-4">
                           {image.customerName || "Inconnu de l'Élite"}
                        </h3>
                        
                        <div className="flex gap-2">
                           <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => toggleApproval(image.id, image.isApproved)}
                              className={cn(
                                 "flex-1 rounded-full h-8 text-[9px] font-black uppercase tracking-widest",
                                 image.isApproved ? "bg-white/10 text-white hover:bg-white/20" : "bg-accent text-white hover:bg-accent/90"
                              )}
                           >
                              {image.isApproved ? 'Désapprouver' : 'Approuver'}
                           </Button>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between gap-3">
                   <div className="flex-1 min-w-0">
                      <p className="text-muted-foreground text-[10px] font-medium italic truncate">
                        {image.caption || "Aucune légende pour cette archive."}
                      </p>
                   </div>
                   
                   <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(image)}
                        className="rounded-full h-8 w-8 text-white/40 hover:text-accent hover:bg-accent/10"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(image.id)}
                        className="rounded-full h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
         <div className="h-[50vh] flex flex-col items-center justify-center space-y-6 border border-dashed border-white/10 rounded-[3rem] bg-secondary/5">
            <ImageIcon className="h-16 w-16 opacity-10" />
            <div className="text-center">
               <p className="text-xl font-bold tracking-tight">Les Archives sont vides</p>
               <p className="text-sm text-muted-foreground">Commencez par immortaliser le style des clients.</p>
            </div>
            <Button 
               variant="outline" 
               className="rounded-full px-8"
               onClick={() => setDialogOpen(true)}
            >
               Soumettre une Photo
            </Button>
         </div>
      )}
    </div>
  )
}
