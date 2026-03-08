import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendPaymentConfirmationEmail, sendShippingNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Get order and user details
    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderResult || orderResult.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderResult[0];
    
    if (!order.userId) {
      return NextResponse.json({ error: 'Order has no user' }, { status: 400 });
    }
    
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1);

    if (!userResult || userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult[0];

    // Update order status if provided
    if (status) {
      await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    }

    // Update payment status if provided
    if (paymentStatus) {
      await db.update(orders).set({ paymentStatus }).where(eq(orders.id, orderId));

      // Send payment confirmation email when payment is completed
      if (paymentStatus === 'completed') {
        try {
          await sendPaymentConfirmationEmail(user.email, {
            orderId,
            customerName: user.name,
            totalAmount: order.totalAmount.toString(),
            paymentDate: new Date().toLocaleDateString('fr-FR'),
          });
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
        }
      }
    }

    // Send shipping notification when status changes to shipped
    if (status === 'shipped') {
      try {
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now

        await sendShippingNotificationEmail(user.email, {
          orderId,
          customerName: user.name,
          estimatedDelivery: estimatedDelivery.toLocaleDateString('fr-FR'),
        });
      } catch (emailError) {
        console.error('Failed to send shipping notification email:', emailError);
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
