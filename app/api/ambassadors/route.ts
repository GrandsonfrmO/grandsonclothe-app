import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandAmbassadors } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const ambassadors = await db
      .select()
      .from(brandAmbassadors)
      .where(eq(brandAmbassadors.isActive, true))
      .orderBy(desc(brandAmbassadors.displayOrder));

    return NextResponse.json(ambassadors);
  } catch (error) {
    console.error('Erreur lors de la récupération des ambassadeurs:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
