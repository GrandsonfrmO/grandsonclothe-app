const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addRejectionReasonColumn() {
  const client = await pool.connect();
  try {
    console.log('Adding rejection_reason column to orders table...');
    
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'rejection_reason'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✓ Column rejection_reason already exists');
      return;
    }

    // Add the column
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN rejection_reason TEXT
    `);

    console.log('✓ Column rejection_reason added successfully');
  } catch (error) {
    console.error('Error adding column:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addRejectionReasonColumn()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
