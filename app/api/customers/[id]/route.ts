import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth-middleware';

// GET - Récupérer un client spécifique
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const params = await context.params;
    const customerId = parseInt(params.id);
    
    const customer = await db
      .select()
      .from(users)
      .where(eq(users.id, customerId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du client' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le statut d'un client
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const params = await context.params;
    const customerId = parseInt(params.id);
    const body = await request.json();
    const { action, reason } = body;

    // Vérifier que le client existe
    const existingCustomer = await db
      .select()
      .from(users)
      .where(eq(users.id, customerId))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Ne pas permettre de modifier un admin
    if (existingCustomer[0].role === 'admin') {
      return NextResponse.json(
        { error: 'Impossible de modifier un compte administrateur' },
        { status: 403 }
      );
    }

    let updateData: any = {
      updatedAt: new Date(),
    };

    switch (action) {
      case 'suspend':
        updateData.status = 'suspended';
        updateData.suspendedAt = new Date();
        updateData.suspendReason = reason || 'Suspendu par l\'administrateur';
        break;

      case 'block':
        updateData.status = 'blocked';
        updateData.suspendedAt = new Date();
        updateData.suspendReason = reason || 'Bloqué par l\'administrateur';
        break;

      case 'activate':
        updateData.status = 'active';
        updateData.suspendedAt = null;
        updateData.suspendReason = null;
        break;

      case 'delete':
        updateData.status = 'deleted';
        updateData.suspendedAt = new Date();
        updateData.suspendReason = reason || 'Compte supprimé';
        break;

      default:
        return NextResponse.json(
          { error: 'Action non valide' },
          { status: 400 }
        );
    }

    const updatedCustomer = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, customerId))
      .returning();

    return NextResponse.json({
      success: true,
      customer: updatedCustomer[0],
      message: `Client ${action === 'suspend' ? 'suspendu' : action === 'block' ? 'bloqué' : action === 'activate' ? 'activé' : 'supprimé'} avec succès`,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du client' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer définitivement un client (soft delete)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const params = await context.params;
    const customerId = parseInt(params.id);

    // Vérifier que le client existe
    const existingCustomer = await db
      .select()
      .from(users)
      .where(eq(users.id, customerId))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Ne pas permettre de supprimer un admin
    if (existingCustomer[0].role === 'admin') {
      return NextResponse.json(
        { error: 'Impossible de supprimer un compte administrateur' },
        { status: 403 }
      );
    }

    // Soft delete - marquer comme supprimé
    await db
      .update(users)
      .set({
        status: 'deleted',
        suspendedAt: new Date(),
        suspendReason: 'Compte supprimé par l\'administrateur',
        updatedAt: new Date(),
      })
      .where(eq(users.id, customerId));

    return NextResponse.json({
      success: true,
      message: 'Client supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client' },
      { status: 500 }
    );
  }
}
