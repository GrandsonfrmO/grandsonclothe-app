# 🚀 SCRIPT DE DÉPLOIEMENT VERCEL - GRANDSON CLOTHES (PowerShell)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  🚀 DÉPLOIEMENT VERCEL - GRANDSON CLOTHES                 ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# ÉTAPE 1: Installer les dépendances
Write-Host "📦 ÉTAPE 1: Installer les dépendances..." -ForegroundColor Cyan
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dépendances installées" -ForegroundColor Green
Write-Host ""

# ÉTAPE 2: Vérifier le build
Write-Host "🔨 ÉTAPE 2: Vérifier le build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build réussie" -ForegroundColor Green
Write-Host ""

# ÉTAPE 3: Vérifier le linting
Write-Host "🔍 ÉTAPE 3: Vérifier le linting..." -ForegroundColor Cyan
npm run lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Avertissements de linting (non bloquant)" -ForegroundColor Yellow
}

Write-Host "✅ Linting vérifié" -ForegroundColor Green
Write-Host ""

# ÉTAPE 4: Pousser le code
Write-Host "📤 ÉTAPE 4: Pousser le code sur GitHub..." -ForegroundColor Cyan
git add .
git commit -m "Deploy: Ready for Vercel deployment"
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du push Git" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Code poussé sur GitHub" -ForegroundColor Green
Write-Host ""

# ÉTAPE 5: Instructions finales
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  ✅ PRÊT POUR VERCEL!                                     ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Allez sur https://vercel.com" -ForegroundColor White
Write-Host "2. Cliquez 'Add New' → 'Project'" -ForegroundColor White
Write-Host "3. Sélectionnez 'grandsonclothe-app'" -ForegroundColor White
Write-Host "4. Cliquez 'Import'" -ForegroundColor White
Write-Host ""
Write-Host "5. Ajoutez les variables d'environnement:" -ForegroundColor White
Write-Host "   - DATABASE_URL (de Neon)" -ForegroundColor White
Write-Host "   - RESEND_API_KEY (de Resend)" -ForegroundColor White
Write-Host "   - NODE_ENV = production" -ForegroundColor White
Write-Host "   - RESEND_FROM_EMAIL" -ForegroundColor White
Write-Host ""
Write-Host "6. Cliquez 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Durée: ~15 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Votre application sera en ligne!" -ForegroundColor Green
Write-Host ""
