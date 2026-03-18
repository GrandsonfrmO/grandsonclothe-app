// Script pour mettre à jour les images des produits avec des URLs publiques
import { db } from './lib/db';
import { products } from './lib/db/schema';
import { eq } from 'drizzle-orm';

// Images publiques Unsplash - produits variés
const publicImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // Casque audio
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', // Montre
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', // Lunettes de soleil
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', // Baskets
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop', // Sneakers
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // Chaussures rouges
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop', // Lunettes
  'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=400&h=400&fit=crop', // Baskets blanches
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', // Parfum
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=400&fit=crop', // Sac à main
];

async function updateImages() {
  try {
    console.log('🖼️  Mise à jour des images des produits\n');

    // Récupérer tous les produits
    const allProducts = await db.select().from(products);
    console.log(`📦 ${allProducts.length} produits trouvés\n`);

    if (allProducts.length === 0) {
      console.log('⚠️  Aucun produit trouvé dans la base de données');
      console.log('Créez d\'abord des produits avant de mettre à jour les images.');
      return;
    }

    // Mettre à jour chaque produit
    let updated = 0;
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      const imageUrl = publicImages[i % publicImages.length];
      
      await db.update(products)
        .set({ image: imageUrl })
        .where(eq(products.id, product.id));
      
      console.log(`✅ ${product.name}: ${imageUrl}`);
      updated++;
    }

    console.log(`\n✨ Mise à jour terminée! ${updated} produits mis à jour.`);
    console.log('Les produits ont maintenant des images publiques Unsplash.');
    console.log('\n📧 Vous pouvez maintenant tester les emails avec:');
    console.log('   node test-email-3-scenarios.js');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

updateImages();
