'use client';

import { useState, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, Minus, Plus, ShoppingBag, Check, AlertCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { WishlistButton } from "@/components/wishlist-button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/format-price"
import { SchemaScript } from "@/components/schema-script"
import { generateProductSchema } from "@/lib/schema"
import { COLORS } from "@/components/2tact/color-picker"
import { BottomNav } from "@/components/bottom-nav"

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number | null
  image: string
  images: string[]
  isNew?: boolean
  colors: Array<{ name: string; hex: string }>
  sizes: string[]
  description: string
  rating: number
  reviews: number
  stock: number
}

// Interne de transformation de couleur
// Interne de transformation de couleur optimisé
const mapColor = (c: any) => {
  if (typeof c === 'object' && c.hex) return c;
  const colorStr = String(c).toLowerCase().trim();
  
  const found = COLORS.find(col => 
    col.value.toLowerCase() === colorStr || 
    col.name.toLowerCase() === colorStr
  );
  if (found) return { name: found.name, hex: found.hex, value: found.value };
  
  // Mappage étendu pour robustesse maximale
  const extraMap: Record<string, {name: string, hex: string}> = {
    'blanc': { name: 'Blanc', hex: '#FFFFFF' },
    'noir': { name: 'Noir', hex: '#000000' },
    'rouge': { name: 'Rouge', hex: '#EF4444' },
    'bleu': { name: 'Bleu', hex: '#3B82F6' },
    'vert': { name: 'Vert', hex: '#10B981' },
    'gris': { name: 'Gris', hex: '#6B7280' },
    'gray': { name: 'Gris', hex: '#6B7280' },
    'jaune': { name: 'Jaune', hex: '#F59E0B' },
    'rose': { name: 'Rose', hex: '#EC4899' },
    'pink': { name: 'Rose', hex: '#EC4899' },
    'violet': { name: 'Violet', hex: '#8B5CF6' },
    'purple': { name: 'Violet', hex: '#8B5CF6' },
    'orange': { name: 'Orange', hex: '#F97316' },
    'marron': { name: 'Marron', hex: '#92400E' },
    'brown': { name: 'Marron', hex: '#92400E' },
    'beige': { name: 'Beige', hex: '#D4A574' },
  };
  
  if (extraMap[colorStr]) return extraMap[colorStr];
  
  return { name: c, hex: '#000000', value: 'black' };
};

export function ProductPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  
  // Charger le produit depuis l'API
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          
          let productColors = [{ name: 'Noir', hex: '#000000' }];
          if (data.colors) {
            try {
              const parsed = typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors;
              if (Array.isArray(parsed)) {
                productColors = parsed.map(mapColor);
              } else {
                productColors = [mapColor(parsed)];
              }
            } catch (e) {
              productColors = data.colors.split(',').map((c: string) => mapColor(c.trim()));
            }
          }

          const transformedProduct: Product = {
            id: data.id,
            name: data.name,
            category: data.category,
            price: parseFloat(data.price),
            originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
            image: data.image || '/placeholder.jpg',
            images: data.images ? (typeof data.images === 'string' ? JSON.parse(data.images) : data.images) : [data.image || '/placeholder.jpg'],
            isNew: data.isNew || false,
            colors: productColors,
            sizes: data.sizes ? (typeof data.sizes === 'string' ? JSON.parse(data.sizes) : data.sizes) : ['M', 'L', 'XL'],
            description: data.description || 'Produit de qualité supérieure signé Grandson Clothes.',
            rating: 4.8,
            reviews: 12,
            stock: data.stock || 0
          }
          setProduct(transformedProduct)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [reviewRefresh, setReviewRefresh] = useState(0)
  const { addItem } = useCart()

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-40">
        {/* Skeleton Header */}
        <div className="sticky top-0 z-50 bg-background/60 backdrop-blur-3xl border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div className="w-12 h-12 bg-secondary/20 rounded-2xl animate-pulse" />
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-secondary/20 rounded-2xl animate-pulse" />
            <div className="w-12 h-12 bg-secondary/20 rounded-2xl animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image skeleton */}
            <div className="aspect-[4/5] rounded-[3.5rem] bg-secondary/10 animate-pulse" />
            {/* Info skeleton */}
            <div className="space-y-8 pt-4">
              <div className="space-y-4">
                <div className="h-4 w-24 bg-secondary/20 rounded-full animate-pulse" />
                <div className="h-12 w-3/4 bg-secondary/20 rounded-2xl animate-pulse" />
                <div className="h-10 w-1/3 bg-secondary/10 rounded-2xl animate-pulse" />
              </div>
              <div className="h-48 bg-secondary/10 rounded-[3rem] animate-pulse" />
              <div className="h-32 bg-secondary/5 rounded-[3rem] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Produit non trouvé</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    rating: product.rating,
    reviews: product.reviews,
    category: product.category,
  })

  const handleAddToCart = () => {
    if (!selectedSize) return
    
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: product.colors[selectedColor].name,
    };
    
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <>
      <SchemaScript schema={productSchema} />
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pb-48">
        {/* Header Premium Dynamique */}
        <div 
          className="sticky top-0 z-50 backdrop-blur-3xl border-b border-border/40 transition-colors duration-1000"
          style={{ 
            backgroundColor: `${product.colors[selectedColor].hex}15`, // Teinte subtile (15% opacité)
            borderColor: `${product.colors[selectedColor].hex}30`
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <Link href="/" className="p-3 bg-background/40 hover:bg-secondary/60 rounded-2xl transition-all hover:scale-110 active:scale-90 group shadow-lg border border-border/20">
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4">
              <WishlistButton productId={product.id} size="lg" className="shadow-lg" />
              <button className="p-3 bg-background/40 hover:bg-secondary/60 rounded-2xl transition-all hover:scale-110 active:scale-90 shadow-lg border border-border/20">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Visual Sector */}
            <div className="space-y-8">
              <div 
                className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-border/20 group transition-all duration-1000"
                style={{ 
                  backgroundColor: `${product.colors[selectedColor].hex}20`,
                  backgroundImage: `radial-gradient(circle at 30% 30%, ${product.colors[selectedColor].hex}40, transparent)` 
                }}
              >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <Image
                  src={product.images[currentImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  unoptimized={product.images[currentImage]?.endsWith('.gif')}
                  priority
                />
                
                {/* Visual Indicators */}
                {product.isNew && (
                  <div className="absolute top-8 left-8 bg-accent text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl animate-in fade-in zoom-in duration-500">
                    Prestige
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-12 text-center">
                    <div className="space-y-4 animate-in zoom-in duration-700">
                       <AlertCircle className="w-16 h-16 text-white mx-auto opacity-50" />
                       <h3 className="text-4xl font-black italic tracking-tighter text-white">ÉPUISEMENT ROYAL</h3>
                       <p className="text-white/60 font-medium uppercase tracking-widest text-xs leading-loose">Cette pièce rare ne peut plus être acquise pour le moment.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails Royale */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                   {product.images.map((img: string, idx: number) => (
                      <button 
                         key={idx}
                         onClick={() => setCurrentImage(idx)}
                         className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${currentImage === idx ? 'border-accent scale-105 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
                      >
                         <Image src={img} alt="" fill className="object-cover" />
                      </button>
                   ))}
                </div>
              )}
            </div>

            {/* Information Sector */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-[1px] bg-accent/40" />
                   <span className="text-xs font-black uppercase tracking-[0.4em] text-accent">{product.category}</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter leading-none">{product.name}</h1>
                
                <div className="flex items-baseline gap-6 py-4">
                  <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-muted-foreground line-through opacity-40 font-black italic">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse shadow-lg`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    {product.stock > 0 ? `Disponible en ${product.stock} exemplaires` : 'Indisponible Temporairement'}
                  </span>
                </div>
              </div>

              {/* Advanced Controls Card */}
              <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] p-8 lg:p-10 shadow-2xl space-y-10">
                {/* Color Selector Premium */}
                <div className="space-y-5">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Variation Chromatique</p>
                      <span className="text-xs font-black italic text-accent">{product.colors[selectedColor].name}</span>
                   </div>
                   <div className="flex gap-4 flex-wrap">
                      {product.colors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(idx)}
                          className={`group relative w-16 h-16 rounded-2xl transition-all duration-500 ${selectedColor === idx ? 'scale-110 shadow-2xl ring-4 ring-accent/30' : 'hover:scale-105 opacity-80'}`}
                          style={{ backgroundColor: color.hex }}
                        >
                           {selectedColor === idx && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] rounded-2xl">
                                <Check className="w-8 h-8 text-white drop-shadow-md" />
                             </div>
                           )}
                           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <span className="text-[8px] font-black uppercase bg-background px-2 py-1 rounded shadow-sm whitespace-nowrap">{color.name}</span>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Size Grid Premium */}
                <div className="space-y-5">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dimension Royale</p>
                      <button className="text-[10px] font-black text-accent uppercase tracking-[0.2em] border-b border-accent/20">Guide des Tailles</button>
                   </div>
                   <div className="grid grid-cols-4 gap-3">
                      {product.sizes.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSize(size)}
                          className={`h-16 rounded-2xl font-black italic text-lg transition-all duration-500 ${selectedSize === size ? 'bg-accent text-white shadow-xl scale-105' : 'bg-secondary/20 hover:bg-secondary/40 text-muted-foreground'}`}
                        >
                          {size}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Multiplier Premium */}
                <div className="space-y-5 border-t border-border/20 pt-8">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Quantité Souhaitée</p>
                   <div className="flex items-center justify-between bg-secondary/20 p-2 rounded-[2rem]">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-14 bg-background rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all active:scale-90">
                         <Minus className="w-6 h-6" />
                      </button>
                      <span className="text-3xl font-black italic tracking-tighter">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-14 h-14 bg-background rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all active:scale-90">
                         <Plus className="w-6 h-6" />
                      </button>
                   </div>
                </div>
              </div>

              {/* Epic Description */}
              <div className="space-y-4 p-10 bg-secondary/5 rounded-[3rem] border border-border/20">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Hérédité du Produit</h3>
                 </div>
                 <p className="text-xl font-medium text-muted-foreground leading-relaxed italic">{product.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Bar Premium */}
        <div className="fixed bottom-[72px] left-0 right-0 p-4 md:p-6 z-[55] bg-background/60 backdrop-blur-3xl border-t border-border/20 animate-in slide-in-from-bottom-full duration-700">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3 md:gap-6">
             <div className="hidden sm:block shrink-0">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total</p>
                <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-accent">{formatPrice(product.price * quantity)}</p>
             </div>
             <div className="flex-1 w-full space-y-2">
               {!selectedSize && product.stock > 0 && (
                 <p className="text-center text-[9px] font-black uppercase tracking-widest text-amber-500 animate-pulse">
                   ⚠ Sélectionnez une taille pour continuer
                 </p>
               )}
               <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || product.stock === 0}
                  className={`flex-1 h-16 md:h-20 rounded-[2rem] md:rounded-[2.5rem] font-black italic text-xl md:text-2xl tracking-tighter transition-all duration-700 w-full shadow-2xl ${
                    addedToCart
                      ? 'bg-green-500 scale-105 shadow-green-500/30'
                      : !selectedSize || product.stock === 0
                      ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
                      : 'bg-accent hover:bg-accent/90 shadow-accent/30 hover:scale-[1.02] active:scale-95'
                  }`}
               >
                  {product.stock === 0 ? "RUPTURE DE STOCK" : addedToCart ? (
                    <div className="flex items-center gap-3"><Check className="w-6 h-6" /> AJOUTÉ AU PANIER !</div>
                  ) : (
                    <div className="flex items-center gap-3 justify-center">
                      <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" /> AJOUTER AU PANIER
                    </div>
                  )}
               </Button>
             </div>
          </div>
        </div>

        {/* Reviews Section Premium */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-32 space-y-20">
          <div className="space-y-4">
             <h2 className="text-5xl font-black italic tracking-tighter leading-none">Chronique des Citoyens</h2>
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.4em] opacity-40">Témoignages de la communauté Grandson</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
               {user ? (
                 <ReviewForm productId={product.id} userId={user.id} onReviewSubmitted={() => setReviewRefresh(prev => prev + 1)} />
               ) : (
                 <Card className="p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] text-center space-y-6">
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Exprimez votre allégeance</p>
                    <h3 className="text-xl font-black italic">Connectez-vous pour laisser votre empreinte</h3>
                    <Link href="/auth/login" className="block">
                      <Button className="w-full h-14 rounded-2xl bg-secondary/50 font-black italic uppercase tracking-widest text-[10px]">REJOINDRE L'ELITE</Button>
                    </Link>
                 </Card>
               )}
            </div>
            <div className="lg:col-span-2">
               <ReviewsList productId={product.id} refreshTrigger={reviewRefresh} />
            </div>
          </div>
        </div>

      </div>
      <BottomNav />
    </>
  );
}
