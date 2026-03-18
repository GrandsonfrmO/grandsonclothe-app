import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logoHistory } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { verifyAuth } from '@/lib/auth-middleware';

// GET - Récupérer l'historique des logos (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult || authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = await db
      .select()
      .from(logoHistory)
      .orderBy(desc(logoHistory.createdAt))
      .limit(20);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching logo history:', error);
    return NextResponse.json({ error: 'Failed to fetch logo history' }, { status: 500 });
  }
}

// DELETE - Supprimer une entrée de l'historique (admin uniquement)
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult || authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(logoHistory).where(eq(logoHistory.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting logo history:', error);
    return NextResponse.json({ error: 'Failed to delete logo history' }, { status: 500 });
  }
}
