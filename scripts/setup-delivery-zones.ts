import { db } from '@/lib/db';
import { deliveryZones } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

async function setupDeliveryZones() {
  try {
    console.log('📦 Setting up delivery zones table...\n');

    // Create table using raw SQL
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS delivery_zones (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Table created successfully!');

    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_delivery_zones_name ON delivery_zones(name)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_delivery_zones_active ON delivery_zones(is_active)
    `);

    console.log('✅ Indexes created successfully!');

    // Insert sample data
    const sampleZones = [
      {
        name: 'Conakry Centre',
        description: 'Zone centrale de Conakry',
        price: 5000,
        isActive: true,
      },
      {
        name: 'Conakry Banlieue',
        description: 'Zones périphériques de Conakry',
        price: 8000,
        isActive: true,
      },
      {
        name: 'Kindia',
        description: 'Région de Kindia',
        price: 12000,
        isActive: true,
      },
      {
        name: 'Mamou',
        description: 'Région de Mamou',
        price: 15000,
        isActive: true,
      },
      {
        name: 'Labé',
        description: 'Région de Labé',
        price: 18000,
        isActive: true,
      },
    ];

    // Insert zones
    for (const zone of sampleZones) {
      try {
        await db.insert(deliveryZones).values(zone);
        console.log(`✅ Zone created: ${zone.name}`);
      } catch (error: any) {
        if (error.message.includes('duplicate')) {
          console.log(`⚠️  Zone already exists: ${zone.name}`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Setup complete!');
    console.log('\n📋 Sample zones:');
    console.log('  - Conakry Centre: 5,000 GNF');
    console.log('  - Conakry Banlieue: 8,000 GNF');
    console.log('  - Kindia: 12,000 GNF');
    console.log('  - Mamou: 15,000 GNF');
    console.log('  - Labé: 18,000 GNF');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupDeliveryZones();
