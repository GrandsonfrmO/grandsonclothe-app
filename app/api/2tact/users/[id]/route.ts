import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, cart, wishlist, notifications, reviews, orders, logoHistory, marketingCampaigns } from '@/lib/db/schema';
import { sendAccountDeletedEmail } from '@/lib/email';
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
  const { id } = await params;
  const userId = parseInt(id);
  
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) return adminCheck;

    if (adminCheck.userId === userId) {
      const error = createError('BAD_REQUEST', 'Autodestruction interdite. Un autre administrateur doit effectuer cette action.');
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }

    // 1. Récupérer les infos de l'utilisateur AVANT suppression pour l'email
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
      const error = createError('NOT_FOUND', 'Utilisateur non trouvé');
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }

    const userData = user[0];

    // 2. Transaction pour garantir l'atomicité de la suppression complète
    await db.transaction(async (tx) => {
      // Nettoyage Hard (suppression pure)
      await tx.delete(cart).where(eq(cart.userId, userId));
      await tx.delete(wishlist).where(eq(wishlist.userId, userId));
      await tx.delete(notifications).where(eq(notifications.userId, userId));
      await tx.delete(notifications).where(eq(notifications.adminId, userId));
      await tx.delete(reviews).where(eq(reviews.userId, userId));
      
      // Nettoyage Soft / Détachement (garder les données historiques sans liaison directe)
      await tx.update(orders).set({ userId: null }).where(eq(orders.userId, userId));
      await tx.update(logoHistory).set({ userId: null }).where(eq(logoHistory.userId, userId));
      await tx.update(marketingCampaigns).set({ createdBy: null }).where(eq(marketingCampaigns.createdBy, userId));

      // Suppression FINALE de l'avatar principal (l'utilisateur lui-même)
      await tx.delete(users).where(eq(users.id, userId));
    });

    // 3. Notification déconnectée (asynchrone) - On ne bloque pas si l'email fail après la suppression DB
    if (userData.email && !userData.email.includes('deleted')) {
      sendAccountDeletedEmail(userData.email, userData.name).catch(e => {
        logger.error(`⚠️ Email de suppression échoué pour ${userData.email}:`, e);
      });
    }

    logger.info(`🚨 Éradication complète de l'utilisateur ${userId} (${userData.email}) effectuée avec succès.`);

    return NextResponse.json({ 
      success: true,
      message: 'Le compte et toutes ses données associées ont été bannis définitivement. Allégeance rompue.' 
    });

  } catch (error) {
    logger.error('❌ Catastrophe lors de la suppression de l\'utilisateur', error);
    const appError = createError('INTERNAL_ERROR');
    return NextResponse.json({ error: appError.message, code: appError.code }, { status: appError.statusCode });
  }
}
