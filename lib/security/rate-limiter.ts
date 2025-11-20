/**
 * Rate Limiter pour les APIs IA
 * Limite le nombre de requêtes par utilisateur/IP
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMinutes: number = 1) {
    this.maxRequests = maxRequests
    this.windowMs = windowMinutes * 60 * 1000
  }

  /**
   * Vérifie si une requête est autorisée
   * @param identifier - IP ou user ID
   * @returns true si autorisé, false sinon
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    // Première requête ou fenêtre expirée
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs
      this.limits.set(identifier, { count: 1, resetTime })
      return { allowed: true, remaining: this.maxRequests - 1, resetTime }
    }

    // Limite atteinte
    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime }
    }

    // Incrémenter le compteur
    entry.count++
    this.limits.set(identifier, entry)
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime }
  }

  /**
   * Réinitialise le compteur pour un identifier
   */
  reset(identifier: string): void {
    this.limits.delete(identifier)
  }

  /**
   * Nettoie les entrées expirées (à appeler périodiquement)
   */
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.limits.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.limits.delete(key))
  }
}

// Instances pour différents types d'APIs
export const aiRateLimiter = new RateLimiter(10, 1) // 10 req/min pour IA
export const uploadRateLimiter = new RateLimiter(5, 1) // 5 uploads/min
export const generalRateLimiter = new RateLimiter(100, 1) // 100 req/min général

// Nettoyage automatique toutes les 5 minutes
setInterval(() => {
  aiRateLimiter.cleanup()
  uploadRateLimiter.cleanup()
  generalRateLimiter.cleanup()
}, 5 * 60 * 1000)

/**
 * Helper pour extraire l'IP de la requête
 */
export function getClientIdentifier(req: Request): string {
  // Essayer d'obtenir l'IP depuis les headers
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback sur un ID aléatoire (pour dev local)
  return 'unknown-' + Math.random().toString(36).substring(7)
}
