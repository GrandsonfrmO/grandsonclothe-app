// Script pour mettre à jour les couleurs via l'API
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
    { name: 'Rouge Foncé', hex: '#DC143C' }
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

async function updateColors() {
  try {
    console.log('\n🎨 Récupération des produits...\n');
    
    // Récupérer tous les produits
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      throw new Error('Impossible de récupérer les produits');
    }
    
    const products = await response.json();
    console.log(`📦 ${products.length} produits trouvés\n`);
    
    let updated = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const colorSet = colorSets[i % colorSets.length];
      
      console.log(`🔄 Mise à jour: Produit #${product.id} "${product.name}"`);
      console.log(`   Couleurs: ${colorSet.map(c => c.name).join(', ')}`);
      
      // Mettre à jour via l'API
      const updateResponse = await fetch(`http://localhost:3000/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          colors: JSON.stringify(colorSet)
        })
      });
      
      if (updateResponse.ok) {
        console.log(`   ✅ Mis à jour avec succès\n`);
        updated++;
      } else {
        console.log(`   ❌ Échec de la mise à jour\n`);
      }
    }
    
    console.log(`\n✨ ${updated}/${products.length} produits mis à jour!\n`);
    console.log('🔄 Rafraîchissez votre navigateur pour voir les changements.\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n⚠️  Assurez-vous que le serveur Next.js est démarré (npm run dev)\n');
  }
}

updateColors();
