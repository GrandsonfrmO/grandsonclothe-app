import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customerGallery } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const images = await db
      .select()
      .from(customerGallery)
      .where(
        and(
          eq(customerGallery.isActive, true),
          eq(customerGallery.isApproved, true)
        )
      )
      .orderBy(desc(customerGallery.displayOrder));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
