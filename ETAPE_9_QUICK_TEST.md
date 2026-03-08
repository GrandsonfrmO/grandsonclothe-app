# ÉTAPE 9 : WISHLIST - GUIDE DE TEST RAPIDE ⚡

## 🚀 Démarrage Rapide

### 1. Démarrer l'app
```bash
npm run dev
```

### 2. Accéder à l'app
```
http://localhost:3000
```

## ✅ Checklist de Test

### Test 1: Authentification & Wishlist Button
- [ ] Aller sur la page d'accueil (non authentifié)
- [ ] Cliquer sur le cœur d'un produit
- [ ] Vérifier redirection vers `/auth/login`
- [ ] Se connecter avec un compte existant
- [ ] Revenir à l'accueil

### Test 2: Ajouter aux Favoris
- [ ] Cliquer sur le cœur d'un produit
- [ ] Vérifier que le cœur devient rouge/rempli
- [ ] Vérifier que le badge "1" apparaît dans le header
- [ ] Cliquer sur un autre cœur
- [ ] Vérifier que le badge passe à "2"

### Test 3: Page Wishlist
- [ ] Cliquer sur le badge wishlist dans le header
- [ ] Vérifier que la page `/wishlist` s'affiche
- [ ] Vérifier que tous les produits ajoutés s'affichent
- [ ] Vérifier le prix et l'image de chaque produit

### Test 4: Ajouter au Panier depuis Wishlist
- [ ] Sur la page wishlist
- [ ] Cliquer sur "Ajouter au panier" d'un produit
- [ ] Vérifier le message "Added to cart"
- [ ] Aller au panier (`/cart`)
- [ ] Vérifier que le produit est dans le panier

### Test 5: Supprimer des Favoris
- [ ] Sur la page wishlist
- [ ] Cliquer sur le cœur rouge d'un produit
- [ ] Vérifier que le produit disparaît
- [ ] Vérifier que le badge du header diminue
- [ ] Retourner à l'accueil
- [ ] Vérifier que le cœur du produit est vide

### Test 6: Voir Détails du Produit
- [ ] Sur la page wishlist
- [ ] Cliquer sur "Voir détails"
- [ ] Vérifier que la page produit s'affiche
- [ ] Vérifier que le cœur est rouge (produit en favoris)

### Test 7: Persistance des Données
- [ ] Ajouter 3 produits aux favoris
- [ ] Rafraîchir la page (F5)
- [ ] Vérifier que les 3 produits sont toujours en favoris
- [ ] Badge affiche toujours "3"

### Test 8: Logout & Login
- [ ] Ajouter des favoris
- [ ] Cliquer sur le menu utilisateur
- [ ] Cliquer sur "Logout"
- [ ] Se reconnecter
- [ ] Vérifier que les favoris sont toujours là

### Test 9: Wishlist Vide
- [ ] Supprimer tous les favoris
- [ ] Vérifier le message "Your wishlist is empty"
- [ ] Vérifier le bouton "Continue Shopping"
- [ ] Cliquer sur le bouton
- [ ] Vérifier redirection vers `/`

### Test 10: Responsive Design
- [ ] Ouvrir DevTools (F12)
- [ ] Passer en mode mobile (375px)
- [ ] Vérifier que la grille affiche 1 colonne
- [ ] Passer en mode tablet (768px)
- [ ] Vérifier que la grille affiche 2 colonnes
- [ ] Passer en mode desktop (1024px)
- [ ] Vérifier que la grille affiche 3 colonnes

## 🐛 Dépannage

### Le cœur ne change pas de couleur
- Vérifier que vous êtes authentifié
- Vérifier la console pour les erreurs
- Vérifier que l'API répond (Network tab)

### La page wishlist est vide
- Vérifier que vous avez ajouté des favoris
- Vérifier que vous êtes authentifié
- Vérifier la console pour les erreurs

### Le badge ne s'affiche pas
- Vérifier que WishlistProvider est dans layout.tsx
- Vérifier que useWishlist() est utilisé dans Header
- Rafraîchir la page

### Erreur 401 Unauthorized
- Vérifier que le token JWT est valide
- Vérifier que le cookie 'token' est présent
- Se reconnecter

## 📊 Vérification de la Base de Données

### Vérifier la table wishlist
```sql
SELECT * FROM wishlist;
```

### Vérifier les favoris d'un utilisateur
```sql
SELECT w.*, p.name, p.price 
FROM wishlist w
JOIN products p ON w.product_id = p.id
WHERE w.user_id = 1;
```

### Compter les favoris par utilisateur
```sql
SELECT user_id, COUNT(*) as count
FROM wishlist
GROUP BY user_id;
```

## ✨ Cas d'Usage Avancés

### Ajouter le même produit deux fois
- Essayer d'ajouter un produit déjà en favoris
- Vérifier que l'API retourne une erreur "Already in wishlist"
- Vérifier que le produit n'est pas dupliqué

### Supprimer un produit de la base
- Supprimer un produit de la table products
- Vérifier que les favoris associés sont supprimés (CASCADE)

### Supprimer un utilisateur
- Supprimer un utilisateur de la table users
- Vérifier que tous ses favoris sont supprimés (CASCADE)

## 🎉 Succès!
Si tous les tests passent, l'étape 9 est complète! 🚀
