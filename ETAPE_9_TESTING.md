# ETAPE 9 : WISHLIST - TESTING 🧪

## 🧪 Tests Manuels

### Prérequis
- Application en cours d'exécution sur http://localhost:3000
- Utilisateur connecté (ou prêt à se connecter)

## Test 1: Ajouter aux Favoris (Non Connecté)

**Étapes:**
1. Aller sur http://localhost:3000
2. Cliquer sur le cœur d'un produit (sans être connecté)
3. Vous serez redirigé vers `/auth/login`

**Résultat Attendu:**
- ✅ Redirection vers la page de login
- ✅ Message de connexion visible

---

## Test 2: Ajouter aux Favoris (Connecté)

**Étapes:**
1. Se connecter avec un compte
2. Aller sur http://localhost:3000
3. Cliquer sur le cœur d'un produit
4. Observer le changement

**Résultat Attendu:**
- ✅ Le cœur devient rouge/rempli
- ✅ Badge dans le header augmente
- ✅ Pas d'erreur dans la console

---

## Test 3: Voir les Favoris

**Étapes:**
1. Cliquer sur le badge du cœur dans le header
2. Ou aller directement sur http://localhost:3000/wishlist

**Résultat Attendu:**
- ✅ Page `/wishlist` s'affiche
- ✅ Tous les produits favoris sont listés
- ✅ Compteur affiche le nombre correct
- ✅ Images et prix s'affichent

---

## Test 4: Ajouter au Panier depuis Favoris

**Étapes:**
1. Aller sur `/wishlist`
2. Cliquer "Ajouter au panier" sur un produit
3. Voir la notification "Added to cart"
4. Aller sur `/cart`

**Résultat Attendu:**
- ✅ Produit s'ajoute au panier
- ✅ Notification de confirmation
- ✅ Produit visible dans `/cart`

---

## Test 5: Supprimer des Favoris (Page Wishlist)

**Étapes:**
1. Aller sur `/wishlist`
2. Cliquer le cœur rouge d'un produit
3. Observer la disparition

**Résultat Attendu:**
- ✅ Produit disparaît de la liste
- ✅ Badge du header diminue
- ✅ Page se met à jour
- ✅ Pas d'erreur

---

## Test 6: Supprimer des Favoris (Product Card)

**Étapes:**
1. Aller sur http://localhost:3000
2. Cliquer le cœur rouge d'un produit en favoris
3. Observer le changement

**Résultat Attendu:**
- ✅ Le cœur devient blanc/vide
- ✅ Badge du header diminue
- ✅ Produit disparaît de `/wishlist`

---

## Test 7: Page Produit Détail

**Étapes:**
1. Cliquer sur un produit pour aller sur `/product/[id]`
2. Cliquer le cœur dans le header
3. Observer le changement

**Résultat Attendu:**
- ✅ Le cœur devient rouge/rempli
- ✅ Badge du header augmente
- ✅ Produit s'ajoute aux favoris
- ✅ Visible sur `/wishlist`

---

## Test 8: État Vide

**Étapes:**
1. Supprimer tous les favoris
2. Aller sur `/wishlist`

**Résultat Attendu:**
- ✅ Message "Your wishlist is empty"
- ✅ Bouton "Continue Shopping"
- ✅ Pas d'erreur

---

## Test 9: Responsive Design

**Étapes:**
1. Aller sur `/wishlist`
2. Redimensionner la fenêtre (mobile, tablet, desktop)
3. Observer l'affichage

**Résultat Attendu:**
- ✅ Mobile: 1 colonne
- ✅ Tablet: 2 colonnes
- ✅ Desktop: 3 colonnes
- ✅ Tous les éléments visibles

---

## Test 10: Compteur du Header

**Étapes:**
1. Ajouter plusieurs produits aux favoris
2. Observer le badge dans le header
3. Supprimer des favoris
4. Observer la mise à jour

**Résultat Attendu:**
- ✅ Badge affiche le nombre correct
- ✅ Mise à jour en temps réel
- ✅ Badge disparaît si 0 favoris

---

## Test 11: Persistance (Refresh)

**Étapes:**
1. Ajouter un produit aux favoris
2. Rafraîchir la page (F5)
3. Vérifier que le produit est toujours en favoris

**Résultat Attendu:**
- ✅ Produit toujours en favoris
- ✅ Badge toujours visible
- ✅ Données persistées en DB

---

## Test 12: Déconnexion/Reconnexion

**Étapes:**
1. Ajouter des favoris
2. Se déconnecter
3. Se reconnecter
4. Vérifier les favoris

**Résultat Attendu:**
- ✅ Favoris toujours présents
- ✅ Badge correct
- ✅ Données persistées

---

## 🔍 Vérifications Console

Ouvrir la console du navigateur (F12) et vérifier:

```javascript
// Pas d'erreurs rouges
// Pas de warnings critiques
// Logs normaux pour les requêtes API
```

---

## 📊 Vérifications Base de Données

Vérifier que la table wishlist existe:

```sql
SELECT * FROM wishlist;
```

Vérifier les données:

```sql
SELECT w.id, w.user_id, w.product_id, p.name, w.created_at
FROM wishlist w
JOIN products p ON w.product_id = p.id
ORDER BY w.created_at DESC;
```

---

## 🐛 Dépannage

### Le cœur ne change pas de couleur
- Vérifier que vous êtes connecté
- Vérifier la console pour les erreurs
- Vérifier que le JWT token est valide

### Le badge ne s'affiche pas
- Rafraîchir la page
- Vérifier que wishlistItems n'est pas vide
- Vérifier le context provider dans layout.tsx

### Les favoris ne persistent pas
- Vérifier la migration: `npm run db:push`
- Vérifier la connexion à la base de données
- Vérifier les logs du serveur

### Erreur 401 Unauthorized
- Vérifier que vous êtes connecté
- Vérifier que le token JWT est valide
- Vérifier les cookies

---

## ✅ Checklist de Test

- [ ] Ajouter aux favoris (non connecté) → Redirection login
- [ ] Ajouter aux favoris (connecté) → Cœur rouge
- [ ] Voir les favoris → Page affichée
- [ ] Ajouter au panier → Produit dans le panier
- [ ] Supprimer des favoris → Produit disparu
- [ ] Page produit détail → Cœur fonctionnel
- [ ] État vide → Message affiché
- [ ] Responsive → Affichage correct
- [ ] Compteur → Nombre correct
- [ ] Persistance → Données sauvegardées
- [ ] Déconnexion/Reconnexion → Favoris conservés
- [ ] Console → Pas d'erreurs

---

## 🎯 Résultat Final

Si tous les tests passent ✅, la wishlist est prête pour la production!
