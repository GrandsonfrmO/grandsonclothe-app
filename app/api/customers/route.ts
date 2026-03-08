import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders } from '@/lib/db/schema';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    const allOrders = await db.select().from(orders);

    const customers = allUsers.map(user => {
      const userOrders = allOrders.filter(o => o.userId === user.id);
      const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        orderCount: userOrders.length,
        totalSpent: totalSpent.toFixed(2),
      };
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
