import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { createOrderSchema } from '@/lib/validation';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email';
import { siteConfig } from '@/lib/config';
import { createNotification } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const order = await db.select().from(orders).where(eq(orders.id, parseInt(orderId)));
      if (order.length === 0) {
        const error = createError('NOT_FOUND', 'Commande non trouvée');
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        );
      }

      // Get order items with product details
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          product: {
            id: products.id,
            name: products.name,
            price: products.price,
          },
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, parseInt(orderId)));

      // Get user info if userId exists
      let user = null;
      if (order[0].userId) {
        const userData = await db.select().from(users).where(eq(users.id, order[0].userId));
        if (userData.length > 0) {
          user = {
            id: userData[0].id,
            name: userData[0].name,
            email: userData[0].email,
          };
        }
      }

      return NextResponse.json({
        ...order[0],
        items,
        user,
      });
    }

    if (userId) {
      try {
        const userOrders = await db.select().from(orders).where(eq(orders.userId, parseInt(userId)));
        
        // Enrich each order with items and user data
        const enrichedOrders = await Promise.all(
          userOrders.map(async (order) => {
            const items = await db
              .select({
                id: orderItems.id,
                productId: orderItems.productId,
                quantity: orderItems.quantity,
                price: orderItems.price,
                product: {
                  id: products.id,
                  name: products.name,
                  price: products.price,
                },
              })
              .from(orderItems)
              .leftJoin(products, eq(orderItems.productId, products.id))
              .where(eq(orderItems.orderId, order.id));

            return {
              ...order,
              items,
            };
          })
        );

        return NextResponse.json(enrichedOrders || []);
      } catch (dbError) {
        logger.error('Erreur DB lors de la récupération des commandes utilisateur', dbError);
        return NextResponse.json([], { status: 200 });
      }
    }

    // Get all orders with items and user data
    const allOrders = await db.select().from(orders);
    
    const enrichedOrders = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            product: {
              id: products.id,
              name: products.name,
              price: products.price,
            },
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        let user = null;
        if (order.userId) {
          const userData = await db.select().from(users).where(eq(users.id, order.userId));
          if (userData.length > 0) {
            user = {
              id: userData[0].id,
              name: userData[0].name,
              email: userData[0].email,
            };
          }
        }

        return {
          ...order,
          items,
          user,
        };
      })
    );

    return NextResponse.json(enrichedOrders || []);
  } catch (error) {
    logger.error('Erreur lors de la récupération des commandes', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    logger.info('Order creation request:', JSON.stringify(body));

    // Validation avec Zod
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      logger.error('Validation error:', validationResult.error.errors);
      const error = createError('VALIDATION_ERROR', validationResult.error.errors[0].message);
      return NextResponse.json(
        { error: error.message, code: error.code, details: validationResult.error.errors },
        { status: error.statusCode }
      );
    }

    const { userId, guestEmail, guestName, totalAmount, paymentMethod, deliveryAddress, phoneNumber, deliveryZoneId, items } = validationResult.data;

    // Ajouter le préfixe +224 automatiquement si absent
    let formattedPhoneNumber = phoneNumber.trim();
    if (!formattedPhoneNumber.startsWith('+224')) {
      formattedPhoneNumber = '+224' + formattedPhoneNumber.replace(/^\+?224/, '');
    }

    logger.info('Starting order creation');

    // 1. Créer la commande
    logger.info('Creating order with data:', { userId, guestEmail, guestName, totalAmount, paymentMethod });
    const newOrder = await db.insert(orders).values({
      userId: userId || null,
      guestEmail: guestEmail || null,
      guestName: guestName || null,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      phoneNumber: formattedPhoneNumber,
      deliveryZoneId: deliveryZoneId || null,
      status: 'pending',
    }).returning();

    if (newOrder.length === 0) {
      logger.error('Order insert returned empty array');
      throw createError('ORDER_CREATION_FAILED');
    }

    const orderId = newOrder[0].id;
    logger.info(`Order created with ID: ${orderId}`);

    // 2. Pour chaque article, vérifier le stock et créer l'item
    for (const item of items) {
      logger.info(`Processing item: productId=${item.productId}, quantity=${item.quantity}`);
      
      // Vérifier le stock disponible
      const product = await db.select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (product.length === 0) {
        logger.error(`Product not found: ${item.productId}`);
        throw createError('NOT_FOUND', `Produit ${item.productId} non trouvé`);
      }

      const currentStock = product[0].stock ?? 0;
      logger.info(`Product stock check: ${product[0].name}, current=${currentStock}, requested=${item.quantity}`);
      
      if (currentStock < item.quantity) {
        logger.error(`Insufficient stock for product ${item.productId}`);
        throw createError(
          'INSUFFICIENT_STOCK',
          `Stock insuffisant pour ${product[0].name}. Disponible: ${currentStock}, Demandé: ${item.quantity}`
        );
      }

      // Décrémenter le stock de manière atomique
      logger.info(`Updating stock for product ${item.productId}`);
      await db.update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId));

      // Créer l'item de commande
      logger.info(`Creating order item for orderId=${orderId}, productId=${item.productId}`);
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    const result = newOrder[0];
    logger.info(`Commande créée: ${result.id} (${userId ? `User ${userId}` : `Guest ${guestEmail}`})`);

    // Prepare email data with product details
    const emailItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await db.select().from(products).where(eq(products.id, item.productId));
        return {
          name: product[0]?.name || `Produit #${item.productId}`,
          quantity: item.quantity,
          price: item.price,
          image: product[0]?.image || 'https://via.placeholder.com/100',
        };
      })
    );

    const customerEmail = userId 
      ? (await db.select().from(users).where(eq(users.id, userId))).at(0)?.email || guestEmail
      : guestEmail;

    const customerName = userId
      ? (await db.select().from(users).where(eq(users.id, userId))).at(0)?.name || guestName
      : guestName;

    logger.info(`Customer email for order ${result.id}: ${customerEmail}`);
    logger.info(`Customer name for order ${result.id}: ${customerName}`);

    // Send order confirmation email to customer
    if (customerEmail) {
      try {
        logger.info(`Sending order confirmation email to customer: ${customerEmail}`);
        await sendOrderConfirmationEmail(customerEmail, {
          orderId: result.id,
          customerName: customerName || 'Client',
          totalAmount: totalAmount,
          deliveryAddress: deliveryAddress,
          paymentMethod: paymentMethod,
          items: emailItems,
          createdAt: result.createdAt,
        });
        logger.info(`Order confirmation email sent successfully to ${customerEmail}`);
      } catch (emailError) {
        logger.error(`Failed to send order confirmation email to ${customerEmail}:`, emailError);
        // Don't fail the order if email fails
      }
    }

    // Send admin notification email
    try {
      logger.info(`Sending admin notification email to: ${siteConfig.admin.email}`);
      await sendAdminOrderNotificationEmail(siteConfig.admin.email, {
        orderId: result.id,
        customerName: customerName || 'Client inconnu',
        customerEmail: customerEmail || 'Email non disponible',
        phoneNumber: phoneNumber,
        totalAmount: totalAmount,
        deliveryAddress: deliveryAddress,
        items: emailItems,
        createdAt: result.createdAt,
      });
      logger.info(`Admin notification email sent successfully to ${siteConfig.admin.email}`);
    } catch (emailError) {
      logger.error('Failed to send admin notification email:', emailError);
      // Don't fail the order if email fails
    }

    // Create in-app notifications
    try {
      // Notification for customer
      if (userId) {
        await createNotification({
          userId,
          type: 'order_created',
          title: 'Commande créée',
          message: `Votre commande #${result.id} a été créée avec succès. Montant: ${totalAmount} GNF`,
          orderId: result.id,
          actionUrl: `/profile/orders/${result.id}`,
        });
      }

      // Notification for admin
      const adminUser = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);
      if (adminUser.length > 0) {
        await createNotification({
          adminId: adminUser[0].id,
          type: 'new_order_admin',
          title: 'Nouvelle commande',
          message: `Nouvelle commande #${result.id} de ${customerName || 'Client'} - Montant: ${totalAmount} GNF`,
          orderId: result.id,
          actionUrl: `/admin/orders`,
        });
      }
    } catch (notificationError) {
      logger.error('Failed to create notifications:', notificationError);
      // Don't fail the order if notification creation fails
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('=== FULL ERROR DETAILS ===');
    console.error('Error type:', typeof error);
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.error('=== END ERROR DETAILS ===');
    
    logger.error('Error in POST /api/orders:', error);
    
    // Check if it's an AppError by checking for the statusCode property
    if (error && typeof error === 'object' && 'statusCode' in error && 'code' in error) {
      const appError = error as any;
      logger.error(`AppError: ${appError.code} - ${appError.message}`);
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.statusCode }
      );
    }

    logger.error('Erreur lors de la création de la commande', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
