import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    const { id } = await params;
    const userId = parseInt(id);
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0) {
      const error = createError('NOT_FOUND', 'Utilisateur non trouvé');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    const safeUser = { ...user[0], password: undefined };
    return NextResponse.json(safeUser);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'utilisateur', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}

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
    const userId = parseInt(id);
    const body = await request.json();
    const { status, suspendReason } = body;

    // Vérifier que l'utilisateur existe
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
      const error = createError('NOT_FOUND', 'Utilisateur non trouvé');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    // Mettre à jour le statut
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'suspended') {
      updateData.suspendedAt = new Date();
      updateData.suspendReason = suspendReason || 'Suspendu par l\'administrateur';
    } else if (status === 'active') {
      updateData.suspendedAt = null;
      updateData.suspendReason = null;
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    logger.info(`Utilisateur ${userId} - Statut changé à ${status}`);

    const safeUser = { ...result[0], password: undefined };
    return NextResponse.json(safeUser);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de l\'utilisateur', error);
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
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) {
      return adminCheck;
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Vérifier que l'utilisateur existe
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
      const error = createError('NOT_FOUND', 'Utilisateur non trouvé');
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    // Marquer comme supprimé au lieu de supprimer physiquement
    const result = await db
      .update(users)
      .set({
        status: 'deleted',
        email: `deleted-${userId}-${Date.now()}@deleted.local`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    logger.info(`Utilisateur ${userId} supprimé`);

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'utilisateur', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.statusCode }
    );
  }
}
