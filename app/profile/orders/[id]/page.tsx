'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';

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
    // TODO: Implement return/refund API
    alert(`Demande de retour soumise: ${returnReason}`);
    setShowReturnForm(false);
    setReturnReason('');
  };

  if (loading || orderLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p>Chargement...</p>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Card className="p-6 text-center">
              <p className="text-gray-600 mb-4">Commande non trouvée</p>
              <Link href="/profile">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Retour au profil
                </Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/profile">
              <Button variant="outline" className="mb-4">
                ← Retour au profil
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Commande #{order.id}</h1>
          </div>

          {/* Status Timeline */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Suivi de la commande</h2>
            <div className="flex items-center justify-between">
              {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white mb-2 ${
                    ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-600 text-center capitalize">
                    {getStatusLabel(step)}
                  </p>
                  {index < 3 && (
                    <div className={`h-1 w-full mt-2 ${
                      ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) > index
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Statut actuel:</span> {getStatusLabel(order.status)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Dernière mise à jour: {new Date(order.updatedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </Card>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Items */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product?.name || `Produit #${item.productId}`}
                      </p>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping & Payment */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Adresse de livraison</p>
                  <p className="text-gray-900">{order.deliveryAddress || 'Non spécifiée'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                  <p className="text-gray-900">{order.phoneNumber || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Méthode de paiement</p>
                  <p className="text-gray-900 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Statut du paiement</p>
                  <p className="text-gray-900">{getPaymentStatusLabel(order.paymentStatus)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Total */}
          <Card className="p-6 mb-8 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900">Montant total</p>
              <p className="text-2xl font-bold text-gray-900">
                {parseFloat(order.totalAmount).toFixed(2)} €
              </p>
            </div>
          </Card>

          {/* Return/Refund Section */}
          {canReturn && (
            <Card className="p-6 border-2 border-orange-200 bg-orange-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Retour et remboursement</h2>
              <p className="text-sm text-gray-700 mb-4">
                Cette commande peut être retournée jusqu'au {new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
              </p>
              
              {!showReturnForm ? (
                <Button 
                  onClick={() => setShowReturnForm(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Demander un retour
                </Button>
              ) : (
                <form onSubmit={handleReturnSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raison du retour
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                      Soumettre la demande
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowReturnForm(false);
                        setReturnReason('');
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {!canReturn && order.status === 'delivered' && (
            <Card className="p-6 bg-gray-50">
              <p className="text-sm text-gray-600">
                La période de retour de 30 jours pour cette commande a expiré.
              </p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
