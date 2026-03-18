const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function clearAmbassadors() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });
  
  try {
    console.log('🚀 Suppression de TOUS les ambassadeurs...');
    
    // On vide la table brand_ambassadors
    const result = await sql`DELETE FROM brand_ambassadors`;
    
    console.log('✅ Tous les ambassadeurs ont été supprimés avec succès.');
    console.log('✨ La table est maintenant vide et prête pour vos tests.');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression :', error);
  } finally {
    await sql.end();
  }
}

clearAmbassadors();
