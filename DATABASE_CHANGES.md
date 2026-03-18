# Changements de Base de Données

## Modifications du Schéma

### Table: `orders`

#### Nouvelle Colonne: `admin_notes`

```sql
ALTER TABLE orders ADD COLUMN admin_notes TEXT;
```

**Propriétés**:
- **Nom**: `admin_notes`
- **Type**: `TEXT`
- **Nullable**: Oui (NULL par défaut)
- **Index**: Non
- **Défaut**: NULL

**Description**: Notes internes de l'administrateur sur la commande

**Utilisation**:
- Stocke les notes ajoutées lors de la validation d'une commande
- Visibles uniquement par les admins
- Utiles pour les instructions spéciales, problèmes, etc.

### Schéma Complet de la Table `orders`

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  guest_email VARCHAR(255),
  guest_name VARCHAR(255),
  status order_status DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_method payment_method DEFAULT 'cash_on_delivery',
  delivery_address TEXT,
  phone_number VARCHAR(20),
  delivery_zone_id INTEGER REFERENCES delivery_zones(id),
  admin_notes TEXT,  -- NOUVELLE COLONNE
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_orders_user_id (user_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created_at (created_at),
  INDEX idx_orders_guest_email (guest_email),
  INDEX idx_orders_delivery_zone_id (delivery_zone_id)
);
```

## Migration

### Exécuter la Migration

**Option 1: Via API (Recommandé)**
```bash
curl -X POST http://localhost:3000/api/admin/migrate-admin-notes
```

**Option 2: Via Script Node**
```bash
node scripts/add-admin-notes-to-orders.js
```

**Option 3: Directement en SQL**
```bash
psql -d votredb -c "ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;"
```

### Vérifier la Migration

```bash
# Vérifier que la colonne existe
psql -d votredb -c "SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='admin_notes';"

# Voir toutes les colonnes de la table orders
psql -d votredb -c "\d orders"
```

## Rollback (Si Nécessaire)

```sql
ALTER TABLE orders DROP COLUMN admin_notes;
```

## Impact sur les Requêtes

### Avant (Sans admin_notes)
```sql
SELECT id, user_id, status, total_amount FROM orders;
```

### Après (Avec admin_notes)
```sql
SELECT id, user_id, status, total_amount, admin_notes FROM orders;
```

## Données Existantes

- Les commandes existantes auront `admin_notes = NULL`
- Aucune donnée n'est perdue
- Les requêtes existantes continuent de fonctionner

## Performance

- Pas d'impact sur les performances
- La colonne est nullable (pas de contrainte)
- Pas d'index sur cette colonne (rarement utilisée pour les filtres)

## Sauvegarde

Avant d'exécuter la migration, faire une sauvegarde:

```bash
# Sauvegarde complète
pg_dump -d votredb > backup_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde de la table orders
pg_dump -d votredb -t orders > backup_orders_$(date +%Y%m%d_%H%M%S).sql
```

## Restauration (Si Problème)

```bash
# Restaurer depuis une sauvegarde
psql -d votredb < backup_20240309_120000.sql
```

## Vérification Post-Migration

```bash
-- Vérifier que la colonne existe
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'admin_notes';

-- Vérifier que les données existantes sont intactes
SELECT COUNT(*) FROM orders;

-- Vérifier que la colonne est bien NULL pour les commandes existantes
SELECT COUNT(*) FROM orders WHERE admin_notes IS NULL;
```

## Intégration avec Drizzle ORM

Le schéma Drizzle a été mis à jour:

```typescript
export const orders = pgTable('orders', {
  // ... autres colonnes ...
  adminNotes: text('admin_notes'),
  // ... autres colonnes ...
});
```

## Utilisation dans le Code

### Lecture
```typescript
const order = await db.select().from(orders).where(eq(orders.id, 1));
console.log(order[0].adminNotes);
```

### Écriture
```typescript
await db.update(orders)
  .set({ adminNotes: 'Notes de l\'admin' })
  .where(eq(orders.id, 1));
```

### Filtrage
```typescript
const ordersWithNotes = await db
  .select()
  .from(orders)
  .where(ne(orders.adminNotes, null));
```

## Considérations de Sécurité

- Les notes admin ne sont visibles que par les admins
- Les notes ne sont jamais envoyées au client
- Les notes ne sont jamais affichées publiquement

## Considérations de Conformité

- Les notes peuvent contenir des données sensibles
- Respecter les politiques de confidentialité
- Implémenter un audit trail si nécessaire

## Prochaines Étapes

1. ✅ Exécuter la migration
2. ✅ Vérifier que la colonne existe
3. ✅ Tester l'application
4. ✅ Monitorer les performances
5. ✅ Documenter les changements

## Support

Pour toute question sur la migration:
1. Vérifier les logs
2. Consulter cette documentation
3. Exécuter les commandes de vérification
4. Faire une sauvegarde avant de modifier
