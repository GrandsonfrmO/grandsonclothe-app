import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deliveryZones } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateZoneSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// GET single delivery zone
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const zone = await db
      .select()
      .from(deliveryZones)
      .where(eq(deliveryZones.id, parseInt(id)))
      .limit(1);

    if (zone.length === 0) {
      const error = createError('NOT_FOUND', 'Delivery zone not found');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(zone[0]);
  } catch (error) {
    logger.error('Error fetching delivery zone', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}

// PATCH update delivery zone (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    const { id } = await params;
    const body = await request.json();
    const validation = updateZoneSchema.safeParse(body);

    if (!validation.success) {
      const error = createError('VALIDATION_ERROR', validation.error.errors[0].message);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    const result = await db
      .update(deliveryZones)
      .set(validation.data)
      .where(eq(deliveryZones.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      const error = createError('NOT_FOUND', 'Delivery zone not found');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    logger.info(`Delivery zone updated: ${result[0].name}`);
    return NextResponse.json(result[0]);
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as any;
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.statusCode }
      );
    }

    logger.error('Error updating delivery zone', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}

// DELETE delivery zone (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    const { id } = await params;
    const result = await db
      .delete(deliveryZones)
      .where(eq(deliveryZones.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      const error = createError('NOT_FOUND', 'Delivery zone not found');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    logger.info(`Delivery zone deleted: ${result[0].name}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as any;
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.statusCode }
      );
    }

    logger.error('Error deleting delivery zone', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
