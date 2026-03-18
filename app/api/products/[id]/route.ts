import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth } from '@/lib/auth-middleware';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';
import { updateProductSchema } from '@/lib/validation';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (product.length === 0) {
      const error = createError('NOT_FOUND', 'Produit non trouvé');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(product[0]);
  } catch (error) {
    logger.error('Erreur lors de la récupération du produit', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Protection admin
    const admin = await requireAdmin(request);
    if (isNextResponse(admin)) return admin;

    const { id } = await params;
    const body = await request.json();

    // Validation avec Zod
    const validationResult = updateProductSchema.safeParse(body);
    if (!validationResult.success) {
      const error = createError('VALIDATION_ERROR', validationResult.error.errors[0].message);
      return NextResponse.json(
        { error: error.message, code: error.code, details: validationResult.error.errors },
        { status: error.statusCode }
      );
    }

    const { name, description, price, image, category, stock, colors, sizes } = validationResult.data;

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (image !== undefined) updateData.image = image;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = stock;
    if (colors !== undefined) {
      updateData.colors = colors 
        ? (typeof colors === 'string' ? colors : JSON.stringify(colors))
        : null;
    }
    if (sizes !== undefined) {
      updateData.sizes = sizes
        ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes))
        : null;
    }

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      const error = createError('NOT_FOUND', 'Produit non trouvé');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    logger.info(`Produit ${id} mis à jour par admin ${admin.userId}`);

    return NextResponse.json(updated[0]);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du produit', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Protection admin
    const admin = await requireAdmin(request);
    if (isNextResponse(admin)) return admin;

    const { id } = await params;
    const deleted = await db
      .delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      const error = createError('NOT_FOUND', 'Produit non trouvé');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    logger.info(`Produit ${id} supprimé par admin ${admin.userId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Erreur lors de la suppression du produit', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
