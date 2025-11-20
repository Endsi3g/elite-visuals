/**
 * Validation et sécurisation des uploads de fichiers
 */

// Types de fichiers autorisés
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
  document: ['application/pdf', 'text/plain', 'text/markdown'],
} as const

// Tailles maximales (en bytes)
const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 100 * 1024 * 1024, // 100 MB
  audio: 50 * 1024 * 1024, // 50 MB
  document: 20 * 1024 * 1024, // 20 MB
} as const

export interface FileValidationResult {
  valid: boolean
  error?: string
  sanitizedName?: string
  fileType?: keyof typeof ALLOWED_MIME_TYPES
}

/**
 * Valide un fichier uploadé
 */
export function validateFile(file: File): FileValidationResult {
  // Vérifier que le fichier existe
  if (!file) {
    return { valid: false, error: 'Aucun fichier fourni' }
  }

  // Vérifier le nom du fichier
  if (!file.name || file.name.length > 255) {
    return { valid: false, error: 'Nom de fichier invalide' }
  }

  // Déterminer le type de fichier
  let fileType: keyof typeof ALLOWED_MIME_TYPES | null = null
  for (const [type, mimes] of Object.entries(ALLOWED_MIME_TYPES)) {
    if ((mimes as readonly string[]).includes(file.type)) {
      fileType = type as keyof typeof ALLOWED_MIME_TYPES
      break
    }
  }

  if (!fileType) {
    return {
      valid: false,
      error: `Type de fichier non autorisé: ${file.type}. Types acceptés: images, vidéos, audio, PDF`,
    }
  }

  // Vérifier la taille
  const maxSize = MAX_FILE_SIZES[fileType]
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Maximum: ${formatBytes(maxSize)}`,
    }
  }

  // Vérifier la taille minimale (éviter les fichiers vides)
  if (file.size < 100) {
    return { valid: false, error: 'Fichier trop petit ou vide' }
  }

  // Sanitize le nom du fichier
  const sanitizedName = sanitizeFileName(file.name)

  return {
    valid: true,
    sanitizedName,
    fileType,
  }
}

/**
 * Sanitize un nom de fichier
 */
export function sanitizeFileName(fileName: string): string {
  // Retirer les caractères dangereux
  let sanitized = fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Remplacer caractères spéciaux
    .replace(/\.{2,}/g, '.') // Éviter les doubles points
    .replace(/^\./, '') // Retirer point au début
    .substring(0, 200) // Limiter la longueur

  // Ajouter un timestamp pour éviter les collisions
  const timestamp = Date.now()
  const extension = sanitized.split('.').pop()
  const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'))

  return `${nameWithoutExt}_${timestamp}.${extension}`
}

/**
 * Valide une URL
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url)
    
    // Autoriser seulement HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Protocole non autorisé. Utilisez HTTP ou HTTPS' }
    }

    // Bloquer les IPs locales en production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname
      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')
      ) {
        return { valid: false, error: 'URLs locales non autorisées en production' }
      }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'URL invalide' }
  }
}

/**
 * Formate les bytes en format lisible
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Vérifie si un fichier est une image
 */
export function isImage(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.image.includes(mimeType as any)
}

/**
 * Vérifie si un fichier est une vidéo
 */
export function isVideo(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.video.includes(mimeType as any)
}

/**
 * Vérifie si un fichier est un audio
 */
export function isAudio(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.audio.includes(mimeType as any)
}
