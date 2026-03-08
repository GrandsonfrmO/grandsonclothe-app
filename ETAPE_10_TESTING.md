# ÉTAPE 10 : AVIS & ÉVALUATIONS - GUIDE DE TEST COMPLET

## 🚀 Démarrage Rapide

### 1. Démarrer l'app
```bash
npm run dev
```

### 2. Accéder à l'app
```
http://localhost:3000
```

## ✅ Checklist de Test Complète

### Test 1: Voir les Avis (Non Authentifié)
- [ ] Aller sur une page produit (`/product/1`)
- [ ] Scroll jusqu'à "Avis clients"
- [ ] Vérifier que la section s'affiche
- [ ] Vérifier que le message "Connectez-vous pour laisser un avis" s'affiche
- [ ] Vérifier que le bouton "Se connecter" s'affiche
- [ ] Vérifier que la liste des avis s'affiche (s'il y en a)

### Test 2: Redirection Login
- [ ] Cliquer sur le bouton "Se connecter"
- [ ] Vérifier redirection vers `/auth/login`
- [ ] Se connecter
- [ ] Vérifier redirection vers la page produit

### Test 3: Formulaire d'Avis (Authentifié)
- [ ] Se connecter
- [ ] Aller sur une page produit
- [ ] Scroll jusqu'à "Avis clients"
- [ ] Vérifier que le formulaire s'affiche
- [ ] Vérifier que le formulaire a:
  - [ ] Titre "Votre note"
  - [ ] 5 étoiles sélectionnables
  - [ ] Champ "Votre avis (optionnel)"
  - [ ] Textarea pour le commentaire
  - [ ] Compteur de caractères
  - [ ] Bouton "Soumettre mon avis"

### Test 4: Sélection des Étoiles
- [ ] Cliquer sur la 1ère étoile
- [ ] Vérifier que seule la 1ère étoile se remplit
- [ ] Cliquer sur la 3ème étoile
- [ ] Vérifier que les 3 premières étoiles se remplissent
- [ ] Cliquer sur la 5ème étoile
- [ ] Vérifier que les 5 étoiles se remplissent
- [ ] Survoler les étoiles
- [ ] Vérifier que les étoiles se remplissent au survol

### Test 5: Compteur de Caractères
- [ ] Ajouter du texte dans le commentaire
- [ ] Vérifier que le compteur augmente
- [ ] Ajouter 500 caractères
- [ ] Vérifier que le compteur affiche "500/500"
- [ ] Essayer d'ajouter plus de caractères
- [ ] Vérifier que le compteur s'arrête à 500

### Test 6: Validation - Pas de Note
- [ ] Laisser le commentaire vide
- [ ] Cliquer "Soumettre mon avis" sans sélectionner une note
- [ ] Vérifier le message d'erreur "Veuillez sélectionner une note"
- [ ] Vérifier que l'avis n'est pas soumis

### Test 7: Soumission Réussie
- [ ] Sélectionner une note (ex: 5 étoiles)
- [ ] Ajouter un commentaire (ex: "Excellent produit!")
- [ ] Cliquer "Soumettre mon avis"
- [ ] Vérifier le message "Avis soumis avec succès"
- [ ] Vérifier que le formulaire se réinitialise
- [ ] Vérifier que l'avis apparaît dans la liste

### Test 8: Affichage de l'Avis
- [ ] Vérifier que l'avis affiche:
  - [ ] Nom de l'auteur
  - [ ] Date relative (ex: "à l'instant")
  - [ ] Note (étoiles)
  - [ ] Commentaire

### Test 9: Moyenne des Notes
- [ ] Laisser plusieurs avis avec des notes différentes
- [ ] Vérifier que la moyenne est calculée correctement
- [ ] Exemple: 5 + 4 + 3 = 4 (moyenne)
- [ ] Vérifier que le nombre d'avis augmente

### Test 10: Avis en Doublon
- [ ] Laisser un avis sur un produit
- [ ] Essayer de laisser un autre avis sur le même produit
- [ ] Vérifier le message d'erreur "You have already reviewed this product"
- [ ] Vérifier que le nouvel avis n'est pas créé

### Test 11: Vérification d'Achat
- [ ] Créer un nouvel utilisateur
- [ ] Se connecter avec ce nouvel utilisateur
- [ ] Aller sur une page produit
- [ ] Essayer de laisser un avis
- [ ] Vérifier le message d'erreur "You must purchase this product to leave a review"
- [ ] Vérifier que l'avis n'est pas créé

### Test 12: Avis Optionnel
- [ ] Sélectionner une note
- [ ] Laisser le commentaire vide
- [ ] Cliquer "Soumettre mon avis"
- [ ] Vérifier que l'avis est créé
- [ ] Vérifier que l'avis affiche la note sans commentaire

### Test 13: Persistance
- [ ] Laisser un avis
- [ ] Rafraîchir la page (F5)
- [ ] Vérifier que l'avis est toujours là
- [ ] Logout
- [ ] Login
- [ ] Aller sur la page produit
- [ ] Vérifier que l'avis est toujours là

### Test 14: Responsive Mobile
- [ ] Ouvrir DevTools (F12)
- [ ] Passer en mode mobile (375px)
- [ ] Aller sur une page produit
- [ ] Scroll jusqu'à "Avis clients"
- [ ] Vérifier que le formulaire s'affiche correctement
- [ ] Vérifier que les étoiles sont sélectionnables
- [ ] Vérifier que la liste des avis s'affiche correctement
- [ ] Vérifier que tout est lisible

### Test 15: Responsive Tablet
- [ ] Passer en mode tablet (768px)
- [ ] Vérifier que le formulaire s'affiche correctement
- [ ] Vérifier que la liste des avis s'affiche correctement
- [ ] Vérifier que tout est lisible

### Test 16: Responsive Desktop
- [ ] Passer en mode desktop (1024px)
- [ ] Vérifier que le formulaire s'affiche correctement
- [ ] Vérifier que la liste des avis s'affiche correctement
- [ ] Vérifier que tout est lisible

### Test 17: Plusieurs Produits
- [ ] Laisser un avis sur le produit 1
- [ ] Aller sur le produit 2
- [ ] Vérifier que les avis du produit 1 ne s'affichent pas
- [ ] Vérifier que les avis du produit 2 s'affichent
- [ ] Laisser un avis sur le produit 2
- [ ] Retourner au produit 1
- [ ] Vérifier que l'avis du produit 1 est toujours là

### Test 18: Plusieurs Utilisateurs
- [ ] Utilisateur 1 laisse un avis
- [ ] Logout
- [ ] Utilisateur 2 se connecte
- [ ] Aller sur le même produit
- [ ] Vérifier que l'avis de l'utilisateur 1 s'affiche
- [ ] Laisser un avis en tant qu'utilisateur 2
- [ ] Vérifier que les deux avis s'affichent

### Test 19: Ordre des Avis
- [ ] Laisser plusieurs avis
- [ ] Vérifier que les avis les plus récents s'affichent en premier
- [ ] Vérifier que l'ordre est correct

### Test 20: Pas d'Avis
- [ ] Aller sur un produit sans avis
- [ ] Vérifier le message "Aucun avis pour le moment. Soyez le premier à laisser un avis."
- [ ] Laisser un avis
- [ ] Vérifier que le message disparaît
- [ ] Vérifier que l'avis s'affiche

## 🐛 Dépannage

### Le formulaire ne s'affiche pas
**Cause:** Utilisateur non authentifié
**Solution:** Se connecter

### Les avis ne s'affichent pas
**Cause:** Erreur API
**Solution:** 
- Vérifier la console pour les erreurs
- Vérifier que l'API répond (Network tab)
- Vérifier que le productId est correct

### Erreur "You must purchase this product"
**Cause:** Utilisateur n'a pas acheté le produit
**Solution:** Créer une commande d'abord

### Erreur "You have already reviewed this product"
**Cause:** Utilisateur a déjà laissé un avis
**Solution:** C'est normal, un avis par produit par utilisateur

### Erreur "Rating must be between 1 and 5"
**Cause:** Rating invalide
**Solution:** Sélectionner une note entre 1 et 5

### Erreur "Product ID is required"
**Cause:** ProductId manquant
**Solution:** Vérifier que vous êtes sur une page produit

## 📊 Vérification de la Base de Données

### Vérifier la table reviews
```sql
SELECT * FROM reviews LIMIT 5;
```

### Vérifier les avis d'un produit
```sql
SELECT r.*, u.name, p.name as product_name
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN products p ON r.product_id = p.id
WHERE r.product_id = 1
ORDER BY r.created_at DESC;
```

### Calculer la moyenne des notes
```sql
SELECT 
  product_id,
  COUNT(*) as total_reviews,
  AVG(rating) as average_rating
FROM reviews
GROUP BY product_id;
```

### Vérifier les avis d'un utilisateur
```sql
SELECT r.*, p.name as product_name
FROM reviews r
JOIN products p ON r.product_id = p.id
WHERE r.user_id = 1
ORDER BY r.created_at DESC;
```

### Vérifier les doublons (ne doit rien retourner)
```sql
SELECT user_id, product_id, COUNT(*)
FROM reviews
GROUP BY user_id, product_id
HAVING COUNT(*) > 1;
```

## 🎯 Cas d'Usage Avancés

### Filtrer les avis par note
- Afficher seulement les avis 5 étoiles
- Afficher seulement les avis 1 étoile
- Afficher les avis avec commentaire

### Trier les avis
- Trier par date (récents d'abord)
- Trier par note (plus hautes d'abord)
- Trier par utilité (plus utiles d'abord)

### Marquer un avis comme utile
- Ajouter un bouton "Utile"
- Compter le nombre de votes
- Trier par utilité

### Répondre aux avis (Admin)
- Admin peut répondre aux avis
- Afficher les réponses sous les avis
- Notifier l'utilisateur

## ✨ Performance

### Optimisations
- [ ] Lazy loading des avis
- [ ] Pagination des avis (ex: 10 par page)
- [ ] Cache des avis
- [ ] Optimisation des requêtes

### Métriques
- [ ] Temps de chargement < 1s
- [ ] Temps de soumission < 500ms
- [ ] Pas de lag au sélectionner les étoiles

## 🎉 Succès!
Si tous les tests passent, l'étape 10 est complète! 🚀
