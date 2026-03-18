'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useWishlist } from '@/lib/wishlist-context';
import { formatPriceNumber } from '@/lib/format-price';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNav } from '@/components/bottom-nav';
import { Heart, ShoppingCart, Trash2, Home, TrendingUp } from 'lucide-react';

interface WishlistProduct {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    category?: string;
  };
}

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setItems(data.wishlist || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      setItems(items.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        setAddedToCart(productId);
        setTimeout(() => setAddedToCart(null), 2000);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader title="Mes Favoris" showBack />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.product.price), 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title="Mes Favoris" showBack />

      <main className="space-y-2 px-4 py-4">
        {/* Empty State */}
        {items.length === 0 ? (
          <>
            <Card className="p-8 text-center bg-secondary/50 border-border/50">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold mb-2">Aucun favori</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Commencez à ajouter vos produits préférés à votre liste de favoris
              </p>
              <Link href="/">
                <Button className="rounded-full gap-2">
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </Button>
              </Link>
            </Card>
          </>
        ) : (
          <>
            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Articles</p>
                  <p className="text-2xl font-bold">{items.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Valeur totale</p>
                  <p className="text-2xl font-bold text-accent">{formatPriceNumber(totalPrice)} GNF</p>
                </div>
              </div>
            </Card>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-md active:shadow-sm transition-all border-border/50 touch-manipulation"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-secondary overflow-hidden group">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full p-2 hover:bg-destructive/20 active:bg-destructive/30 transition-all touch-manipulation shadow-md"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>

                    {/* Category Badge */}
                    {item.product.category && (
                      <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                        {item.product.category}
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 flex flex-col h-full">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-semibold text-sm line-clamp-2 hover:text-accent transition-colors mb-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto space-y-2">
                      <p className="text-lg font-bold text-accent">
                        {formatPriceNumber(item.product.price)} GNF
                      </p>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(item.productId)}
                        size="sm"
                        className="w-full rounded-lg h-9 gap-1 touch-manipulation"
                        variant={addedToCart === item.productId ? "default" : "outline"}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {addedToCart === item.productId ? 'Ajouté' : 'Panier'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Card */}
            <Card className="p-4 bg-accent/10 border-accent/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1">Continuez vos achats</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Découvrez d'autres produits qui pourraient vous intéresser
                  </p>
                  <Link href="/">
                    <Button size="sm" className="rounded-lg h-8 gap-1">
                      <Home className="w-3.5 h-3.5" />
                      Retour à l'accueil
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
