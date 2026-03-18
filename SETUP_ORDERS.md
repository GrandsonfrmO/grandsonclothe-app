# Configuration du Système de Gestion des Commandes

## 📋 Prérequis

- Node.js 18+
- PostgreSQL
- Compte Resend (pour les emails)
- Variables d'environnement configurées

## 🚀 Installation

### 1. Configuration des Variables d'Environnement

Ajouter à votre fichier `.env.local`:

```env
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@votredomaine.com

# API URL
NEXT_PUBLIC_API_URL=https://votredomaine.com
# En développement: http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### 2. Migration de la Base de Données

Ajouter la colonne `admin_notes` à la table `orders`:

**Option A: Via API (Recommandé)**
```bash
curl -X POST http://localhost:3000/api/admin/migrate-admin-notes
```

**Option B: Via Script Node**
```bash
node scripts/add-admin-notes-to-orders.js
```

**Option C: Directement en SQL**
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
```

### 3. Vérifier la Migration

```bash
# Vérifier que la colonne existe
psql -d votredb -c "SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='admin_notes';"
```

## 📧 Configuration Resend

### Créer un Compte Resend

1. Aller sur [resend.com](https://resend.com)
2. S'inscrire et créer un compte
3. Vérifier votre domaine
4. Générer une clé API

### Configurer le Domaine

1. Ajouter votre domaine dans Resend
2. Ajouter les enregistrements DNS fournis
3. Vérifier le domaine

### Obtenir la Clé API

1. Aller dans Settings → API Keys
2. Créer une nouvelle clé API
3. Copier la clé dans `.env.local`

## 🧪 Tests

### Test du Flux Complet

```bash
# Exécuter le script de test
node scripts/test-order-workflow.js
```

### Test Manuel

1. Créer une commande via le checkout
2. Vérifier que l'email de validation est reçu
3. Aller sur `/admin/orders`
4. Cliquer sur "Voir détails"
5. Ajouter des notes (optionnel)
6. Cliquer sur "Valider et Confirmer"
7. Vérifier que l'email de confirmation est reçu
8. Tester les autres actions (Expédier, Marquer livrée)

## 📊 Vérification des Emails

### Vérifier les Logs

```bash
# Voir les logs de l'application
tail -f .next/logs/app.log | grep -i email
```

### Vérifier dans Resend Dashboard

1. Aller sur [resend.com/emails](https://resend.com/emails)
2. Voir tous les emails envoyés
3. Vérifier les statuts de livraison

## 🔧 Dépannage

### Les emails ne sont pas envoyés

**Problème**: `Email service not configured`

**Solution**:
1. Vérifier que `RESEND_API_KEY` est défini
2. Vérifier que la clé API est valide
3. Vérifier que le domaine est vérifié dans Resend

### Erreur: `Column "admin_notes" does not exist`

**Solution**:
1. Exécuter la migration: `POST /api/admin/migrate-admin-notes`
2. Vérifier que la migration s'est bien exécutée
3. Redémarrer l'application

### Les notifications in-app ne s'affichent pas

**Solution**:
1. Vérifier que l'utilisateur est connecté
2. Vérifier que la table `notifications` existe
3. Vérifier les logs pour les erreurs

### Les emails arrivent dans les spams

**Solution**:
1. Ajouter des enregistrements SPF/DKIM dans DNS
2. Vérifier la réputation du domaine
3. Utiliser un domaine de confiance

## 📱 Interface Admin

### Accéder à la Page des Commandes

```
http://localhost:3000/admin/orders
```

### Fonctionnalités Principales

- 📊 Statistiques en temps réel
- 🔍 Recherche et filtrage
- 👁️ Modal de détails complet
- ✅ Validation avec notes
- 📧 Envoi automatique d'emails
- 📋 Historique des actions

## 🔐 Sécurité

### Permissions

- Seuls les admins peuvent accéder à `/admin/orders`
- Seuls les admins peuvent valider les commandes
- Les notes admin ne sont visibles que par les admins

### Validation

- Validation des données côté serveur
- Vérification des stocks avant création
- Vérification des permissions avant mise à jour

## 📈 Monitoring

### Métriques à Surveiller

- Nombre de commandes en attente
- Temps moyen de validation
- Taux de conversion (commandes validées)
- Taux d'erreur d'email

### Logs Importants

```bash
# Logs de création de commande
grep "Order created" .next/logs/app.log

# Logs d'email
grep "email sent" .next/logs/app.log

# Logs d'erreur
grep "ERROR" .next/logs/app.log
```

## 🎯 Prochaines Étapes

1. ✅ Configurer les variables d'environnement
2. ✅ Exécuter la migration de base de données
3. ✅ Configurer Resend
4. ✅ Tester le flux complet
5. ✅ Former les admins
6. ✅ Monitorer les performances

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs
2. Consulter la documentation
3. Tester avec le script de test
4. Vérifier les configurations

## 📚 Ressources

- [Documentation Resend](https://resend.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
