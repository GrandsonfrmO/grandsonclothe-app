# Flux de Gestion des Commandes

## Vue d'ensemble

Le système de gestion des commandes comprend un flux complet avec validation, confirmation et suivi des commandes.

## Flux de Commande

### 1. **Création de Commande (Client)**
- Le client passe une commande via le checkout
- **Email envoyé**: Email de validation de commande
- **Notification**: Notification in-app pour le client
- **Statut**: `pending` (En attente)

### 2. **Validation par l'Admin**
- L'admin accède à `/admin/orders`
- Clique sur "Voir détails" pour une commande en attente
- Peut ajouter des notes internes (optionnel)
- Clique sur "Valider et Confirmer"
- **Email envoyé**: Email de confirmation de commande au client
- **Notification**: Notification in-app pour le client
- **Statut**: `processing` (En traitement)

### 3. **Expédition**
- L'admin clique sur "Expédier"
- **Email envoyé**: Email d'expédition avec numéro de suivi
- **Notification**: Notification in-app pour le client
- **Statut**: `shipped` (Expédiée)

### 4. **Livraison**
- L'admin clique sur "Marquer livrée"
- **Notification**: Notification in-app pour le client
- **Statut**: `delivered` (Livrée)

### 5. **Annulation (optionnel)**
- L'admin peut annuler une commande à tout moment (sauf si déjà livrée)
- **Notification**: Notification in-app pour le client
- **Statut**: `cancelled` (Annulée)

## Emails Envoyés

### Email 1: Validation de Commande (Automatique)
- **Destinataire**: Client
- **Déclencheur**: Création de commande
- **Contenu**:
  - Numéro de commande
  - Liste des produits avec images
  - Montant total
  - Adresse de livraison
  - Mode de paiement

### Email 2: Confirmation par l'Admin
- **Destinataire**: Client
- **Déclencheur**: Admin valide la commande (statut → processing)
- **Contenu**:
  - Confirmation que la commande est validée
  - Liste des produits
  - Montant total
  - Adresse de livraison
  - Estimation de livraison (24-48 heures)

### Email 3: Expédition
- **Destinataire**: Client
- **Déclencheur**: Admin marque comme expédiée (statut → shipped)
- **Contenu**:
  - Confirmation d'expédition
  - Numéro de suivi (si disponible)
  - Estimation de livraison

## Interface Admin

### Page de Gestion des Commandes

**Localisation**: `/admin/orders`

**Fonctionnalités**:
- 📊 Statistiques en temps réel
  - Total de commandes
  - Revenu total
  - Commandes en attente
  - Commandes livrées

- 🔍 Recherche et Filtrage
  - Recherche par ID, client ou adresse
  - Filtrage par statut

- 📋 Liste des Commandes
  - Affichage des commandes avec statut
  - Aperçu des produits
  - Informations client

- 👁️ Modal de Détails
  - Informations complètes du client
  - Adresse de livraison
  - Liste détaillée des produits
  - Résumé financier
  - Notes admin (si existantes)
  - Formulaire de validation (pour commandes en attente)

### Actions Disponibles

| Statut | Actions Disponibles |
|--------|-------------------|
| **pending** | Confirmer, Annuler, Voir détails |
| **processing** | Expédier, Annuler, Voir détails |
| **shipped** | Marquer livrée, Voir détails |
| **delivered** | Voir détails |
| **cancelled** | Voir détails |

## Notes Admin

Les admins peuvent ajouter des notes internes lors de la validation d'une commande:
- Notes visibles uniquement par les admins
- Utiles pour les instructions spéciales, problèmes, etc.
- Affichées dans le modal de détails

## Notifications In-App

Les clients reçoivent des notifications in-app pour:
- ✓ Création de commande
- ✓ Confirmation par l'admin
- ✓ Expédition
- ✓ Livraison
- ✓ Annulation

## Configuration Requise

### Variables d'Environnement
```
RESEND_API_KEY=votre_clé_api_resend
RESEND_FROM_EMAIL=noreply@votredomaine.com
NEXT_PUBLIC_API_URL=https://votredomaine.com
```

### Base de Données
La colonne `admin_notes` doit être ajoutée à la table `orders`:
```sql
ALTER TABLE orders ADD COLUMN admin_notes TEXT;
```

Ou exécuter la migration via:
```bash
POST /api/admin/migrate-admin-notes
```

## Dépannage

### Les emails ne sont pas envoyés
1. Vérifier que `RESEND_API_KEY` est configuré
2. Vérifier les logs pour les erreurs
3. Les emails ne bloquent pas la création de commande

### Les notes admin ne s'affichent pas
1. Vérifier que la migration a été exécutée
2. Vérifier que la colonne `admin_notes` existe dans la table `orders`

### Les notifications in-app ne s'affichent pas
1. Vérifier que l'utilisateur est connecté
2. Vérifier que la table `notifications` existe
3. Vérifier les logs pour les erreurs

## Fichiers Modifiés

- `lib/email.ts` - Ajout de `sendOrderConfirmedByAdminEmail()`
- `app/api/orders/[id]/route.ts` - Logique de confirmation avec email
- `app/admin/orders/page.tsx` - Interface améliorée avec modal de validation
- `lib/db/schema.ts` - Ajout de la colonne `adminNotes`
- `app/api/admin/migrate-admin-notes/route.ts` - Route de migration

## Prochaines Étapes

1. Exécuter la migration pour ajouter la colonne `admin_notes`
2. Tester le flux complet de commande
3. Configurer les emails Resend
4. Former les admins à utiliser la nouvelle interface
