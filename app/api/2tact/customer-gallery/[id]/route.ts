import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customerGallery } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) return adminCheck;

    const { id: idStr } = await params;
    const id = parseInt(idStr);

    const result = await db
      .select()
      .from(customerGallery)
      .where(eq(customerGallery.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 });
    }

    const image = result[0];
    
    return NextResponse.json({
      id: image.id,
      imageUrl: image.imageUrl,
      customerName: image.customerName,
      caption: image.caption,
      productId: image.productId,
      isApproved: image.isApproved,
      isActive: image.isActive,
      displayOrder: image.displayOrder,
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) return adminCheck;

    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    const { imageUrl, customerName, caption, productId, isApproved, isActive, displayOrder } = body;

    const updated = await db
      .update(customerGallery)
      .set({
        imageUrl,
        customerName,
        caption,
        productId,
        isApproved,
        isActive,
        displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(customerGallery.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) return adminCheck;

    const { id: idStr } = await params;
    const id = parseInt(idStr);

    const deleted = await db
      .delete(customerGallery)
      .where(eq(customerGallery.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
