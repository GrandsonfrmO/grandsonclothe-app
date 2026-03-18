import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  // Verify admin access
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const allUsers = await db.select().from(users);
    const allOrders = await db.select().from(orders);

    // 1. Processus pour les utilisateurs enregistrés
    const registeredCustomers = allUsers.map(user => {
      const userOrders = allOrders.filter(o => o.userId === user.id);
      const totalSpent = userOrders.reduce((sum, order) => {
        const amount = typeof order.totalAmount === 'number' 
          ? order.totalAmount 
          : (parseFloat(order.totalAmount as string) || 0);
        return sum + amount;
      }, 0);
      
      return {
        id:  `user-${user.id}`, // On utilise un string unique
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        orderCount: userOrders.length,
        totalSpent: totalSpent.toFixed(0),
        isGuest: false,
      };
    });

    // 2. Processus pour les invités (ayant fait au moins une commande)
    const guestEmails = new Set(allOrders.filter(o => !o.userId && o.guestEmail).map(o => o.guestEmail));
    const guestCustomers = Array.from(guestEmails).map(email => {
      const guestOrders = allOrders.filter(o => o.guestEmail === email);
      const guestName = guestOrders[0]?.guestName || 'Invité';
      const totalSpent = guestOrders.reduce((sum, order) => {
        const amount = typeof order.totalAmount === 'number' 
          ? order.totalAmount 
          : (parseFloat(order.totalAmount as string) || 0);
        return sum + amount;
      }, 0);

      return {
        id: `guest-${email}`, // ID unique chaine pour les invités
        email: email,
        name: guestName,
        role: 'guest',
        createdAt: guestOrders[0].createdAt,
        orderCount: guestOrders.length,
        totalSpent: totalSpent.toFixed(0),
        isGuest: true,
      };
    });

    const allCustomers = [...registeredCustomers, ...guestCustomers];

    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
