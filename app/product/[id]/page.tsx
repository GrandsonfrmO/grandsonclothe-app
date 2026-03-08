import { products } from "@/lib/products"
import type { Metadata } from 'next'
import { ProductPageClient } from "./product-page-client"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return {
      title: 'Produit non trouve | GRANDSON CLOTHES',
      description: 'Le produit que vous recherchez n\'existe pas.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'
  const productUrl = `${baseUrl}/product/${product.id}`

  return {
    title: `${product.name} | GRANDSON CLOTHES`,
    description: product.description,
    keywords: [product.name, product.category, 'streetwear', 'Guinee', 'fashion'],
    openGraph: {
      title: `${product.name} | GRANDSON CLOTHES`,
      description: product.description,
      url: productUrl,
      siteName: 'GRANDSON CLOTHES',
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
      type: 'article',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | GRANDSON CLOTHES`,
      description: product.description,
      images: [product.image],
      creator: '@grandsonclothes',
    },
    alternates: {
      canonical: productUrl,
    },
  }
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductPageClient params={params} />
}
