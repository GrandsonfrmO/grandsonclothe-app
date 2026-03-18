"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Instagram, Facebook, Twitter, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

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
      const response = await fetch('/api/2tact/ambassadors')
      if (response.ok) {
        const data = await response.json()
        setAmbassadors(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, profileImage: data.url }))
      }
    } catch (error) {
      console.error('Erreur upload:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
        setDialogOpen(false)
        resetForm()
        fetchAmbassadors()
      }
    } catch (error) {
      console.error('Erreur:', error)
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
    if (!confirm('Supprimer cet ambassadeur ?')) return

    try {
      const response = await fetch(`/api/2tact/ambassadors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAmbassadors()
      }
    } catch (error) {
      console.error('Erreur:', error)
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ambassadeurs de la Marque</h1>
          <p className="text-muted-foreground">Gérez les ambassadeurs avec profils détaillés</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un ambassadeur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAmbassador ? 'Modifier' : 'Ajouter'} un ambassadeur
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nom *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Photo de profil *</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {formData.profileImage && (
                    <div className="relative w-32 h-32">
                      <Image
                        src={formData.profileImage}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Rôle / Titre</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ex: Influenceur Mode, Artiste..."
                />
              </div>

              <div>
                <Label>Biographie</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={5}
                  placeholder="Biographie complète de l'ambassadeur..."
                />
              </div>

              <div className="space-y-3">
                <Label>Réseaux sociaux</Label>
                
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  <Input
                    placeholder="https://instagram.com/..."
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  <Input
                    placeholder="https://facebook.com/..."
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  <Input
                    placeholder="https://twitter.com/..."
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Input
                    placeholder="https://site-web.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Ordre d'affichage</Label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Actif</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={uploading || !formData.profileImage}>
                  {editingAmbassador ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ambassadors.map((ambassador) => (
          <Card key={ambassador.id}>
            <CardContent className="p-4">
              <div className="relative aspect-square mb-3">
                <Image
                  src={ambassador.profileImage || ambassador.profile_image || ''}
                  alt={ambassador.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <h3 className="font-semibold mb-1">{ambassador.name}</h3>
              {ambassador.role && (
                <p className="text-sm text-muted-foreground mb-2">{ambassador.role}</p>
              )}
              {ambassador.bio && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {ambassador.bio}
                </p>
              )}

              <div className="flex items-center gap-2 mb-3">
                {ambassador.instagram && <Instagram className="h-4 w-4" />}
                {ambassador.facebook && <Facebook className="h-4 w-4" />}
                {ambassador.twitter && <Twitter className="h-4 w-4" />}
                {ambassador.website && <Globe className="h-4 w-4" />}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(ambassador)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(ambassador.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ambassadors.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Aucun ambassadeur pour le moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
