import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin access
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { id } = await params;
    
    let customerOrders;
    if (id.startsWith('user-')) {
      const userId = parseInt(id.replace('user-', ''));
      customerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId));
    } else if (id.startsWith('guest-')) {
      const guestEmail = id.replace('guest-', '');
      customerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.guestEmail, guestEmail));
    } else {
      // Pour la compatibilité ascendante avec les ID numériques simples
      const userId = parseInt(id);
      customerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId));
    }

    return NextResponse.json(customerOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
