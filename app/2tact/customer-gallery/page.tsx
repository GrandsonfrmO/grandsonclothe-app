"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

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
      const response = await fetch('/api/admin/customer-gallery')
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
        ? `/api/admin/customer-gallery/${editingImage.id}`
        : '/api/admin/customer-gallery'

      const response = await fetch(url, {
        method: editingImage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    if (!confirm('Supprimer cette photo ?')) return

    try {
      const response = await fetch(`/api/admin/customer-gallery/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/customer-gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Galerie Clients</h1>
          <p className="text-muted-foreground">Photos des clients portant la marque</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Modifier' : 'Ajouter'} une photo
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
                <Label>Nom du client</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Nom du client (optionnel)"
                />
              </div>

              <div>
                <Label>Légende</Label>
                <Textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Description de la photo"
                  rows={3}
                />
              </div>

              <div>
                <Label>ID Produit (optionnel)</Label>
                <Input
                  type="number"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  placeholder="Lier à un produit"
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
                  checked={formData.isApproved}
                  onCheckedChange={(checked) => setFormData({ ...formData, isApproved: checked })}
                />
                <Label>Approuvé (visible sur le site)</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-3">
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={image.imageUrl}
                  alt={image.customerName || 'Client'}
                  fill
                  className="object-cover rounded"
                />
                {image.isApproved ? (
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded">
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded">
                    <X className="h-4 w-4" />
                  </div>
                )}
              </div>

              {image.customerName && (
                <p className="font-medium text-sm mb-1">{image.customerName}</p>
              )}
              {image.caption && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{image.caption}</p>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={image.isApproved ? "outline" : "default"}
                  onClick={() => toggleApproval(image.id, image.isApproved)}
                  className="flex-1"
                >
                  {image.isApproved ? 'Désapprouver' : 'Approuver'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(image)}
                >
                  <Pencil className="h-4 w-4" />
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
            <p className="text-muted-foreground">Aucune photo pour le moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
