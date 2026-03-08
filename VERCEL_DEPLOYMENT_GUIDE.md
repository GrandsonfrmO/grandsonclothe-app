# 🚀 GUIDE DE DÉPLOIEMENT VERCEL - GRANDSON CLOTHES

**Date:** 2026-03-08 | **Statut:** 🟢 PRÊT À DÉPLOYER

---

## ⚠️ ÉTAPE PRÉALABLE: CORRIGER LES DÉPENDANCES

Avant de déployer, installez les dépendances manquantes:

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

Puis vérifiez que tout build:

```bash
npm run build
npm run lint
```

---

## 🎯 DÉPLOIEMENT VERCEL - ÉTAPES COMPLÈTES

### **ÉTAPE 1: Préparer le Code (5 min)**

```bash
# 1. Vérifier le statut Git
git status

# 2. Ajouter les fichiers
git add .

# 3. Commiter les changements
git commit -m "Fix: Add missing jsonwebtoken dependency"

# 4. Pousser vers GitHub
git push origin main
```

✅ **Vérifier:** Tous les fichiers sont poussés sur GitHub

---

### **ÉTAPE 2: Accéder à Vercel (2 min)**

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New..."** en haut à gauche
4. Sélectionnez **"Project"**

---

### **ÉTAPE 3: Importer le Projet (3 min)**

1. Cliquez sur **"Continue with GitHub"**
2. Cherchez **"grandsonclothe-app"**
3. Cliquez sur **"Import"**

---

### **ÉTAPE 4: Configurer le Projet (2 min)**

Dans la page "Configure Project":

- **Project Name:** `grandsonclothe-app` (ou votre nom)
- **Framework Preset:** `Next.js`
- **Root Directory:** `.` (vide)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

Cliquez sur **"Continue"**

---

### **ÉTAPE 5: Ajouter les Variables d'Environnement (5 min)**

Cliquez sur **"Environment Variables"** et ajoutez:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://[user]:[password]@[host]:[port]/[database]
```

**Où trouver:**
- Allez sur [neon.tech](https://neon.tech)
- Connectez-vous
- Sélectionnez votre projet
- Cliquez sur "Connection string"
- Copiez l'URL PostgreSQL

#### Variable 2: NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### Variable 3: RESEND_API_KEY
```
Name: RESEND_API_KEY
Value: re_[votre-clé]
```

**Où trouver:**
- Allez sur [resend.com](https://resend.com)
- Connectez-vous
- Allez dans "API Keys"
- Copiez votre clé

#### Variable 4: RESEND_FROM_EMAIL
```
Name: RESEND_FROM_EMAIL
Value: noreply@yourdomain.com
```

#### Variable 5: NEXT_PUBLIC_API_URL (optionnel)
```
Name: NEXT_PUBLIC_API_URL
Value: https://[votre-projet].vercel.app
```

**Note:** Vous pouvez ajouter cette variable après le déploiement

---

### **ÉTAPE 6: Déployer (2 min)**

1. Vérifiez que toutes les variables sont configurées
2. Cliquez sur **"Deploy"** en bas à droite
3. Attendez que le déploiement soit terminé (vert)

**Durée:** 2-5 minutes

---

### **ÉTAPE 7: Vérifier le Déploiement (2 min)**

Une fois déployé:

1. Cliquez sur **"Visit"**
2. Votre site s'ouvre dans un nouvel onglet
3. Vérifiez que la page se charge
4. Copiez l'URL (ex: `https://grandsonclothe-app.vercel.app`)

✅ **Vérifier:** Site accessible

---

## 🧪 TESTS POST-DÉPLOIEMENT (10 min)

### Tests Basiques

```
URL: https://[votre-projet].vercel.app
```

- [ ] Site accessible
- [ ] Pas d'erreurs 500
- [ ] Produits s'affichent
- [ ] Page d'accueil charge

### Tests Fonctionnels

1. **Inscription**
   - [ ] Aller à `/auth/signup`
   - [ ] Créer un compte
   - [ ] Email reçu

2. **Login**
   - [ ] Aller à `/auth/login`
   - [ ] Se connecter
   - [ ] Menu utilisateur affiche email

3. **Panier**
   - [ ] Ajouter un produit
   - [ ] Aller à `/cart`
   - [ ] Produit dans le panier

4. **Checkout**
   - [ ] Aller à `/checkout`
   - [ ] Remplir le formulaire
   - [ ] Confirmer la commande
   - [ ] Email reçu

---

## 🔧 DÉPANNAGE

### Erreur: "Build failed"

```bash
# Vérifier les erreurs
npm run build

# Vérifier les erreurs de linting
npm run lint

# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

**Solutions:**
1. Vérifiez les logs Vercel
2. Vérifiez que toutes les dépendances sont installées
3. Vérifiez que les variables d'environnement sont correctes

### Erreur: "DATABASE_URL not found"

**Solutions:**
1. Vérifiez que DATABASE_URL est configuré dans Vercel
2. Vérifiez que la valeur est correcte
3. Redéployez après avoir ajouté la variable

### Erreur: "Database connection failed"

**Solutions:**
1. Vérifiez que DATABASE_URL est correct
2. Vérifiez que la base de données est accessible
3. Vérifiez les logs Neon
4. Vérifiez que les migrations sont appliquées

### Erreur: "Emails not received"

**Solutions:**
1. Vérifiez que RESEND_API_KEY est configuré
2. Vérifiez que la valeur est correcte
3. Vérifiez les logs Resend
4. Vérifiez le dossier spam

---

## 📊 CHECKLIST DÉPLOIEMENT

### Avant le Déploiement
- [ ] `npm install jsonwebtoken` ✅
- [ ] `npm run build` ✅
- [ ] `npm run lint` ✅
- [ ] Code poussé sur GitHub ✅
- [ ] Compte Vercel créé ✅

### Pendant le Déploiement
- [ ] Projet importé ✅
- [ ] Variables configurées ✅
- [ ] DATABASE_URL défini ✅
- [ ] RESEND_API_KEY défini ✅
- [ ] Déploiement lancé ✅

### Après le Déploiement
- [ ] Site accessible ✅
- [ ] Pas d'erreurs 500 ✅
- [ ] Inscription fonctionne ✅
- [ ] Login fonctionne ✅
- [ ] Panier fonctionne ✅
- [ ] Checkout fonctionne ✅
- [ ] Emails reçus ✅

---

## 📞 RESSOURCES

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Neon Docs](https://neon.tech/docs)
- [Resend Docs](https://resend.com/docs)

### Votre Repository
- [GitHub](https://github.com/GrandsonfrmO/grandsonclothe-app)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## 🎯 RÉSUMÉ

**Durée totale:** ~20 minutes

| Étape | Durée | Statut |
|-------|-------|--------|
| 1. Préparer le code | 5 min | ⏳ |
| 2. Accéder à Vercel | 2 min | ⏳ |
| 3. Importer le projet | 3 min | ⏳ |
| 4. Configurer le projet | 2 min | ⏳ |
| 5. Ajouter les variables | 5 min | ⏳ |
| 6. Déployer | 2 min | ⏳ |
| 7. Vérifier | 2 min | ⏳ |
| **Total** | **~20 min** | ⏳ |

---

## ✅ APRÈS LE DÉPLOIEMENT

Une fois déployé avec succès:

1. **Configurez un domaine personnalisé** (optionnel)
   - Allez dans Settings → Domains
   - Ajoutez votre domaine
   - Configurez les DNS

2. **Configurez le monitoring** (optionnel)
   - Allez dans Analytics
   - Vérifiez les performances
   - Configurez les alertes

3. **Configurez les déploiements automatiques**
   - Par défaut, Vercel déploie à chaque push sur `main`
   - Vérifiez dans Settings → Git

---

**Bonne chance avec votre déploiement!** 🚀

Votre application **GRANDSON CLOTHES** sera bientôt en production! 🎉
