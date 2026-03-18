"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Edit2, Trash2, Search, Package, AlertTriangle, TrendingUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { GifImage } from "@/components/gif-image"
import { ImageUpload } from "@/components/2tact/image-upload"
import { ColorPicker } from "@/components/2tact/color-picker"
import { SizeSelector } from "@/components/2tact/size-selector"
import { PageHeader } from "@/components/2tact/page-header"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  description: string
  price: string
  image: string
  category: string
  stock: number
  colors?: string
  sizes?: string
  createdAt: string
}

const CATEGORIES = [
  { value: "hoodies", label: "Hoodies" },
  { value: "tshirts", label: "T-Shirts" },
  { value: "pantalons", label: "Pantalons" },
  { value: "accessoires", label: "Accessoires" },
  { value: "nouveautes", label: "Nouveautés" },
]

// Restock Dialog Component
function RestockDialog({ productId, productName, onRestock }: { productId: number; productName: string; onRestock: () => void }) {
  const [newStock, setNewStock] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRestock = async () => {
    if (!newStock || parseInt(newStock) < 0) {
      setError("Veuillez entrer un nombre valide")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: parseInt(newStock) }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Erreur lors de la mise à jour du stock")
        return
      }

      setNewStock("")
      onRestock()
    } catch (err) {
      setError("Erreur lors de la mise à jour du stock")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Nouveau stock pour {productName}</Label>
        <Input
          type="number"
          min="0"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder="Entrez la quantité"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => setNewStock("")}>
          Annuler
        </Button>
        <Button onClick={handleRestock} disabled={loading} className="bg-green-600 hover:bg-green-700">
          {loading ? "Mise à jour..." : "Renouveler"}
        </Button>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0, hasMore: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    colors: [] as string[],
    sizes: [] as string[],
  })

  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?page=${page}&limit=12`)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error("API Error:", res.status, errorData)
        setProducts([])
        setLoading(false)
        return
      }
      
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setProducts(data)
      } else if (data.data && Array.isArray(data.data)) {
        setProducts(data.data)
      } else {
        setProducts([])
      }
      
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Erreur:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = "Le nom est requis"
    if (!formData.description.trim()) newErrors.description = "La description est requise"
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Prix invalide"
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = "Stock invalide"
    if (!formData.category) newErrors.category = "Catégorie requise"
    if (!formData.image.trim()) newErrors.image = "L'image est requise"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/products/${editingId}` : "/api/products"
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image,
        category: formData.category,
        colors: formData.colors.length > 0 ? JSON.stringify(formData.colors) : null,
        sizes: formData.sizes.length > 0 ? JSON.stringify(formData.sizes) : null,
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(`Erreur: ${data.error || 'Impossible de créer le produit'}`)
        return
      }

      setIsOpen(false)
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
        colors: [],
        sizes: [],
      })
      setEditingId(null)
      fetchProducts()
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de la création du produit")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
    const matchesStock = stockFilter === "all" || 
                        (stockFilter === "low" && p.stock <= 5) ||
                        (stockFilter === "out" && p.stock === 0) ||
                        (stockFilter === "in" && p.stock > 5)
    return matchesSearch && matchesCategory && matchesStock
  }), [products, searchTerm, categoryFilter, stockFilter])

  // Statistiques - Mémorisées
  const stats = useMemo(() => ({
    totalProducts: products.length,
    lowStockProducts: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    outOfStockProducts: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0),
  }), [products])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-3 sm:p-4 lg:p-8">
          <PageHeader
            title="Gestion des Produits"
            description="Créez, modifiez et supprimez vos produits"
            backHref="/2tact/dashboard"
            action={
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-accent hover:bg-accent/90 text-sm sm:text-base">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nouveau produit</span>
                    <span className="sm:hidden">Nouveau</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      {editingId ? "Modifier le produit" : "Créer un nouveau produit"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label className="text-sm">Nom du produit</Label>
                      <Input
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                        className={`text-sm ${errors.name ? "border-red-500" : ""}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label className="text-sm">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        className={`text-sm ${errors.description ? "border-red-500" : ""}`}
                      />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Prix (GNF)</Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                          className={`text-sm ${errors.price ? "border-red-500" : ""}`}
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                      </div>

                      <div>
                        <Label className="text-sm">Stock</Label>
                        <Input
                          type="number"
                          value={formData.stock}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stock: e.target.value })}
                          className={`text-sm ${errors.stock ? "border-red-500" : ""}`}
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Catégorie</Label>
                      <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className={`text-sm ${errors.category ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <Label className="text-sm">Image</Label>
                      <ImageUpload
                        onImageSelect={(url: string) => setFormData({ ...formData, image: url })}
                      />
                      {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                      
                      {formData.image && (
                        <div className="mt-4">
                          <p className="text-xs sm:text-sm font-medium mb-2">Aperçu de l'image:</p>
                          <div className="relative w-full h-32 sm:h-48 bg-secondary rounded-lg overflow-hidden border border-border">
                            <GifImage
                              src={formData.image}
                              alt="Aperçu du produit"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm">Couleurs</Label>
                      <ColorPicker
                        selectedColors={formData.colors}
                        onColorsChange={(colors: string[]) => setFormData({ ...formData, colors })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Tailles</Label>
                      <SizeSelector
                        selectedSizes={formData.sizes}
                        onSizesChange={(sizes: string[]) => setFormData({ ...formData, sizes })}
                      />
                    </div>

                    <div className="flex gap-2 justify-end flex-col-reverse sm:flex-row">
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="text-sm">
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-accent hover:bg-accent/90 text-sm">
                        {editingId ? "Mettre à jour" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Produits</p>
                <p className="text-lg sm:text-xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stock Faible</p>
                <p className="text-lg sm:text-xl font-bold">{stats.lowStockProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rupture</p>
                <p className="text-lg sm:text-xl font-bold">{stats.outOfStockProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valeur Stock</p>
                <p className="text-sm sm:text-base font-bold">{stats.totalValue.toFixed(0)} GNF</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="text-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="text-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les stocks</SelectItem>
                <SelectItem value="in">En stock (&gt;5)</SelectItem>
                <SelectItem value="low">Stock faible (1-5)</SelectItem>
                <SelectItem value="out">Rupture (0)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-sm">Chargement...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Aucun produit trouvé
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all border-border">
                  <div className="aspect-square bg-secondary overflow-hidden relative">
                    <GifImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold truncate flex-1">{product.name}</h3>
                      {product.stock === 0 ? (
                        <Badge variant="destructive" className="text-xs">Rupture</Badge>
                      ) : product.stock <= 5 ? (
                        <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">Stock faible</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-500">En stock</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-lg font-bold">{product.price} GNF</p>
                        <p className="text-xs text-muted-foreground">Stock: {product.stock} unités</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFormData({
                              name: product.name,
                              description: product.description,
                              price: product.price,
                              image: product.image,
                              category: product.category,
                              stock: product.stock.toString(),
                              colors: product.colors ? JSON.parse(product.colors) : [],
                              sizes: product.sizes ? JSON.parse(product.sizes) : [],
                            })
                            setEditingId(product.id)
                            setIsOpen(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {product.stock === 0 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                                Renouveler
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Renouveler le stock</DialogTitle>
                              </DialogHeader>
                              <RestockDialog productId={product.id} productName={product.name} onRestock={() => fetchProducts()} />
                            </DialogContent>
                          </Dialog>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Supprimer le produit?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer "{product.name}"?
                            </AlertDialogDescription>
                            <div className="flex gap-2 justify-end">
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} sur {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={!pagination.hasMore}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
