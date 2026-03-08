import React from "react"
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { SchemaScript } from '@/components/schema-script'
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schema'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-sans"
});
const bebasNeue = Bebas_Neue({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'

export const metadata: Metadata = {
  title: 'GRANDSON CLOTHES | Streetwear Guinee',
  description: 'GRANDSON CLOTHES - Streetwear authentique depuis la Guinee, Afrique. Decouvrez notre collection urbaine unique.',
  keywords: ['streetwear', 'Guinee', 'fashion', 'vêtements', 'urbain', 'Afrique'],
  authors: [{ name: 'GRANDSON CLOTHES' }],
  creator: 'GRANDSON CLOTHES',
  publisher: 'GRANDSON CLOTHES',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GRANDSON',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: baseUrl,
    siteName: 'GRANDSON CLOTHES',
    title: 'GRANDSON CLOTHES | Streetwear Guinee',
    description: 'GRANDSON CLOTHES - Streetwear authentique depuis la Guinee, Afrique. Decouvrez notre collection urbaine unique.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GRANDSON CLOTHES',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GRANDSON CLOTHES | Streetwear Guinee',
    description: 'GRANDSON CLOTHES - Streetwear authentique depuis la Guinee, Afrique.',
    images: [`${baseUrl}/og-image.png`],
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
    canonical: baseUrl,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <SchemaScript schema={generateOrganizationSchema()} />
        <SchemaScript schema={generateWebsiteSchema()} />
      </head>
      <body className={`${spaceGrotesk.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
