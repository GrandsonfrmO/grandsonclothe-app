import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function migrateUsersStatus() {
  try {
    console.log('🔄 Migration: Ajout de la colonne status à la table users...');

    // Vérifier si la colonne existe déjà
    const checkColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'status'
    `);

    if (checkColumn && checkColumn.length > 0) {
      console.log('✅ La colonne status existe déjà');
      return;
    }

    // Créer l'enum si nécessaire
    await db.execute(sql`
      DO $ BEGIN
        CREATE TYPE user_status AS ENUM ('active', 'suspended', 'blocked', 'deleted');
      EXCEPTION WHEN duplicate_object THEN null;
      END $;
    `);

    // Ajouter la colonne
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'active' NOT NULL
    `);

    console.log('✅ Migration réussie: colonne status ajoutée');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

migrateUsersStatus();
