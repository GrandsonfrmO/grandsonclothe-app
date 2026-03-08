# ÉTAPE 13: SEO 🔍

## Résumé
Implémentation complète du SEO pour GRANDSON CLOTHES avec sitemap, robots.txt, métadonnées dynamiques et Open Graph.

## ✅ Tâches Complétées

### 13.1 Sitemap.xml
- **Fichier**: `app/sitemap.ts`
- **Fonctionnalité**: Génère automatiquement un sitemap XML avec:
  - Pages statiques (accueil, recherche, wishlist, commandes, auth)
  - Pages produits dynamiques
  - Priorités et fréquences de mise à jour
  - Dates de modification

### 13.2 Robots.txt
- **Fichier**: `app/robots.ts`
- **Fonctionnalité**: Contrôle l'accès des crawlers:
  - Autorise l'indexation des pages publiques
  - Bloque l'accès aux pages admin, API, auth
  - Référence le sitemap
  - Règles spécifiques pour Googlebot

### 13.3 Métadonnées Dynamiques
- **Fichier**: `lib/seo.ts`
- **Fonctionnalité**: Utilitaires pour générer des métadonnées:
  - `generateMetadata()`: Crée des métadonnées complètes
  - `generateProductMetadata()`: Métadonnées spécifiques aux produits
  - Support Open Graph et Twitter Card

#### Pages avec Métadonnées:
1. **Accueil** (`app/layout.tsx`)
   - Titre: "GRANDSON CLOTHES | Streetwear Guinee"
   - Description complète
   - Open Graph avec image

2. **Pages Produits** (`app/product/[id]/page.tsx`)
   - Titre dynamique avec nom du produit
   - Description du produit
   - Image du produit en Open Graph
   - Canonical URL
   - Type: product

3. **Recherche** (`app/search/page.tsx`)
   - Titre: "Rechercher | GRANDSON CLOTHES"
   - Description des filtres
   - Indexable

4. **Wishlist** (`app/wishlist/page.tsx`)
   - Titre: "Ma Liste de Souhaits | GRANDSON CLOTHES"
   - Non-indexable (robots: index: false)

### 13.4 Open Graph & Twitter Cards
Implémenté sur toutes les pages:
- **Open Graph**:
  - og:title, og:description
  - og:image (1200x630 pour pages, 1200x1200 pour produits)
  - og:url, og:type
  - og:locale: fr_FR
  - og:site_name: GRANDSON CLOTHES

- **Twitter Cards**:
  - twitter:card: summary_large_image
  - twitter:title, twitter:description
  - twitter:image
  - twitter:creator: @grandsonclothes

### 13.5 Structured Data (JSON-LD)
- **Fichier**: `lib/schema.ts`
- **Composant**: `components/schema-script.tsx`

#### Schémas Implémentés:
1. **Organization Schema**
   - Nom, URL, logo
   - Description
   - Réseaux sociaux
   - Contact
   - Adresse (Conakry, Guinée)

2. **Product Schema**
   - Nom, description, image
   - Prix et devise (EUR)
   - Disponibilité
   - Note agrégée et nombre d'avis
   - Catégorie

3. **Website Schema**
   - Recherche intégrée
   - SearchAction avec template

4. **Breadcrumb Schema**
   - Navigation structurée

## 📁 Fichiers Créés/Modifiés

### Créés:
- `app/robots.ts` - Contrôle des crawlers
- `app/sitemap.ts` - Sitemap XML
- `lib/seo.ts` - Utilitaires SEO
- `lib/schema.ts` - Schémas JSON-LD
- `components/schema-script.tsx` - Composant pour injecter les schémas

### Modifiés:
- `app/layout.tsx` - Métadonnées complètes + schémas
- `app/product/[id]/page.tsx` - Métadonnées dynamiques + schéma produit
- `app/search/page.tsx` - Métadonnées
- `app/wishlist/page.tsx` - Métadonnées

## 🔍 Vérification SEO

### Sitemap
```
https://grandsonclothes.com/sitemap.xml
```
Contient toutes les pages avec priorités.

### Robots.txt
```
https://grandsonclothes.com/robots.txt
```
Contrôle l'accès des crawlers.

### Métadonnées
Vérifiables via:
- Inspection du code source HTML
- Google Search Console
- Facebook Sharing Debugger
- Twitter Card Validator

### Structured Data
Vérifiable via:
- Google Rich Results Test
- Schema.org Validator
- Structured Data Testing Tool

## 🚀 Configuration Requise

### Variables d'Environnement
```env
NEXT_PUBLIC_BASE_URL=https://grandsonclothes.com
```

### Images OG
Créer les images suivantes dans `public/`:
- `og-image.png` (1200x630px) - Image par défaut
- Logo pour les schémas

## 📊 Bonnes Pratiques Implémentées

✅ Métadonnées uniques par page
✅ Open Graph pour partage réseaux
✅ Twitter Cards pour partage Twitter
✅ Canonical URLs
✅ Structured Data (JSON-LD)
✅ Sitemap XML
✅ Robots.txt
✅ Langue correcte (fr_FR)
✅ Images optimisées pour partage
✅ Descriptions pertinentes

## 🔗 Ressources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

## ✨ Prochaines Étapes

1. Créer les images OG dans `public/`
2. Configurer `NEXT_PUBLIC_BASE_URL` en production
3. Soumettre le sitemap à Google Search Console
4. Tester avec Google Rich Results Test
5. Configurer les réseaux sociaux pour les métadonnées
6. Ajouter des métadonnées à d'autres pages (profil, commandes, etc.)
