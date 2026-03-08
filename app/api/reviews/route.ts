import { db } from '@/lib/db';
import { reviews, orderItems, orders } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// GET reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productReviews = await db.query.reviews.findMany({
      where: eq(reviews.productId, parseInt(productId)),
      with: {
        user: {
          columns: { id: true, name: true },
        },
      },
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
    });

    return NextResponse.json(productReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId, rating, comment } = body;

    if (!productId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Product ID, User ID, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify user has purchased this product
    const userOrders = await db
      .select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.productId, productId),
          eq(orders.userId, userId)
        )
      )
      .limit(1);

    if (userOrders.length === 0) {
      return NextResponse.json(
        { error: 'You must purchase this product to leave a review' },
        { status: 403 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.userId, userId)
      ),
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    const newReview = await db.insert(reviews).values({
      productId,
      userId,
      rating,
      comment: comment || null,
    }).returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
