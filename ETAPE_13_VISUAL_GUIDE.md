# ÉTAPE 13: SEO - Guide Visuel 🎨

## 📊 Architecture SEO

```
┌─────────────────────────────────────────────────────────────┐
│                    GRANDSON CLOTHES SEO                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    CRAWLERS & INDEXING                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  robots.txt ──────────────────────────────────────────────┐  │
│  ├─ Autorise: pages publiques                            │  │
│  ├─ Bloque: admin, API, checkout                         │  │
│  └─ Référence: sitemap.xml                               │  │
│                                                            │  │
│  sitemap.xml ──────────────────────────────────────────┐  │  │
│  ├─ Pages statiques (6)                                │  │  │
│  ├─ Pages produits (dynamique)                         │  │  │
│  ├─ Priorités: 0.6 - 1.0                               │  │  │
│  └─ Fréquences: daily, weekly, monthly                 │  │  │
│                                                         │  │  │
└─────────────────────────────────────────────────────────┘  │
                                                              │
┌──────────────────────────────────────────────────────────────┐
│                    METADATA & SHARING                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Open Graph ────────────────────────────────────────────┐   │
│  ├─ og:title                                            │   │
│  ├─ og:description                                      │   │
│  ├─ og:image (1200x630 ou 1200x1200)                   │   │
│  ├─ og:url                                              │   │
│  ├─ og:type (website, product)                          │   │
│  ├─ og:locale (fr_FR)                                   │   │
│  └─ og:site_name (GRANDSON CLOTHES)                     │   │
│                                                         │   │
│  Twitter Cards ─────────────────────────────────────┐   │   │
│  ├─ twitter:card (summary_large_image)             │   │   │
│  ├─ twitter:title                                  │   │   │
│  ├─ twitter:description                            │   │   │
│  ├─ twitter:image                                  │   │   │
│  └─ twitter:creator (@grandsonclothes)             │   │   │
│                                                    │   │   │
└────────────────────────────────────────────────────┘   │
                                                         │
┌──────────────────────────────────────────────────────────────┐
│                  STRUCTURED DATA (JSON-LD)                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Organization Schema ────────────────────────────────────┐   │
│  ├─ Nom: GRANDSON CLOTHES                              │   │
│  ├─ URL, logo, description                             │   │
│  ├─ Réseaux sociaux                                     │   │
│  ├─ Contact                                             │   │
│  └─ Adresse: Conakry, Guinée                            │   │
│                                                         │   │
│  Product Schema (Pages Produits) ──────────────────┐   │   │
│  ├─ Nom, description, image                        │   │   │
│  ├─ Prix (EUR), disponibilité                      │   │   │
│  ├─ Note agrégée et nombre d'avis                  │   │   │
│  └─ Catégorie                                      │   │   │
│                                                    │   │   │
│  Website Schema ────────────────────────────────┐  │   │   │
│  ├─ Recherche intégrée                         │  │   │   │
│  └─ SearchAction avec template                 │  │   │   │
│                                                │  │   │   │
└────────────────────────────────────────────────┘  │
                                                    │
└──────────────────────────────────────────────────────────────┘
```

## 🗂️ Structure des Fichiers

```
GRANDSON CLOTHES/
│
├── app/
│   ├── robots.ts                    ← Contrôle des crawlers
│   ├── sitemap.ts                   ← Sitemap XML
│   ├── layout.tsx                   ← Métadonnées globales + schémas
│   ├── product/[id]/page.tsx        ← Métadonnées dynamiques + schéma produit
│   ├── search/page.tsx              ← Métadonnées
│   └── wishlist/page.tsx            ← Métadonnées
│
├── lib/
│   ├── seo.ts                       ← Utilitaires SEO
│   └── schema.ts                    ← Schémas JSON-LD
│
├── components/
│   └── schema-script.tsx            ← Injection des schémas
│
└── public/
    └── og-image.png                 ← Image OG (1200x630px)
```

## 🔄 Flux de Données SEO

```
┌─────────────────────────────────────────────────────────────┐
│                    USER VISITS PAGE                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS GENERATES METADATA                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Récupère les données (produit, page, etc.)              │
│  2. Génère les métadonnées (titre, description, etc.)       │
│  3. Crée les balises Open Graph                             │
│  4. Crée les balises Twitter Cards                          │
│  5. Injecte les schémas JSON-LD                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              HTML SENT TO BROWSER/CRAWLER                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  <head>                                                      │
│    <title>Produit | GRANDSON CLOTHES</title>               │
│    <meta name="description" content="...">                 │
│    <meta property="og:title" content="...">                │
│    <meta property="og:image" content="...">                │
│    <meta name="twitter:card" content="...">                │
│    <script type="application/ld+json">...</script>         │
│  </head>                                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ CRAWLER  │  │ FACEBOOK │  │ TWITTER  │
        │ (Google) │  │ DEBUGGER │  │ CARD VAL │
        └──────────┘  └──────────┘  └──────────┘
```

## 📱 Métadonnées par Page

### Accueil
```
Title: GRANDSON CLOTHES | Streetwear Guinee
Description: GRANDSON CLOTHES - Streetwear authentique depuis la Guinee...
OG Image: og-image.png (1200x630)
Type: website
Robots: index, follow
```

### Page Produit
```
Title: {Nom Produit} | GRANDSON CLOTHES
Description: {Description du produit}
OG Image: {Image du produit} (1200x1200)
Type: product
Robots: index, follow
Canonical: https://grandsonclothes.com/product/{id}
```

### Recherche
```
Title: Rechercher | GRANDSON CLOTHES
Description: Recherchez nos produits streetwear authentiques...
OG Image: og-image.png (1200x630)
Type: website
Robots: index, follow
```

### Wishlist
```
Title: Ma Liste de Souhaits | GRANDSON CLOTHES
Description: Consultez votre liste de souhaits...
OG Image: og-image.png (1200x630)
Type: website
Robots: noindex, nofollow
```

## 🔍 Vérification SEO

```
┌─────────────────────────────────────────────────────────────┐
│                  VÉRIFICATION SEO                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. SITEMAP                                                  │
│     ✓ Accessible: https://grandsonclothes.com/sitemap.xml   │
│     ✓ Format: XML valide                                     │
│     ✓ Contenu: Toutes les pages                             │
│                                                               │
│  2. ROBOTS.TXT                                               │
│     ✓ Accessible: https://grandsonclothes.com/robots.txt    │
│     ✓ Format: Texte valide                                   │
│     ✓ Règles: Appropriées                                    │
│                                                               │
│  3. MÉTADONNÉES                                              │
│     ✓ Titre: Unique par page                                 │
│     ✓ Description: Pertinente                                │
│     ✓ Keywords: Appropriés                                   │
│                                                               │
│  4. OPEN GRAPH                                               │
│     ✓ og:title: Présent                                      │
│     ✓ og:description: Présent                                │
│     ✓ og:image: Présent et valide                            │
│     ✓ og:url: Correct                                        │
│                                                               │
│  5. TWITTER CARDS                                            │
│     ✓ twitter:card: summary_large_image                      │
│     ✓ twitter:title: Présent                                 │
│     ✓ twitter:description: Présent                           │
│     ✓ twitter:image: Présent                                 │
│                                                               │
│  6. STRUCTURED DATA                                          │
│     ✓ Organization: Présent                                  │
│     ✓ Product: Sur pages produits                            │
│     ✓ Website: Présent                                       │
│     ✓ Format: JSON-LD valide                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Tests Recommandés

```
┌─────────────────────────────────────────────────────────────┐
│                  OUTILS DE TEST                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Google Rich Results Test                                 │
│     URL: https://search.google.com/test/rich-results        │
│     Vérifie: Schémas JSON-LD                                 │
│                                                               │
│  2. Facebook Sharing Debugger                                │
│     URL: https://developers.facebook.com/tools/debug/       │
│     Vérifie: Open Graph                                      │
│                                                               │
│  3. Twitter Card Validator                                   │
│     URL: https://cards-dev.twitter.com/validator            │
│     Vérifie: Twitter Cards                                   │
│                                                               │
│  4. Schema.org Validator                                     │
│     URL: https://validator.schema.org/                      │
│     Vérifie: Schémas JSON-LD                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Sitemap Contenu

```
Sitemap (sitemap.xml)
│
├─ Accueil (/)
│  ├─ Priorité: 1.0
│  ├─ Fréquence: daily
│  └─ Dernière modification: Aujourd'hui
│
├─ Recherche (/search)
│  ├─ Priorité: 0.8
│  ├─ Fréquence: weekly
│  └─ Dernière modification: Aujourd'hui
│
├─ Wishlist (/wishlist)
│  ├─ Priorité: 0.7
│  ├─ Fréquence: weekly
│  └─ Dernière modification: Aujourd'hui
│
├─ Commandes (/orders)
│  ├─ Priorité: 0.7
│  ├─ Fréquence: weekly
│  └─ Dernière modification: Aujourd'hui
│
├─ Login (/auth/login)
│  ├─ Priorité: 0.6
│  ├─ Fréquence: monthly
│  └─ Dernière modification: Aujourd'hui
│
├─ Signup (/auth/signup)
│  ├─ Priorité: 0.6
│  ├─ Fréquence: monthly
│  └─ Dernière modification: Aujourd'hui
│
└─ Produits (/product/*)
   ├─ Priorité: 0.9
   ├─ Fréquence: weekly
   └─ Dernière modification: Aujourd'hui
```

## 🤖 Robots.txt Règles

```
Robots.txt (robots.txt)
│
├─ User-Agent: *
│  ├─ Allow: /
│  ├─ Allow: /search
│  ├─ Allow: /wishlist
│  ├─ Allow: /orders
│  ├─ Allow: /auth/login
│  ├─ Allow: /auth/signup
│  ├─ Allow: /product/*
│  ├─ Disallow: /admin
│  ├─ Disallow: /api
│  ├─ Disallow: /checkout
│  └─ Sitemap: https://grandsonclothes.com/sitemap.xml
│
└─ User-Agent: Googlebot
   ├─ Allow: /
   ├─ Crawl-delay: 0
   └─ Sitemap: https://grandsonclothes.com/sitemap.xml
```

## 🎯 Résumé Visuel

```
┌─────────────────────────────────────────────────────────────┐
│                  ÉTAPE 13: SEO COMPLÉTÉE                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ Sitemap.xml          - Tous les crawlers                 │
│  ✅ Robots.txt           - Contrôle d'accès                  │
│  ✅ Métadonnées          - Chaque page unique                │
│  ✅ Open Graph           - Partage réseaux sociaux           │
│  ✅ Twitter Cards        - Partage Twitter                   │
│  ✅ Structured Data      - Rich results Google               │
│  ✅ Canonical URLs       - Pas de contenu dupliqué           │
│  ✅ Langue Correcte      - fr_FR                             │
│                                                               │
│  RÉSULTAT: Stratégie SEO complète et robuste                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📈 Impact SEO Attendu

```
Avant ÉTAPE 13:
├─ Pas de sitemap
├─ Pas de robots.txt
├─ Métadonnées minimales
├─ Pas d'Open Graph
├─ Pas de Twitter Cards
└─ Pas de Structured Data

Après ÉTAPE 13:
├─ ✅ Sitemap complet
├─ ✅ Robots.txt optimisé
├─ ✅ Métadonnées complètes
├─ ✅ Open Graph sur toutes les pages
├─ ✅ Twitter Cards sur toutes les pages
└─ ✅ Structured Data pour rich results

Résultat:
├─ Meilleure indexation
├─ Meilleur classement
├─ Meilleur partage réseaux sociaux
├─ Rich results dans Google
└─ Meilleure visibilité globale
```

---

**Status**: ✅ COMPLÉTÉE
**Durée**: 45 min
**Date**: 2026-03-08
