-- Migration: Ajouter la colonne status à la table users

-- Créer l'enum si nécessaire
DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'suspended', 'blocked', 'deleted');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Ajouter la colonne status
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'active' NOT NULL;

-- Ajouter l'index
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Vérifier
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
