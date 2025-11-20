/**
 * Sanitization des inputs utilisateur
 * Prévention XSS, injection SQL, etc.
 */

/**
 * Sanitize une chaîne de texte pour éviter XSS
 */
export function sanitizeText(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Sanitize du HTML (permet certaines balises sûres)
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''

  // Liste blanche de balises autorisées
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3']
  const allowedAttributes = ['href', 'title', 'target']

  // Retirer les balises script et style
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Retirer les event handlers
    .replace(/on\w+='[^']*'/gi, '')

  return sanitized
}

/**
 * Sanitize un email
 */
export function sanitizeEmail(email: string): string | null {
  if (!email) return null

  const trimmed = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(trimmed)) {
    return null
  }

  return trimmed
}

/**
 * Sanitize un nom d'utilisateur
 */
export function sanitizeUsername(username: string): string | null {
  if (!username) return null

  const trimmed = username.trim()
  
  // Autoriser seulement alphanumériques, underscores et tirets
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/

  if (!usernameRegex.test(trimmed)) {
    return null
  }

  return trimmed
}

/**
 * Sanitize un numéro de téléphone
 */
export function sanitizePhone(phone: string): string | null {
  if (!phone) return null

  // Retirer tous les caractères non numériques sauf +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Vérifier le format basique
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null
  }

  return cleaned
}

/**
 * Sanitize du JSON
 */
export function sanitizeJSON(input: string): any | null {
  try {
    const parsed = JSON.parse(input)
    
    // Vérifier que c'est un objet ou un tableau
    if (typeof parsed !== 'object') {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

/**
 * Sanitize une couleur hexadécimale
 */
export function sanitizeHexColor(color: string): string | null {
  if (!color) return null

  const trimmed = color.trim()
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

  if (!hexRegex.test(trimmed)) {
    return null
  }

  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
}

/**
 * Sanitize un nombre
 */
export function sanitizeNumber(input: any, options?: {
  min?: number
  max?: number
  integer?: boolean
}): number | null {
  const num = Number(input)

  if (isNaN(num) || !isFinite(num)) {
    return null
  }

  // Vérifier si entier requis
  if (options?.integer && !Number.isInteger(num)) {
    return null
  }

  // Vérifier les limites
  if (options?.min !== undefined && num < options.min) {
    return null
  }

  if (options?.max !== undefined && num > options.max) {
    return null
  }

  return num
}

/**
 * Sanitize une date
 */
export function sanitizeDate(input: string | Date): Date | null {
  try {
    const date = new Date(input)
    
    if (isNaN(date.getTime())) {
      return null
    }

    return date
  } catch {
    return null
  }
}

/**
 * Sanitize un objet complet (récursif)
 */
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    return sanitizeText(obj)
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  if (typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeText(key)] = sanitizeObject(value)
    }
    return sanitized
  }

  return obj
}

/**
 * Valide et sanitize un prompt IA
 */
export function sanitizeAIPrompt(prompt: string, maxLength: number = 5000): string | null {
  if (!prompt) return null

  const trimmed = prompt.trim()

  // Vérifier la longueur
  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return null
  }

  // Retirer les caractères de contrôle
  const cleaned = trimmed.replace(/[\x00-\x1F\x7F]/g, '')

  return cleaned
}
