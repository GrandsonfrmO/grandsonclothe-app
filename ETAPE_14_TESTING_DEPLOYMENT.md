# 🚀 ÉTAPE 14: TESTS & DÉPLOIEMENT

**Durée:** 1h14 | **Statut:** 🟢 PRÊT À COMMENCER

---

## 📋 Vue d'Ensemble

Cette étape couvre:
1. **14.1** - Tests du flux complet (Inscription → Panier → Paiement)
2. **14.2** - Tests sur mobile (tous les écrans)
3. **14.3** - Déploiement sur Vercel
4. **14.4** - Tests en production

---

## 14.1 🧪 TESTER FLUX COMPLET

### Durée: 25 min

#### A. Préparation

```bash
# 1. Vérifier que le projet build sans erreurs
npm run build

# 2. Vérifier qu'il n'y a pas d'erreurs de linting
npm run lint

# 3. Démarrer le serveur de développement
npm run dev
```

#### B. Test Inscription → Panier → Paiement

**Scénario 1: Nouvel utilisateur complet**

1. **Inscription**
   - [ ] Accédez à `http://localhost:3000/auth/signup`
   - [ ] Remplissez le formulaire:
     - Email: `test-[timestamp]@example.com` (ex: `test-1234567890@example.com`)
     - Mot de passe: `TestPassword123!`
     - Confirmez le mot de passe
   - [ ] Cliquez sur "S'inscrire"
   - [ ] Vérifiez que vous êtes redirigé vers la page d'accueil
   - [ ] Vérifiez que le menu utilisateur affiche votre email
   - [ ] Vérifiez que vous avez reçu un email de confirmation

2. **Navigation et Produits**
   - [ ] Accédez à la page d'accueil
   - [ ] Vérifiez que les produits s'affichent
   - [ ] Cliquez sur un produit pour voir les détails
   - [ ] Vérifiez les images, prix, description

3. **Ajouter au Panier**
   - [ ] Cliquez sur "Ajouter au panier"
   - [ ] Vérifiez que le badge du panier s'incrémente
   - [ ] Accédez au panier (`/cart`)
   - [ ] Vérifiez que le produit est dans le panier
   - [ ] Modifiez la quantité
   - [ ] Vérifiez que le total se met à jour

4. **Checkout**
   - [ ] Cliquez sur "Procéder au paiement"
   - [ ] Remplissez les informations de livraison:
     - Nom complet
     - Adresse
     - Ville
     - Code postal
     - Téléphone
   - [ ] Sélectionnez le mode de paiement (à la livraison)
   - [ ] Cliquez sur "Confirmer la commande"

5. **Confirmation**
   - [ ] Vérifiez que vous êtes redirigé vers la page de confirmation
   - [ ] Vérifiez que le numéro de commande s'affiche
   - [ ] Vérifiez que vous avez reçu un email de confirmation
   - [ ] Accédez à votre profil (`/profile`)
   - [ ] Vérifiez que la commande apparaît dans l'historique

**Scénario 2: Utilisateur existant**

1. **Login**
   - [ ] Accédez à `http://localhost:3000/auth/login`
   - [ ] Entrez l'email et le mot de passe du test précédent
   - [ ] Cliquez sur "Se connecter"
   - [ ] Vérifiez que vous êtes redirigé vers la page d'accueil
   - [ ] Vérifiez que le menu utilisateur affiche votre email

2. **Panier Persistant**
   - [ ] Accédez au panier
   - [ ] Vérifiez que les produits précédents sont toujours là
   - [ ] Ajoutez un nouveau produit
   - [ ] Rafraîchissez la page
   - [ ] Vérifiez que le panier est persistant

3. **Nouvelle Commande**
   - [ ] Procédez au checkout
   - [ ] Vérifiez que les informations de livraison précédentes sont pré-remplies
   - [ ] Confirmez la commande
   - [ ] Vérifiez la confirmation

**Scénario 3: Fonctionnalités Supplémentaires**

1. **Wishlist**
   - [ ] Accédez à un produit
   - [ ] Cliquez sur le cœur pour ajouter aux favoris
   - [ ] Vérifiez que le badge du cœur s'incrémente
   - [ ] Accédez à la wishlist (`/wishlist`)
   - [ ] Vérifiez que le produit est dans la liste
   - [ ] Ajoutez le produit au panier depuis la wishlist

2. **Avis**
   - [ ] Accédez à un produit que vous avez acheté
   - [ ] Cliquez sur "Laisser un avis"
   - [ ] Notez le produit (1-5 étoiles)
   - [ ] Ajoutez un commentaire
   - [ ] Cliquez sur "Soumettre"
   - [ ] Vérifiez que l'avis apparaît

3. **Recherche**
   - [ ] Accédez à la page de recherche (`/search`)
   - [ ] Recherchez un produit par nom
   - [ ] Vérifiez que les résultats s'affichent
   - [ ] Appliquez des filtres (catégorie, prix)
   - [ ] Vérifiez que les filtres fonctionnent

#### C. Vérifications Critiques

- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans les logs du serveur
- [ ] Tous les emails sont reçus
- [ ] Les données sont persistantes après rafraîchissement
- [ ] Les redirections fonctionnent correctement
- [ ] Les cookies sont définis (vérifiez dans DevTools)

---

## 14.2 📱 TESTER SUR MOBILE

### Durée: 25 min

#### A. Configuration

1. **Ouvrir DevTools**
   - Appuyez sur `F12` ou `Ctrl+Shift+I`
   - Cliquez sur l'icône "Toggle device toolbar" (ou `Ctrl+Shift+M`)

2. **Tester les Breakpoints**
   - [ ] Mobile: 375px (iPhone SE)
   - [ ] Mobile: 414px (iPhone 12)
   - [ ] Tablet: 768px (iPad)
   - [ ] Desktop: 1024px+

#### B. Tests Visuels

**Mobile (375px)**

- [ ] Header s'affiche correctement
- [ ] Navigation mobile fonctionne
- [ ] Grille de produits: 1 colonne
- [ ] Boutons sont cliquables
- [ ] Formulaires sont lisibles
- [ ] Images s'affichent correctement
- [ ] Pas de débordement horizontal

**Mobile (414px)**

- [ ] Même vérifications que 375px
- [ ] Grille de produits: 1-2 colonnes
- [ ] Espacement correct

**Tablet (768px)**

- [ ] Grille de produits: 2 colonnes
- [ ] Navigation desktop s'affiche
- [ ] Formulaires sont bien espacés
- [ ] Pas de débordement

**Desktop (1024px+)**

- [ ] Grille de produits: 3-4 colonnes
- [ ] Navigation complète
- [ ] Sidebar s'affiche si applicable
- [ ] Espacement optimal

#### C. Tests Fonctionnels

**Inscription sur Mobile**

- [ ] Formulaire s'affiche correctement
- [ ] Clavier virtuel ne cache pas les champs
- [ ] Bouton "S'inscrire" est cliquable
- [ ] Redirection fonctionne

**Panier sur Mobile**

- [ ] Produits s'affichent correctement
- [ ] Boutons +/- sont cliquables
- [ ] Bouton "Supprimer" fonctionne
- [ ] Total se met à jour

**Checkout sur Mobile**

- [ ] Formulaire s'affiche correctement
- [ ] Tous les champs sont accessibles
- [ ] Clavier virtuel ne cache pas les champs
- [ ] Bouton "Confirmer" est cliquable

**Wishlist sur Mobile**

- [ ] Cœur est cliquable
- [ ] Badge s'affiche correctement
- [ ] Page wishlist s'affiche correctement

**Avis sur Mobile**

- [ ] Formulaire s'affiche correctement
- [ ] Étoiles sont cliquables
- [ ] Textarea est accessible
- [ ] Bouton "Soumettre" fonctionne

#### D. Tests de Performance

- [ ] Temps de chargement < 3s sur 4G
- [ ] Pas de lag lors du scroll
- [ ] Pas de lag lors du clic sur les boutons
- [ ] Images se chargent rapidement

#### E. Tests d'Accessibilité

- [ ] Tous les boutons ont un label
- [ ] Les images ont un alt text
- [ ] Les formulaires ont des labels
- [ ] Les couleurs ont un contraste suffisant
- [ ] La navigation au clavier fonctionne

---

## 14.3 🚀 DÉPLOYER SUR VERCEL

### Durée: 15 min

#### A. Préparation

1. **Vérifier que tout est commité**

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

2. **Vérifier les variables d'environnement**

```bash
# Vérifier que .env.local existe
cat .env.local

# Vérifier que DATABASE_URL est défini
echo $DATABASE_URL
```

#### B. Déploiement sur Vercel

1. **Accédez à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub

2. **Importer le Projet**
   - Cliquez sur "Add New..." → "Project"
   - Sélectionnez votre repo GitHub
   - Cliquez sur "Import"

3. **Configurer les Variables d'Environnement**
   - Dans "Environment Variables", ajoutez:
     - `DATABASE_URL`: Votre URL PostgreSQL (Neon)
     - `NODE_ENV`: `production`
   - Cliquez sur "Deploy"

4. **Attendre le Déploiement**
   - Vercel va builder et déployer votre app
   - Vous recevrez une URL de déploiement
   - Attendez que le déploiement soit terminé (vert)

#### C. Vérification Post-Déploiement

- [ ] Site accessible via l'URL Vercel
- [ ] Pas d'erreurs 500
- [ ] Pas d'erreurs dans les logs
- [ ] Base de données connectée
- [ ] Emails fonctionnent

---

## 14.4 🌐 TESTER EN PRODUCTION

### Durée: 9 min

#### A. Tests Basiques

1. **Accédez au site**
   - [ ] Ouvrez l'URL Vercel
   - [ ] Vérifiez que la page se charge
   - [ ] Vérifiez que les produits s'affichent

2. **Inscription**
   - [ ] Accédez à `/auth/signup`
   - [ ] Créez un nouveau compte
   - [ ] Vérifiez que vous recevez un email
   - [ ] Vérifiez que vous êtes connecté

3. **Panier**
   - [ ] Ajoutez un produit au panier
   - [ ] Accédez au panier
   - [ ] Vérifiez que le produit est là

4. **Checkout**
   - [ ] Procédez au checkout
   - [ ] Remplissez les informations
   - [ ] Confirmez la commande
   - [ ] Vérifiez la confirmation
   - [ ] Vérifiez que vous recevez un email

#### B. Tests Avancés

1. **Wishlist**
   - [ ] Ajoutez un produit aux favoris
   - [ ] Accédez à la wishlist
   - [ ] Vérifiez que le produit est là

2. **Avis**
   - [ ] Laissez un avis sur un produit
   - [ ] Vérifiez que l'avis apparaît

3. **Recherche**
   - [ ] Recherchez un produit
   - [ ] Appliquez des filtres
   - [ ] Vérifiez que ça fonctionne

#### C. Vérifications Critiques

- [ ] Pas d'erreurs 500
- [ ] Pas d'erreurs dans la console
- [ ] Tous les emails sont reçus
- [ ] Les données sont persistantes
- [ ] Les redirections fonctionnent
- [ ] Les cookies sont définis

---

## 📊 Checklist Complète

### Avant le Déploiement
- [ ] Build réussie: `npm run build`
- [ ] Pas d'erreurs de linting: `npm run lint`
- [ ] Tous les tests passent
- [ ] `.env.local` configuré
- [ ] Base de données connectée
- [ ] Migrations appliquées: `npm run db:push`

### Tests Locaux
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Panier fonctionne
- [ ] Checkout fonctionne
- [ ] Emails sont reçus
- [ ] Wishlist fonctionne
- [ ] Avis fonctionnent
- [ ] Recherche fonctionne

### Tests Mobile
- [ ] Mobile 375px: OK
- [ ] Mobile 414px: OK
- [ ] Tablet 768px: OK
- [ ] Desktop 1024px+: OK
- [ ] Tous les écrans: Responsive
- [ ] Tous les écrans: Fonctionnels

### Déploiement Vercel
- [ ] Repo GitHub connecté
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] URL accessible
- [ ] Pas d'erreurs 500

### Tests Production
- [ ] Site accessible
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Panier fonctionne
- [ ] Checkout fonctionne
- [ ] Emails sont reçus
- [ ] Wishlist fonctionne
- [ ] Avis fonctionnent
- [ ] Recherche fonctionne

---

## 🔧 Dépannage

### Erreur: "DATABASE_URL not found"
```bash
# Vérifier que .env.local existe
cat .env.local

# Vérifier que DATABASE_URL est défini
echo $DATABASE_URL

# Si vide, ajouter dans .env.local
echo "DATABASE_URL=postgresql://..." >> .env.local
```

### Erreur: "Build failed"
```bash
# Vérifier les erreurs de build
npm run build

# Vérifier les erreurs de linting
npm run lint

# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

### Erreur: "Emails not received"
- Vérifier que Resend est configuré
- Vérifier que l'API key est correcte
- Vérifier les logs de Resend

### Erreur: "Database connection failed"
- Vérifier que DATABASE_URL est correct
- Vérifier que la base de données est accessible
- Vérifier les logs de Neon

---

## 📞 Support

### Documentation
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [API_TEST.md](./API_TEST.md)
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)

### Ressources
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Neon Docs](https://neon.tech/docs)

---

## ✅ Résumé

| Tâche | Durée | Statut |
|-------|-------|--------|
| 14.1 - Tests flux complet | 25 min | ⏳ |
| 14.2 - Tests mobile | 25 min | ⏳ |
| 14.3 - Déploiement Vercel | 15 min | ⏳ |
| 14.4 - Tests production | 9 min | ⏳ |
| **Total** | **1h14** | ⏳ |

---

**Prêt à tester et déployer?** 🚀

Commencez par la section 14.1 pour tester le flux complet en local!
