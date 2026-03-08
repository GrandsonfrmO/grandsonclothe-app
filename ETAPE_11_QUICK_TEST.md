# ÉTAPE 11 : TEST RAPIDE 🧪

## Avant de commencer

Assurez-vous que:
- ✅ Votre serveur Next.js est en cours d'exécution
- ✅ Votre base de données est connectée
- ✅ Vous êtes connecté en tant qu'administrateur

## Test 1: Gestion des Produits

### Ajouter un produit
1. Allez à `http://localhost:3000/admin/products`
2. Cliquez sur "Nouveau produit"
3. Remplissez:
   - Nom: "Test Produit"
   - Prix: "29.99"
   - Stock: "50"
   - Catégorie: "Test"
4. Cliquez "Créer"
5. ✅ Le produit doit apparaître dans la liste

### Modifier le produit
1. Cliquez sur l'icône "Modifier"
2. Changez le prix à "39.99"
3. Cliquez "Modifier"
4. ✅ Le prix doit être mis à jour

### Supprimer le produit
1. Cliquez sur l'icône "Supprimer"
2. Confirmez la suppression
3. ✅ Le produit doit disparaître

## Test 2: Gestion des Commandes

### Voir les commandes
1. Allez à `http://localhost:3000/admin/orders`
2. ✅ Vous devez voir une liste de commandes

### Changer le statut
1. Cliquez sur "Détails" pour une commande
2. Sélectionnez un nouveau statut
3. ✅ Le statut doit être mis à jour immédiatement

## Test 3: Gestion des Clients

### Voir les clients
1. Allez à `http://localhost:3000/admin/customers`
2. ✅ Vous devez voir une liste de clients

### Voir l'historique
1. Cliquez sur "Historique" pour un client
2. ✅ Vous devez voir ses commandes

## Test 4: Statistiques

### Voir les statistiques
1. Allez à `http://localhost:3000/admin/analytics`
2. ✅ Vous devez voir:
   - Revenu total
   - Nombre de commandes
   - Nombre de clients
   - Panier moyen
   - 3 graphiques

## Résultat

Si tous les tests passent ✅, l'ÉTAPE 11 est complète et fonctionnelle!
