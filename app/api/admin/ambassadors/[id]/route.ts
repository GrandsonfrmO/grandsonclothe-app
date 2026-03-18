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

    const ambassadors = await db
      .select()
      .from(brandAmbassadors)
      .where(eq(brandAmbassadors.id, id));

    if (ambassadors.length === 0) {
      return NextResponse.json({ error: 'Ambassadeur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(ambassadors[0]);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, profileImage, bio, role, instagram, facebook, twitter, tiktok, website, isActive, displayOrder } = body;

    const updated = await db
      .update(brandAmbassadors)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(brandAmbassadors.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Ambassadeur non trouvé' }, { status: 404 });
    }

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

    const deleted = await db
      .delete(brandAmbassadors)
      .where(eq(brandAmbassadors.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Ambassadeur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
