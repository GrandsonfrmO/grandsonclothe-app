# ÉTAPE 13: SEO - Vérification ✅

## 🔍 Checklist de Vérification

### 1. Sitemap.xml
- [ ] Fichier créé: `app/sitemap.ts`
- [ ] Accessible via: `http://localhost:3000/sitemap.xml`
- [ ] Contient pages statiques
- [ ] Contient pages produits dynamiques
- [ ] Format XML valide
- [ ] Priorités définies (0.6-1.0)
- [ ] Fréquences de mise à jour définies

**Vérification**:
```bash
# Vérifier le sitemap
curl http://localhost:3000/sitemap.xml
```

### 2. Robots.txt
- [ ] Fichier créé: `app/robots.ts`
- [ ] Accessible via: `http://localhost:3000/robots.txt`
- [ ] Autorise pages publiques
- [ ] Bloque pages admin
- [ ] Bloque pages API
- [ ] Référence le sitemap
- [ ] Règles Googlebot spécifiques

**Vérification**:
```bash
# Vérifier robots.txt
curl http://localhost:3000/robots.txt
```

### 3. Métadonnées Globales
- [ ] Titre: "GRANDSON CLOTHES | Streetwear Guinee"
- [ ] Description complète
- [ ] Keywords définis
- [ ] Authors définis
- [ ] Open Graph configuré
- [ ] Twitter Cards configuré
- [ ] Robots index/follow
- [ ] Canonical URL

**Vérification**:
```bash
# Inspecter le code source
curl http://localhost:3000 | grep -E '<meta|<title'
```

### 4. Métadonnées Produits
- [ ] Titre dynamique avec nom du produit
- [ ] Description du produit
- [ ] Image du produit en OG
- [ ] Canonical URL
- [ ] Type: product
- [ ] Keywords incluent catégorie

**Vérification**:
```bash
# Vérifier une page produit
curl http://localhost:3000/product/1 | grep -E '<meta|<title'
```

### 5. Métadonnées Recherche
- [ ] Titre: "Rechercher | GRANDSON CLOTHES"
- [ ] Description des filtres
- [ ] Indexable (robots: index: true)

**Vérification**:
```bash
# Vérifier la page recherche
curl http://localhost:3000/search | grep -E '<meta|<title'
```

### 6. Métadonnées Wishlist
- [ ] Titre: "Ma Liste de Souhaits | GRANDSON CLOTHES"
- [ ] Non-indexable (robots: index: false)

**Vérification**:
```bash
# Vérifier la page wishlist
curl http://localhost:3000/wishlist | grep -E '<meta|<title'
```

### 7. Open Graph
- [ ] og:title présent
- [ ] og:description présent
- [ ] og:image présent
- [ ] og:url présent
- [ ] og:type présent
- [ ] og:locale: fr_FR
- [ ] og:site_name: GRANDSON CLOTHES

**Vérification**:
```bash
# Vérifier Open Graph
curl http://localhost:3000 | grep 'og:'
```

### 8. Twitter Cards
- [ ] twitter:card: summary_large_image
- [ ] twitter:title présent
- [ ] twitter:description présent
- [ ] twitter:image présent
- [ ] twitter:creator: @grandsonclothes

**Vérification**:
```bash
# Vérifier Twitter Cards
curl http://localhost:3000 | grep 'twitter:'
```

### 9. Structured Data (JSON-LD)
- [ ] Organization schema présent
- [ ] Website schema présent
- [ ] Product schema sur pages produits
- [ ] Format JSON-LD valide
- [ ] Pas d'erreurs de validation

**Vérification**:
```bash
# Vérifier les schémas
curl http://localhost:3000 | grep -A 20 'application/ld+json'
```

### 10. Fichiers Créés
- [ ] `app/robots.ts`
- [ ] `app/sitemap.ts`
- [ ] `lib/seo.ts`
- [ ] `lib/schema.ts`
- [ ] `components/schema-script.tsx`

### 11. Fichiers Modifiés
- [ ] `app/layout.tsx` - Métadonnées + schémas
- [ ] `app/product/[id]/page.tsx` - Métadonnées dynamiques
- [ ] `app/search/page.tsx` - Métadonnées
- [ ] `app/wishlist/page.tsx` - Métadonnées

## 🧪 Tests Recommandés

### Google Rich Results Test
1. Aller sur: https://search.google.com/test/rich-results
2. Entrer l'URL: https://grandsonclothes.com
3. Vérifier les schémas détectés
4. Pas d'erreurs critiques

### Facebook Sharing Debugger
1. Aller sur: https://developers.facebook.com/tools/debug/
2. Entrer l'URL: https://grandsonclothes.com
3. Vérifier les métadonnées OG
4. Vérifier l'image de partage

### Twitter Card Validator
1. Aller sur: https://cards-dev.twitter.com/validator
2. Entrer l'URL: https://grandsonclothes.com
3. Vérifier les Twitter Cards
4. Vérifier l'image

### Schema.org Validator
1. Aller sur: https://validator.schema.org/
2. Entrer l'URL: https://grandsonclothes.com
3. Vérifier les schémas
4. Pas d'erreurs

## 📊 Métriques à Vérifier

- [ ] Sitemap contient toutes les pages
- [ ] Robots.txt bloque les pages appropriées
- [ ] Métadonnées uniques par page
- [ ] Images OG correctes (1200x630 ou 1200x1200)
- [ ] Canonical URLs correctes
- [ ] Pas de contenu dupliqué
- [ ] Liens internes valides
- [ ] Pas d'erreurs 404

## 🚀 Déploiement

### Avant le Déploiement
- [ ] Tester localement
- [ ] Vérifier tous les schémas
- [ ] Créer `public/og-image.png`
- [ ] Configurer `NEXT_PUBLIC_BASE_URL`

### Après le Déploiement
- [ ] Vérifier les URLs en production
- [ ] Soumettre sitemap à Google Search Console
- [ ] Soumettre sitemap à Bing Webmaster Tools
- [ ] Tester avec Google Rich Results Test
- [ ] Tester les partages réseaux sociaux
- [ ] Monitorer Google Search Console

## 📝 Notes

- Les métadonnées sont générées automatiquement
- Les schémas JSON-LD sont injectés côté serveur
- Le sitemap est généré dynamiquement
- Les robots.txt sont générés dynamiquement
- Toutes les pages incluent les Open Graph et Twitter Cards

## ✨ Résultat Attendu

Après vérification, vous devriez voir:
- ✅ Sitemap XML valide avec toutes les pages
- ✅ Robots.txt avec règles appropriées
- ✅ Métadonnées uniques par page
- ✅ Open Graph sur toutes les pages
- ✅ Twitter Cards sur toutes les pages
- ✅ Schémas JSON-LD valides
- ✅ Images OG correctes
- ✅ Canonical URLs correctes
- ✅ Pas d'erreurs SEO critiques
