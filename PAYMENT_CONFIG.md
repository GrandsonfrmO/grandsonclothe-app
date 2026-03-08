# Configuration du Mode de Paiement

## Mode Actuel: Paiement à la Livraison (Cash on Delivery)

Le système est configuré pour accepter **uniquement le paiement à la livraison**.

### Caractéristiques

- **Mode de paiement unique**: Paiement à la livraison (cash_on_delivery)
- **Processus**: Le client paie directement au livreur lors de la réception
- **Statut de paiement**: Défini à "pending" jusqu'à la livraison
- **Confirmation**: SMS de confirmation envoyé au client

### Flux de Commande

1. **Panier** (`/cart`)
   - Affichage des articles et du total
   - Calcul des frais de livraison

2. **Checkout** (`/checkout`)
   - Collecte des informations de livraison
   - Affichage du mode de paiement (paiement à la livraison)
   - Confirmation de la commande

3. **Confirmation** (`/order-confirmation/[id]`)
   - Affichage du numéro de commande
   - Informations de livraison
   - Instructions de paiement
   - Prochaines étapes

### Champs de Commande

```typescript
{
  id: number
  userId: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: decimal
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'cash_on_delivery' // Seule option disponible
  deliveryAddress: string
  phoneNumber: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### API Endpoints

#### POST /api/orders
Crée une nouvelle commande avec paiement à la livraison.

**Body:**
```json
{
  "userId": 1,
  "totalAmount": "150000",
  "paymentMethod": "cash_on_delivery",
  "deliveryAddress": "Rue de la Paix, Conakry",
  "phoneNumber": "+224 XXX XXX XXX",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": "75000"
    }
  ]
}
```

#### GET /api/orders?userId=1
Récupère les commandes d'un utilisateur.

#### GET /api/orders?orderId=1
Récupère les détails d'une commande spécifique.

### Ajouter d'autres modes de paiement

Pour ajouter d'autres modes de paiement à l'avenir:

1. Mettre à jour l'enum `paymentMethodEnum` dans `lib/db/schema.ts`:
```typescript
export const paymentMethodEnum = pgEnum('payment_method', [
  'cash_on_delivery',
  'mobile_money',
  'credit_card',
  // ... autres modes
]);
```

2. Mettre à jour la page de checkout pour afficher les options

3. Implémenter la logique de paiement pour chaque mode

### Statuts de Commande

- **pending**: Commande créée, en attente de traitement
- **processing**: Commande en préparation
- **shipped**: Commande expédiée
- **delivered**: Commande livrée
- **cancelled**: Commande annulée

### Statuts de Paiement

- **pending**: Paiement en attente (défaut pour paiement à la livraison)
- **completed**: Paiement reçu
- **failed**: Paiement échoué
- **refunded**: Remboursement effectué
