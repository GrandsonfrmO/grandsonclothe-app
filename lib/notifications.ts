import { db } from '@/lib/db';
import { notifications, orders, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export type NotificationType = 
  | 'order_created'
  | 'order_processing'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_received'
  | 'new_order_admin'
  | 'low_stock_admin'
  | 'product_review';

interface CreateNotificationParams {
  userId?: number;
  adminId?: number;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: number;
  productId?: number;
  actionUrl?: string;
}

// Notification templates
const notificationTemplates: Record<NotificationType, { title: string; message: (data: any) => string }> = {
  order_created: {
    title: 'Commande créée',
    message: (data) => `Votre commande #${data.orderId} a été créée avec succès. Montant: ${data.amount}`,
  },
  order_processing: {
    title: 'Commande en traitement',
    message: (data) => `Votre commande #${data.orderId} est maintenant en traitement.`,
  },
  order_shipped: {
    title: 'Commande expédiée',
    message: (data) => `Votre commande #${data.orderId} a été expédiée! Livraison estimée: ${data.estimatedDelivery}`,
  },
  order_delivered: {
    title: 'Commande livrée',
    message: (data) => `Votre commande #${data.orderId} a été livrée avec succès!`,
  },
  order_cancelled: {
    title: 'Commande annulée',
    message: (data) => `Votre commande #${data.orderId} a été annulée.`,
  },
  payment_received: {
    title: 'Paiement reçu',
    message: (data) => `Le paiement de votre commande #${data.orderId} a été reçu.`,
  },
  new_order_admin: {
    title: 'Nouvelle commande',
    message: (data) => `Nouvelle commande #${data.orderId} de ${data.customerName} - Montant: ${data.amount}`,
  },
  low_stock_admin: {
    title: 'Stock faible',
    message: (data) => `Le produit "${data.productName}" a un stock faible (${data.stock} unités restantes)`,
  },
  product_review: {
    title: 'Nouvel avis produit',
    message: (data) => `Un nouvel avis a été laissé sur le produit "${data.productName}"`,
  },
};

export const createNotification = async (params: CreateNotificationParams) => {
  try {
    const template = notificationTemplates[params.type];
    
    const notification = await db.insert(notifications).values({
      userId: params.userId,
      adminId: params.adminId,
      type: params.type,
      title: params.title || template.title,
      message: params.message || template.message({}),
      orderId: params.orderId,
      productId: params.productId,
      actionUrl: params.actionUrl,
      isRead: false,
    }).returning();

    logger.info(`✓ Notification created: ${params.type} for user ${params.userId || params.adminId}`);
    return notification[0];
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId: number, limit = 20) => {
  try {
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy((n) => n.createdAt)
      .limit(limit);

    return userNotifications;
  } catch (error) {
    logger.error('Error fetching user notifications:', error);
    throw error;
  }
};

export const getAdminNotifications = async (adminId: number, limit = 20) => {
  try {
    const adminNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.adminId, adminId))
      .orderBy((n) => n.createdAt)
      .limit(limit);

    return adminNotifications;
  } catch (error) {
    logger.error('Error fetching admin notifications:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (userId?: number, adminId?: number) => {
  try {
    const allUnread = await db.select().from(notifications).where(eq(notifications.isRead, false));
    
    let filtered = allUnread;
    if (userId) {
      filtered = allUnread.filter(n => n.userId === userId);
    } else if (adminId) {
      filtered = allUnread.filter(n => n.adminId === adminId);
    }

    return filtered.length;
  } catch (error) {
    logger.error('Error fetching unread notification count:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const updated = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, notificationId))
      .returning();

    return updated[0];
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId?: number, adminId?: number) => {
  try {
    // Get all unread notifications first
    const allUnread = await db.select().from(notifications).where(eq(notifications.isRead, false));
    
    // Filter based on userId or adminId
    let toUpdate = allUnread;
    if (userId) {
      toUpdate = allUnread.filter(n => n.userId === userId);
    } else if (adminId) {
      toUpdate = allUnread.filter(n => n.adminId === adminId);
    }

    // Update each notification
    for (const notif of toUpdate) {
      await db.update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(notifications.id, notif.id));
    }

    return { success: true };
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: number) => {
  try {
    await db.delete(notifications).where(eq(notifications.id, notificationId));
    return { success: true };
  } catch (error) {
    logger.error('Error deleting notification:', error);
    throw error;
  }
};
