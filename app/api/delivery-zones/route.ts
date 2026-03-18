import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deliveryZones } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';
import { z } from 'zod';

const createZoneSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  price: z.number().int().min(0, 'Price must be non-negative'),
  isActive: z.boolean().optional().default(true),
});

const updateZoneSchema = createZoneSchema.partial();

export const revalidate = 3600; // Cache for 1 hour

// GET all delivery zones
export async function GET(request: NextRequest) {
  try {
    const zones = await db.select().from(deliveryZones).orderBy(deliveryZones.name);
    return NextResponse.json(zones);
  } catch (error) {
    logger.error('Error fetching delivery zones', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}

// POST create new delivery zone (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    const body = await request.json();
    const validation = createZoneSchema.safeParse(body);

    if (!validation.success) {
      const error = createError('VALIDATION_ERROR', validation.error.errors[0].message);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    const result = await db
      .insert(deliveryZones)
      .values(validation.data)
      .returning();

    logger.info(`Delivery zone created: ${validation.data.name}`);
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as any;
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.statusCode }
      );
    }

    logger.error('Error creating delivery zone', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
