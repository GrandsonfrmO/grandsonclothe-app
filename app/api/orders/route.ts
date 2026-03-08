import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const order = await db.select().from(orders).where(eq(orders.id, parseInt(orderId)));
      if (order.length === 0) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order[0]);
    }

    if (userId) {
      const userOrders = await db.select().from(orders).where(eq(orders.userId, parseInt(userId)));
      return NextResponse.json(userOrders);
    }

    const allOrders = await db.select().from(orders);
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, totalAmount, paymentMethod, deliveryAddress, phoneNumber, items } = body;

    if (!userId || !totalAmount || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newOrder = await db.insert(orders).values({
      userId,
      totalAmount: totalAmount.toString(),
      paymentMethod,
      deliveryAddress,
      phoneNumber,
      status: 'pending',
    }).returning();

    if (newOrder.length === 0) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderId = newOrder[0].id;

    for (const item of items) {
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toString(),
      });
    }

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
