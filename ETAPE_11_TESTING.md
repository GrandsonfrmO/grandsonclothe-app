# ÉTAPE 11 : GUIDE DE TEST COMPLET 🧪

## Avant de commencer

Assurez-vous que:
- ✅ Votre serveur Next.js est en cours d'exécution
- ✅ Votre base de données est connectée
- ✅ Vous avez des données de test dans la base de données

---

## Test 1: Gestion des Produits

### 1.1 Voir la liste des produits
**Étapes:**
1. Allez à `http://localhost:3000/admin/products`
2. Vous devez voir une liste de produits

**Résultat attendu:**
- ✅ La page se charge
- ✅ Les produits s'affichent dans un tableau
- ✅ Les colonnes sont: Nom, Catégorie, Prix, Stock, Actions

---

### 1.2 Rechercher un produit
**Étapes:**
1. Allez à `http://localhost:3000/admin/products`
2. Tapez un nom de produit dans la barre de recherche
3. Appuyez sur Entrée

**Résultat attendu:**
- ✅ La liste se filtre en temps réel
- ✅ Seuls les produits correspondants s'affichent
- ✅ La recherche est insensible à la casse

---

### 1.3 Ajouter un produit
**Étapes:**
1. Allez à `http://localhost:3000/admin/products`
2. Cliquez sur "Nouveau produit"
3. Remplissez le formulaire:
   - Nom: "Test Produit"
   - Description: "Description de test"
   - Prix: "29.99"
   - Stock: "50"
   - Catégorie: "Test"
   - Image URL: "https://example.com/image.jpg"
4. Cliquez "Créer"

**Résultat attendu:**
- ✅ La modale se ferme
- ✅ Le produit apparaît dans la liste
- ✅ Les données sont correctes

---

### 1.4 Modifier un produit
**Étapes:**
1. Allez à `http://localhost:3000/admin/products`
2. Cliquez sur l'icône "Modifier" pour le produit créé
3. Modifiez le prix à "39.99"
4. Cliquez "Modifier"

**Résultat attendu:**
- ✅ La modale se ferme
- ✅ Le prix est mis à jour dans la liste
- ✅ Les autres données restent inchangées

---

### 1.5 Supprimer un produit
**Étapes:**
1. Allez à `http://localhost:3000/admin/products`
2. Cliquez sur l'icône "Supprimer" pour le produit créé
3. Confirmez la suppression

**Résultat attendu:**
- ✅ La modale de confirmation s'affiche
- ✅ Après confirmation, le produit disparaît de la liste
- ✅ La liste se met à jour

---

## Test 2: Gestion des Commandes

### 2.1 Voir la liste des commandes
**Étapes:**
1. Allez à `http://localhost:3000/admin/orders`
2. Vous devez voir une liste de commandes

**Résultat attendu:**
- ✅ La page se charge
- ✅ Les commandes s'affichent dans un tableau
- ✅ Les colonnes sont: ID, Client, Montant, Statut, Date, Actions

---

### 2.2 Rechercher une commande
**Étapes:**
1. Allez à `http://localhost:3000/admin/orders`
2. Tapez un ID de commande dans la barre de recherche
3. Appuyez sur Entrée

**Résultat attendu:**
- ✅ La liste se filtre en temps réel
- ✅ Seules les commandes correspondantes s'affichent

---

### 2.3 Voir les détails d'une commande
**Étapes:**
1. Allez à `http://localhost:3000/admin/orders`
2. Cliquez sur "Détails" pour une commande

**Résultat attendu:**
- ✅ Une modale s'ouvre
- ✅ Les détails s'affichent: adresse, téléphone, montant
- ✅ Un sélecteur de statut est visible

---

### 2.4 Changer le statut d'une commande
**Étapes:**
1. Allez à `http://localhost:3000/admin/orders`
2. Cliquez sur "Détails" pour une commande
3. Sélectionnez un nouveau statut (ex: "shipped")
4. Vérifiez que le statut change

**Résultat attendu:**
- ✅ Le statut change immédiatement
- ✅ La modale se ferme
- ✅ Le badge de statut est mis à jour dans la liste
- ✅ La couleur du badge change

---

### 2.5 Vérifier les badges de statut
**Étapes:**
1. Allez à `http://localhost:3000/admin/orders`
2. Observez les badges de statut

**Résultat attendu:**
- ✅ pending: badge jaune
- ✅ processing: badge bleu
- ✅ shipped: badge violet
- ✅ delivered: badge vert
- ✅ cancelled: badge rouge

---

## Test 3: Gestion des Clients

### 3.1 Voir la liste des clients
**Étapes:**
1. Allez à `http://localhost:3000/admin/customers`
2. Vous devez voir une liste de clients

**Résultat attendu:**
- ✅ La page se charge
- ✅ Les clients s'affichent dans un tableau
- ✅ Les colonnes sont: Nom, Email, Commandes, Total dépensé, Inscrit, Actions

---

### 3.2 Rechercher un client
**Étapes:**
1. Allez à `http://localhost:3000/admin/customers`
2. Tapez un nom ou email dans la barre de recherche
3. Appuyez sur Entrée

**Résultat attendu:**
- ✅ La liste se filtre en temps réel
- ✅ Seuls les clients correspondants s'affichent

---

### 3.3 Voir l'historique d'un client
**Étapes:**
1. Allez à `http://localhost:3000/admin/customers`
2. Cliquez sur "Historique" pour un client

**Résultat attendu:**
- ✅ Une modale s'ouvre
- ✅ Les informations du client s'affichent
- ✅ L'historique des commandes s'affiche
- ✅ Chaque commande affiche: ID, date, montant, statut

---

### 3.4 Vérifier les totaux
**Étapes:**
1. Allez à `http://localhost:3000/admin/customers`
2. Observez les colonnes "Commandes" et "Total dépensé"

**Résultat attendu:**
- ✅ Le nombre de commandes est correct
- ✅ Le total dépensé est correct
- ✅ Les montants sont formatés en euros

---

## Test 4: Statistiques et Graphiques

### 4.1 Voir les KPIs
**Étapes:**
1. Allez à `http://localhost:3000/admin/analytics`
2. Observez les 4 cartes de KPIs

**Résultat attendu:**
- ✅ Revenu total s'affiche
- ✅ Nombre de commandes s'affiche
- ✅ Nombre de clients s'affiche
- ✅ Panier moyen s'affiche
- ✅ Les icônes s'affichent

---

### 4.2 Voir le graphique revenu par jour
**Étapes:**
1. Allez à `http://localhost:3000/admin/analytics`
2. Observez le graphique "Revenu par jour"

**Résultat attendu:**
- ✅ Le graphique s'affiche
- ✅ Les 7 derniers jours s'affichent
- ✅ Les valeurs de revenu s'affichent
- ✅ Le graphique est interactif

---

### 4.3 Voir le graphique commandes par statut
**Étapes:**
1. Allez à `http://localhost:3000/admin/analytics`
2. Observez le graphique "Commandes par statut"

**Résultat attendu:**
- ✅ Le graphique en camembert s'affiche
- ✅ Les statuts s'affichent avec les couleurs
- ✅ Les nombres s'affichent
- ✅ Le graphique est interactif

---

### 4.4 Voir le graphique produits les plus vendus
**Étapes:**
1. Allez à `http://localhost:3000/admin/analytics`
2. Observez le graphique "Produits les plus vendus"

**Résultat attendu:**
- ✅ Le graphique en barres s'affiche
- ✅ Les top 5 produits s'affichent
- ✅ Les nombres de ventes s'affichent
- ✅ Le graphique est interactif

---

## Test 5: Performance et UX

### 5.1 Performance des pages
**Étapes:**
1. Allez à `/admin/products`
2. Observez le temps de chargement
3. Répétez pour les autres pages

**Résultat attendu:**
- ✅ Les pages se chargent rapidement (< 2 secondes)
- ✅ Pas de lag ou de ralentissement
- ✅ Les graphiques ne ralentissent pas

---

### 5.2 Responsivité mobile
**Étapes:**
1. Ouvrez les outils de développement (F12)
2. Activez le mode mobile
3. Naviguez dans l'admin panel

**Résultat attendu:**
- ✅ L'interface s'adapte au mobile
- ✅ Les tableaux sont lisibles
- ✅ Les boutons sont cliquables
- ✅ Les graphiques s'affichent correctement

---

### 5.3 Gestion des erreurs
**Étapes:**
1. Arrêtez la base de données
2. Essayez de charger une page admin
3. Observez le message d'erreur

**Résultat attendu:**
- ✅ Un message d'erreur s'affiche
- ✅ L'interface ne plante pas
- ✅ L'utilisateur peut revenir en arrière

---

## Test 6: Validation des données

### 6.1 Validation du formulaire produit
**Étapes:**
1. Allez à `/admin/products`
2. Cliquez sur "Nouveau produit"
3. Essayez de soumettre sans remplir les champs requis

**Résultat attendu:**
- ✅ Le formulaire ne se soumet pas
- ✅ Les champs requis sont marqués
- ✅ Un message d'erreur s'affiche

---

### 6.2 Validation des prix
**Étapes:**
1. Allez à `/admin/products`
2. Cliquez sur "Nouveau produit"
3. Entrez un prix invalide (ex: "abc")

**Résultat attendu:**
- ✅ Le champ refuse les caractères non numériques
- ✅ Seuls les nombres décimaux sont acceptés

---

## Checklist finale

### Produits
- [ ] Liste affichée
- [ ] Recherche fonctionnelle
- [ ] Ajouter fonctionnel
- [ ] Modifier fonctionnel
- [ ] Supprimer fonctionnel
- [ ] Stock affiché

### Commandes
- [ ] Liste affichée
- [ ] Recherche fonctionnelle
- [ ] Détails affichés
- [ ] Statut modifiable
- [ ] Badges colorés
- [ ] Mise à jour en temps réel

### Clients
- [ ] Liste affichée
- [ ] Recherche fonctionnelle
- [ ] Nombre de commandes
- [ ] Total dépensé
- [ ] Historique visible
- [ ] Détails complets

### Statistiques
- [ ] KPIs affichés
- [ ] Graphique revenu
- [ ] Graphique statuts
- [ ] Graphique produits
- [ ] Données en temps réel
- [ ] Mise à jour automatique

### Performance
- [ ] Pages rapides
- [ ] Pas de lag
- [ ] Mobile responsive
- [ ] Gestion des erreurs

---

## Résultat

Si tous les tests passent ✅, l'ÉTAPE 11 est complète et fonctionnelle!

🎉 Prêt pour la production!

