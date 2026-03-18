import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customerGallery } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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
