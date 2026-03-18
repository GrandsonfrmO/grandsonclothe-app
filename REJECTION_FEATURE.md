# Fonctionnalité de Refus de Commande

## 📋 Vue d'ensemble

Le système permet aux admins de refuser une commande en attente avec une raison spécifique. Un email de notification est automatiquement envoyé au client.

## 🔄 Flux de Refus

```
Admin → /admin/orders → Voir Détails (Commande en attente)
                              ↓
                    Cliquer "Refuser"
                              ↓
                    Entrer la raison du refus
                              ↓
                    Cliquer "Confirmer le Refus"
                              ↓
                    ✅ Commande Refusée
                              ↓
        Email: Notification de refus → Client
        Notification: Commande refusée → Client
        Statut: cancelled
        Raison: Sauvegardée dans rejection_reason
```

## 📧 Email de Refus

### Contenu

- **Destinataire**: Client
- **Sujet**: ⚠️ Votre commande #123 a été refusée
- **Contenu**:
  - Notification du refus
  - Raison du refus
  - Numéro de commande
  - Montant de la commande
  - Prochaines étapes (aucun paiement effectué)
  - Lien de contact support

### Template

Le template est défini dans `lib/email.ts`:
- Fonction: `getOrderRejectedTemplate()`
- Fonction d'envoi: `sendOrderRejectedEmail()`

## 🎯 Raisons Courantes de Refus

- Stock insuffisant
- Adresse de livraison invalide
- Informations client incomplètes
- Problème de paiement
- Commande dupliquée
- Produit indisponible
- Autres raisons spécifiques

## 🔧 Implémentation

### Base de Données

#### Nouvelle Colonne: `rejection_reason`

```sql
ALTER TABLE orders ADD COLUMN rejection_reason TEXT;
```

**Propriétés**:
- **Nom**: `rejection_reason`
- **Type**: `TEXT`
- **Nullable**: Oui
- **Description**: Raison du refus de la commande

### API

#### Route: `PATCH /api/orders/[id]`

**Paramètres**:
```json
{
  "status": "cancelled",
  "rejectionReason": "Stock insuffisant pour ce produit"
}
```

**Réponse**:
```json
{
  "id": 123,
  "status": "cancelled",
  "rejectionReason": "Stock insuffisant pour ce produit",
  "updatedAt": "2024-03-09T12:00:00Z"
}
```

### Interface Admin

#### Modal de Détails

**Avant refus**:
- Bouton "Valider et Confirmer"
- Bouton "Refuser"

**Après clic sur "Refuser"**:
- Formulaire de refus avec champ de raison
- Bouton "Confirmer le Refus"
- Bouton "Annuler"

**Après refus**:
- Affichage de la raison du refus
- Statut: Refusée

## 📱 Interface Admin

### Page: `/admin/orders`

#### Modal de Détails - Commande en Attente

```
┌─────────────────────────────────────────────────────────────┐
│ Détails de la commande #123                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Informations client, produits, etc.]                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Valider cette commande                              │   │
│ │ Confirmez la commande et envoyez un email...        │   │
│ │                                                     │   │
│ │ Notes (optionnel):                                  │   │
│ │ [_________________________________]                │   │
│ │                                                     │   │
│ │ [Valider et Confirmer] [Refuser]                   │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Modal de Détails - Formulaire de Refus

```
┌─────────────────────────────────────────────────────────────┐
│ Détails de la commande #123                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Informations client, produits, etc.]                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ ⚠️ Refuser cette commande                            │   │
│ │ Veuillez entrer une raison pour le refus...         │   │
│ │                                                     │   │
│ │ Raison du refus *:                                  │   │
│ │ [_________________________________]                │   │
│ │ [_________________________________]                │   │
│ │ [_________________________________]                │   │
│ │                                                     │   │
│ │ [Confirmer le Refus] [Annuler]                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Modal de Détails - Commande Refusée

```
┌─────────────────────────────────────────────────────────────┐
│ Détails de la commande #123                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Informations client, produits, etc.]                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Raison du Refus                                     │   │
│ │ Stock insuffisant pour ce produit                   │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Statut: Refusée                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔔 Notifications

### Email de Refus

**Destinataire**: Client
**Déclencheur**: Admin refuse la commande
**Contenu**:
- Notification du refus
- Raison du refus
- Détails de la commande
- Prochaines étapes

### Notification In-App

**Destinataire**: Client
**Type**: `order_cancelled`
**Message**: "Votre commande #123 a été refusée. Raison: [raison]"

## 🗄️ Base de Données

### Schéma

```sql
CREATE TABLE orders (
  -- ... autres colonnes ...
  rejection_reason TEXT,  -- NOUVELLE COLONNE
  -- ... autres colonnes ...
);
```

### Migration

**Option 1: Via API**
```bash
curl -X POST http://localhost:3000/api/admin/migrate-rejection-reason
```

**Option 2: Via Script**
```bash
node scripts/add-rejection-reason-to-orders.js
```

**Option 3: Directement en SQL**
```bash
psql -d votredb -c "ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT;"
```

## 📊 Données

### Exemple de Commande Refusée

```json
{
  "id": 123,
  "userId": 5,
  "guestEmail": null,
  "guestName": null,
  "status": "cancelled",
  "totalAmount": 50000,
  "paymentStatus": "pending",
  "paymentMethod": "cash_on_delivery",
  "deliveryAddress": "123 Rue de Test, Conakry",
  "phoneNumber": "+224612345678",
  "deliveryZoneId": 1,
  "adminNotes": null,
  "rejectionReason": "Stock insuffisant pour ce produit",
  "createdAt": "2024-03-09T10:00:00Z",
  "updatedAt": "2024-03-09T12:00:00Z"
}
```

## 🔐 Sécurité

- ✅ Seuls les admins peuvent refuser les commandes
- ✅ La raison du refus est enregistrée pour l'audit
- ✅ Un email est envoyé au client
- ✅ La notification in-app informe le client

## 🧪 Tests

### Test Manuel

1. Créer une commande
2. Aller sur `/admin/orders`
3. Cliquer sur "Voir détails"
4. Cliquer sur "Refuser"
5. Entrer une raison
6. Cliquer sur "Confirmer le Refus"
7. Vérifier que:
   - La commande est marquée comme refusée
   - L'email est envoyé au client
   - La notification in-app s'affiche
   - La raison est sauvegardée

### Test Automatisé

```bash
# Ajouter un test dans scripts/test-order-workflow.js
```

## 📈 Métriques

### À Surveiller

- Nombre de commandes refusées
- Raisons les plus courantes de refus
- Taux de refus par jour/semaine/mois
- Temps moyen avant refus

### Requête SQL

```sql
-- Nombre de commandes refusées
SELECT COUNT(*) FROM orders WHERE status = 'cancelled' AND rejection_reason IS NOT NULL;

-- Raisons les plus courantes
SELECT rejection_reason, COUNT(*) as count 
FROM orders 
WHERE status = 'cancelled' AND rejection_reason IS NOT NULL
GROUP BY rejection_reason
ORDER BY count DESC;

-- Taux de refus
SELECT 
  COUNT(CASE WHEN status = 'cancelled' AND rejection_reason IS NOT NULL THEN 1 END) as refused,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(CASE WHEN status = 'cancelled' AND rejection_reason IS NOT NULL THEN 1 END) / COUNT(*), 2) as percentage
FROM orders;
```

## 🔄 Transitions de Statut

### Avant Refus

```
pending → processing (Validation)
pending → cancelled (Refus)
```

### Après Refus

```
cancelled (Refusée)
  ├─ rejectionReason: "Stock insuffisant"
  └─ Email envoyé au client
```

## 📝 Fichiers Modifiés/Créés

### Modifiés

1. **lib/email.ts**
   - Ajout: `getOrderRejectedTemplate()`
   - Ajout: `sendOrderRejectedEmail()`

2. **app/api/orders/[id]/route.ts**
   - Modification: Accepte `rejectionReason` en paramètre
   - Modification: Envoie email de refus quand status → cancelled
   - Modification: Crée notification in-app

3. **app/admin/orders/page.tsx**
   - Modification: Ajout du formulaire de refus
   - Modification: Ajout de la fonction `handleRejectOrder()`
   - Modification: Affichage de la raison du refus

4. **lib/db/schema.ts**
   - Modification: Ajout de la colonne `rejectionReason`

### Créés

1. **app/api/admin/migrate-rejection-reason/route.ts**
   - Route API pour la migration

2. **scripts/add-rejection-reason-to-orders.js**
   - Script de migration

3. **REJECTION_FEATURE.md** (ce fichier)
   - Documentation de la fonctionnalité

## 🚀 Déploiement

### Checklist

- [ ] Exécuter la migration
- [ ] Vérifier que la colonne existe
- [ ] Tester le refus d'une commande
- [ ] Vérifier que l'email est envoyé
- [ ] Vérifier que la notification s'affiche
- [ ] Former les admins

### Commandes

```bash
# Migration
curl -X POST https://votredomaine.com/api/admin/migrate-rejection-reason

# Vérification
psql -d votredb -c "SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='rejection_reason';"
```

## 🎓 Formation Admin

### Points Clés

1. **Quand refuser une commande**
   - Stock insuffisant
   - Adresse invalide
   - Informations incomplètes
   - Autres raisons valides

2. **Comment refuser**
   - Cliquer sur "Voir détails"
   - Cliquer sur "Refuser"
   - Entrer une raison claire
   - Cliquer sur "Confirmer le Refus"

3. **Après le refus**
   - Client reçoit un email
   - Client reçoit une notification
   - Commande marquée comme refusée
   - Raison enregistrée pour l'audit

## 📞 Support

Pour toute question:
1. Consulter cette documentation
2. Vérifier les logs
3. Tester avec une commande de test
4. Vérifier les configurations

## 🔄 Prochaines Améliorations

1. Ajouter des raisons prédéfinies
2. Ajouter un système de remboursement
3. Ajouter un système de réessai
4. Ajouter des rapports de refus
5. Ajouter des notifications SMS
