import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function fixUsersTable() {
  try {
    console.log('🔄 Correction de la table users...\n');

    // Étape 1: Créer l'enum
    console.log('1️⃣  Création de l\'enum user_status...');
    try {
      await db.execute(sql`
        DO $$ BEGIN
          CREATE TYPE user_status AS ENUM ('active', 'suspended', 'blocked', 'deleted');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
      `);
      console.log('✅ Enum créé\n');
    } catch (e) {
      console.log('✅ Enum existe déjà\n');
    }

    // Étape 2: Ajouter la colonne
    console.log('2️⃣  Ajout de la colonne status...');
    try {
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN status user_status DEFAULT 'active' NOT NULL;
      `);
      console.log('✅ Colonne ajoutée\n');
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log('✅ Colonne existe déjà\n');
      } else {
        throw e;
      }
    }

    // Étape 3: Ajouter l'index
    console.log('3️⃣  Création de l\'index...');
    try {
      await db.execute(sql`
        CREATE INDEX idx_users_status ON users(status);
      `);
      console.log('✅ Index créé\n');
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log('✅ Index existe déjà\n');
      } else {
        throw e;
      }
    }

    console.log('✅ Correction réussie!\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixUsersTable();
