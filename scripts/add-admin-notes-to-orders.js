const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addAdminNotesColumn() {
  const client = await pool.connect();
  try {
    console.log('Adding admin_notes column to orders table...');
    
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'admin_notes'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✓ Column admin_notes already exists');
      return;
    }

    // Add the column
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN admin_notes TEXT
    `);

    console.log('✓ Column admin_notes added successfully');
  } catch (error) {
    console.error('Error adding column:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addAdminNotesColumn()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
