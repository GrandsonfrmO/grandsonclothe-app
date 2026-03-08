import { Metadata } from 'next'

export interface SEOMetadata {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article'
  author?: string
  publishedDate?: string
  modifiedDate?: string
}

export function generateMetadata(seo: SEOMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'
  const url = seo.url || baseUrl
  const image = seo.image || `${baseUrl}/og-image.png`

  return {
    title: seo.title,
    description: seo.description,
    keywords: ['streetwear', 'Guinee', 'fashion', 'GRANDSON CLOTHES'],
    authors: seo.author ? [{ name: seo.author }] : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: url,
      siteName: 'GRANDSON CLOTHES',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: seo.title,
          type: 'image/png',
        },
      ],
      type: seo.type || 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [image],
      creator: '@grandsonclothes',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
    ...(seo.publishedDate && {
      other: {
        'article:published_time': seo.publishedDate,
        ...(seo.modifiedDate && { 'article:modified_time': seo.modifiedDate }),
      },
    }),
  }
}

export function generateProductMetadata(product: {
  id: number
  name: string
  description: string
  price: number
  image: string
  rating: number
  category: string
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'
  const productUrl = `${baseUrl}/product/${product.id}`

  return generateMetadata({
    title: `${product.name} | GRANDSON CLOTHES`,
    description: product.description,
    image: product.image,
    url: productUrl,
    type: 'product',
    author: 'GRANDSON CLOTHES',
  })
}
