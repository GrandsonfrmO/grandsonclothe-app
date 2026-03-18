import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroImages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const images = await db
      .select()
      .from(heroImages)
      .where(eq(heroImages.isActive, true))
      .orderBy(desc(heroImages.displayOrder));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Erreur lors de la récupération des images hero:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
