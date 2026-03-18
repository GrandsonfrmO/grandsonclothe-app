# Diagramme du Flux de Commande

## 📊 Flux Complet

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUX DE GESTION DES COMMANDES                    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ 1️⃣  CLIENT PASSE UNE COMMANDE                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Client → Checkout → Créer Commande                                 │
│                           ↓                                          │
│                    POST /api/orders                                  │
│                           ↓                                          │
│                  ✅ Commande Créée (#123)                            │
│                           ↓                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ACTIONS AUTOMATIQUES:                                       │   │
│  │ • Email: Validation de commande → Client                   │   │
│  │ • Notification: Commande créée → Client                    │   │
│  │ • Notification: Nouvelle commande → Admin                  │   │
│  │ • Statut: pending                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ 2️⃣  ADMIN VALIDE LA COMMANDE                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Admin → /admin/orders → Voir Détails                               │
│                           ↓                                          │
│                    Modal de Détails                                  │
│                           ↓                                          │
│              Ajouter Notes (Optionnel)                               │
│                           ↓                                          │
│          Cliquer "Valider et Confirmer"                             │
│                           ↓                                          │
│              PATCH /api/orders/123                                   │
│              { status: "processing", adminNotes: "..." }            │
│                           ↓                                          │
│              ✅ Commande Validée                                     │
│                           ↓                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ACTIONS AUTOMATIQUES:                                       │   │
│  │ • Email: Confirmation de commande → Client                 │   │
│  │ • Notification: Commande confirmée → Client                │   │
│  │ • Statut: processing                                        │   │
│  │ • Notes: Sauvegardées dans admin_notes                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ 3️⃣  ADMIN MARQUE COMME EXPÉDIÉE                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Admin → /admin/orders → Cliquer "Expédier"                         │
│                           ↓                                          │
│              PATCH /api/orders/123                                   │
│              { status: "shipped" }                                   │
│                           ↓                                          │
│              ✅ Commande Expédiée                                    │
│                           ↓                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ACTIONS AUTOMATIQUES:                                       │   │
│  │ • Email: Expédition → Client                               │   │
│  │ • Notification: Commande expédiée → Client                 │   │
│  │ • Statut: shipped                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ 4️⃣  ADMIN MARQUE COMME LIVRÉE                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Admin → /admin/orders → Cliquer "Marquer livrée"                   │
│                           ↓                                          │
│              PATCH /api/orders/123                                   │
│              { status: "delivered" }                                 │
│                           ↓                                          │
│              ✅ Commande Livrée                                      │
│                           ↓                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ACTIONS AUTOMATIQUES:                                       │   │
│  │ • Notification: Commande livrée → Client                   │   │
│  │ • Statut: delivered                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ ❌ ADMIN ANNULE LA COMMANDE (À TOUT MOMENT)                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Admin → /admin/orders → Cliquer "Annuler"                          │
│                           ↓                                          │
│              Confirmer l'Annulation                                  │
│                           ↓                                          │
│              PATCH /api/orders/123                                   │
│              { status: "cancelled" }                                 │
│                           ↓                                          │
│              ✅ Commande Annulée                                     │
│                           ↓                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ACTIONS AUTOMATIQUES:                                       │   │
│  │ • Notification: Commande annulée → Client                  │   │
│  │ • Statut: cancelled                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 📧 Emails Envoyés

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EMAILS ENVOYÉS                               │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  EMAIL DE VALIDATION (Automatique)
   ├─ Déclencheur: Création de commande
   ├─ Destinataire: Client
   ├─ Sujet: ✓ Confirmation de commande #123
   └─ Contenu:
      ├─ Numéro de commande
      ├─ Liste des produits avec images
      ├─ Montant total
      ├─ Adresse de livraison
      ├─ Mode de paiement
      └─ Prochaines étapes

2️⃣  EMAIL DE CONFIRMATION (Quand admin valide)
   ├─ Déclencheur: Admin valide (status → processing)
   ├─ Destinataire: Client
   ├─ Sujet: ✓ Votre commande #123 a été confirmée
   └─ Contenu:
      ├─ Confirmation de validation
      ├─ Liste des produits
      ├─ Montant total
      ├─ Adresse de livraison
      └─ Estimation de livraison (24-48h)

3️⃣  EMAIL D'EXPÉDITION (Quand admin marque expédié)
   ├─ Déclencheur: Admin marque expédié (status → shipped)
   ├─ Destinataire: Client
   ├─ Sujet: Votre commande #123 est en route
   └─ Contenu:
      ├─ Confirmation d'expédition
      ├─ Numéro de suivi (si disponible)
      └─ Estimation de livraison
```

## 🔔 Notifications In-App

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATIONS IN-APP                             │
└─────────────────────────────────────────────────────────────────────┘

CLIENT:
├─ ✓ Commande créée (#123)
├─ ✓ Commande confirmée par l'admin
├─ ✓ Commande expédiée
├─ ✓ Commande livrée
└─ ✓ Commande annulée

ADMIN:
├─ ✓ Nouvelle commande (#123) de [Client]
└─ (Autres notifications selon les besoins)
```

## 🗄️ Base de Données

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STRUCTURE DE DONNÉES                             │
└─────────────────────────────────────────────────────────────────────┘

TABLE: orders
├─ id (PK)
├─ user_id (FK)
├─ guestEmail
├─ guestName
├─ status: pending → processing → shipped → delivered
├─ totalAmount
├─ paymentStatus
├─ paymentMethod
├─ deliveryAddress
├─ phoneNumber
├─ deliveryZoneId (FK)
├─ adminNotes ← NOUVELLE COLONNE
├─ createdAt
└─ updatedAt

TABLE: orderItems
├─ id (PK)
├─ orderId (FK)
├─ productId (FK)
├─ quantity
└─ price

TABLE: notifications
├─ id (PK)
├─ userId (FK)
├─ type
├─ title
├─ message
├─ orderId (FK)
├─ actionUrl
├─ read
├─ createdAt
└─ updatedAt
```

## 🔄 Transitions de Statut

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRANSITIONS DE STATUT                            │
└─────────────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   pending   │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │processing│  │cancelled │  │cancelled │
         └────┬─────┘  └──────────┘  └──────────┘
              │
              ▼
         ┌──────────┐
         │ shipped  │
         └────┬─────┘
              │
              ▼
         ┌──────────┐
         │delivered │
         └──────────┘

Règles:
• pending → processing (Admin valide)
• pending → cancelled (Admin annule)
• processing → shipped (Admin expédie)
• processing → cancelled (Admin annule)
• shipped → delivered (Admin marque livrée)
• shipped → cancelled (Admin annule)
• delivered → (Aucune transition)
• cancelled → (Aucune transition)
```

## 🎯 Points Clés

```
✅ Automatisation
   • Emails envoyés automatiquement
   • Notifications créées automatiquement
   • Pas d'action manuelle requise

✅ Traçabilité
   • Chaque action est enregistrée
   • Notes admin pour les instructions spéciales
   • Historique complet des statuts

✅ Communication
   • Client informé à chaque étape
   • Admin a une vue complète
   • Pas de confusion sur le statut

✅ Flexibilité
   • Admin peut annuler à tout moment
   • Admin peut ajouter des notes
   • Système extensible pour futures améliorations
```

## 📱 Interface Admin

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PAGE: /admin/orders                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ STATISTIQUES                                                        │
├─────────────────────────────────────────────────────────────────────┤
│ Total: 150 | Revenu: 7,500,000 GNF | En attente: 12 | Livrées: 138│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ FILTRES                                                             │
├─────────────────────────────────────────────────────────────────────┤
│ Recherche: [________________] | Statut: [Tous ▼]                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ LISTE DES COMMANDES                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ #123 | Client: John Doe | 50,000 GNF | En attente         │   │
│ │ [Voir détails] [Confirmer] [Annuler]                       │   │
│ └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ #122 | Client: Jane Smith | 75,000 GNF | En traitement    │   │
│ │ [Voir détails] [Expédier] [Annuler]                        │   │
│ └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ MODAL: DÉTAILS DE LA COMMANDE                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Commande #123                                                       │
│                                                                     │
│ CLIENT:                                                             │
│ ├─ Nom: John Doe                                                   │
│ ├─ Email: john@example.com                                         │
│ ├─ Téléphone: +224612345678                                        │
│ └─ Statut: En attente                                              │
│                                                                     │
│ LIVRAISON:                                                          │
│ └─ Adresse: 123 Rue de Test, Conakry                               │
│                                                                     │
│ PRODUITS:                                                           │
│ ├─ Produit 1 × 2 = 50,000 GNF                                      │
│ └─ Total: 50,000 GNF                                               │
│                                                                     │
│ VALIDATION:                                                         │
│ ├─ Notes: [Ajouter des notes...]                                   │
│ └─ [Valider et Confirmer] [Fermer]                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🚀 Déploiement

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHECKLIST DE DÉPLOIEMENT                         │
└─────────────────────────────────────────────────────────────────────┘

1. Configuration
   ☐ RESEND_API_KEY configuré
   ☐ RESEND_FROM_EMAIL configuré
   ☐ NEXT_PUBLIC_API_URL configuré

2. Base de Données
   ☐ Migration exécutée
   ☐ Colonne admin_notes créée
   ☐ Données existantes intactes

3. Tests
   ☐ Test de création de commande
   ☐ Test de validation par admin
   ☐ Test d'emails
   ☐ Test de notifications

4. Production
   ☐ Déployer le code
   ☐ Exécuter les migrations
   ☐ Vérifier les logs
   ☐ Former les admins

5. Monitoring
   ☐ Surveiller les emails
   ☐ Surveiller les notifications
   ☐ Surveiller les erreurs
   ☐ Surveiller les performances
```
