import React from "react"
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { ThemeProvider } from '@/lib/theme-context'
import { SchemaScript } from '@/components/schema-script'
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schema'
import { DynamicFavicon } from '@/components/dynamic-favicon'
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
  metadataBase: new URL(baseUrl),
  title: {
    default: 'GRANDSON CLOTHES | Streetwear Authentique Guinée',
    template: '%s | GRANDSON CLOTHES',
  },
  description: 'GRANDSON CLOTHES - La marque de streetwear leader en Guinée. Découvrez nos collections urbaines uniques, qualité premium et design authentique. Livraison Conakry et partout en Guinée.',
  keywords: [
    'streetwear Guinée', 
    'mode urbaine Afrique', 
    'vêtements Conakry', 
    'marque de vêtement guinéenne', 
    'hoodies premium', 
    't-shirt authentique',
    'Grandson Clothes',
    'luxe urbain'
  ],
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
  generator: 'Next.js',
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
    url: '/',
    siteName: 'GRANDSON CLOTHES',
    title: 'GRANDSON CLOTHES | Streetwear Authentique Guinée',
    description: 'Découvrez la nouvelle collection de streetwear authentique. Qualité premium, design unique, livraison partout en Guinée.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GRANDSON CLOTHES - Streetwear Guinée',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GRANDSON CLOTHES | Streetwear Authentique Guinée',
    description: 'Streetwear leader en Guinée. Qualité premium et design authentique.',
    images: ['/og-image.png'],
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
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const cached = localStorage.getItem('theme-colors');
                  if (cached) {
                    const colors = JSON.parse(cached);
                    const root = document.documentElement;
                      if (colors.accent) {
                      root.style.setProperty('--accent', colors.accent);
                      root.style.setProperty('--ring', colors.primary || colors.accent);
                      root.style.setProperty('--sidebar-ring', colors.primary || colors.accent);
                      root.style.setProperty('--chart-1', colors.primary || colors.accent);
                    }
                    if (colors.background) {
                      root.style.setProperty('--background', colors.background);
                    }
                    if (colors.foreground) {
                      root.style.setProperty('--foreground', colors.foreground);
                    }
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        <SchemaScript schema={generateOrganizationSchema()} />
        <SchemaScript schema={generateWebsiteSchema()} />
      </head>
      <body className={`${spaceGrotesk.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <DynamicFavicon />
                {children}
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
