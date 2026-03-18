#!/usr/bin/env node

/**
 * Migration script for logo_history table
 * Run with: node scripts/migrate-logo-history.js
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting logo_history migration...\n');

    // Create logo_history table
    console.log('📝 Creating logo_history table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS logo_history (
        id SERIAL PRIMARY KEY,
        logo_url VARCHAR(500) NOT NULL,
        site_name VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        favicon_url VARCHAR(500),
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table created\n');

    // Create indexes
    console.log('📝 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_logo_history_created_at 
      ON logo_history(created_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_logo_history_user_id 
      ON logo_history(user_id);
    `);
    console.log('✅ Indexes created\n');

    // Add comment
    await client.query(`
      COMMENT ON TABLE logo_history IS 
      'Stores historical versions of site logos for rollback and tracking';
    `);

    // Verify table
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'logo_history'
      ORDER BY ordinal_position;
    `);

    console.log('📊 Table structure:');
    console.table(result.rows);

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Go to Admin → Settings → Logo');
    console.log('3. Upload a logo to test the system');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
