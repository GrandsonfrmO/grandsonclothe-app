# ÉTAPE 11 : RÉFÉRENCE API 🔌

## Endpoints disponibles

### Produits

#### GET /api/products
Récupérer tous les produits
```bash
curl http://localhost:3000/api/products
```

Réponse:
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "Puissant laptop",
    "price": "999.99",
    "image": "https://...",
    "category": "Tech",
    "stock": 5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/products
Créer un produit
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Puissant laptop",
    "price": 999.99,
    "image": "https://...",
    "category": "Tech",
    "stock": 5
  }'
```

#### PUT /api/products/[id]
Modifier un produit
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "price": 1299.99,
    "stock": 10
  }'
```

#### DELETE /api/products/[id]
Supprimer un produit
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

---

### Commandes

#### GET /api/orders
Récupérer toutes les commandes
```bash
curl http://localhost:3000/api/orders
```

Réponse:
```json
[
  {
    "id": 1,
    "userId": 1,
    "status": "pending",
    "totalAmount": "299.99",
    "paymentStatus": "pending",
    "paymentMethod": "cash_on_delivery",
    "deliveryAddress": "123 Rue de Paris",
    "phoneNumber": "0612345678",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### PATCH /api/orders/[id]
Mettre à jour le statut d'une commande
```bash
curl -X PATCH http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

Statuts valides:
- `pending` - En attente
- `processing` - En traitement
- `shipped` - Expédié
- `delivered` - Livré
- `cancelled` - Annulé

---

### Clients

#### GET /api/customers
Récupérer tous les clients
```bash
curl http://localhost:3000/api/customers
```

Réponse:
```json
[
  {
    "id": 1,
    "email": "alice@mail.com",
    "name": "Alice",
    "createdAt": "2024-01-01T00:00:00Z",
    "orderCount": 3,
    "totalSpent": "1500.00"
  }
]
```

#### GET /api/customers/[id]/orders
Récupérer l'historique des commandes d'un client
```bash
curl http://localhost:3000/api/customers/1/orders
```

Réponse:
```json
[
  {
    "id": 1,
    "userId": 1,
    "status": "delivered",
    "totalAmount": "299.99",
    "paymentStatus": "completed",
    "paymentMethod": "cash_on_delivery",
    "deliveryAddress": "123 Rue de Paris",
    "phoneNumber": "0612345678",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Statistiques

#### GET /api/analytics
Récupérer les statistiques
```bash
curl http://localhost:3000/api/analytics
```

Réponse:
```json
{
  "totalRevenue": 15450.50,
  "totalOrders": 127,
  "totalCustomers": 45,
  "averageOrderValue": 121.65,
  "revenueByDay": [
    {
      "date": "2024-01-01",
      "revenue": 1200.50
    },
    {
      "date": "2024-01-02",
      "revenue": 1500.00
    }
  ],
  "ordersByStatus": [
    {
      "status": "pending",
      "count": 30
    },
    {
      "status": "processing",
      "count": 20
    },
    {
      "status": "shipped",
      "count": 50
    },
    {
      "status": "delivered",
      "count": 25
    },
    {
      "status": "cancelled",
      "count": 2
    }
  ],
  "topProducts": [
    {
      "name": "Laptop",
      "sales": 45
    },
    {
      "name": "Phone",
      "sales": 32
    },
    {
      "name": "Tablet",
      "sales": 18
    }
  ]
}
```

---

## Codes de statut HTTP

- `200 OK` - Succès
- `201 Created` - Ressource créée
- `400 Bad Request` - Requête invalide
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

---

## Exemples d'utilisation

### JavaScript/Fetch

#### Récupérer les produits
```javascript
const response = await fetch('/api/products');
const products = await response.json();
console.log(products);
```

#### Créer un produit
```javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Laptop',
    price: 999.99,
    stock: 5,
    category: 'Tech'
  })
});
const product = await response.json();
console.log(product);
```

#### Modifier un produit
```javascript
const response = await fetch('/api/products/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Laptop Gaming',
    price: 1299.99
  })
});
const product = await response.json();
console.log(product);
```

#### Supprimer un produit
```javascript
const response = await fetch('/api/products/1', {
  method: 'DELETE'
});
const result = await response.json();
console.log(result);
```

#### Changer le statut d'une commande
```javascript
const response = await fetch('/api/orders/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'shipped'
  })
});
const order = await response.json();
console.log(order);
```

#### Récupérer les statistiques
```javascript
const response = await fetch('/api/analytics');
const stats = await response.json();
console.log(stats);
```

---

## Gestion des erreurs

```javascript
try {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error('Erreur:', error);
}
```

---

## Validation des données

### Produit
- `name` (string, requis) - Nom du produit
- `description` (string, optionnel) - Description
- `price` (number, requis) - Prix en euros
- `stock` (number, requis) - Quantité en stock
- `category` (string, optionnel) - Catégorie
- `image` (string, optionnel) - URL de l'image

### Commande
- `status` (enum, requis) - Statut de la commande
  - `pending`
  - `processing`
  - `shipped`
  - `delivered`
  - `cancelled`

---

## Limites et considérations

- Les prix sont stockés en décimal (2 décimales)
- Les stocks sont des entiers positifs
- Les statuts sont limités aux valeurs définies
- Les dates sont en ISO 8601 (UTC)
- Les réponses sont en JSON

---

## Authentification

Actuellement, les endpoints ne nécessitent pas d'authentification. Pour la production, il est recommandé d'ajouter:
- JWT tokens
- Vérification des rôles (admin)
- Rate limiting
- CORS

