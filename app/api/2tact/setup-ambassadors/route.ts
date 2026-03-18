import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    console.log('🚀 Création des tables ambassadeurs, galerie clients et hero images...');

    // Table des ambassadeurs avec profils détaillés
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS brand_ambassadors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        profile_image VARCHAR(500) NOT NULL,
        bio TEXT,
        role VARCHAR(255),
        instagram VARCHAR(255),
        facebook VARCHAR(255),
        twitter VARCHAR(255),
        tiktok VARCHAR(255),
        website VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_ambassadors_active ON brand_ambassadors(is_active)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_ambassadors_order ON brand_ambassadors(display_order)
    `);

    console.log('✅ Table brand_ambassadors créée');

    // Table de la galerie clients
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS customer_gallery (
        id SERIAL PRIMARY KEY,
        image_url VARCHAR(500) NOT NULL,
        customer_name VARCHAR(255),
        caption TEXT,
        product_id INTEGER,
        is_approved BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_gallery_approved ON customer_gallery(is_approved)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_gallery_active ON customer_gallery(is_active)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_gallery_order ON customer_gallery(display_order)
    `);

    console.log('✅ Table customer_gallery créée');

    // Table des images hero
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hero_images (
        id SERIAL PRIMARY KEY,
        image_url VARCHAR(500) NOT NULL,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        cta_text VARCHAR(100),
        cta_link VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(display_order)
    `);

    console.log('✅ Table hero_images créée');

    return NextResponse.json({
      success: true,
      message: 'Tables créées avec succès',
      tables: ['brand_ambassadors', 'customer_gallery', 'hero_images']
    });

  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: 'Vérifiez que les tables n\'existent pas déjà ou que vous avez les permissions nécessaires'
      },
      { status: 500 }
    );
  }
}
