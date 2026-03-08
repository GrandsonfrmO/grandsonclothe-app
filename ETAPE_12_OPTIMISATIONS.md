# ÉTAPE 12 : OPTIMISATIONS ⚡

## Durée : 1h12

### 12.1 Optimiser images
- ✅ Changer `unoptimized: false`
- ✅ Ajouter `sizes`

### 12.2 Ajouter pagination
- ✅ Produits par page
- ✅ Implémentation API

### 12.3 Ajouter lazy loading
- ✅ Images
- ✅ Composants

### 12.4 Ajouter caching
- ✅ Revalidate produits

---

## Fichiers à modifier

1. `components/home/product-card.tsx` - Image optimization
2. `app/api/products/route.ts` - Pagination + caching
3. `components/home/featured-products.tsx` - Lazy loading
4. `components/home/trending-section.tsx` - Lazy loading
5. `app/search/page.tsx` - Pagination
6. `next.config.js` - Image optimization config

## Implémentation

### 12.1 Image Optimization
- Utiliser Next.js Image component
- Ajouter sizes pour responsive
- Ajouter loading="lazy"
- Ajouter placeholder

### 12.2 Pagination
- Ajouter limit/offset à l'API
- Implémenter dans search et admin
- Afficher 12 produits par page

### 12.3 Lazy Loading
- Utiliser dynamic() pour composants
- Ajouter loading state
- Suspense boundaries

### 12.4 Caching
- Ajouter revalidate: 3600 (1h)
- Cache produits API
- Cache images

