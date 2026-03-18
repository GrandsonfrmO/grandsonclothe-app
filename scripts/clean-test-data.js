const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { eq, ne, sql } = require('drizzle-orm');
require('dotenv').config({ path: '.env.local' });

async function cleanTestData() {
  try {
    console.log('🧹 Nettoyage des données de test...\n');

    // Connexion à la base de données
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in .env.local');
    }
    
    const client = postgres(connectionString);
    const db = drizzle(client);

    // 1. Supprimer tous les items de wishlist
    console.log('📋 Suppression des wishlists...');
    await client`DELETE FROM wishlist`;
    console.log('✅ Wishlists supprimées');

    // 2. Supprimer tous les avis
    console.log('📋 Suppression des avis...');
    await client`DELETE FROM reviews`;
    console.log('✅ Avis supprimés');

    // 3. Supprimer tous les items de panier
    console.log('📋 Suppression des paniers...');
    await client`DELETE FROM cart`;
    console.log('✅ Paniers supprimés');

    // 4. Supprimer tous les items de commande
    console.log('📋 Suppression des items de commande...');
    await client`DELETE FROM order_items`;
    console.log('✅ Items de commande supprimés');

    // 5. Supprimer toutes les commandes
    console.log('📋 Suppression des commandes...');
    await client`DELETE FROM orders`;
    console.log('✅ Commandes supprimées');

    // 6. Supprimer tous les produits
    console.log('📋 Suppression des produits...');
    await client`DELETE FROM products`;
    console.log('✅ Produits supprimés');

    // 7. Supprimer tous les utilisateurs sauf les admins
    console.log('📋 Suppression des utilisateurs non-admin...');
    await client`DELETE FROM users WHERE role != 'admin'`;
    console.log('✅ Utilisateurs non-admin supprimés');

    console.log('\n🎉 Nettoyage terminé avec succès !');
    console.log('📊 Résumé:');
    console.log('   - Tous les produits de test supprimés');
    console.log('   - Toutes les commandes supprimées');
    console.log('   - Tous les paniers supprimés');
    console.log('   - Tous les avis supprimés');
    console.log('   - Toutes les wishlists supprimées');
    console.log('   - Utilisateurs non-admin supprimés');
    console.log('   - Comptes admin conservés');
    console.log('\n💡 Vous pouvez maintenant ajouter de vrais produits via l\'interface admin');
    console.log('🔗 Admin: http://localhost:3000/2tact');
    
    await client.end();
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

cleanTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
