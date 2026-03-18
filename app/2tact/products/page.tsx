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
import { ColorPicker, COLORS } from "@/components/2tact/color-picker"
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pb-20">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <PageHeader
            title="Inventaire Royal"
            description="Excellence et gestion de vos collections"
            backHref="/2tact/dashboard"
            action={
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 gap-2 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 rounded-2xl">
                    <Plus className="w-5 h-5" />
                    <span className="font-bold">Nouveau Produit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2rem] shadow-3xl">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-black tracking-tighter">
                      {editingId ? "Édition du Chef-d'œuvre" : "Nouveau Chef-d'œuvre"}
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm font-medium">Définissez les détails de votre pièce unique</p>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nom de la pièce</Label>
                          <Input
                            placeholder="Ex: Hoodie Grandson Black Edition"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`h-12 bg-secondary/30 border-border/50 focus:bg-background transition-all rounded-xl ${errors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
                          />
                          {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Composition & Détails</Label>
                          <Textarea
                            placeholder="Décrivez l'histoire de ce produit..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`min-h-[120px] bg-secondary/30 border-border/50 focus:bg-background transition-all rounded-xl ${errors.description ? "border-red-500" : ""}`}
                          />
                          {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Prix (GNF)</Label>
                            <Input
                              type="number"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              className={`h-12 bg-secondary/30 border-border/50 focus:bg-background transition-all rounded-xl font-bold ${errors.price ? "border-red-500" : ""}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Stock Initial</Label>
                            <Input
                              type="number"
                              value={formData.stock}
                              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                              className={`h-12 bg-secondary/30 border-border/50 focus:bg-background transition-all rounded-xl ${errors.stock ? "border-red-500" : ""}`}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Univers / Catégorie</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger className={`h-12 bg-secondary/30 border-border/50 rounded-xl ${errors.category ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Choisir un univers" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/40">
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Visuel Principal</Label>
                          <ImageUpload onImageSelect={(url) => setFormData({ ...formData, image: url })} />
                          {formData.image && (
                            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-accent/20 group animate-in fade-in zoom-in">
                              <GifImage src={formData.image} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Vrai Aperçu</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6 bg-secondary/10 p-4 rounded-2xl border border-border/30">
                          <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nuancier de couleurs</Label>
                            <ColorPicker
                              selectedColors={formData.colors}
                              onColorsChange={(colors) => setFormData({ ...formData, colors })}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Guide des tailles</Label>
                            <SizeSelector
                              selectedSizes={formData.sizes}
                              onSizesChange={(sizes) => setFormData({ ...formData, sizes })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-border/30 justify-end">
                      <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl font-bold text-muted-foreground hover:scale-105 active:scale-95 transition-all">
                        Abandonner
                      </Button>
                      <Button type="submit" className="h-12 px-10 bg-accent hover:bg-accent/90 rounded-xl font-black shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                        {editingId ? "Enregistrer les modifications" : "Lancer le produit"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />
        </div>
      </div>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
        {/* Statistiques Dynamiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-blue-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Inventaire</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tighter">{stats.totalProducts}</p>
                  <span className="text-[10px] text-blue-500 font-bold">PIÈCES</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-orange-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-orange-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner text-orange-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stock Faible</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tighter">{stats.lowStockProducts}</p>
                  <span className="text-[10px] text-orange-500 font-bold">ALERTES</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-red-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-red-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rupture Stock</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tighter">{stats.outOfStockProducts}</p>
                  <span className="text-[10px] text-red-500 font-bold">ZÉRO</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40 bg-card/40 backdrop-blur-xl border-l-4 border-l-accent overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner text-accent">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valeur Marchande</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black tracking-tighter">{stats.totalValue.toLocaleString()}</p>
                  <span className="text-[10px] text-accent font-bold">GNF</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtres et Recherche High-End */}
        <div className="bg-card/40 backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] border border-border/40 shadow-2xl space-y-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input
              placeholder="Rechercher l'excellence par nom ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 px-2 pb-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 bg-secondary/50 border-none rounded-xl text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    <SelectValue placeholder="Toutes les collections" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40">
                <SelectItem value="all">Toutes les collections</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="h-10 bg-secondary/50 border-none rounded-xl text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    <SelectValue placeholder="État du stock" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40">
                <SelectItem value="all">Tout l'état du stock</SelectItem>
                <SelectItem value="in">📦 En stock abondant</SelectItem>
                <SelectItem value="low">⚠️ Stock limité</SelectItem>
                <SelectItem value="out">🚫 Rupture totale</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex-1" />
            <div className="text-[10px] font-black text-muted-foreground flex items-center gap-2 uppercase tracking-widest bg-secondary/30 px-4 rounded-xl">
               <span className="w-2 h-2 rounded-full bg-accent" />
               {filteredProducts.length} RÉSULTATS
            </div>
          </div>
        </div>

        {/* Grille de Produits Premium */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent animate-pulse">Signature en cours...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 space-y-4 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border/20">
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <div>
              <h3 className="text-xl font-black">Aucune merveille trouvée</h3>
              <p className="text-muted-foreground text-sm">Ajustez vos filtres pour découvrir vos trésors</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setStockFilter("all"); }} className="rounded-xl font-bold">Réinitialiser l'univers</Button>
          </div>
        ) : (
          <div className="space-y-12 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden bg-card/40 backdrop-blur-md border-border/40 hover:border-accent/40 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
                  <div className="aspect-[4/5] bg-secondary overflow-hidden relative">
                    <GifImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      {product.stock === 0 ? (
                        <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Rupture</div>
                      ) : product.stock <= 5 ? (
                        <div className="bg-orange-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Stock Limité</div>
                      ) : (
                        <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10">Disponible</div>
                      )}
                    </div>
                    {/* Hover Actions Bar */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 text-white">
                       <p className="text-xs font-bold text-accent/90 uppercase tracking-[0.2em] mb-1">{CATEGORIES.find(c => c.value === product.category)?.label || "Univers"}</p>
                       <h4 className="text-xl font-black tracking-tight line-clamp-1">{product.name}</h4>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Prix de vente</p>
                        <p className="text-2xl font-black tracking-tighter text-foreground">{parseFloat(product.price).toLocaleString()} <span className="text-xs text-muted-foreground">GNF</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Stock Portfolio</p>
                        <p className={`text-sm font-black ${product.stock === 0 ? "text-red-500" : "text-foreground"}`}>{product.stock} PIÈCES</p>
                      </div>
                    </div>

                    {/* Color Swatches Preview */}
                    <div className="pt-2 flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                       {product.colors && JSON.parse(product.colors).map((colorName: string, i: number) => {
                          const colorData = COLORS.find(c => c.value === colorName || c.name === colorName);
                          return (
                             <div 
                                key={i} 
                                className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: colorData?.hex || '#000' }}
                                title={colorName}
                             />
                          );
                       })}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="secondary"
                        className="rounded-2xl h-12 gap-2 font-bold hover:bg-accent hover:text-white transition-all group/btn"
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
                        <Edit2 className="w-4 h-4 group-hover/btn:scale-120" />
                        Modifier
                      </Button>

                      {product.stock === 0 ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="rounded-2xl h-12 gap-2 font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20">
                               Renouveler
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-background/95 backdrop-blur-2xl rounded-3xl border-border/40">
                             <DialogHeader>
                               <DialogTitle className="text-2xl font-black tracking-tighter">Renouvellement des Stocks</DialogTitle>
                               <p className="text-muted-foreground text-sm font-medium">Réapprovisionnez vos réserves de luxe</p>
                             </DialogHeader>
                             <div className="py-6">
                                <RestockDialog productId={product.id} productName={product.name} onRestock={() => fetchProducts()} />
                             </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="rounded-2xl h-12 gap-2 font-bold text-red-500 hover:bg-red-500/10 hover:text-red-500 border border-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-background/95 backdrop-blur-2xl rounded-3xl border-border/40">
                            <AlertDialogTitle className="text-2xl font-black">Sceller le destin du produit?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground font-medium">
                              Êtes-vous absolument sûr de vouloir retirer "{product.name}" de votre collection impériale? Cette action est irréversible.
                            </AlertDialogDescription>
                            <div className="flex gap-4 justify-end mt-8">
                              <AlertDialogCancel className="rounded-xl font-bold">Vivre un jour de plus</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 hover:bg-red-600 rounded-xl font-black px-8 shadow-xl shadow-red-500/20"
                              >
                                Confirmer la Destruction
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Royal Style */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center p-8 bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border/40 shadow-2xl">
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-2xl px-6 font-bold hover:bg-accent/10 hover:text-accent transition-all disabled:opacity-30"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Précédent
                  </Button>
                  
                  <div className="flex items-center px-6 bg-secondary/30 rounded-2xl text-xs font-black tracking-widest uppercase text-muted-foreground border border-border/30">
                    SÉQUENCE {page} <span className="mx-2 opacity-30">/</span> {pagination.pages}
                  </div>

                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-2xl px-6 font-bold hover:bg-accent/10 hover:text-accent transition-all disabled:opacity-30"
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={!pagination.hasMore}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
