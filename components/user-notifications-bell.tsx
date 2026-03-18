'use client';

import { useState } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const notificationIcons: Record<string, React.ReactNode> = {
  order_created: '📦',
  order_processing: '⏳',
  order_shipped: '🚚',
  order_delivered: '✅',
  order_cancelled: '❌',
  payment_received: '💰',
  product_review: '⭐',
};

export function UserNotificationsBell() {
  const { user } = useAuth();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || user.role === 'admin') return null;

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-secondary rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 transition-colors ${
                      !notification.isRead ? 'bg-accent/5' : ''
                    }`}
                  >
                    <div className="flex gap-2">
                      <div className="text-lg flex-shrink-0">
                        {notificationIcons[notification.type] || '📢'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </span>
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-0.5 hover:bg-secondary rounded text-xs"
                                title="Marquer comme lu"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-0.5 hover:bg-secondary rounded text-xs text-destructive"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border text-center">
              <button
                onClick={() => {
                  router.push('/notifications');
                  setIsOpen(false);
                }}
                className="text-xs text-accent hover:underline"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
