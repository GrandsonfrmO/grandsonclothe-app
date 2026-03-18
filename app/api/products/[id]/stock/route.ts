import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    const { id } = await params;
    const body = await request.json();
    const { stock } = body;

    // Validate stock
    if (typeof stock !== 'number' || stock < 0) {
      const error = createError('VALIDATION_ERROR', 'Stock must be a non-negative number');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    // Update product stock
    const result = await db
      .update(products)
      .set({ stock })
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      const error = createError('NOT_FOUND', 'Product not found');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    logger.info(`Stock updated for product ${id}: ${stock}`);

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as any;
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.statusCode }
      );
    }

    logger.error('Error updating product stock', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
