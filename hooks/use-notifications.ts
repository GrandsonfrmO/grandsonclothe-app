'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

interface Notification {
  id: number;
  userId?: number;
  adminId?: number;
  type: string;
  title: string;
  message: string;
  orderId?: number;
  productId?: number;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async (unreadOnly = false) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        [user.role === 'admin' ? 'adminId' : 'userId']: user.id.toString(),
        limit: '50',
        ...(unreadOnly && { unreadOnly: 'true' }),
      });

      const response = await fetch(`/api/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const params = new URLSearchParams({
        [user.role === 'admin' ? 'adminId' : 'userId']: user.id.toString(),
      });

      const response = await fetch(`/api/notifications/unread-count?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [user.role === 'admin' ? 'adminId' : 'userId']: user.id,
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
