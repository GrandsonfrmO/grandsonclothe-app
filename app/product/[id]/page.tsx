import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2 } from "lucide-react"
import { SchemaScript } from "@/components/schema-script"
import { generateProductSchema } from "@/lib/schema"
import { products, formatPrice } from "@/lib/products"
import { ProductPageClient } from "./product-page-client"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
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
          type: 'image/jpeg',
        },
      ],
      type: 'product',
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
  'use client';
  const { id } = use(params)
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Produit non trouve</p>
      </div>
    )
  }

  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    rating: product.rating,
    reviews: product.reviews,
    category: product.category,
  })

  return (
    <>
      <SchemaScript schema={productSchema} />
      <ProductPageClient product={product} />
    </>
  )
}
