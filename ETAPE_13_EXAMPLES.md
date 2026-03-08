# ÉTAPE 13: SEO - Exemples d'Implémentation 📚

## 1. Ajouter des Métadonnées à une Nouvelle Page

### Exemple: Page de Catégorie

```typescript
// app/category/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const category = await fetchCategory(slug)

  if (!category) {
    return {
      title: 'Catégorie non trouvée | GRANDSON CLOTHES',
      description: 'La catégorie que vous recherchez n\'existe pas.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'
  const categoryUrl = `${baseUrl}/category/${slug}`

  return {
    title: `${category.name} | GRANDSON CLOTHES`,
    description: category.description,
    keywords: [category.name, 'streetwear', 'Guinee', 'fashion'],
    openGraph: {
      title: `${category.name} | GRANDSON CLOTHES`,
      description: category.description,
      url: categoryUrl,
      siteName: 'GRANDSON CLOTHES',
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: category.name,
          type: 'image/jpeg',
        },
      ],
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | GRANDSON CLOTHES`,
      description: category.description,
      images: [category.image],
      creator: '@grandsonclothes',
    },
    alternates: {
      canonical: categoryUrl,
    },
  }
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Page content
}
```

## 2. Ajouter un Schéma JSON-LD Personnalisé

### Exemple: Schéma de Produit avec Avis

```typescript
// lib/schema.ts - Ajouter cette fonction

export function generateProductWithReviewsSchema(product: {
  id: number
  name: string
  description: string
  price: number
  image: string
  rating: number
  reviews: number
  category: string
  reviews_list: Array<{
    author: string
    rating: number
    text: string
    date: string
  }>
}): SchemaOrg {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${baseUrl}/product/${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'GRANDSON CLOTHES',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.id}`,
      priceCurrency: 'EUR',
      price: product.price.toString(),
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews.toString(),
    },
    review: product.reviews_list.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      description: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
      },
    })),
    category: product.category,
  }
}
```

## 3. Utiliser les Utilitaires SEO

### Exemple: Page de Blog

```typescript
// app/blog/[slug]/page.tsx
import { generateMetadata } from '@/lib/seo'
import { SchemaScript } from '@/components/schema-script'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await fetchBlogPost(slug)

  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
    url: `https://grandsonclothes.com/blog/${slug}`,
    type: 'article',
    author: post.author,
    publishedDate: post.publishedAt,
    modifiedDate: post.updatedAt,
  })
}

export default function BlogPost({ params }) {
  const post = use(params)
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
  }

  return (
    <div>
      <SchemaScript schema={articleSchema} />
      {/* Blog content */}
    </div>
  )
}
```

## 4. Ajouter des Métadonnées à une Page Dynamique

### Exemple: Page de Profil Utilisateur

```typescript
// app/profile/[username]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}): Promise<Metadata> {
  const { username } = await params
  const user = await fetchUser(username)

  if (!user) {
    return {
      title: 'Utilisateur non trouvé | GRANDSON CLOTHES',
      robots: { index: false },
    }
  }

  return {
    title: `${user.name} | GRANDSON CLOTHES`,
    description: `Profil de ${user.name} sur GRANDSON CLOTHES`,
    robots: {
      index: false, // Ne pas indexer les profils utilisateurs
      follow: false,
    },
  }
}

export default function ProfilePage({ params }) {
  // Page content
}
```

## 5. Générer un Sitemap Personnalisé

### Exemple: Ajouter des Pages de Blog

```typescript
// app/sitemap.ts - Modifier la fonction

import { MetadataRoute } from 'next'
import { products } from '@/lib/products'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    // ... autres pages
  ]

  // Pages produits
  const productPages = products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Pages de blog
  const blogPosts = await fetchBlogPosts()
  const blogPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages, ...blogPages]
}
```

## 6. Tester les Métadonnées Localement

### Script de Test

```bash
#!/bin/bash
# test-seo.sh

echo "=== Testing Sitemap ==="
curl -s http://localhost:3000/sitemap.xml | head -20

echo -e "\n=== Testing Robots.txt ==="
curl -s http://localhost:3000/robots.txt

echo -e "\n=== Testing Home Page Metadata ==="
curl -s http://localhost:3000 | grep -E '<meta|<title' | head -10

echo -e "\n=== Testing Product Page Metadata ==="
curl -s http://localhost:3000/product/1 | grep -E '<meta|<title' | head -10

echo -e "\n=== Testing JSON-LD Schema ==="
curl -s http://localhost:3000 | grep -A 5 'application/ld+json'
```

## 7. Vérifier les Métadonnées en Production

### Commandes Utiles

```bash
# Vérifier le sitemap
curl https://grandsonclothes.com/sitemap.xml | head -20

# Vérifier robots.txt
curl https://grandsonclothes.com/robots.txt

# Vérifier les métadonnées OG
curl https://grandsonclothes.com | grep 'og:'

# Vérifier les Twitter Cards
curl https://grandsonclothes.com | grep 'twitter:'

# Vérifier les schémas JSON-LD
curl https://grandsonclothes.com | grep -A 10 'application/ld+json'
```

## 8. Ajouter des Métadonnées Conditionnelles

### Exemple: Métadonnées Basées sur l'Authentification

```typescript
// app/profile/page.tsx
import { Metadata } from 'next'
import { getSession } from '@/lib/auth'

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession()

  if (!session) {
    return {
      title: 'Profil | GRANDSON CLOTHES',
      robots: { index: false },
    }
  }

  return {
    title: `${session.user.name} | GRANDSON CLOTHES`,
    description: 'Votre profil GRANDSON CLOTHES',
    robots: { index: false },
  }
}

export default function ProfilePage() {
  // Page content
}
```

## 9. Créer un Schéma Personnalisé

### Exemple: Schéma de Localisation

```typescript
// lib/schema.ts - Ajouter cette fonction

export function generateLocalBusinessSchema(): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'GRANDSON CLOTHES',
    image: 'https://grandsonclothes.com/logo.png',
    description: 'GRANDSON CLOTHES - Streetwear authentique depuis la Guinee',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue de la Paix',
      addressLocality: 'Conakry',
      addressRegion: 'Conakry',
      postalCode: '1000',
      addressCountry: 'GN',
    },
    telephone: '+224 XXX XXX XXX',
    url: 'https://grandsonclothes.com',
    priceRange: '€€',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  }
}
```

## 10. Monitorer le SEO

### Google Search Console Integration

```typescript
// lib/seo-monitoring.ts

export async function submitSitemapToGSC(sitemapUrl: string) {
  // Utiliser l'API Google Search Console
  // https://developers.google.com/webmaster-tools/v1/sitemap/submit
}

export async function checkIndexingStatus(url: string) {
  // Vérifier l'état d'indexation
  // https://developers.google.com/webmaster-tools/v1/urlInspection/index
}

export async function getSearchAnalytics() {
  // Récupérer les données de recherche
  // https://developers.google.com/webmaster-tools/v1/searchanalytics/query
}
```

## 📝 Checklist d'Implémentation

- [ ] Ajouter des métadonnées à toutes les pages principales
- [ ] Configurer Open Graph sur toutes les pages
- [ ] Configurer Twitter Cards sur toutes les pages
- [ ] Ajouter des schémas JSON-LD appropriés
- [ ] Créer `public/og-image.png`
- [ ] Configurer `NEXT_PUBLIC_BASE_URL`
- [ ] Tester avec Google Rich Results Test
- [ ] Tester avec Facebook Sharing Debugger
- [ ] Tester avec Twitter Card Validator
- [ ] Soumettre le sitemap à Google Search Console
- [ ] Monitorer Google Search Console

## 🔗 Ressources Supplémentaires

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
