import { NextRequest, NextResponse } from 'next/server';
import { getCartItems, addToCart, removeFromCart, updateCartQuantity, clearCart } from '@/lib/db/queries';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await getCartItems(user.userId);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity, action = 'add' } = body;
    const userId = user.userId;

    if (action === 'add') {
      const item = await addToCart(userId, productId, quantity);
      return NextResponse.json(item, { status: 201 });
    } else if (action === 'update') {
      const item = await updateCartQuantity(userId, productId, quantity);
      return NextResponse.json(item);
    } else if (action === 'remove') {
      await removeFromCart(userId, productId);
      return NextResponse.json({ success: true });
    } else if (action === 'clear') {
      await clearCart(userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
