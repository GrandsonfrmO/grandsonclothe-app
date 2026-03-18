'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Bell, Trash2, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect } from 'react';

const notificationIcons: Record<string, React.ReactNode> = {
  order_created: '📦',
  order_processing: '⏳',
  order_shipped: '🚚',
  order_delivered: '✅',
  order_cancelled: '❌',
  payment_received: '💰',
  product_review: '⭐',
};

const notificationColors: Record<string, string> = {
  order_created: 'border-blue-200 bg-blue-50',
  order_processing: 'border-yellow-200 bg-yellow-50',
  order_shipped: 'border-purple-200 bg-purple-50',
  order_delivered: 'border-green-200 bg-green-50',
  order_cancelled: 'border-red-200 bg-red-50',
  payment_received: 'border-emerald-200 bg-emerald-50',
  product_review: 'border-orange-200 bg-orange-50',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="p-4 lg:p-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Notifications</h1>
              <p className="text-muted-foreground mt-1">
                {unreadNotifications.length} non lue{unreadNotifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Actions */}
          {unreadNotifications.length > 0 && (
            <div className="mb-6 flex gap-2">
              <Button
                onClick={() => markAllAsRead()}
                variant="outline"
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Tout marquer comme lu
              </Button>
            </div>
          )}

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                Vous recevrez des notifications pour vos commandes et activités
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
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
