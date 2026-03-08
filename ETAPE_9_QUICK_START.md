# ETAPE 9 : WISHLIST - QUICK START ❤️

## 🚀 Démarrage Rapide

### 1. Migration Appliquée ✅
La table `wishlist` a été créée dans la base de données avec:
- Clé primaire `id`
- Références aux tables `users` et `products`
- Contrainte UNIQUE pour éviter les doublons
- Indexes pour les performances

### 2. Fichiers Créés

#### Backend
```
app/api/wishlist/
├── route.ts          # GET (récupérer), POST (ajouter)
└── [id]/route.ts     # DELETE (supprimer)
```

#### Frontend
```
lib/wishlist-context.tsx       # Context + Hook useWishlist()
app/wishlist/page.tsx          # Page complète des favoris
components/wishlist-button.tsx # Bouton cœur réutilisable
```

#### Database
```
lib/db/schema.ts               # Table wishlist + relations
drizzle/migrations/            # Migration SQL
```

### 3. Intégrations

#### Header
- Lien vers `/wishlist`
- Badge avec compteur de favoris

#### Product Card (Accueil)
- Bouton cœur sur chaque produit
- Rempli si en favoris

#### Product Detail
- Bouton cœur dans le header
- Taille large pour meilleure visibilité

## 🧪 Tests Manuels

### Test 1: Ajouter aux Favoris
```
1. Aller sur http://localhost:3000
2. Cliquer sur le cœur d'un produit
3. Vous serez redirigé vers /auth/login si non connecté
4. Après login, le cœur devient rouge
5. Le badge dans le header augmente
```

### Test 2: Voir les Favoris
```
1. Cliquer sur le cœur dans le header (badge)
2. Aller sur http://localhost:3000/wishlist
3. Voir tous les produits favoris
4. Compteur affiche le nombre total
```

### Test 3: Ajouter au Panier depuis Favoris
```
1. Aller sur /wishlist
2. Cliquer "Ajouter au panier"
3. Produit s'ajoute au panier
4. Vérifier dans /cart
```

### Test 4: Supprimer des Favoris
```
1. Sur /wishlist, cliquer le cœur rouge
2. Produit disparaît de la liste
3. Badge du header diminue
4. Ou cliquer le cœur sur la page produit
```

### Test 5: Page Produit Détail
```
1. Aller sur /product/[id]
2. Cliquer le cœur dans le header
3. Cœur devient rouge
4. Produit s'ajoute aux favoris
5. Vérifier sur /wishlist
```

## 🔌 API Endpoints

### GET /api/wishlist
Récupère tous les favoris de l'utilisateur connecté
```bash
curl -X GET http://localhost:3000/api/wishlist \
  -H "Cookie: token=YOUR_TOKEN"
```

Response:
```json
{
  "wishlist": [
    {
      "id": 1,
      "productId": 5,
      "product": {
        "id": 5,
        "name": "T-Shirt Classic",
        "price": "25.00",
        "image": "..."
      }
    }
  ]
}
```

### POST /api/wishlist
Ajoute un produit aux favoris
```bash
curl -X POST http://localhost:3000/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN" \
  -d '{"productId": 5}'
```

### DELETE /api/wishlist/[productId]
Supprime un produit des favoris
```bash
curl -X DELETE http://localhost:3000/api/wishlist/5 \
  -H "Cookie: token=YOUR_TOKEN"
```

## 🎯 Hook useWishlist()

```typescript
import { useWishlist } from '@/lib/wishlist-context';

export function MyComponent() {
  const {
    wishlistItems,      // Array<number> - IDs des produits
    loading,            // boolean
    isInWishlist,       // (productId: number) => boolean
    addToWishlist,      // (productId: number) => Promise<void>
    removeFromWishlist, // (productId: number) => Promise<void>
    toggleWishlist,     // (productId: number) => Promise<void>
  } = useWishlist();

  return (
    <button onClick={() => toggleWishlist(5)}>
      {isInWishlist(5) ? '❤️' : '🤍'}
    </button>
  );
}
```

## 📊 Modifications Existantes

| Fichier | Changement |
|---------|-----------|
| `app/layout.tsx` | Ajout WishlistProvider |
| `components/header.tsx` | Ajout lien wishlist + badge |
| `components/home/product-card.tsx` | Remplacement cœur local par WishlistButton |
| `app/product/[id]/page.tsx` | Remplacement cœur local par WishlistButton |
| `lib/db/schema.ts` | Ajout table wishlist + relations |

## ✅ Checklist

- [x] Table wishlist créée
- [x] API routes implémentées
- [x] Context + Hook créés
- [x] Bouton wishlist réutilisable
- [x] Page wishlist complète
- [x] Intégration header
- [x] Intégration product card
- [x] Intégration product detail
- [x] Tests manuels validés
- [x] Pas d'erreurs de compilation

## 🎨 Fonctionnalités

✅ Ajouter/Supprimer des favoris
✅ Voir tous les favoris
✅ Ajouter au panier depuis favoris
✅ Compteur de favoris dans le header
✅ Cœur rempli si en favoris
✅ Redirection login si non connecté
✅ Gestion des erreurs
✅ Responsive design

## 🚀 Prochaines Étapes

- [ ] Notifications email pour les favoris
- [ ] Partage de wishlist
- [ ] Historique des favoris
- [ ] Favoris par catégorie
- [ ] Alertes prix pour les favoris
