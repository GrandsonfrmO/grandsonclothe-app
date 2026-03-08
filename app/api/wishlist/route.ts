import { db } from '@/lib/db';
import { wishlist, products } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

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

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await db
      .select({
        id: wishlist.id,
        productId: wishlist.productId,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image: products.image,
        },
      })
      .from(wishlist)
      .innerJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, userId));

    return Response.json({ wishlist: items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return Response.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if already in wishlist
    const existing = await db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));

    if (existing.length > 0) {
      return Response.json({ error: 'Already in wishlist' }, { status: 400 });
    }

    // Add to wishlist
    const result = await db.insert(wishlist).values({
      userId,
      productId,
    });

    return Response.json({ success: true, wishlistItem: result });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return Response.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}
