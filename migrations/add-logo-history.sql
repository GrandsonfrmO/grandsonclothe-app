-- Migration: Add logo history table
-- Date: 2026-03-08

-- Create logo_history table
CREATE TABLE IF NOT EXISTS logo_history (
  id SERIAL PRIMARY KEY,
  logo_url VARCHAR(500) NOT NULL,
  site_name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  favicon_url VARCHAR(500),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_logo_history_created_at ON logo_history(created_at DESC);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_logo_history_user_id ON logo_history(user_id);

-- Add comment
COMMENT ON TABLE logo_history IS 'Stores historical versions of site logos for rollback and tracking';
