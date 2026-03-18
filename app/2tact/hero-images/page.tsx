"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

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
      const response = await fetch('/api/2tact/hero-images')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
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
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
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
      const url = editingImage
        ? `/api/2tact/hero-images/${editingImage.id}`
        : '/api/2tact/hero-images'

      const response = await fetch(url, {
        method: editingImage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setDialogOpen(false)
        resetForm()
        fetchImages()
      }
    } catch (error) {
      console.error('Erreur:', error)
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
    if (!confirm('Supprimer cette image ?')) return

    try {
      const response = await fetch(`/api/2tact/hero-images/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Erreur:', error)
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Images Hero Header</h1>
          <p className="text-muted-foreground">Gérez les images du carrousel de la page d'accueil</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Modifier' : 'Ajouter'} une image hero
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Image *</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {formData.imageUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre affiché sur l'image"
                />
              </div>

              <div>
                <Label>Sous-titre</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Sous-titre affiché sur l'image"
                />
              </div>

              <div>
                <Label>Texte du bouton</Label>
                <Input
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="Ex: Découvrir"
                />
              </div>

              <div>
                <Label>Lien du bouton</Label>
                <Input
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="/products ou URL externe"
                />
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
                <Button type="submit" disabled={uploading || !formData.imageUrl}>
                  {editingImage ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={image.imageUrl}
                  alt={image.title || 'Hero image'}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {image.title && <h3 className="font-semibold mb-1">{image.title}</h3>}
              {image.subtitle && (
                <p className="text-sm text-muted-foreground mb-2">{image.subtitle}</p>
              )}

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(image)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Aucune image hero pour le moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
