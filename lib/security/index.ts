/**
 * Module de sécurité centralisé pour Elite Visuals
 * 
 * Exporte tous les utilitaires de sécurité :
 * - Rate limiting
 * - Validation de fichiers
 * - Sanitization
 * - CORS
 */

export * from './rate-limiter'
export * from './file-validator'
export * from './sanitizer'
export * from './cors'

// Helpers de validation rapide
export { validateFile, validateUrl, sanitizeFileName } from './file-validator'
export { sanitizeText, sanitizeHTML, sanitizeEmail, sanitizeAIPrompt } from './sanitizer'
export { aiRateLimiter, uploadRateLimiter, getClientIdentifier } from './rate-limiter'
export { getCorsHeaders, getSecurityHeaders, isOriginAllowed } from './cors'
