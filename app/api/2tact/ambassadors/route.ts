import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandAmbassadors } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const ambassadors = await db
      .select()
      .from(brandAmbassadors)
      .orderBy(desc(brandAmbassadors.displayOrder));

    const formattedAmbassadors = ambassadors.map(amb => ({
      ...amb,
      socialMedia: amb.socialMedia ? JSON.parse(amb.socialMedia) : null,
    }));

    return NextResponse.json(formattedAmbassadors);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
