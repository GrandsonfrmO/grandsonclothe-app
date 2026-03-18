import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteSettings, logoHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAuth } from '@/lib/auth-middleware';

interface LogoSettings {
  logoUrl: string;
  siteName: string;
  tagline: string;
  faviconUrl?: string;
}

const defaultSettings: LogoSettings = {
  logoUrl: '',
  siteName: 'GRANDSON CLOTHES',
  tagline: 'Style & Qualité',
  faviconUrl: ''
};

// GET - Récupérer les paramètres du logo (public)
export async function GET() {
  try {
    const settings = await db.select().from(siteSettings).where(eq(siteSettings.key, 'logo_settings'));
    
    if (settings.length === 0) {
      return NextResponse.json(defaultSettings, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        }
      });
    }

    return NextResponse.json(JSON.parse(settings[0].value), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      }
    });
  } catch (error) {
    console.error('Error fetching logo settings:', error);
    return NextResponse.json(defaultSettings, { status: 200 });
  }
}

// POST - Mettre à jour les paramètres du logo (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult || authResult.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { logoUrl, siteName, tagline, faviconUrl } = body;

    // Validation
    if (!siteName || siteName.trim().length === 0) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }

    const logoSettings: LogoSettings = {
      logoUrl: logoUrl || '',
      siteName: siteName.trim(),
      tagline: tagline?.trim() || '',
      faviconUrl: faviconUrl || ''
    };

    const settingsData = JSON.stringify(logoSettings);

    // Vérifier si les paramètres existent
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'logo_settings'));

    if (existing.length > 0) {
      // Mettre à jour
      await db.update(siteSettings)
        .set({ value: settingsData, updatedAt: new Date() })
        .where(eq(siteSettings.key, 'logo_settings'));
    } else {
      // Créer
      await db.insert(siteSettings).values({
        key: 'logo_settings',
        value: settingsData,
      });
    }

    // Sauvegarder dans l'historique si le logo a changé
    if (logoUrl) {
      await db.insert(logoHistory).values({
        logoUrl: logoUrl,
        siteName: siteName.trim(),
        tagline: tagline?.trim() || '',
        faviconUrl: faviconUrl || '',
        userId: authResult.userId,
      });
    }

    console.log('✅ Logo settings updated successfully:', logoSettings);

    return NextResponse.json({ 
      success: true, 
      settings: logoSettings,
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error updating logo settings:', error);
    return NextResponse.json({ error: 'Failed to update logo settings' }, { status: 500 });
  }
}
