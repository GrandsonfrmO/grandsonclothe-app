#!/usr/bin/env node

const { Pool } = require('pg');

async function checkLogoTable() {
  console.log('🔍 Vérification de la table logo_history...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL n\'est pas défini');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Vérifier si la table existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'logo_history'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ La table logo_history n\'existe pas');
      console.log('\n📝 Pour créer la table, exécutez:');
      console.log('   npm run migrate:logo');
      console.log('   ou');
      console.log('   ./apply-logo-migration.sh');
      process.exit(1);
    }

    console.log('✅ La table logo_history existe\n');

    // Vérifier les colonnes
    const columns = await pool.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'logo_history'
      ORDER BY ordinal_position;
    `);

    console.log('📋 Colonnes:');
    columns.rows.forEach(col => {
      const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
      console.log(`   - ${col.column_name}: ${col.data_type}${length}`);
    });

    // Vérifier les index
    const indexes = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'logo_history';
    `);

    console.log('\n🔑 Index:');
    indexes.rows.forEach(idx => {
      console.log(`   - ${idx.indexname}`);
    });

    // Compter les entrées
    const count = await pool.query('SELECT COUNT(*) FROM logo_history');
    console.log(`\n📊 Nombre d'entrées: ${count.rows[0].count}`);

    // Afficher les dernières entrées
    if (parseInt(count.rows[0].count) > 0) {
      const recent = await pool.query(`
        SELECT id, site_name, created_at
        FROM logo_history
        ORDER BY created_at DESC
        LIMIT 5;
      `);

      console.log('\n📜 Dernières entrées:');
      recent.rows.forEach(row => {
        const date = new Date(row.created_at).toLocaleString('fr-FR');
        console.log(`   - #${row.id}: ${row.site_name} (${date})`);
      });
    }

    console.log('\n✅ Vérification terminée avec succès!');
    console.log('🎉 Le système de logo est prêt à l\'emploi\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkLogoTable();
