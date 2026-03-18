const Database = require('better-sqlite3');
const path = require('path');

// Connexion à la base de données
const dbPath = path.join(process.cwd(), 'ecommerce.db');
const db = new Database(dbPath);

// Couleurs variées pour les produits
const colorSets = [
  // Set 1 - Couleurs vives
  [
    { name: 'Rouge', hex: '#FF0000' },
    { name: 'Bleu', hex: '#0000FF' },
    { name: 'Noir', hex: '#000000' }
  ],
  // Set 2 - Couleurs pastel
  [
    { name: 'Rose', hex: '#FFC0CB' },
    { name: 'Bleu Ciel', hex: '#87CEEB' },
    { name: 'Menthe', hex: '#98FF98' }
  ],
  // Set 3 - Couleurs classiques
  [
    { name: 'Noir', hex: '#000000' },
    { name: 'Blanc', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#808080' }
  ],
  // Set 4 - Couleurs chaudes
  [
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Jaune', hex: '#FFD700' },
    { name: 'Rouge', hex: '#DC143C' }
  ],
  // Set 5 - Couleurs froides
  [
    { name: 'Bleu Marine', hex: '#000080' },
    { name: 'Turquoise', hex: '#40E0D0' },
    { name: 'Violet', hex: '#800080' }
  ],
  // Set 6 - Couleurs terre
  [
    { name: 'Marron', hex: '#8B4513' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Vert Olive', hex: '#808000' }
  ],
  // Set 7 - Couleurs tendance
  [
    { name: 'Corail', hex: '#FF7F50' },
    { name: 'Lavande', hex: '#E6E6FA' },
    { name: 'Bordeaux', hex: '#800020' }
  ]
];

try {
  // Récupérer tous les produits
  const products = db.prepare('SELECT id, name FROM products').all();
  
  console.log(`\n🎨 Mise à jour des couleurs pour ${products.length} produits...\n`);
  
  let updated = 0;
  
  products.forEach((product, index) => {
    // Choisir un set de couleurs de manière cyclique
    const colorSet = colorSets[index % colorSets.length];
    const colorsJson = JSON.stringify(colorSet);
    
    // Mettre à jour le produit
    db.prepare('UPDATE products SET colors = ? WHERE id = ?').run(colorsJson, product.id);
    
    console.log(`✅ Produit #${product.id} "${product.name}"`);
    console.log(`   Couleurs: ${colorSet.map(c => c.name).join(', ')}`);
    console.log(`   Codes: ${colorSet.map(c => c.hex).join(', ')}\n`);
    
    updated++;
  });
  
  console.log(`\n✨ ${updated} produits mis à jour avec succès!\n`);
  console.log('🔄 Redémarrez votre serveur pour voir les changements.\n');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
} finally {
  db.close();
}
