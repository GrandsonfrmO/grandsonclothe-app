import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroImages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const { imageUrl, title, subtitle, ctaText, ctaLink, isActive, displayOrder } = body;

    const updated = await db
      .update(heroImages)
      .set({
        imageUrl,
        title,
        subtitle,
        ctaText,
        ctaLink,
        isActive,
        displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(heroImages.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await db
      .delete(heroImages)
      .where(eq(heroImages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
