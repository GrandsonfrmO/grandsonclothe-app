import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandAmbassadors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const result = await db
      .select()
      .from(brandAmbassadors)
      .where(eq(brandAmbassadors.id, id));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Ambassadeur non trouvé' }, { status: 404 });
    }

    const ambassador = result[0];
    
    return NextResponse.json({
      id: ambassador.id,
      name: ambassador.name,
      profileImage: ambassador.profileImage,
      bio: ambassador.bio,
      role: ambassador.role,
      instagram: ambassador.instagram,
      facebook: ambassador.facebook,
      twitter: ambassador.twitter,
      tiktok: ambassador.tiktok,
      website: ambassador.website,
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
