import { db } from '@/lib/db';
import { wishlist } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = parseInt(params.id);

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
