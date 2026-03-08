import { db } from '@/lib/db';
import { wishlist } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

async function getUserId() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    return null;
  }

  try {
    const parsed = JSON.parse(authToken) as { userId: number };
    return parsed.userId;
  } catch {
    return null;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = parseInt(id);

    if (isNaN(productId)) {
      return Response.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Delete from wishlist
    await db
      .delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return Response.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
