#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT VERCEL - GRANDSON CLOTHES

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║  🚀 DÉPLOIEMENT VERCEL - GRANDSON CLOTHES                 ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ÉTAPE 1: Installer les dépendances
echo "📦 ÉTAPE 1: Installer les dépendances..."
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"
echo ""

# ÉTAPE 2: Vérifier le build
echo "🔨 ÉTAPE 2: Vérifier le build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussie"
echo ""

# ÉTAPE 3: Vérifier le linting
echo "🔍 ÉTAPE 3: Vérifier le linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Avertissements de linting (non bloquant)"
fi

echo "✅ Linting vérifié"
echo ""

# ÉTAPE 4: Pousser le code
echo "📤 ÉTAPE 4: Pousser le code sur GitHub..."
git add .
git commit -m "Deploy: Ready for Vercel deployment"
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du push Git"
    exit 1
fi

echo "✅ Code poussé sur GitHub"
echo ""

# ÉTAPE 5: Instructions finales
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║  ✅ PRÊT POUR VERCEL!                                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo ""
echo "1. Allez sur https://vercel.com"
echo "2. Cliquez 'Add New' → 'Project'"
echo "3. Sélectionnez 'grandsonclothe-app'"
echo "4. Cliquez 'Import'"
echo ""
echo "5. Ajoutez les variables d'environnement:"
echo "   - DATABASE_URL (de Neon)"
echo "   - RESEND_API_KEY (de Resend)"
echo "   - NODE_ENV = production"
echo "   - RESEND_FROM_EMAIL"
echo ""
echo "6. Cliquez 'Deploy'"
echo ""
echo "⏱️  Durée: ~15 minutes"
echo ""
echo "🚀 Votre application sera en ligne!"
echo ""
