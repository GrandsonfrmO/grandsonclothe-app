import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandAmbassadors } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin, isNextResponse } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request);
    if (isNextResponse(adminCheck)) return adminCheck;

    const ambassadors = await db
      .select()
      .from(brandAmbassadors)
      .orderBy(desc(brandAmbassadors.displayOrder));

    return NextResponse.json(ambassadors);
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
    const { name, profileImage, bio, role, instagram, facebook, twitter, tiktok, website, isActive, displayOrder } = body;

    const newAmbassador = await db
      .insert(brandAmbassadors)
      .values({
        name,
        profileImage,
        bio,
        role,
        instagram,
        facebook,
        twitter,
        tiktok,
        website,
        isActive,
        displayOrder,
      })
      .returning();

    return NextResponse.json(newAmbassador[0]);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
