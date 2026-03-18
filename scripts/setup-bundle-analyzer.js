#!/usr/bin/env node

/**
 * Script pour installer et configurer @next/bundle-analyzer
 * Permet d'analyser la taille du bundle JavaScript
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Installation de @next/bundle-analyzer...\n');

try {
  // Installer le package
  console.log('📦 Installation du package...');
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });
  
  console.log('\n✅ Package installé avec succès!\n');
  
  // Lire le fichier next.config.js actuel
  const configPath = path.join(process.cwd(), 'next.config.js');
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Vérifier si le bundle analyzer est déjà configuré
  if (configContent.includes('@next/bundle-analyzer')) {
    console.log('ℹ️  Bundle analyzer déjà configuré dans next.config.js');
  } else {
    console.log('📝 Configuration de next.config.js...');
    
    // Ajouter la configuration du bundle analyzer
    const analyzerConfig = `const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

`;
    
    // Remplacer l'export
    configContent = analyzerConfig + configContent.replace(
      'module.exports = nextConfig',
      'module.exports = withBundleAnalyzer(nextConfig)'
    );
    
    // Écrire le fichier modifié
    fs.writeFileSync(configPath, configContent);
    
    console.log('✅ Configuration ajoutée à next.config.js\n');
  }
  
  // Ajouter les scripts npm
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['analyze']) {
    console.log('📝 Ajout des scripts npm...');
    packageJson.scripts['analyze'] = 'ANALYZE=true npm run build';
    packageJson.scripts['analyze:server'] = 'ANALYZE=true BUNDLE_ANALYZE=server npm run build';
    packageJson.scripts['analyze:browser'] = 'ANALYZE=true BUNDLE_ANALYZE=browser npm run build';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Scripts ajoutés à package.json\n');
  } else {
    console.log('ℹ️  Scripts déjà présents dans package.json\n');
  }
  
  console.log('🎉 Configuration terminée!\n');
  console.log('📊 Pour analyser le bundle, exécutez:');
  console.log('   npm run analyze\n');
  console.log('💡 Cela ouvrira automatiquement un rapport dans votre navigateur.\n');
  
} catch (error) {
  console.error('❌ Erreur lors de la configuration:', error.message);
  process.exit(1);
}
