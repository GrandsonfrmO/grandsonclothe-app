"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Instagram, Facebook, Twitter, Globe, Camera, Loader2, Link as LinkIcon, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"
import { PageHeader } from "@/components/2tact/page-header"
import { cn } from "@/lib/utils"

interface Ambassador {
  id: number
  name: string
  profileImage?: string
  profile_image?: string
  bio?: string
  role?: string
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
  website?: string
  isActive: boolean
  displayOrder: number
}

export default function AmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAmbassador, setEditingAmbassador] = useState<Ambassador | null>(null)
  const [uploading, setUploading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    profileImage: '',
    bio: '',
    role: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
    website: '',
    isActive: true,
    displayOrder: 0,
  })

  useEffect(() => {
    fetchAmbassadors()
  }, [])

  const fetchAmbassadors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/2tact/ambassadors')
      if (response.ok) {
        const data = await response.json()
        setAmbassadors(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Échec du chargement des ambassadeurs.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadToast = toast.loading("Téléversement de l'emblème...")
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, profileImage: data.url }))
        toast.success("Image capturée avec succès.", { id: uploadToast })
      } else {
        toast.error("Échec du téléversement.", { id: uploadToast })
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error("Erreur réseau lors de l'upload.", { id: uploadToast })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    const actionToast = toast.loading(editingAmbassador ? "Mise à jour de l'élite..." : "Enrôlement d'un nouvel ambassadeur...")

    try {
      const url = editingAmbassador
        ? `/api/2tact/ambassadors/${editingAmbassador.id}`
        : '/api/2tact/ambassadors'

      const response = await fetch(url, {
        method: editingAmbassador ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingAmbassador ? "Profil mis à jour." : "Ambassadeur ajouté au manifeste.", { id: actionToast })
        setDialogOpen(false)
        resetForm()
        fetchAmbassadors()
      } else {
        const err = await response.json()
        toast.error(`Erreur: ${err.error || "Opération échouée"}`, { id: actionToast })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Catastrophe technique lors de l'enregistrement.", { id: actionToast })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (ambassador: Ambassador) => {
    setEditingAmbassador(ambassador)
    setFormData({
      name: ambassador.name,
      profileImage: ambassador.profileImage || ambassador.profile_image || '',
      bio: ambassador.bio || '',
      role: ambassador.role || '',
      instagram: ambassador.instagram || '',
      facebook: ambassador.facebook || '',
      twitter: ambassador.twitter || '',
      tiktok: ambassador.tiktok || '',
      website: ambassador.website || '',
      isActive: ambassador.isActive,
      displayOrder: ambassador.displayOrder,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment révoquer cet ambassadeur ?')) return

    const deleteToast = toast.loading("Révocation en cours...")
    try {
      const response = await fetch(`/api/2tact/ambassadors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Ambassadeur banni de l'élite.", { id: deleteToast })
        fetchAmbassadors()
      } else {
        toast.error("Échec de la révocation.", { id: deleteToast })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur serveur lors de la suppression.", { id: deleteToast })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      profileImage: '',
      bio: '',
      role: '',
      instagram: '',
      facebook: '',
      twitter: '',
      tiktok: '',
      website: '',
      isActive: true,
      displayOrder: 0,
    })
    setEditingAmbassador(null)
  }

  return (
    <div className="p-8 space-y-10 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="ÉLITE & AMBASSADEURS" 
          description="Gérez les figures iconiques de la marque Grandson."
        />

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-6 shadow-2xl shadow-accent/20 border-0">
              <Plus className="h-4 w-4 mr-2" />
              Initialiser un Profil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/90 backdrop-blur-2xl border-white/10 rounded-[3rem] p-10">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                <div className="w-1.5 h-8 bg-accent rounded-full" />
                {editingAmbassador ? 'Raffiner le Profil' : 'Nouvelle Égérie'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Emblème Visuel</Label>
                  <div className="relative group aspect-square rounded-[2rem] overflow-hidden bg-secondary/10 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all hover:border-accent/40">
                    {formData.profileImage ? (
                      <>
                        <Image
                          src={formData.profileImage}
                          alt="Preview"
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="rounded-full h-12 w-12 p-0"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            <Camera className="h-5 w-5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <Camera className={cn("h-10 w-10 mx-auto opacity-20", uploading && "animate-pulse text-accent opacity-100")} />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Déposer portrait</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full text-[9px] font-black uppercase"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choisir Fichier
                        </Button>
                      </div>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Main Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identité Complète</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Prénom & Nom"
                      className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Titre / Rôle</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Ex: Visionnaire Mode, Icône Urbaine"
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
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</Label>
                        <div className="flex items-center gap-3 h-14 bg-secondary/5 rounded-2xl px-4 border border-white/5">
                           <Switch
                              checked={formData.isActive}
                              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                           />
                           <span className="text-[10px] font-black uppercase tracking-widest">{formData.isActive ? "Actif" : "Inactif"}</span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manifeste / Biographie</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Écrivez le récit de cet ambassadeur..."
                  className="rounded-[2rem] bg-secondary/5 border-white/5 focus:border-accent/40 p-6 resize-none"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Connections Sociales</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40 focus-within:opacity-100" />
                      <Input
                        placeholder="Instagram handle"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="rounded-2xl h-12 pl-12 bg-secondary/5 border-white/5"
                      />
                   </div>
                   <div className="relative">
                      <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                      <Input
                        placeholder="Facebook link"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        className="rounded-2xl h-12 pl-12 bg-secondary/5 border-white/5"
                      />
                   </div>
                   <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                      <Input
                        placeholder="Twitter / X"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="rounded-2xl h-12 pl-12 bg-secondary/5 border-white/5"
                      />
                   </div>
                   <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                      <Input
                        placeholder="Site Web Officiel"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="rounded-2xl h-12 pl-12 bg-secondary/5 border-white/5"
                      />
                   </div>
                </div>
              </div>

              <DialogFooter className="pt-6 border-t border-white/5 gap-4">
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-full px-8 font-black uppercase text-[10px] tracking-widest">
                  Annuler
                </Button>
                <Button 
                   type="submit" 
                   disabled={uploading || !formData.profileImage || actionLoading}
                   className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-[10px] uppercase tracking-widest px-10 shadow-xl shadow-accent/20"
                >
                  {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (editingAmbassador ? 'Mettre à Jour' : 'Approuver Nouveau Profil')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
         <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Initialisation de l'Elite...</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {ambassadors.map((ambassador) => (
            <Card key={ambassador.id} className="group overflow-hidden rounded-[2.5rem] bg-secondary/5 border-white/5 border hover:border-accent/40 shadow-xl transition-all duration-700 hover:shadow-accent/10">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={ambassador.profileImage || ambassador.profile_image || ''}
                    alt={ambassador.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-all duration-700 p-8 flex flex-col justify-end">
                     {!ambassador.isActive && (
                        <div className="absolute top-6 left-6 px-3 py-1 bg-red-500 rounded-full text-white text-[8px] font-black uppercase tracking-widest">Inactif</div>
                     )}
                     
                     <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-accent text-[8px] font-black uppercase tracking-[0.4em] mb-1">
                           {ambassador.role || "Ambassadeur"}
                        </p>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
                           {ambassador.name}
                        </h3>
                        
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                           {ambassador.instagram && <Instagram className="h-4 w-4 text-white/40 hover:text-white" />}
                           {ambassador.facebook && <Facebook className="h-4 w-4 text-white/40 hover:text-white" />}
                           {ambassador.website && <Globe className="h-4 w-4 text-white/40 hover:text-white" />}
                        </div>
                     </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                   <p className="text-muted-foreground text-[11px] font-medium italic line-clamp-3 leading-relaxed">
                     {ambassador.bio || "Aucun manifeste rédigé pour cet ambassadeur."}
                   </p>
                   
                   <div className="flex gap-3 pt-4 border-t border-white/5">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(ambassador)}
                        className="flex-1 rounded-full h-10 font-black text-[10px] uppercase tracking-widest bg-secondary/50 border border-white/5 hover:bg-accent hover:text-white transition-colors"
                      >
                        <Pencil className="h-3 w-3 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(ambassador.id)}
                        className="rounded-full h-10 w-10 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && ambassadors.length === 0 && (
         <div className="h-[50vh] flex flex-col items-center justify-center space-y-6 border border-dashed border-white/10 rounded-[3rem] bg-secondary/5">
            <User className="h-16 w-16 opacity-10" />
            <div className="text-center">
               <p className="text-xl font-bold tracking-tight">Le Manifeste est vide</p>
               <p className="text-sm text-muted-foreground">Commencez par enrôler des figures inspirantes.</p>
            </div>
            <Button 
               variant="outline" 
               className="rounded-full px-8"
               onClick={() => setDialogOpen(true)}
            >
               Enrôler maintenant
            </Button>
         </div>
      )}
    </div>
  )
}
