import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth } from '@/lib/auth-middleware';

const defaultContactSettings = {
  name: 'GRANDSON CLOTHES',
  email: 'contact@grandsonclothes.gn',
  phone: '+224 622 000 000',
  whatsapp: '+224 622 000 000',
  address: 'Kaloum, Conakry, Guinée',
  instagram: '@grandsonclothes',
  facebook: 'GRANDSON CLOTHES',
};

// GET - Récupérer les infos de contact (public)
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'contact_settings'));

    if (rows.length === 0) {
      return NextResponse.json(defaultContactSettings);
    }

    return NextResponse.json(JSON.parse(rows[0].value));
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return NextResponse.json(defaultContactSettings);
  }
}

// POST - Mettre à jour (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult || authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, whatsapp, address, instagram, facebook } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Le nom de la boutique est requis' }, { status: 400 });
    }

    const contactData = {
      name: name.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      whatsapp: whatsapp?.trim() || '',
      address: address?.trim() || '',
      instagram: instagram?.trim() || '',
      facebook: facebook?.trim() || '',
    };

    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'contact_settings'));

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value: JSON.stringify(contactData), updatedAt: new Date() })
        .where(eq(siteSettings.key, 'contact_settings'));
    } else {
      await db.insert(siteSettings).values({
        key: 'contact_settings',
        value: JSON.stringify(contactData),
      });
    }

    return NextResponse.json({ success: true, settings: contactData });
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}
