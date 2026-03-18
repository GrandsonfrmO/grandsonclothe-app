import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grandsonclothes.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/2tact', 
          '/admin', 
          '/api', 
          '/auth/login', 
          '/auth/signup', 
          '/checkout',
          '/order-confirmation',
          '/profil',
          '/profile/settings'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/*?*'], // Bloquer les URLs avec query strings pour éviter le duplicate content
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
