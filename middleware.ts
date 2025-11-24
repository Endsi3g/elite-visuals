import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting simple en mémoire (pour production, utiliser Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

/**
 * Middleware Next.js pour la sécurité et l'authentification
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Vérifier si Supabase est configuré
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = supabaseUrl && supabaseKey && 
    supabaseUrl.startsWith('http') && 
    !supabaseUrl.includes('your-supabase')

  let session = null

  // Créer le client Supabase uniquement si configuré
  if (isSupabaseConfigured) {
    const supabase = createMiddlewareClient({ req, res })
    
    // Rafraîchir la session si elle existe
    const sessionData = await supabase.auth.getSession()
    session = sessionData.data.session
  }

  // Routes protégées qui nécessitent une authentification
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Routes d'authentification (accessibles uniquement si NON connecté)
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Redirection si non connecté et accès à une route protégée
  // En mode développement, permettre l'accès sans authentification
  if (isProtectedRoute && !session && process.env.NODE_ENV !== 'development') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirection si connecté et accès à une route d'auth
  if (isAuthRoute && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Rate Limiting (100 requêtes par minute par IP)
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 100

  const rateLimitData = rateLimit.get(ip)
  
  if (rateLimitData) {
    if (now < rateLimitData.resetTime) {
      if (rateLimitData.count >= maxRequests) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitData.resetTime - now) / 1000)),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitData.resetTime),
          },
        })
      }
      rateLimitData.count++
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    }
  } else {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
  }

  // Nettoyer les anciennes entrées (toutes les 5 minutes)
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime + 300000) {
        rateLimit.delete(key)
      }
    }
  }

  // Content Security Policy (CSP)
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.openai.com https://api.anthropic.com",
    "media-src 'self' blob: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join('; ')

  // Headers de sécurité
  const securityHeaders = {
    'Content-Security-Policy': cspHeader,
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-DNS-Prefetch-Control': 'on',
    'X-RateLimit-Limit': String(maxRequests),
    'X-RateLimit-Remaining': String(maxRequests - (rateLimitData?.count || 1)),
  }

  // Ajouter les headers de sécurité
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  // CORS - Autoriser les origines en développement
  if (process.env.NODE_ENV === 'development') {
    const origin = req.headers.get('origin')
    res.headers.set('Access-Control-Allow-Origin', origin || '*')
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  }

  return res
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     * - public (dossier public)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
