'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Bell, Trash2, Check, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/2tact/page-header';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';

const notificationIcons: Record<string, React.ReactNode> = {
  new_order_admin: '📦',
  low_stock_admin: '⚠️',
  order_shipped: '🚚',
  order_delivered: '✅',
  order_cancelled: '❌',
  payment_received: '💰',
  product_review: '⭐',
};

const notificationColors: Record<string, string> = {
  new_order_admin: 'border-blue-200 bg-blue-50',
  low_stock_admin: 'border-yellow-200 bg-yellow-50',
  order_shipped: 'border-purple-200 bg-purple-50',
  order_delivered: 'border-green-200 bg-green-50',
  order_cancelled: 'border-red-200 bg-red-50',
  payment_received: 'border-emerald-200 bg-emerald-50',
  product_review: 'border-orange-200 bg-orange-50',
};

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter((n) => n.type === filterType);

  const notificationTypes = Array.from(new Set(notifications.map((n) => n.type)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <PageHeader
        title="Notifications"
        description={`${unreadNotifications.length} non lue${unreadNotifications.length !== 1 ? 's' : ''}`}
      />

      {/* Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {unreadNotifications.length > 0 && (
                <Button
                  onClick={() => markAllAsRead()}
                  variant="outline"
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Tout marquer comme lu
                </Button>
              )}
            </div>

            {/* Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                <option value="all">Tous les types</option>
                {notificationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                {filterType === 'all'
                  ? 'Vous recevrez des notifications pour les nouvelles commandes et alertes'
                  : `Aucune notification de type "${filterType.replace(/_/g, ' ')}"`}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-6 border-l-4 transition-all hover:shadow-md ${
                    notificationColors[notification.type] || 'border-border bg-secondary'
                  } ${!notification.isRead ? 'ring-1 ring-accent' : ''}`}
                >
                  <div className="flex gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {notificationIcons[notification.type] || '📢'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          <p className="text-muted-foreground mt-1">{notification.message}</p>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-secondary rounded text-xs text-muted-foreground">
                              {notification.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                        <div className="flex gap-2">
                          {notification.actionUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(notification.actionUrl!)}
                            >
                              Voir détails
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Marquer comme lu
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
