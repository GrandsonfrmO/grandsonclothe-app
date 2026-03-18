# Guide Rapide - Système de Validation de Commandes

## ⚡ Démarrage Rapide (5 minutes)

### 1. Configuration (2 min)

Ajouter à `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@votredomaine.com
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Migrations (1 min)

```bash
# Migration 1: Notes admin
curl -X POST http://localhost:3000/api/admin/migrate-admin-notes

# Migration 2: Raison de refus
curl -X POST http://localhost:3000/api/admin/migrate-rejection-reason

# Ou via SQL
psql -d votredb -c "ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT; ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT;"
```

### 3. Test (2 min)

```bash
node scripts/test-order-workflow.js
```

## 🎯 Utilisation

### Pour les Clients

1. Passer une commande via checkout
2. Recevoir email de validation
3. Attendre la confirmation de l'admin
4. Recevoir email de confirmation (ou refus)

### Pour les Admins

#### Valider une Commande

1. Aller sur `/admin/orders`
2. Cliquer sur "Voir détails" pour une commande en attente
3. Ajouter des notes (optionnel)
4. Cliquer sur "Valider et Confirmer"
5. Client reçoit email de confirmation

#### Refuser une Commande

1. Aller sur `/admin/orders`
2. Cliquer sur "Voir détails" pour une commande en attente
3. Cliquer sur "Refuser"
4. Entrer une raison de refus
5. Cliquer sur "Confirmer le Refus"
6. Client reçoit email de refus

## 📧 Emails Envoyés

| Moment | Destinataire | Contenu |
|--------|-------------|---------|
| Création | Client | Validation de commande |
| Validation admin | Client | Confirmation de commande |
| Refus admin | Client | Notification de refus |
| Expédition | Client | Numéro de suivi |

## 🔧 Commandes Utiles

```bash
# Tester le flux
node scripts/test-order-workflow.js

# Voir les logs
tail -f .next/logs/app.log | grep -i email

# Vérifier les migrations
psql -d votredb -c "SELECT column_name FROM information_schema.columns WHERE table_name='orders';"
```

## ✅ Checklist

- [ ] `.env.local` configuré
- [ ] Migrations exécutées
- [ ] Resend configuré
- [ ] Test passé
- [ ] Admins formés

## 🆘 Problèmes Courants

### Les emails ne sont pas envoyés
→ Vérifier `RESEND_API_KEY` dans `.env.local`

### Erreur: `Column admin_notes does not exist`
→ Exécuter: `curl -X POST http://localhost:3000/api/admin/migrate-admin-notes`

### Erreur: `Column rejection_reason does not exist`
→ Exécuter: `curl -X POST http://localhost:3000/api/admin/migrate-rejection-reason`

### Les notes admin ne s'affichent pas
→ Vérifier que les migrations se sont bien exécutées

## 📚 Documentation Complète

- `ORDERS_WORKFLOW.md` - Flux détaillé des commandes
- `REJECTION_FEATURE.md` - Fonctionnalité de refus
- `SETUP_ORDERS.md` - Configuration complète
- `IMPLEMENTATION_SUMMARY.md` - Détails techniques
- `DATABASE_CHANGES.md` - Changements de base de données
- `FLOW_DIAGRAM.md` - Diagrammes visuels

## 🚀 Prêt à Déployer!

Une fois les 3 étapes complétées, le système est prêt pour la production.
