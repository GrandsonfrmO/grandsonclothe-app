# ÉTAPE 13: SEO - Quick Reference 🚀

## 📋 Checklist Rapide

### Fichiers Clés
- ✅ `app/robots.ts` - Contrôle des crawlers
- ✅ `app/sitemap.ts` - Sitemap XML
- ✅ `lib/seo.ts` - Utilitaires SEO
- ✅ `lib/schema.ts` - Schémas JSON-LD
- ✅ `components/schema-script.tsx` - Injection des schémas

### Pages Mises à Jour
- ✅ `app/layout.tsx` - Métadonnées globales + schémas
- ✅ `app/product/[id]/page.tsx` - Métadonnées dynamiques
- ✅ `app/search/page.tsx` - Métadonnées
- ✅ `app/wishlist/page.tsx` - Métadonnées

## 🔗 URLs Importantes

```
Sitemap:     https://grandsonclothes.com/sitemap.xml
Robots:      https://grandsonclothes.com/robots.txt
```

## 📝 Ajouter des Métadonnées à une Nouvelle Page

### Méthode 1: Métadonnées Statiques
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | GRANDSON CLOTHES',
  description: 'Page description',
  openGraph: {
    title: 'Page Title | GRANDSON CLOTHES',
    description: 'Page description',
    type: 'website',
  },
}
```

### Méthode 2: Métadonnées Dynamiques
```typescript
import { generateMetadata } from '@/lib/seo'

export async function generateMetadata({ params }) {
  const data = await fetchData(params.id)
  
  return generateMetadata({
    title: data.title,
    description: data.description,
    image: data.image,
    url: `https://grandsonclothes.com/page/${data.id}`,
    type: 'product',
  })
}
```

## 🏷️ Ajouter un Schéma JSON-LD

```typescript
import { SchemaScript } from '@/components/schema-script'
import { generateProductSchema } from '@/lib/schema'

export default function Page() {
  const schema = generateProductSchema({
    id: 1,
    name: 'Product Name',
    description: 'Description',
    price: 99.99,
    image: 'image.jpg',
    rating: 4.5,
    reviews: 10,
    category: 'Category',
  })

  return (
    <div>
      <SchemaScript schema={schema} />
      {/* Page content */}
    </div>
  )
}
```

## 🖼️ Images OG Requises

Créer dans `public/`:
- `og-image.png` (1200x630px) - Image par défaut

## 🌍 Configuration Environnement

```env
NEXT_PUBLIC_BASE_URL=https://grandsonclothes.com
```

## ✅ Vérification

### Sitemap
```bash
curl https://grandsonclothes.com/sitemap.xml
```

### Robots.txt
```bash
curl https://grandsonclothes.com/robots.txt
```

### Métadonnées (Navigateur)
1. Ouvrir la page
2. Clic droit → Inspecter
3. Chercher les balises `<meta>` et `<title>`

### Structured Data
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

## 📊 Contenu du Sitemap

- Pages statiques: 6
- Pages produits: Dynamique (basé sur `products.ts`)
- Priorités: 0.6 à 1.0
- Fréquence: daily, weekly, monthly

## 🤖 Règles Robots.txt

```
Autorisé:
- /
- /search
- /wishlist
- /orders
- /auth/login
- /auth/signup
- /product/*

Bloqué:
- /admin
- /api
- /auth/login (crawlers)
- /auth/signup (crawlers)
- /checkout
```

## 🔍 Open Graph Implémenté

Toutes les pages incluent:
- `og:title` - Titre de la page
- `og:description` - Description
- `og:image` - Image de partage
- `og:url` - URL canonique
- `og:type` - Type de contenu
- `og:locale` - Langue (fr_FR)
- `og:site_name` - Nom du site

## 🐦 Twitter Cards Implémenté

Toutes les pages incluent:
- `twitter:card` - summary_large_image
- `twitter:title` - Titre
- `twitter:description` - Description
- `twitter:image` - Image
- `twitter:creator` - @grandsonclothes

## 📚 Schémas JSON-LD Disponibles

1. **Organization** - Infos entreprise
2. **Product** - Infos produit
3. **Website** - Infos site
4. **Breadcrumb** - Navigation

## 🚀 Déploiement

1. Configurer `NEXT_PUBLIC_BASE_URL` en production
2. Créer `public/og-image.png`
3. Soumettre sitemap à Google Search Console
4. Tester avec Google Rich Results Test
5. Vérifier les métadonnées en production

## 💡 Tips

- Utiliser des images OG de haute qualité
- Garder les descriptions courtes et pertinentes
- Mettre à jour les métadonnées régulièrement
- Tester les partages sur réseaux sociaux
- Monitorer Google Search Console
