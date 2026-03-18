require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL);

async function createTable() {
  try {
    console.log('Creating delivery_zones table...');
    
    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS delivery_zones (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Table created');

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_delivery_zones_name ON delivery_zones(name);
    `;
    console.log('✅ Index on name created');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_delivery_zones_active ON delivery_zones(is_active);
    `;
    console.log('✅ Index on is_active created');

    // Insert sample data
    await sql`
      INSERT INTO delivery_zones (name, description, price, is_active) VALUES
        ('Conakry Centre', 'Zone centrale de Conakry', 5000, true),
        ('Conakry Banlieue', 'Zones périphériques de Conakry', 8000, true),
        ('Kindia', 'Région de Kindia', 12000, true),
        ('Mamou', 'Région de Mamou', 15000, true),
        ('Labé', 'Région de Labé', 18000, true)
      ON CONFLICT (name) DO NOTHING;
    `;
    console.log('✅ Sample data inserted');

    // Verify
    const result = await sql`SELECT COUNT(*) as count FROM delivery_zones;`;
    console.log(`✅ Total zones in database: ${result[0].count}`);

    console.log('\n✅ Delivery zones table setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTable();
