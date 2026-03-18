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

  // Si c'est une route admin
  if (isAdminRoute) {
    if (!token) {
      // Pas de token, rediriger vers login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      // Vérifier le token
      const decoded = verifyToken(token)
      
      if (!decoded) {
        // Token invalide, rediriger vers login
        const response = NextResponse.redirect(new URL('/auth/login', request.url))
        response.cookies.delete('auth_token')
        return response
      }

      // Vérifier si c'est un admin
      if (decoded.role !== 'admin') {
        // Pas admin, rediriger vers home
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Token valide et admin, renouveler le cookie pour prolonger la session
      const response = NextResponse.next()
      
      // Renouveler le cookie avec la même durée (30 jours)
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        path: '/',
      })

      return response
    } catch (error) {
      // Erreur de vérification, rediriger vers login
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth_token')
      return response
    }
  }

  // Pour les autres routes, continuer normalement
  return NextResponse.next()
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
