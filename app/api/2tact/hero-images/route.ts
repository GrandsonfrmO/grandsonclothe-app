import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroImages } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) return adminCheck;

    const images = await db
      .select()
      .from(heroImages)
      .orderBy(desc(heroImages.displayOrder));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) return adminCheck;

    const body = await request.json();
    const { imageUrl, title, subtitle, ctaText, ctaLink, isActive, displayOrder } = body;

    const newImage = await db
      .insert(heroImages)
      .values({
        imageUrl,
        title,
        subtitle,
        ctaText,
        ctaLink,
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
