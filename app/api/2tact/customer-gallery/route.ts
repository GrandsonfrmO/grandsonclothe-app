import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customerGallery } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const images = await db
      .select()
      .from(customerGallery)
      .orderBy(desc(customerGallery.displayOrder));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, customerName, caption, productId, isApproved, isActive, displayOrder } = body;

    const newImage = await db
      .insert(customerGallery)
      .values({
        imageUrl,
        customerName,
        caption,
        productId,
        isApproved,
        isActive,
        displayOrder,
      })
      .returning();

    return NextResponse.json(newImage[0]);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
