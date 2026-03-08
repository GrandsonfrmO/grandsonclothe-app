# 🌐 ÉTAPE 14.4: PRODUCTION TESTING GUIDE

**Durée:** 9 min | **Format:** Checklist

---

## 🎯 Objectif

Vérifier que l'application fonctionne correctement en production après le déploiement sur Vercel.

---

## 📋 TESTS BASIQUES (5 min)

### 1. Accès au Site

```
URL: https://your-vercel-url.vercel.app
```

- [ ] Site accessible
- [ ] Page se charge en < 3 secondes
- [ ] Pas d'erreur 404
- [ ] Pas d'erreur 500
- [ ] Pas d'erreur dans la console

### 2. Page d'Accueil

- [ ] Logo s'affiche
- [ ] Navigation s'affiche
- [ ] Produits s'affichent
- [ ] Images se chargent
- [ ] Footer s'affiche
- [ ] Pas de contenu cassé

### 3. Inscription

**Scénario:**
1. Accédez à `/auth/signup`
2. Créez un compte avec:
   - Email: `test-prod-[timestamp]@example.com`
   - Mot de passe: `TestPassword123!`
3. Cliquez sur "S'inscrire"

**Vérifications:**
- [ ] Formulaire s'affiche
- [ ] Pas d'erreurs de validation
- [ ] Redirection vers `/` après succès
- [ ] Menu utilisateur affiche l'email
- [ ] Email de confirmation reçu
- [ ] Email contient le bon contenu

### 4. Login

**Scénario:**
1. Accédez à `/auth/login`
2. Entrez l'email et le mot de passe du test précédent
3. Cliquez sur "Se connecter"

**Vérifications:**
- [ ] Formulaire s'affiche
- [ ] Pas d'erreurs de validation
- [ ] Redirection vers `/` après succès
- [ ] Menu utilisateur affiche l'email
- [ ] Cookies sont définis (vérifiez dans DevTools)

### 5. Panier

**Scénario:**
1. Cliquez sur un produit
2. Cliquez sur "Ajouter au panier"
3. Accédez à `/cart`

**Vérifications:**
- [ ] Produit s'affiche dans le panier
- [ ] Badge du panier s'incrémente
- [ ] Quantité peut être modifiée
- [ ] Total se met à jour
- [ ] Produit persiste après rafraîchissement

### 6. Checkout

**Scénario:**
1. Cliquez sur "Procéder au paiement"
2. Remplissez le formulaire:
   - Nom: Test User
   - Adresse: 123 Main St
   - Ville: Conakry
   - Code postal: 1000
   - Téléphone: +224 612345678
3. Cliquez sur "Confirmer la commande"

**Vérifications:**
- [ ] Formulaire s'affiche
- [ ] Tous les champs acceptent l'input
- [ ] Validation fonctionne
- [ ] Redirection vers confirmation après succès
- [ ] Numéro de commande s'affiche
- [ ] Email de confirmation reçu
- [ ] Email contient les détails de la commande

---

## 🎯 TESTS AVANCÉS (4 min)

### 7. Wishlist

**Scénario:**
1. Accédez à un produit
2. Cliquez sur le cœur
3. Accédez à `/wishlist`

**Vérifications:**
- [ ] Produit ajouté aux favoris
- [ ] Badge du cœur s'incrémente
- [ ] Produit s'affiche dans la wishlist
- [ ] Bouton "Ajouter au panier" fonctionne
- [ ] Produit persiste après rafraîchissement

### 8. Avis

**Scénario:**
1. Accédez à un produit que vous avez acheté
2. Cliquez sur "Laisser un avis"
3. Notez 5 étoiles
4. Ajoutez un commentaire: "Excellent produit!"
5. Cliquez sur "Soumettre"

**Vérifications:**
- [ ] Formulaire s'affiche
- [ ] Étoiles sont cliquables
- [ ] Commentaire s'affiche
- [ ] Avis apparaît sur la page
- [ ] Moyenne des notes se met à jour

### 9. Recherche

**Scénario:**
1. Accédez à `/search`
2. Recherchez un produit
3. Appliquez des filtres

**Vérifications:**
- [ ] Barre de recherche fonctionne
- [ ] Résultats s'affichent
- [ ] Filtres fonctionnent
- [ ] Pagination fonctionne (si applicable)

### 10. Profil

**Scénario:**
1. Accédez à `/profile`
2. Cliquez sur une commande

**Vérifications:**
- [ ] Informations utilisateur s'affichent
- [ ] Historique des commandes s'affiche
- [ ] Détails de la commande s'affichent
- [ ] Bouton "Modifier le profil" fonctionne

---

## 🔍 VÉRIFICATIONS CRITIQUES

### Performance

- [ ] Page d'accueil: < 2s
- [ ] Page produit: < 2s
- [ ] Page panier: < 1s
- [ ] Page checkout: < 2s
- [ ] Pas de lag lors du scroll
- [ ] Pas de lag lors du clic

### Sécurité

- [ ] HTTPS activé
- [ ] Certificat SSL valide
- [ ] Pas d'avertissements de sécurité
- [ ] Cookies httpOnly
- [ ] Cookies Secure
- [ ] Pas de données sensibles exposées

### Erreurs

- [ ] Pas d'erreurs 500
- [ ] Pas d'erreurs 404
- [ ] Pas d'erreurs dans la console
- [ ] Pas d'erreurs dans les logs Vercel

### Données

- [ ] Données persistantes
- [ ] Pas de perte de données
- [ ] Pas de doublons
- [ ] Pas de données corrompues

### Emails

- [ ] Emails reçus
- [ ] Emails contiennent le bon contenu
- [ ] Pas d'emails dupliqués
- [ ] Pas d'emails perdus

---

## 📱 TESTS MOBILE EN PRODUCTION

### Tester sur Appareil Réel

1. Ouvrez l'URL Vercel sur votre téléphone
2. Testez les scénarios basiques:
   - [ ] Inscription
   - [ ] Login
   - [ ] Ajouter au panier
   - [ ] Checkout

### Tester sur Émulateur

1. Ouvrez DevTools (`F12`)
2. Cliquez sur "Toggle device toolbar" (`Ctrl+Shift+M`)
3. Testez sur 375px, 414px, 768px, 1024px+

---

## 🔄 TESTS DE RÉGRESSION

### Vérifier que rien n'est cassé

- [ ] Authentification fonctionne
- [ ] Produits s'affichent
- [ ] Panier fonctionne
- [ ] Checkout fonctionne
- [ ] Emails fonctionnent
- [ ] Wishlist fonctionne
- [ ] Avis fonctionnent
- [ ] Recherche fonctionne
- [ ] Profil fonctionne

---

## 🐛 DÉPANNAGE

### Erreur: "500 Internal Server Error"

**Solutions:**
1. Vérifiez les logs Vercel
2. Vérifiez que DATABASE_URL est configuré
3. Vérifiez que la base de données est accessible
4. Vérifiez que les migrations sont appliquées

### Erreur: "Database connection failed"

**Solutions:**
1. Vérifiez DATABASE_URL
2. Vérifiez que la base de données est accessible
3. Vérifiez les logs Neon
4. Redéployez

### Erreur: "Emails not received"

**Solutions:**
1. Vérifiez que Resend API key est configuré
2. Vérifiez les logs Resend
3. Vérifiez que l'email est dans la liste blanche
4. Vérifiez le dossier spam

### Erreur: "Page not found"

**Solutions:**
1. Vérifiez l'URL
2. Vérifiez que la page existe
3. Vérifiez les logs Vercel
4. Redéployez

### Erreur: "Slow performance"

**Solutions:**
1. Vérifiez les métriques Vercel
2. Vérifiez la base de données
3. Vérifiez les images
4. Optimisez le code

---

## 📊 CHECKLIST FINALE

### Accès
- [ ] Site accessible
- [ ] Pas d'erreurs 500
- [ ] Pas d'erreurs 404
- [ ] HTTPS activé

### Fonctionnalités
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Panier fonctionne
- [ ] Checkout fonctionne
- [ ] Emails reçus
- [ ] Wishlist fonctionne
- [ ] Avis fonctionnent
- [ ] Recherche fonctionne
- [ ] Profil fonctionne

### Performance
- [ ] Temps de chargement OK
- [ ] Pas de lag
- [ ] Animations fluides
- [ ] Réseau OK

### Sécurité
- [ ] HTTPS OK
- [ ] Cookies OK
- [ ] Pas de données exposées
- [ ] Pas d'erreurs de sécurité

### Mobile
- [ ] 375px OK
- [ ] 414px OK
- [ ] 768px OK
- [ ] 1024px+ OK

---

## 📈 MONITORING CONTINU

### Vérifier Régulièrement

1. **Quotidien:**
   - Vérifier les logs Vercel
   - Vérifier les erreurs
   - Vérifier les performances

2. **Hebdomadaire:**
   - Vérifier les métriques
   - Vérifier les alertes
   - Vérifier les utilisateurs

3. **Mensuellement:**
   - Vérifier les performances
   - Vérifier la sécurité
   - Vérifier les mises à jour

---

## 🎯 RÉSUMÉ

| Test | Durée | Statut |
|------|-------|--------|
| Tests basiques | 5 min | ⏳ |
| Tests avancés | 4 min | ⏳ |
| **Total** | **9 min** | ⏳ |

---

## 📞 RESSOURCES

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Neon Docs](https://neon.tech/docs)

### Support
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://vercel.com/community)

---

**Prêt à tester en production?** 🌐

Commencez par les tests basiques!
