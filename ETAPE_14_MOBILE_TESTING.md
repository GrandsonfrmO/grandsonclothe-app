# 📱 ÉTAPE 14.2: MOBILE TESTING CHECKLIST

**Durée:** 25 min | **Format:** Détaillé

---

## 🎯 Objectif

Vérifier que l'application fonctionne correctement sur tous les appareils mobiles et tablettes.

---

## 🛠️ SETUP

### Ouvrir DevTools

1. Appuyez sur `F12` (Windows/Linux) ou `Cmd+Option+I` (Mac)
2. Cliquez sur l'icône "Toggle device toolbar" (ou `Ctrl+Shift+M`)
3. Sélectionnez un appareil dans le dropdown

### Appareils à Tester

```
Mobile:
  - iPhone SE (375x667)
  - iPhone 12 (390x844)
  - iPhone 14 Pro (393x852)
  - Samsung Galaxy S21 (360x800)
  - Google Pixel 6 (412x915)

Tablet:
  - iPad (768x1024)
  - iPad Pro (1024x1366)

Desktop:
  - 1280x720
  - 1920x1080
```

---

## 📋 TESTS PAR PAGE

### 1. PAGE D'ACCUEIL `/`

#### Visuel (375px)
- [ ] Header s'affiche correctement
- [ ] Logo visible et cliquable
- [ ] Menu hamburger visible
- [ ] Barre de recherche visible
- [ ] Panier visible
- [ ] Wishlist visible
- [ ] Hero banner s'affiche
- [ ] Grille de produits: 1 colonne
- [ ] Produits bien espacés
- [ ] Footer s'affiche
- [ ] Pas de débordement horizontal

#### Visuel (414px)
- [ ] Même que 375px
- [ ] Grille de produits: 1-2 colonnes
- [ ] Meilleur espacement

#### Visuel (768px)
- [ ] Grille de produits: 2 colonnes
- [ ] Navigation desktop s'affiche
- [ ] Menu hamburger disparaît
- [ ] Meilleur espacement

#### Visuel (1024px+)
- [ ] Grille de produits: 3-4 colonnes
- [ ] Navigation complète
- [ ] Sidebar s'affiche si applicable
- [ ] Espacement optimal

#### Fonctionnel (Mobile)
- [ ] Cliquer sur un produit → Détails s'affichent
- [ ] Cliquer sur le logo → Retour à l'accueil
- [ ] Cliquer sur le menu hamburger → Menu s'ouvre
- [ ] Cliquer sur un lien du menu → Navigation fonctionne
- [ ] Cliquer sur le panier → Accès au panier
- [ ] Cliquer sur la wishlist → Accès à la wishlist
- [ ] Scroll → Pas de lag
- [ ] Images se chargent rapidement

---

### 2. PAGE INSCRIPTION `/auth/signup`

#### Visuel (375px)
- [ ] Formulaire s'affiche correctement
- [ ] Tous les champs visibles
- [ ] Bouton "S'inscrire" visible
- [ ] Lien "Se connecter" visible
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer sur champ email → Clavier virtuel s'affiche
- [ ] Clavier ne cache pas le formulaire
- [ ] Cliquer sur champ mot de passe → Clavier change
- [ ] Cliquer sur "S'inscrire" → Formulaire se soumet
- [ ] Erreurs s'affichent correctement
- [ ] Succès → Redirection vers `/`

#### Accessibilité
- [ ] Tous les champs ont un label
- [ ] Labels sont associés aux champs
- [ ] Clavier Tab fonctionne
- [ ] Contraste des couleurs OK

---

### 3. PAGE LOGIN `/auth/login`

#### Visuel (375px)
- [ ] Formulaire s'affiche correctement
- [ ] Tous les champs visibles
- [ ] Bouton "Se connecter" visible
- [ ] Lien "S'inscrire" visible
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer sur champ email → Clavier virtuel s'affiche
- [ ] Cliquer sur champ mot de passe → Clavier change
- [ ] Cliquer sur "Se connecter" → Formulaire se soumet
- [ ] Erreurs s'affichent correctement
- [ ] Succès → Redirection vers `/`

---

### 4. PAGE PRODUIT `/product/[id]`

#### Visuel (375px)
- [ ] Images s'affichent correctement
- [ ] Carrousel d'images fonctionne
- [ ] Titre du produit visible
- [ ] Prix visible
- [ ] Description visible
- [ ] Bouton "Ajouter au panier" visible
- [ ] Cœur (wishlist) visible
- [ ] Avis s'affichent
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Swiper sur les images → Carrousel fonctionne
- [ ] Cliquer sur une image → Zoom fonctionne
- [ ] Cliquer "Ajouter au panier" → Produit ajouté
- [ ] Cliquer sur le cœur → Produit ajouté aux favoris
- [ ] Scroll → Pas de lag
- [ ] Avis se chargent

---

### 5. PAGE PANIER `/cart`

#### Visuel (375px)
- [ ] Produits s'affichent correctement
- [ ] Image du produit visible
- [ ] Nom du produit visible
- [ ] Prix visible
- [ ] Quantité visible
- [ ] Boutons +/- visibles
- [ ] Bouton "Supprimer" visible
- [ ] Total visible
- [ ] Bouton "Procéder au paiement" visible
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer "+" → Quantité augmente
- [ ] Cliquer "-" → Quantité diminue
- [ ] Cliquer "Supprimer" → Produit supprimé
- [ ] Total se met à jour
- [ ] Cliquer "Procéder au paiement" → Redirection checkout
- [ ] Panier vide → Message s'affiche

---

### 6. PAGE CHECKOUT `/checkout`

#### Visuel (375px)
- [ ] Formulaire s'affiche correctement
- [ ] Tous les champs visibles
- [ ] Résumé de la commande visible
- [ ] Bouton "Confirmer" visible
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer sur champ → Clavier virtuel s'affiche
- [ ] Clavier ne cache pas le formulaire
- [ ] Tous les champs acceptent l'input
- [ ] Cliquer "Confirmer" → Formulaire se soumet
- [ ] Erreurs s'affichent correctement
- [ ] Succès → Redirection confirmation

#### Champs à Tester
- [ ] Nom complet
- [ ] Adresse
- [ ] Ville
- [ ] Code postal
- [ ] Téléphone
- [ ] Mode de paiement

---

### 7. PAGE CONFIRMATION `/order-confirmation/[id]`

#### Visuel (375px)
- [ ] Numéro de commande visible
- [ ] Détails de la commande visibles
- [ ] Bouton "Retour à l'accueil" visible
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer "Retour à l'accueil" → Redirection `/`
- [ ] Informations de commande correctes

---

### 8. PAGE PROFIL `/profile`

#### Visuel (375px)
- [ ] Informations utilisateur visibles
- [ ] Historique des commandes visible
- [ ] Bouton "Modifier le profil" visible
- [ ] Bouton "Paramètres" visible
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer sur une commande → Détails s'affichent
- [ ] Cliquer "Modifier le profil" → Formulaire s'affiche
- [ ] Cliquer "Paramètres" → Page paramètres s'affiche

---

### 9. PAGE WISHLIST `/wishlist`

#### Visuel (375px)
- [ ] Produits s'affichent correctement
- [ ] Grille: 1 colonne
- [ ] Bouton "Ajouter au panier" visible
- [ ] Bouton "Supprimer" visible
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer "Ajouter au panier" → Produit ajouté
- [ ] Cliquer "Supprimer" → Produit supprimé
- [ ] Wishlist vide → Message s'affiche

---

### 10. PAGE RECHERCHE `/search`

#### Visuel (375px)
- [ ] Barre de recherche visible
- [ ] Filtres visibles
- [ ] Résultats s'affichent
- [ ] Grille: 1 colonne
- [ ] Pas de débordement

#### Fonctionnel (Mobile)
- [ ] Cliquer sur barre de recherche → Clavier s'affiche
- [ ] Taper du texte → Résultats se mettent à jour
- [ ] Cliquer sur filtre → Résultats se mettent à jour
- [ ] Cliquer sur un produit → Détails s'affichent

---

## 🎨 TESTS VISUELS GÉNÉRAUX

### Typographie
- [ ] Texte lisible sur mobile
- [ ] Taille de police appropriée
- [ ] Contraste suffisant
- [ ] Pas de texte coupé

### Couleurs
- [ ] Contraste blanc/noir OK
- [ ] Contraste des boutons OK
- [ ] Contraste des liens OK
- [ ] Pas de couleurs qui clignotent

### Espacement
- [ ] Padding approprié
- [ ] Margin approprié
- [ ] Pas de débordement
- [ ] Éléments bien alignés

### Images
- [ ] Images se chargent
- [ ] Images responsive
- [ ] Pas de distorsion
- [ ] Alt text présent

### Boutons
- [ ] Taille appropriée (min 44x44px)
- [ ] Espacement entre boutons
- [ ] Couleur de focus visible
- [ ] Pas de débordement

---

## ⚡ TESTS DE PERFORMANCE

### Temps de Chargement
- [ ] Page d'accueil: < 3s
- [ ] Page produit: < 2s
- [ ] Page panier: < 1s
- [ ] Page checkout: < 2s

### Scroll
- [ ] Pas de lag lors du scroll
- [ ] Images se chargent progressivement
- [ ] Animations fluides

### Clic
- [ ] Pas de lag lors du clic
- [ ] Feedback immédiat
- [ ] Pas de double-clic accidentel

### Réseau
- [ ] Fonctionne sur 4G
- [ ] Fonctionne sur 3G (lent mais OK)
- [ ] Gestion des erreurs réseau

---

## ♿ TESTS D'ACCESSIBILITÉ

### Clavier
- [ ] Navigation au clavier fonctionne
- [ ] Tab order logique
- [ ] Focus visible
- [ ] Pas de pièges au clavier

### Lecteur d'écran
- [ ] Tous les boutons ont un label
- [ ] Toutes les images ont un alt text
- [ ] Tous les formulaires ont des labels
- [ ] Les erreurs sont annoncées

### Contraste
- [ ] Texte/fond: ratio 4.5:1 minimum
- [ ] Boutons/fond: ratio 3:1 minimum
- [ ] Pas de couleur seule pour transmettre l'info

### Taille de Texte
- [ ] Texte lisible à 200% de zoom
- [ ] Pas de débordement à 200% de zoom
- [ ] Pas de perte de fonctionnalité

---

## 🔄 TESTS DE ROTATION

### Portrait → Paysage
- [ ] Layout s'adapte correctement
- [ ] Pas de débordement
- [ ] Éléments restent accessibles
- [ ] Pas de perte de données

### Paysage → Portrait
- [ ] Layout s'adapte correctement
- [ ] Pas de débordement
- [ ] Éléments restent accessibles
- [ ] Pas de perte de données

---

## 🌐 TESTS MULTI-NAVIGATEUR

### Chrome Mobile
- [ ] Tous les tests passent

### Firefox Mobile
- [ ] Tous les tests passent

### Safari Mobile (iOS)
- [ ] Tous les tests passent
- [ ] Pas de problèmes iOS spécifiques

### Samsung Internet
- [ ] Tous les tests passent

---

## 📊 CHECKLIST FINALE

### Visuel
- [ ] Tous les éléments visibles
- [ ] Pas de débordement
- [ ] Espacement correct
- [ ] Typographie lisible
- [ ] Couleurs OK
- [ ] Images OK

### Fonctionnel
- [ ] Tous les boutons cliquables
- [ ] Tous les formulaires fonctionnent
- [ ] Toutes les pages accessibles
- [ ] Pas d'erreurs console
- [ ] Pas d'erreurs 500

### Performance
- [ ] Temps de chargement OK
- [ ] Pas de lag
- [ ] Animations fluides
- [ ] Réseau OK

### Accessibilité
- [ ] Clavier OK
- [ ] Lecteur d'écran OK
- [ ] Contraste OK
- [ ] Zoom OK

### Responsive
- [ ] 375px OK
- [ ] 414px OK
- [ ] 768px OK
- [ ] 1024px+ OK

---

## 🎯 RÉSUMÉ

| Catégorie | Statut |
|-----------|--------|
| Visuel | ⏳ |
| Fonctionnel | ⏳ |
| Performance | ⏳ |
| Accessibilité | ⏳ |
| Responsive | ⏳ |

---

**Commencez par tester sur 375px!** 📱
