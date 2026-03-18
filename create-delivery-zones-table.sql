-- Create delivery_zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_delivery_zones_name ON delivery_zones(name);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_active ON delivery_zones(is_active);

-- Insert sample data
INSERT INTO delivery_zones (name, description, price, is_active) VALUES
  ('Conakry Centre', 'Zone centrale de Conakry', 5000, true),
  ('Conakry Banlieue', 'Zones périphériques de Conakry', 8000, true),
  ('Kindia', 'Région de Kindia', 12000, true),
  ('Mamou', 'Région de Mamou', 15000, true),
  ('Labé', 'Région de Labé', 18000, true)
ON CONFLICT (name) DO NOTHING;
