'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
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
  MapPin,
  Phone,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product?: {
    name: string;
    image?: string;
  };
}

interface Order {
  id: number;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Demande de retour soumise: ${returnReason}`);
    setShowReturnForm(false);
    setReturnReason('');
  };

  if (loading || orderLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader title="Détails commande" showBack />
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

  if (!order) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader title="Détails commande" showBack />
        <main className="px-4 py-4">
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Commande non trouvée</p>
            <Link href="/profile">
              <Button className="rounded-full">
                Retour au profil
              </Button>
            </Link>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
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
      pending: <Clock className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle2 className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <Package className="w-4 h-4" />;
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      completed: 'Complété',
      failed: 'Échoué',
      refunded: 'Remboursé',
    };
    return labels[status] || status;
  };

  const canReturn = order.status === 'delivered' && 
    new Date(order.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title={`Commande #${order.id}`} showBack />
      
      <main className="space-y-2 px-4 py-4">
        {/* Status Card */}
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                {getStatusIcon(order.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut actuel</p>
                <p className="font-bold">{getStatusLabel(order.status)}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isCompleted 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {getStatusLabel(step)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour: {new Date(order.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </Card>

        {/* Items */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Articles commandés</h2>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-secondary/50 rounded-xl">
                <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm line-clamp-2 mb-1">
                    {item.product?.name || `Produit #${item.productId}`}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Quantité: {item.quantity}
                  </p>
                  <p className="text-sm font-bold text-accent">
                    {formatPriceNumber(parseInt(item.price) * item.quantity)} GNF
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Info */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold">Informations de livraison</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-secondary/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Adresse</p>
              <p className="text-sm">{order.deliveryAddress || 'Non spécifiée'}</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Téléphone
              </p>
              <p className="text-sm">{order.phoneNumber || 'Non spécifié'}</p>
            </div>
          </div>
        </Card>

        {/* Payment Info */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold">Paiement</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Méthode</p>
                <p className="text-sm font-medium capitalize">
                  {order.paymentMethod.replace('_', ' ')}
                </p>
              </div>
              <Badge variant="secondary">
                {getPaymentStatusLabel(order.paymentStatus)}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="font-semibold">Total</p>
              <p className="text-2xl font-bold text-accent">
                {formatPriceNumber(order.totalAmount)} GNF
              </p>
            </div>
          </div>
        </Card>

        {/* Return Section */}
        {canReturn && (
          <Card className="p-4 bg-orange-500/10 border-orange-500/20">
            <div className="flex items-start gap-3 mb-4">
              <RotateCcw className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold mb-1">Retour possible</h2>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez retourner cette commande jusqu'au{' '}
                  {new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            
            {!showReturnForm ? (
              <Button 
                onClick={() => setShowReturnForm(true)}
                variant="outline"
                className="w-full h-12 rounded-xl touch-manipulation border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
              >
                Demander un retour
              </Button>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Raison du retour
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                    required
                  >
                    <option value="">Sélectionner une raison</option>
                    <option value="defective">Produit défectueux</option>
                    <option value="not_as_described">Ne correspond pas à la description</option>
                    <option value="wrong_item">Mauvais article reçu</option>
                    <option value="changed_mind">J'ai changé d'avis</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 rounded-xl touch-manipulation bg-orange-500 hover:bg-orange-600"
                  >
                    Soumettre
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowReturnForm(false);
                      setReturnReason('');
                    }}
                    className="flex-1 h-12 rounded-xl touch-manipulation"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        {!canReturn && order.status === 'delivered' && (
          <Card className="p-4 bg-secondary/50">
            <p className="text-sm text-muted-foreground text-center">
              La période de retour de 30 jours pour cette commande a expiré
            </p>
          </Card>
        )}

        {/* Order Date */}
        <Card className="p-4 bg-secondary/50">
          <p className="text-xs text-muted-foreground text-center">
            Commande passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
