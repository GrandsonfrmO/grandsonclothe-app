export interface SchemaOrg {
  '@context': string
  '@type': string
  [key: string]: any
}

export function generateOrganizationSchema(): SchemaOrg {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GRANDSON CLOTHES',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'GRANDSON CLOTHES - Streetwear authentique depuis la Guinee, Afrique.',
    sameAs: [
      'https://www.instagram.com/grandsonclothes',
      'https://www.facebook.com/grandsonclothes',
      'https://www.twitter.com/grandsonclothes',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@grandsonclothes.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GN',
      addressLocality: 'Conakry',
    },
  }
}

export function generateProductSchema(product: {
  id: number
  name: string
  description: string
  price: number
  image: string
  rating: number
  reviews: number
  category: string
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
      priceCurrency: 'GNF',
      price: product.price.toString(),
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews.toString(),
    },
    category: product.category,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateWebsiteSchema(): SchemaOrg {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GRANDSON CLOTHES',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
