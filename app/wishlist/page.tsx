'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ma Liste de Souhaits | GRANDSON CLOTHES',
  description: 'Consultez votre liste de souhaits et sauvegardez vos produits préférés.',
  robots: {
    index: false,
    follow: false,
  },
}

interface WishlistProduct {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

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
        setItems(data.wishlist);
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
        alert('Added to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            My Wishlist
          </h1>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding your favorite products to your wishlist</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-primary mt-2">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link href={`/product/${item.productId}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleAddToCart(item.productId)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="p-6 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Total items in wishlist</p>
                  <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                </div>
                <Link href="/">
                  <Button size="lg">Continue Shopping</Button>
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
