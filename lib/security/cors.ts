/**
 * Configuration CORS pour Elite Visuals
 */

// Domaines autorisés en production
const ALLOWED_ORIGINS = [
  'https://elite-visuals.vercel.app',
  'https://elitevisuals.com',
  'https://www.elitevisuals.com',
]

// En développement, autoriser localhost
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000')
  ALLOWED_ORIGINS.push('http://127.0.0.1:3000')
}

/**
 * Vérifie si une origine est autorisée
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  
  // En développement, autoriser toutes les origines localhost
  if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    return true
  }
  
  return ALLOWED_ORIGINS.includes(origin)
}

/**
 * Headers CORS pour les réponses
 */
export function getCorsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 heures
  }

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return headers
}

/**
 * Gère les requêtes OPTIONS (preflight)
 */
export function handleCorsPreflightRequest(request: Request): Response {
  const origin = request.headers.get('origin')
  
  if (!origin || !isOriginAllowed(origin)) {
    return new Response(null, { status: 403 })
  }

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  })
}

/**
 * Ajoute les headers CORS à une réponse
 */
export function addCorsHeaders(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers)
  const corsHeaders = getCorsHeaders(origin)

  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value as string)
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Headers de sécurité supplémentaires
 */
export function getSecurityHeaders(): HeadersInit {
  return {
    // Prévenir le clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Forcer HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Prévenir le MIME sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Protection XSS
    'X-XSS-Protection': '1; mode=block',
    
    // Politique de référent
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js nécessite unsafe-eval
      "style-src 'self' 'unsafe-inline'", // Tailwind nécessite unsafe-inline
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in",
      "media-src 'self' https:",
    ].join('; '),
    
    // Permissions Policy (anciennement Feature-Policy)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}
