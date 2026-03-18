"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { PageHeader } from "@/components/2tact/page-header"
import { formatPriceNumber } from "@/lib/format-price"

interface DeliveryZone {
  id: number
  name: string
  description: string | null
  price: number
  isActive: boolean
  createdAt: string
}

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isActive: true,
  })

  useEffect(() => {
    fetchZones()
  }, [])

  const fetchZones = async () => {
    try {
      const res = await fetch("/api/delivery-zones")
      if (res.ok) {
        const data = await res.json()
        setZones(data)
      }
    } catch (error) {
      console.error("Error fetching zones:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.price || parseInt(formData.price) < 0) {
      newErrors.price = "Price must be a non-negative number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: parseInt(formData.price),
        isActive: formData.isActive,
      }

      const url = editingId ? `/api/delivery-zones/${editingId}` : "/api/delivery-zones"
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setFormData({ name: "", description: "", price: "", isActive: true })
        setEditingId(null)
        setIsOpen(false)
        fetchZones()
      } else {
        const error = await res.json()
        setErrors({ submit: error.error || "Error saving zone" })
      }
    } catch (error) {
      setErrors({ submit: "Error saving zone" })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/delivery-zones/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchZones()
      }
    } catch (error) {
      console.error("Error deleting zone:", error)
    }
  }

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title="Zones de Livraison"
        description="Gérez les zones de livraison et leurs tarifs"
        action={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({ name: "", description: "", price: "", isActive: true })
                  setEditingId(null)
                  setErrors({})
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une zone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Modifier la zone" : "Ajouter une zone de livraison"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nom de la zone</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Conakry Centre"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Zone centrale de Conakry"
                  />
                </div>

                <div>
                  <Label>Prix de livraison (GNF)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 5000"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Zone active
                  </Label>
                </div>

                {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    {editingId ? "Mettre à jour" : "Créer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Content */}
      <div className="p-4 lg:p-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Zones Grid */}
        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : filteredZones.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucune zone trouvée
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredZones.map((zone) => (
              <Card key={zone.id} className="overflow-hidden hover:shadow-lg transition-all border-border p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{zone.name}</h3>
                    {zone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{zone.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Prix de livraison</p>
                      <p className="text-2xl font-bold">{formatPriceNumber(zone.price)} GNF</p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          zone.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {zone.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setFormData({
                              name: zone.name,
                              description: zone.description || "",
                              price: zone.price.toString(),
                              isActive: zone.isActive,
                            })
                            setEditingId(zone.id)
                            setErrors({})
                          }}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier la zone</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label>Nom de la zone</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                          </div>

                          <div>
                            <Label>Prix de livraison (GNF)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              className={errors.price ? "border-red-500" : ""}
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isActive"
                              checked={formData.isActive}
                              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                              Zone active
                            </Label>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                              Annuler
                            </Button>
                            <Button type="submit" className="bg-accent hover:bg-accent/90">
                              Mettre à jour
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="flex-1">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Supprimer la zone?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer "{zone.name}"?
                        </AlertDialogDescription>
                        <div className="flex gap-2 justify-end">
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(zone.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
