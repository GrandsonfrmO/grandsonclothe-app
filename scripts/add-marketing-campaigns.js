const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function addMarketingCampaignsTable() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('🚀 Ajout de la table marketing_campaigns...\n');

  try {
    // Créer les enums
    console.log('1️⃣ Création des enums...');
    await sql`
      DO $$ BEGIN
        CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE campaign_type AS ENUM ('newsletter', 'promotion', 'reactivation', 'announcement');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✅ Enums créés\n');

    // Créer la table
    console.log('2️⃣ Création de la table marketing_campaigns...');
    await sql`
      CREATE TABLE IF NOT EXISTS marketing_campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type campaign_type NOT NULL,
        status campaign_status DEFAULT 'draft' NOT NULL,
        target_segment VARCHAR(100),
        scheduled_at TIMESTAMP,
        sent_at TIMESTAMP,
        recipient_count INTEGER DEFAULT 0,
        opened_count INTEGER DEFAULT 0,
        clicked_count INTEGER DEFAULT 0,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Table créée\n');

    // Créer les index
    console.log('3️⃣ Création des index...');
    await sql`CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_campaigns_type ON marketing_campaigns(type);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_at ON marketing_campaigns(scheduled_at);`;
    console.log('✅ Index créés\n');

    // Vérifier
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'marketing_campaigns'
      ORDER BY ordinal_position;
    `;

    console.log('📋 Structure de la table:');
    console.table(result);

    console.log('\n✅ Migration terminée avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Redémarrez votre serveur de développement');
    console.log('   2. Accédez à /2tact/marketing pour créer des campagnes');
    console.log('   3. Configurez RESEND_API_KEY dans .env.local pour envoyer des emails');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

addMarketingCampaignsTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
