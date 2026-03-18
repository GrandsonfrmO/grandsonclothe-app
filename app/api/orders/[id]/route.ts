import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, users, orderItems, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendShippingNotificationEmail, sendOrderConfirmedByAdminEmail, sendOrderRejectedEmail } from '@/lib/email';
import { logger } from '@/lib/logger';
import { createNotification } from '@/lib/notifications';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes, rejectionReason } = body;

    // Get the order before updating
    const orderBefore = await db.select().from(orders).where(eq(orders.id, parseInt(id)));
    if (orderBefore.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderBefore[0];

    // Update the order status and notes if provided
    const updateData: any = { status: status as any };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    if (rejectionReason !== undefined) {
      updateData.rejectionReason = rejectionReason;
    }

    const updated = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    // Send shipping notification if status changed to "shipped"
    if (status === 'shipped' && order.status !== 'shipped') {
      const customerEmail = order.userId
        ? (await db.select().from(users).where(eq(users.id, order.userId))).at(0)?.email
        : order.guestEmail;

      const customerName = order.userId
        ? (await db.select().from(users).where(eq(users.id, order.userId))).at(0)?.name
        : order.guestName;

      if (customerEmail) {
        try {
          await sendShippingNotificationEmail(customerEmail, {
            orderId: order.id,
            customerName: customerName || 'Client',
            estimatedDelivery: '24-48 heures',
          });
        } catch (emailError) {
          logger.error(`Failed to send shipping notification email to ${customerEmail}:`, emailError);
          // Don't fail the status update if email fails
        }
      }

      // Create in-app notification for customer
      if (order.userId) {
        try {
          await createNotification({
            userId: order.userId,
            type: 'order_shipped',
            title: 'Commande expédiée',
            message: `Votre commande #${order.id} a été expédiée! Livraison estimée: 24-48 heures`,
            orderId: order.id,
            actionUrl: `/profile/orders/${order.id}`,
          });
        } catch (notificationError) {
          logger.error('Failed to create shipped notification:', notificationError);
        }
      }
    }

    // Handle other status changes
    if (status === 'processing' && order.status !== 'processing') {
      const customerEmail = order.userId
        ? (await db.select().from(users).where(eq(users.id, order.userId))).at(0)?.email
        : order.guestEmail;

      const customerName = order.userId
        ? (await db.select().from(users).where(eq(users.id, order.userId))).at(0)?.name
        : order.guestName;

      // Get order items with product details for email
      const emailItems = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          name: products.name,
          image: products.image,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      // Send confirmation email to customer
      if (customerEmail) {
        try {
          await sendOrderConfirmedByAdminEmail(customerEmail, {
            orderId: order.id,
            customerName: customerName || 'Client',
            totalAmount: order.totalAmount,
            deliveryAddress: order.deliveryAddress,
            items: emailItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
            })),
            estimatedDelivery: '24-48 heures',
          });
          logger.info(`Order confirmed by admin email sent to ${customerEmail}`);
        } catch (emailError) {
          logger.error(`Failed to send order confirmed by admin email to ${customerEmail}:`, emailError);
          // Don't fail the status update if email fails
        }
      }

      if (order.userId) {
        try {
          await createNotification({
            userId: order.userId,
            type: 'order_processing',
            title: 'Commande confirmée',
            message: `Votre commande #${order.id} a été confirmée par notre équipe et est en traitement.`,
            orderId: order.id,
            actionUrl: `/profile/orders/${order.id}`,
          });
        } catch (notificationError) {
          logger.error('Failed to create processing notification:', notificationError);
        }
      }
    }

    if (status === 'delivered' && order.status !== 'delivered') {
      if (order.userId) {
        try {
          await createNotification({
            userId: order.userId,
            type: 'order_delivered',
            title: 'Commande livrée',
            message: `Votre commande #${order.id} a été livrée avec succès!`,
            orderId: order.id,
            actionUrl: `/profile/orders/${order.id}`,
          });
        } catch (notificationError) {
          logger.error('Failed to create delivered notification:', notificationError);
        }
      }
    }

    if (status === 'cancelled' && order.status !== 'cancelled') {
      const customerEmail = order.userId
        ? (await db.select().from(users).where(eq(users.id, order.userId))).at(0)?.email
        : order.guestEmail;

      const customerName = order.userId
        ? (await db.select().from(users).where(eq(users.id, order.userId))).at(0)?.name
        : order.guestName;

      // Send rejection email to customer
      if (customerEmail) {
        try {
          await sendOrderRejectedEmail(customerEmail, {
            orderId: order.id,
            customerName: customerName || 'Client',
            totalAmount: order.totalAmount,
            reason: rejectionReason || 'Aucune raison spécifiée',
          });
          logger.info(`Order rejected email sent to ${customerEmail}`);
        } catch (emailError) {
          logger.error(`Failed to send order rejected email to ${customerEmail}:`, emailError);
          // Don't fail the status update if email fails
        }
      }

      if (order.userId) {
        try {
          await createNotification({
            userId: order.userId,
            type: 'order_cancelled',
            title: 'Commande refusée',
            message: `Votre commande #${order.id} a été refusée. Raison: ${rejectionReason || 'Non spécifiée'}`,
            orderId: order.id,
            actionUrl: `/profile/orders/${order.id}`,
          });
        } catch (notificationError) {
          logger.error('Failed to create cancelled notification:', notificationError);
        }
      }
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    logger.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
