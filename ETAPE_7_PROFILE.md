# TAPE 7 : CRÉER PAGE PROFIL 👤

## Vue d'ensemble
Création d'un système complet de gestion de profil utilisateur avec historique des commandes, suivi de livraison, et paramètres personnalisés.

**Durée estimée:** 1h

---

## 7.1 Page Profil Principal (`/app/profile/page.tsx`)

### Fonctionnalités
✅ **Affichage des informations utilisateur**
- Nom et email
- Lien vers les paramètres pour modification

✅ **Statistiques rapides**
- Nombre total de commandes
- Nombre de commandes livrées

✅ **Historique des commandes**
- Tableau avec ID, date, montant, statut
- Badges de statut avec couleurs
- Lien vers détails de chaque commande

✅ **Adresses sauvegardées**
- Section pour gérer les adresses
- Lien vers les paramètres

### Structure
```
/app/profile/
├── page.tsx (profil principal)
├── orders/
│   └── [id]/
│       └── page.tsx (détail commande)
└── settings/
    └── page.tsx (paramètres)
```

### Statuts de commande
- `pending` → En attente (jaune)
- `processing` → En traitement (bleu)
- `shipped` → Expédié (violet)
- `delivered` → Livré (vert)
- `cancelled` → Annulé (rouge)

---

## 7.2 Page Détail Commande (`/app/profile/orders/[id]/page.tsx`)

### Fonctionnalités
✅ **Suivi de livraison**
- Timeline visuelle avec 4 étapes
- Indicateur de progression
- Statut actuel et date de mise à jour

✅ **Détails de la commande**
- Liste des articles avec quantités et prix
- Adresse de livraison
- Numéro de téléphone
- Méthode et statut de paiement

✅ **Montant total**
- Affichage en évidence

✅ **Retour et remboursement**
- Disponible pendant 30 jours après livraison
- Formulaire avec raisons de retour:
  - Produit défectueux
  - Ne correspond pas à la description
  - Mauvais article reçu
  - J'ai changé d'avis
  - Autre

### Logique
- Bouton "Demander un retour" visible si:
  - Statut = "delivered"
  - Moins de 30 jours depuis la création
- Formulaire caché par défaut, affichage au clic

---

## 7.3 Page Paramètres (`/app/profile/settings/page.tsx`)

### Onglets

#### 1. Profil
Modification des informations personnelles:
- Nom complet
- Email
- Adresse de livraison par défaut
- Numéro de téléphone

#### 2. Mot de passe
Changement sécurisé du mot de passe:
- Mot de passe actuel (validation)
- Nouveau mot de passe (min 6 caractères)
- Confirmation du mot de passe
- Validation de correspondance

#### 3. Préférences
Gestion des communications:
- ☑️ Infolettre (défaut: activé)
- ☑️ Notifications par email (défaut: activé)
- ☑️ Mises à jour par SMS (défaut: désactivé)

#### Zone de danger
- Suppression de compte (action permanente)

### Gestion des états
- Messages de succès (vert, 3s)
- Messages d'erreur (rouge, persistant)
- Boutons désactivés pendant le traitement
- Validation côté client

---

## Intégration avec les APIs existantes

### Endpoints utilisés
```
GET /api/auth/me
- Récupère l'utilisateur actuel

GET /api/orders?userId={id}
- Récupère toutes les commandes de l'utilisateur

GET /api/orders?orderId={id}
- Récupère les détails d'une commande spécifique
```

### Endpoints à implémenter (TODO)
```
PUT /api/auth/profile
- Mise à jour du profil utilisateur

PUT /api/auth/password
- Changement du mot de passe

PUT /api/auth/preferences
- Mise à jour des préférences

POST /api/orders/{id}/return
- Demande de retour/remboursement

DELETE /api/auth/account
- Suppression du compte
```

---

## Sécurité

✅ **Protection des routes**
- Redirection vers login si non authentifié
- Vérification du statut d'authentification

✅ **Validation des données**
- Validation des mots de passe (min 6 caractères)
- Correspondance des mots de passe
- Validation des emails

✅ **Gestion des erreurs**
- Try/catch sur les appels API
- Messages d'erreur utilisateur-friendly

---

## Améliorations futures

1. **Adresses multiples**
   - Ajouter/modifier/supprimer des adresses
   - Définir une adresse par défaut

2. **Historique des retours**
   - Afficher les demandes de retour
   - Statut du remboursement

3. **Notifications**
   - Intégration avec système de notifications
   - Historique des notifications

4. **Wishlist**
   - Ajouter des produits favoris
   - Partager la wishlist

5. **Authentification 2FA**
   - Activation/désactivation
   - Codes de secours

6. **Téléchargement des factures**
   - PDF des commandes
   - Historique des factures

---

## Fichiers créés/modifiés

### Créés
- ✅ `app/profile/page.tsx` - Page profil principal
- ✅ `app/profile/orders/[id]/page.tsx` - Détail commande
- ✅ `app/profile/settings/page.tsx` - Paramètres

### Modifiés
- ✅ `app/profile/page.tsx` - Remplacé par version améliorée

---

## Checklist de vérification

- ✅ Authentification requise sur toutes les pages
- ✅ Affichage des informations utilisateur
- ✅ Historique des commandes avec statuts
- ✅ Détails de commande avec timeline
- ✅ Formulaire de retour/remboursement
- ✅ Modification du profil
- ✅ Changement de mot de passe
- ✅ Gestion des préférences
- ✅ Messages de succès/erreur
- ✅ Responsive design
- ✅ Navigation cohérente

---

## Prochaines étapes

1. Implémenter les APIs manquantes (PUT/DELETE endpoints)
2. Ajouter la gestion des adresses multiples
3. Implémenter le système de retour/remboursement
4. Ajouter les notifications en temps réel
5. Tester sur mobile et desktop
