'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPriceNumber } from '@/lib/format-price';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNav } from '@/components/bottom-nav';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Package, 
  Heart, 
  Settings, 
  MapPin,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronRight,
  TrendingUp,
  Award,
  Star,
  LogOut
} from 'lucide-react';

interface Order {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  items?: Array<{ productName?: string; quantity: number }>;
}

interface WishlistItem {
  id: number;
  productId: number;
  product?: {
    id: number;
    name: string;
    price: string;
    imageUrl?: string;
  };
}

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
      fetchWishlist();
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlist(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader title="Mon Profil" showBack />
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

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      delivered: 'bg-accent/20 text-accent border-accent/30',
      cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
    };
    return colors[status] || 'bg-secondary text-foreground border-border';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-3.5 h-3.5" />,
      processing: <Package className="w-3.5 h-3.5" />,
      shipped: <Truck className="w-3.5 h-3.5" />,
      delivered: <CheckCircle2 className="w-3.5 h-3.5" />,
      cancelled: <XCircle className="w-3.5 h-3.5" />,
    };
    return icons[status] || <Package className="w-3.5 h-3.5" />;
  };

  const calculateTotalSpent = () => {
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  };

  const getRecentOrders = () => {
    return orders.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title="Mon Profil" showBack />
      
      <main className="space-y-2 px-4 py-4">
        {/* Profile Header Card */}
        <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground text-2xl font-bold shadow-lg flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold tracking-tight mb-1 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {user.name}
                </h1>
                <p className="text-sm text-muted-foreground truncate mb-2">{user.email}</p>
                <Badge variant="secondary" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Membre depuis {new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-accent" />
                  <p className="text-xs text-muted-foreground">Commandes</p>
                </div>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-accent" />
                  <p className="text-xs text-muted-foreground">Favoris</p>
                </div>
                <p className="text-2xl font-bold">{wishlist.length}</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <p className="text-xs text-muted-foreground">Dépensé</p>
                </div>
                <p className="text-lg font-bold">{formatPriceNumber(calculateTotalSpent())} GNF</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/wishlist" className="touch-manipulation">
            <Card className="p-4 hover:bg-secondary/80 active:bg-secondary transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Mes Favoris</p>
                  <p className="text-xs text-muted-foreground">{wishlist.length} articles</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          </Link>

          <Link href="/profile/settings" className="touch-manipulation">
            <Card className="p-4 hover:bg-secondary/80 active:bg-secondary transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Paramètres</p>
                  <p className="text-xs text-muted-foreground">Compte</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <Card className="overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Mes Commandes</h2>
            </div>
            {orders.length > 0 && (
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8">
                  Tout voir
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            )}
          </div>

          <div className="p-4">
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Chargement...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Aucune commande</p>
                <Link href="/">
                  <Button size="sm" className="rounded-full">
                    Commencer mes achats
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {getRecentOrders().map((order) => (
                  <Link 
                    key={order.id}
                    href={`/profile/orders/${order.id}`}
                    className="block touch-manipulation"
                  >
                    <div className="bg-secondary/50 rounded-xl p-4 hover:bg-secondary active:bg-secondary/80 transition-all border border-border/50">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-sm font-bold">Commande #{order.id}</p>
                            <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold">{formatPriceNumber(order.totalAmount)} GNF</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                        </p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Wishlist Preview */}
        <Card className="overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Mes Favoris</h2>
            </div>
            {wishlist.length > 0 && (
              <Link href="/wishlist">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8">
                  Tout voir
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            )}
          </div>

          <div className="p-4">
            {wishlistLoading ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Chargement...</p>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Aucun favori</p>
                <Link href="/">
                  <Button size="sm" className="rounded-full">
                    Découvrir des produits
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlist.slice(0, 4).map((item) => (
                  <Link 
                    key={item.id}
                    href={`/product/${item.productId}`}
                    className="block touch-manipulation"
                  >
                    <div className="bg-secondary/50 rounded-xl overflow-hidden hover:bg-secondary active:bg-secondary/80 transition-all border border-border/50">
                      {item.product?.imageUrl ? (
                        <div className="aspect-square bg-secondary relative overflow-hidden">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-secondary flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-sm font-semibold line-clamp-1 mb-1">
                          {item.product?.name}
                        </p>
                        <p className="text-sm font-bold text-accent">
                          {formatPriceNumber(item.product?.price || '0')} GNF
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Mes Adresses</h2>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-secondary/50 rounded-xl p-6 text-center border border-dashed border-border">
              <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Aucune adresse enregistrée
              </p>
              <Link href="/profile/settings">
                <Button variant="outline" size="sm" className="rounded-full">
                  Ajouter une adresse
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="bg-accent/10 border-accent/20">
          <div className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1">Profitez de vos avantages</p>
              <p className="text-xs text-muted-foreground">
                Enregistrez vos adresses pour un checkout plus rapide et suivez vos commandes en temps réel
              </p>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          variant="outline"
          className="w-full h-12 rounded-xl touch-manipulation border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
