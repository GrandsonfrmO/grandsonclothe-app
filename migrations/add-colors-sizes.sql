-- Migration: Ajouter les champs colors et sizes à la table products
-- Date: 2024

-- Ajouter les colonnes colors et sizes (stockées en JSON)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS colors TEXT,
ADD COLUMN IF NOT EXISTS sizes TEXT;

-- Commentaires
COMMENT ON COLUMN products.colors IS 'Liste des couleurs disponibles (JSON array)';
COMMENT ON COLUMN products.sizes IS 'Liste des tailles disponibles (JSON array)';
