#!/usr/bin/env node

/**
 * Script pour tester les optimisations de performance
 * Vérifie que tous les composants et fonctions sont correctement configurés
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification des optimisations de performance...\n');

let errors = 0;
let warnings = 0;
let success = 0;

// Fonction utilitaire pour vérifier l'existence d'un fichier
function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}`);
    success++;
    return true;
  } else {
    console.log(`❌ ${description} - Fichier manquant: ${filePath}`);
    errors++;
    return false;
  }
}

// Fonction pour vérifier le contenu d'un fichier
function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  ${description} - Fichier non trouvé: ${filePath}`);
    warnings++;
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(searchString)) {
    console.log(`✅ ${description}`);
    success++;
    return true;
  } else {
    console.log(`⚠️  ${description} - Contenu non trouvé`);
    warnings++;
    return false;
  }
}

console.log('📦 Vérification des fichiers d\'optimisation...\n');

// Vérifier les fichiers créés
checkFile('lib/cache.ts', 'Cache serveur (lib/cache.ts)');
checkFile('components/lazy-components.tsx', 'Composants lazy (components/lazy-components.tsx)');
checkFile('components/optimized-image.tsx', 'Images optimisées (components/optimized-image.tsx)');
checkFile('scripts/setup-bundle-analyzer.js', 'Script bundle analyzer');

console.log('\n🔧 Vérification de la configuration Next.js...\n');

// Vérifier next.config.js
checkFileContent('next.config.js', 'compress: true', 'Compression activée');
checkFileContent('next.config.js', 'reactStrictMode: true', 'React Strict Mode activé');
checkFileContent('next.config.js', 'optimizePackageImports', 'Optimisation des imports');
checkFileContent('next.config.js', 'splitChunks', 'Code splitting configuré');

console.log('\n📊 Vérification du schéma de base de données...\n');

// Vérifier les index
checkFileContent('lib/db/schema.ts', 'idx_products_category', 'Index sur products.category');
checkFileContent('lib/db/schema.ts', 'idx_products_stock', 'Index sur products.stock');
checkFileContent('lib/db/schema.ts', 'idx_orders_status', 'Index sur orders.status');
checkFileContent('lib/db/schema.ts', 'idx_users_email', 'Index sur users.email');

console.log('\n🎨 Vérification du ThemeProvider...\n');

// Vérifier les optimisations du thème
checkFileContent('lib/theme-context.tsx', 'CACHE_TTL', 'Cache TTL configuré');
checkFileContent('lib/theme-context.tsx', 'localStorage', 'Cache localStorage');
checkFileContent('lib/theme-context.tsx', 'requestAnimationFrame', 'Optimisation CSS avec RAF');
checkFileContent('lib/theme-context.tsx', 'setTimeout', 'Debounce implémenté');

console.log('\n🚀 Vérification des API routes...\n');

// Vérifier le cache sur les routes API
checkFileContent('app/api/products/route.ts', 'revalidate', 'Revalidation configurée');
checkFileContent('app/api/products/route.ts', 'Cache-Control', 'Headers de cache');
checkFileContent('app/api/products/route.ts', 'getProductsPaginated', 'Pagination SQL');

console.log('\n📈 Résumé des vérifications...\n');
console.log(`✅ Succès: ${success}`);
console.log(`⚠️  Avertissements: ${warnings}`);
console.log(`❌ Erreurs: ${errors}`);

if (errors === 0 && warnings === 0) {
  console.log('\n🎉 Toutes les optimisations sont en place!\n');
  console.log('📊 Prochaines étapes:');
  console.log('   1. npm run build - Construire en mode production');
  console.log('   2. npm start - Tester en production locale');
  console.log('   3. npm run analyze - Analyser le bundle (après setup)');
  console.log('   4. Tester les temps de chargement avec Lighthouse\n');
  process.exit(0);
} else if (errors === 0) {
  console.log('\n✅ Optimisations principales en place (quelques avertissements)\n');
  process.exit(0);
} else {
  console.log('\n❌ Certaines optimisations sont manquantes\n');
  console.log('💡 Consultez GUIDE_OPTIMISATIONS.md pour les instructions\n');
  process.exit(1);
}
