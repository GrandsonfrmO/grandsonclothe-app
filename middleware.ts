import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Routes protégées admin - UNIQUEMENT /2tact
  const isAdminRoute = pathname.startsWith('/2tact')
  
  // Bloquer l'accès direct à /admin (rediriger vers /2tact)
  if (pathname.startsWith('/admin')) {
    const newPath = pathname.replace('/admin', '/2tact')
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // Redirections legacy FR -> EN routes
  if (pathname === '/panier') {
    return NextResponse.redirect(new URL('/cart', request.url))
  }
  if (pathname.startsWith('/produit/')) {
    const productId = pathname.split('/')[2]
    return NextResponse.redirect(new URL(`/product/${productId}`, request.url))
  }
  
  // Routes publiques qui ne nécessitent pas d'authentification
  const isPublicRoute = pathname.startsWith('/auth') || 
                       pathname === '/' || 
                       pathname.startsWith('/product') ||
                       pathname.startsWith('/search') ||
                       pathname.startsWith('/checkout') ||
                       pathname.startsWith('/order-confirmation') ||
                       pathname.startsWith('/api/products') ||
                       pathname.startsWith('/api/orders') ||
                       pathname.startsWith('/_next') ||
                       pathname.startsWith('/static')

  // Middleware response
  let response = NextResponse.next()

  // Si c'est une route admin, on peut avoir besoin de rediriger ou de modifier la réponse existante
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      const decoded = verifyToken(token)
      if (!decoded || decoded.role !== 'admin') {
        const redirectRes = NextResponse.redirect(new URL(decoded ? '/' : '/auth/login', request.url))
        if (!decoded) redirectRes.cookies.delete('auth_token')
        return redirectRes
      }
      
      // Prolonger la session
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
    } catch (error) {
      const errorRes = NextResponse.redirect(new URL('/auth/login', request.url))
      errorRes.cookies.delete('auth_token')
      return errorRes
    }
  }

  // Headers de sécurité
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // CSP de base (Configurable si besoin de plus de sources)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://v0.blob.com https://i.giphy.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://v0.blob.com;
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim()
  
  // Désactivé temporairement en dev pour éviter de bloquer des outils, mais recommandé en prod
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', cspHeader)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
