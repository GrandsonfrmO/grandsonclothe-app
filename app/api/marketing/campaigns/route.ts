import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { marketingCampaigns, users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-middleware';
import { eq, desc } from 'drizzle-orm';

// GET - Récupérer toutes les campagnes
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const campaigns = await db
      .select()
      .from(marketingCampaigns)
      .orderBy(desc(marketingCampaigns.createdAt));

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle campagne
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { name, subject, content, type, targetSegment, scheduledAt } = body;

    // Validation
    if (!name || !subject || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Créer la campagne
    const [campaign] = await db
      .insert(marketingCampaigns)
      .values({
        name,
        subject,
        content,
        type,
        targetSegment: targetSegment || 'all',
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdBy: authResult.user.id,
      })
      .returning();

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
