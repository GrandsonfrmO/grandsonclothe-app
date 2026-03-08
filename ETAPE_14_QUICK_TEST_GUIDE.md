# ⚡ ÉTAPE 14: QUICK TEST GUIDE

**Durée:** 1h14 | **Format:** Checklist rapide

---

## 🚀 START HERE

### 1️⃣ Avant de Commencer (5 min)

```bash
# Build le projet
npm run build

# Vérifier pas d'erreurs
npm run lint

# Démarrer le serveur
npm run dev
```

✅ **Vérifier:** Pas d'erreurs, serveur sur `http://localhost:3000`

---

## 🧪 14.1 TESTS FLUX COMPLET (25 min)

### Scénario 1: Nouvel Utilisateur

| Étape | Action | Vérifier |
|-------|--------|----------|
| 1 | Aller à `/auth/signup` | Page charge |
| 2 | Email: `test-[timestamp]@example.com` | Champ accepte email |
| 3 | Mot de passe: `TestPassword123!` | Champ accepte mot de passe |
| 4 | Cliquer "S'inscrire" | Redirection vers `/` |
| 5 | Vérifier menu utilisateur | Email s'affiche |
| 6 | Vérifier email reçu | Email de confirmation |

### Scénario 2: Ajouter au Panier

| Étape | Action | Vérifier |
|-------|--------|----------|
| 1 | Cliquer sur un produit | Détails s'affichent |
| 2 | Cliquer "Ajouter au panier" | Badge panier +1 |
| 3 | Aller à `/cart` | Produit dans panier |
| 4 | Modifier quantité | Total se met à jour |
| 5 | Rafraîchir page | Panier persistant |

### Scénario 3: Checkout

| Étape | Action | Vérifier |
|-------|--------|----------|
| 1 | Cliquer "Procéder au paiement" | Formulaire s'affiche |
| 2 | Remplir adresse de livraison | Tous les champs |
| 3 | Sélectionner paiement | "À la livraison" |
| 4 | Cliquer "Confirmer" | Redirection confirmation |
| 5 | Vérifier numéro commande | S'affiche |
| 6 | Vérifier email reçu | Email de confirmation |
| 7 | Aller à `/profile` | Commande dans historique |

### Scénario 4: Fonctionnalités Bonus

| Fonctionnalité | Action | Vérifier |
|---|---|---|
| **Wishlist** | Cliquer cœur | Badge +1 |
| | Aller à `/wishlist` | Produit dans liste |
| | Ajouter au panier | Produit dans panier |
| **Avis** | Cliquer "Laisser un avis" | Formulaire s'affiche |
| | Noter 5 étoiles + commentaire | Avis apparaît |
| **Recherche** | Aller à `/search` | Résultats s'affichent |
| | Appliquer filtres | Filtres fonctionnent |

---

## 📱 14.2 TESTS MOBILE (25 min)

### Ouvrir DevTools
- Appuyez sur `F12` ou `Ctrl+Shift+I`
- Cliquez sur "Toggle device toolbar" (`Ctrl+Shift+M`)

### Tester Chaque Breakpoint

#### Mobile 375px (iPhone SE)
```
✅ Header responsive
✅ Navigation mobile
✅ Grille: 1 colonne
✅ Boutons cliquables
✅ Pas de débordement
```

#### Mobile 414px (iPhone 12)
```
✅ Même que 375px
✅ Grille: 1-2 colonnes
✅ Espacement OK
```

#### Tablet 768px (iPad)
```
✅ Grille: 2 colonnes
✅ Navigation desktop
✅ Formulaires espacés
```

#### Desktop 1024px+
```
✅ Grille: 3-4 colonnes
✅ Navigation complète
✅ Espacement optimal
```

### Tester Chaque Page

| Page | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| `/` | ✅ | ✅ | ✅ |
| `/auth/signup` | ✅ | ✅ | ✅ |
| `/auth/login` | ✅ | ✅ | ✅ |
| `/cart` | ✅ | ✅ | ✅ |
| `/checkout` | ✅ | ✅ | ✅ |
| `/profile` | ✅ | ✅ | ✅ |
| `/wishlist` | ✅ | ✅ | ✅ |
| `/search` | ✅ | ✅ | ✅ |

---

## 🚀 14.3 DÉPLOYER SUR VERCEL (15 min)

### Étape 1: Préparer le Code

```bash
# Vérifier le statut
git status

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "ÉTAPE 14: Tests et déploiement"

# Pousser vers GitHub
git push origin main
```

✅ **Vérifier:** Tous les fichiers sont poussés

### Étape 2: Créer un Projet Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer "Add New..." → "Project"
3. Sélectionner votre repo GitHub
4. Cliquer "Import"

### Étape 3: Configurer les Variables

Dans "Environment Variables", ajouter:

```
DATABASE_URL = postgresql://...
NODE_ENV = production
```

### Étape 4: Déployer

1. Cliquer "Deploy"
2. Attendre que le déploiement soit terminé (vert)
3. Copier l'URL de déploiement

✅ **Vérifier:** Déploiement réussi, URL accessible

---

## 🌐 14.4 TESTER EN PRODUCTION (9 min)

### Tests Basiques

| Test | Action | Vérifier |
|------|--------|----------|
| **Site** | Ouvrir URL Vercel | Page charge |
| **Produits** | Voir page d'accueil | Produits s'affichent |
| **Inscription** | Créer compte | Email reçu |
| **Login** | Se connecter | Menu utilisateur |
| **Panier** | Ajouter produit | Produit dans panier |
| **Checkout** | Confirmer commande | Email reçu |

### Tests Avancés

| Test | Action | Vérifier |
|------|--------|----------|
| **Wishlist** | Ajouter aux favoris | Produit dans wishlist |
| **Avis** | Laisser un avis | Avis apparaît |
| **Recherche** | Rechercher produit | Résultats s'affichent |

### Vérifications Critiques

```
✅ Pas d'erreurs 500
✅ Pas d'erreurs console
✅ Tous les emails reçus
✅ Données persistantes
✅ Redirections OK
✅ Cookies définis
```

---

## 📊 CHECKLIST FINALE

### Avant Déploiement
- [ ] `npm run build` ✅
- [ ] `npm run lint` ✅
- [ ] `.env.local` configuré ✅
- [ ] Base de données connectée ✅
- [ ] `npm run db:push` ✅

### Tests Locaux
- [ ] Inscription ✅
- [ ] Login ✅
- [ ] Panier ✅
- [ ] Checkout ✅
- [ ] Emails ✅
- [ ] Wishlist ✅
- [ ] Avis ✅
- [ ] Recherche ✅

### Tests Mobile
- [ ] 375px ✅
- [ ] 414px ✅
- [ ] 768px ✅
- [ ] 1024px+ ✅

### Déploiement
- [ ] Code poussé ✅
- [ ] Vercel connecté ✅
- [ ] Variables configurées ✅
- [ ] Déploiement réussi ✅

### Tests Production
- [ ] Site accessible ✅
- [ ] Inscription ✅
- [ ] Login ✅
- [ ] Panier ✅
- [ ] Checkout ✅
- [ ] Emails ✅

---

## 🎯 RÉSUMÉ

| Tâche | Durée | Status |
|-------|-------|--------|
| 14.1 - Tests flux | 25 min | ⏳ |
| 14.2 - Tests mobile | 25 min | ⏳ |
| 14.3 - Déploiement | 15 min | ⏳ |
| 14.4 - Tests prod | 9 min | ⏳ |
| **Total** | **1h14** | ⏳ |

---

## 🆘 PROBLÈMES COURANTS

### Build échoue
```bash
npm run build
npm run lint
npx tsc --noEmit
```

### Emails non reçus
- Vérifier Resend API key
- Vérifier les logs Resend

### Base de données non connectée
- Vérifier DATABASE_URL
- Vérifier les logs Neon

### Erreurs 500 en production
- Vérifier les logs Vercel
- Vérifier les variables d'environnement

---

**Commencez par 14.1!** 🚀
