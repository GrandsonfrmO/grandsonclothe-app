# ✅ CHECKLIST DE DÉPLOIEMENT VERCEL

**Projet:** grandsonclothe-app
**Date:** 2026-03-08
**Statut:** 🟢 PRÊT À DÉPLOYER

---

## 📋 AVANT DE COMMENCER

### Vérifications Préalables

- [ ] Vous avez un compte GitHub
- [ ] Vous avez un compte Vercel
- [ ] Vous avez une base de données Neon
- [ ] Vous avez un compte Resend
- [ ] Vous avez les clés API nécessaires

---

## 🔧 ÉTAPE 1: INSTALLER LES DÉPENDANCES MANQUANTES

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

**Vérifier:**
```bash
npm run build
npm run lint
```

✅ **Checklist:**
- [ ] Installation réussie
- [ ] Build réussie
- [ ] Pas d'erreurs de linting

---

## 📤 ÉTAPE 2: POUSSER LE CODE SUR GITHUB

```bash
# Vérifier le statut
git status

# Ajouter les fichiers
git add .

# Commiter
git commit -m "Fix: Add missing jsonwebtoken dependency"

# Pousser
git push origin main
```

✅ **Checklist:**
- [ ] Code poussé sur GitHub
- [ ] Pas d'erreurs Git
- [ ] Tous les fichiers sont présents

---

## 🌐 ÉTAPE 3: PRÉPARER LES VARIABLES D'ENVIRONNEMENT

### Récupérer les Valeurs

#### DATABASE_URL (Neon)
1. Allez sur [neon.tech](https://neon.tech)
2. Connectez-vous
3. Sélectionnez votre projet
4. Cliquez sur "Connection string"
5. Copiez l'URL PostgreSQL

**Format:** `postgresql://[user]:[password]@[host]:[port]/[database]`

✅ **Checklist:**
- [ ] DATABASE_URL copié
- [ ] URL commence par `postgresql://`

#### RESEND_API_KEY (Resend)
1. Allez sur [resend.com](https://resend.com)
2. Connectez-vous
3. Allez dans "API Keys"
4. Copiez votre clé

**Format:** `re_[votre-clé]`

✅ **Checklist:**
- [ ] RESEND_API_KEY copié
- [ ] Clé commence par `re_`

#### RESEND_FROM_EMAIL
Utilisez votre email de domaine ou un email de test

**Format:** `noreply@yourdomain.com`

✅ **Checklist:**
- [ ] Email défini
- [ ] Email valide

---

## 🚀 ÉTAPE 4: DÉPLOYER SUR VERCEL

### Étape 4.1: Accéder à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New..."**
4. Sélectionnez **"Project"**

✅ **Checklist:**
- [ ] Connecté à Vercel
- [ ] Page "Add New Project" ouverte

### Étape 4.2: Importer le Projet

1. Cliquez sur **"Continue with GitHub"**
2. Cherchez **"grandsonclothe-app"**
3. Cliquez sur **"Import"**

✅ **Checklist:**
- [ ] Projet trouvé
- [ ] Projet importé

### Étape 4.3: Configurer le Projet

Vérifiez les paramètres:

- **Project Name:** `grandsonclothe-app`
- **Framework Preset:** `Next.js`
- **Root Directory:** `.` (vide)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

Cliquez sur **"Continue"**

✅ **Checklist:**
- [ ] Paramètres vérifiés
- [ ] Prêt à ajouter les variables

### Étape 4.4: Ajouter les Variables d'Environnement

Cliquez sur **"Environment Variables"** et ajoutez:

```
DATABASE_URL = [votre-url-neon]
NODE_ENV = production
RESEND_API_KEY = [votre-clé-resend]
RESEND_FROM_EMAIL = [votre-email]
NEXT_PUBLIC_API_URL = https://[votre-projet].vercel.app
```

✅ **Checklist:**
- [ ] DATABASE_URL ajouté
- [ ] NODE_ENV = production
- [ ] RESEND_API_KEY ajouté
- [ ] RESEND_FROM_EMAIL ajouté
- [ ] NEXT_PUBLIC_API_URL ajouté (optionnel)

### Étape 4.5: Déployer

1. Vérifiez que toutes les variables sont configurées
2. Cliquez sur **"Deploy"**
3. Attendez 2-5 minutes

✅ **Checklist:**
- [ ] Déploiement lancé
- [ ] Pas d'erreurs
- [ ] Déploiement terminé (vert)

### Étape 4.6: Vérifier le Déploiement

1. Cliquez sur **"Visit"**
2. Votre site s'ouvre
3. Copiez l'URL

✅ **Checklist:**
- [ ] Site accessible
- [ ] URL copiée
- [ ] Page se charge

---

## 🧪 ÉTAPE 5: TESTER EN PRODUCTION

### Tests Basiques (5 min)

```
URL: https://[votre-projet].vercel.app
```

- [ ] Site accessible
- [ ] Pas d'erreurs 500
- [ ] Produits s'affichent
- [ ] Page d'accueil charge

### Tests Fonctionnels (10 min)

**Inscription:**
- [ ] Aller à `/auth/signup`
- [ ] Créer un compte
- [ ] Email reçu

**Login:**
- [ ] Aller à `/auth/login`
- [ ] Se connecter
- [ ] Menu utilisateur affiche email

**Panier:**
- [ ] Ajouter un produit
- [ ] Aller à `/cart`
- [ ] Produit dans le panier

**Checkout:**
- [ ] Aller à `/checkout`
- [ ] Remplir le formulaire
- [ ] Confirmer la commande
- [ ] Email reçu

---

## 📊 RÉSUMÉ

### Durée Totale
- Préparation: 5 min
- Déploiement: 20 min
- Tests: 15 min
- **Total: ~40 min**

### Statut
```
✅ Code prêt
✅ Dépendances installées
✅ Code poussé sur GitHub
✅ Variables préparées
✅ Prêt à déployer
```

---

## 🎯 PROCHAINES ÉTAPES

### Immédiatement Après le Déploiement

1. **Vérifier le site**
   - Accédez à l'URL
   - Testez les fonctionnalités

2. **Configurer le monitoring** (optionnel)
   - Allez dans Analytics
   - Vérifiez les performances

3. **Configurer un domaine personnalisé** (optionnel)
   - Allez dans Settings → Domains
   - Ajoutez votre domaine

### À Long Terme

1. **Monitoring continu**
   - Vérifier les logs
   - Vérifier les performances
   - Configurer les alertes

2. **Maintenance**
   - Mettre à jour les dépendances
   - Appliquer les patches de sécurité
   - Optimiser les performances

3. **Améliorations**
   - Ajouter de nouvelles fonctionnalités
   - Améliorer l'UX
   - Optimiser le SEO

---

## 🆘 DÉPANNAGE RAPIDE

### Build échoue
```bash
npm run build
npm run lint
npx tsc --noEmit
```

### Erreurs 500
- Vérifier les logs Vercel
- Vérifier DATABASE_URL
- Vérifier les variables d'environnement

### Emails non reçus
- Vérifier RESEND_API_KEY
- Vérifier les logs Resend
- Vérifier le dossier spam

### Base de données non connectée
- Vérifier DATABASE_URL
- Vérifier que la base de données est accessible
- Vérifier les logs Neon

---

## 📞 RESSOURCES

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Neon Docs](https://neon.tech/docs)
- [Resend Docs](https://resend.com/docs)

---

**Prêt à déployer?** 🚀

Suivez cette checklist étape par étape et votre application sera en production! 🎉
