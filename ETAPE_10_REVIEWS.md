# ÉTAPE 10 : SYSTÈME D'AVIS ⭐

## Vue d'ensemble
Implémentation complète d'un système d'avis pour les produits avec vérification d'achat, notation et commentaires.

## 📋 Checklist

### 10.1 Table Reviews ✅
- [x] Créer table `reviews` dans la base de données
- [x] Champs: `id`, `product_id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`
- [x] Contrainte unique: un utilisateur = un avis par produit
- [x] Vérification: rating entre 1 et 5

**Fichiers modifiés:**
- `lib/db/schema.ts` - Ajout table et relations
- `drizzle/migrations/add_reviews_table.sql` - Migration SQL

### 10.2 Routes API ✅
- [x] POST `/api/reviews` - Ajouter un avis
- [x] GET `/api/reviews?productId=X` - Récupérer les avis

**Fichier créé:**
- `app/api/reviews/route.ts`

**Fonctionnalités:**
- Vérification que l'utilisateur a acheté le produit
- Vérification qu'il n'a pas déjà laissé d'avis
- Validation du rating (1-5)
- Retour des avis triés par date décroissante

### 10.3 Composant ReviewForm ✅
- [x] Formulaire pour laisser un avis
- [x] Sélection de note (1-5 étoiles)
- [x] Champ commentaire optionnel (max 500 caractères)
- [x] Vérification d'achat
- [x] Gestion des erreurs

**Fichier créé:**
- `components/review-form.tsx`

**Fonctionnalités:**
- Interface interactive pour noter
- Compteur de caractères
- Messages d'erreur/succès
- État de chargement

### 10.4 Affichage des Avis ✅
- [x] Composant ReviewsList
- [x] Liste des avis avec auteur et date
- [x] Moyenne des notes
- [x] Affichage sur la page produit

**Fichier créé:**
- `components/reviews-list.tsx`

**Fichier modifié:**
- `app/product/[id]/page.tsx` - Intégration des composants

## 🗄️ Structure de la Base de Données

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL (1-5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);
```

## 🔌 API Endpoints

### GET /api/reviews
Récupère tous les avis d'un produit

**Paramètres:**
- `productId` (required): ID du produit

**Réponse:**
```json
[
  {
    "id": 1,
    "productId": 5,
    "userId": 2,
    "rating": 5,
    "comment": "Excellent produit!",
    "createdAt": "2024-03-08T10:30:00Z",
    "user": {
      "id": 2,
      "name": "Jean Dupont"
    }
  }
]
```

### POST /api/reviews
Crée un nouvel avis

**Body:**
```json
{
  "productId": 5,
  "userId": 2,
  "rating": 5,
  "comment": "Excellent produit!"
}
```

**Validations:**
- `productId` et `userId` requis
- `rating` entre 1 et 5
- Utilisateur doit avoir acheté le produit
- Un seul avis par utilisateur par produit

**Réponse (201):**
```json
{
  "id": 1,
  "productId": 5,
  "userId": 2,
  "rating": 5,
  "comment": "Excellent produit!",
  "createdAt": "2024-03-08T10:30:00Z"
}
```

## 🎨 Composants

### ReviewForm
Formulaire pour laisser un avis

**Props:**
```typescript
interface ReviewFormProps {
  productId: number;
  userId: number;
  onReviewSubmitted: () => void;
}
```

**Fonctionnalités:**
- Sélection interactive des étoiles
- Champ commentaire avec limite de caractères
- Gestion des erreurs
- Feedback utilisateur

### ReviewsList
Affiche la liste des avis et la moyenne

**Props:**
```typescript
interface ReviewsListProps {
  productId: number;
  refreshTrigger?: number;
}
```

**Affiche:**
- Moyenne des notes
- Nombre total d'avis
- Liste des avis avec auteur, date et note
- Commentaires

## 🔄 Flux d'Utilisation

1. **Utilisateur non connecté:**
   - Voir les avis existants
   - Bouton "Se connecter" pour laisser un avis

2. **Utilisateur connecté:**
   - Voir le formulaire pour laisser un avis
   - Sélectionner une note (1-5 étoiles)
   - Ajouter un commentaire optionnel
   - Soumettre l'avis

3. **Vérifications:**
   - Vérification que l'utilisateur a acheté le produit
   - Vérification qu'il n'a pas déjà laissé d'avis
   - Validation du rating

4. **Affichage:**
   - Moyenne des notes mise à jour
   - Nouvel avis ajouté en haut de la liste
   - Confirmation de succès

## 📱 Intégration Page Produit

La section des avis est affichée en bas de la page produit:

```
[Produit]
  ├─ Images
  ├─ Infos (prix, couleur, taille)
  ├─ Description
  ├─ Bouton "Ajouter au panier"
  └─ AVIS CLIENTS
      ├─ Formulaire (si connecté)
      ├─ Moyenne et nombre d'avis
      └─ Liste des avis
```

## 🚀 Déploiement

### Étapes:
1. Exécuter la migration SQL
2. Redémarrer l'application
3. Tester le formulaire d'avis
4. Vérifier les validations

### Commandes:
```bash
# Appliquer les migrations
npm run db:migrate

# Vérifier la base de données
npm run db:studio
```

## ✅ Tests

### Cas de test:
1. ✅ Laisser un avis avec note et commentaire
2. ✅ Laisser un avis avec note uniquement
3. ✅ Vérifier qu'on ne peut pas laisser 2 avis
4. ✅ Vérifier qu'on ne peut pas noter sans avoir acheté
5. ✅ Vérifier la moyenne des notes
6. ✅ Vérifier l'affichage des avis
7. ✅ Vérifier la validation du rating (1-5)

## 📊 Statistiques

- **Temps estimé:** 1h10
- **Fichiers créés:** 4
- **Fichiers modifiés:** 2
- **Lignes de code:** ~400

## 🔗 Dépendances

- `date-fns` - Formatage des dates
- `lucide-react` - Icônes
- `drizzle-orm` - ORM

## 📝 Notes

- Les avis sont triés par date décroissante (plus récents en premier)
- La moyenne est calculée côté client pour les performances
- Un utilisateur ne peut laisser qu'un avis par produit
- Les commentaires sont optionnels
- Les dates sont formatées en français (ex: "il y a 2 heures")

## 🎯 Prochaines étapes (ÉTAPE 11)

- Modération des avis
- Signalement d'avis inappropriés
- Réponses aux avis (admin)
- Filtrage par note
- Tri des avis
