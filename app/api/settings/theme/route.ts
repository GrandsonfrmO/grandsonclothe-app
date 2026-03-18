import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
}

const DEFAULT_THEME: ThemeColors = {
  primary: 'oklch(0.65 0.2 145)',
  accent: 'oklch(0.65 0.2 145)',
  background: 'oklch(0.08 0 0)',
  foreground: 'oklch(0.98 0 0)',
};

// GET - Récupérer les couleurs du thème
export async function GET() {
  try {
    const result = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'theme_colors'))
      .limit(1);

    if (result.length > 0) {
      const colors = JSON.parse(result[0].value);
      return NextResponse.json(colors);
    }

    return NextResponse.json(DEFAULT_THEME);
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(DEFAULT_THEME);
  }
}

// POST - Sauvegarder les couleurs du thème
export async function POST(request: NextRequest) {
  try {
    const colors: ThemeColors = await request.json();

    // Valider les couleurs
    if (!colors.primary || !colors.accent || !colors.background || !colors.foreground) {
      return NextResponse.json(
        { error: 'Toutes les couleurs sont requises' },
        { status: 400 }
      );
    }

    // Vérifier si la clé existe
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'theme_colors'))
      .limit(1);

    if (existing.length > 0) {
      // Mettre à jour
      await db
        .update(siteSettings)
        .set({
          value: JSON.stringify(colors),
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, 'theme_colors'));
    } else {
      // Créer
      await db.insert(siteSettings).values({
        key: 'theme_colors',
        value: JSON.stringify(colors),
      });
    }

    return NextResponse.json({
      success: true,
      colors,
      message: 'Thème mis à jour avec succès',
    });
  } catch (error) {
    console.error('Error saving theme:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du thème' },
      { status: 500 }
    );
  }
}
