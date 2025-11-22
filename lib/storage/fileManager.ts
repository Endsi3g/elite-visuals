import { supabase } from '../supabase/client'

export interface UploadOptions {
  bucket?: string
  folder?: string
  maxSize?: number // en bytes
  allowedTypes?: string[]
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  id: string
  url: string
  publicUrl: string
  path: string
  size: number
  type: string
  name: string
  uploadedAt: number
}

class FileManager {
  private defaultBucket = 'boards'
  private maxFileSize = 50 * 1024 * 1024 // 50 MB par défaut

  /**
   * Upload un fichier vers Supabase Storage
   */
  async uploadFile(
    file: File,
    userId: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const {
      bucket = this.defaultBucket,
      folder = userId,
      maxSize = this.maxFileSize,
      allowedTypes,
      onProgress,
    } = options

    // Validation de la taille
    if (file.size > maxSize) {
      throw new Error(`Le fichier est trop volumineux (max: ${this.formatBytes(maxSize)})`)
    }

    // Validation du type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`)
    }

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    try {
      // Upload le fichier
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        throw error
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return {
        id: crypto.randomUUID(),
        url: urlData.publicUrl,
        publicUrl: urlData.publicUrl,
        path: filePath,
        size: file.size,
        type: file.type,
        name: file.name,
        uploadedAt: Date.now(),
      }
    } catch (error) {
      console.error('Erreur d\'upload:', error)
      throw new Error('Échec de l\'upload du fichier')
    }
  }

  /**
   * Upload multiple fichiers
   */
  async uploadFiles(
    files: File[],
    userId: string,
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = []
    const { onProgress } = options

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        const result = await this.uploadFile(file, userId, {
          ...options,
          onProgress: undefined, // Désactiver le progress individuel
        })
        results.push(result)

        // Mettre à jour le progress global
        if (onProgress) {
          const progress = ((i + 1) / files.length) * 100
          onProgress(progress)
        }
      } catch (error) {
        console.error(`Erreur upload ${file.name}:`, error)
        // Continuer avec les autres fichiers
      }
    }

    return results
  }

  /**
   * Supprimer un fichier
   */
  async deleteFile(path: string, bucket: string = this.defaultBucket): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur de suppression:', error)
      throw new Error('Échec de la suppression du fichier')
    }
  }

  /**
   * Supprimer multiple fichiers
   */
  async deleteFiles(paths: string[], bucket: string = this.defaultBucket): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove(paths)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur de suppression multiple:', error)
      throw new Error('Échec de la suppression des fichiers')
    }
  }

  /**
   * Lister les fichiers d'un dossier
   */
  async listFiles(
    folder: string,
    bucket: string = this.defaultBucket
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erreur de listage:', error)
      return []
    }
  }

  /**
   * Obtenir l'URL publique d'un fichier
   */
  getPublicUrl(path: string, bucket: string = this.defaultBucket): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Télécharger un fichier
   */
  async downloadFile(path: string, bucket: string = this.defaultBucket): Promise<Blob> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path)

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Erreur de téléchargement:', error)
      throw new Error('Échec du téléchargement du fichier')
    }
  }

  /**
   * Créer un bucket s'il n'existe pas
   */
  async createBucket(bucketName: string, isPublic: boolean = true): Promise<void> {
    try {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: this.maxFileSize,
      })

      if (error && error.message !== 'Bucket already exists') {
        throw error
      }
    } catch (error) {
      console.error('Erreur création bucket:', error)
      throw new Error('Échec de la création du bucket')
    }
  }

  /**
   * Valider un fichier image
   */
  validateImage(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    return allowedTypes.includes(file.type)
  }

  /**
   * Valider un fichier vidéo
   */
  validateVideo(file: File): boolean {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg']
    return allowedTypes.includes(file.type)
  }

  /**
   * Valider un fichier document
   */
  validateDocument(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    return allowedTypes.includes(file.type)
  }

  /**
   * Compresser une image avant upload
   */
  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Redimensionner si nécessaire
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Impossible de compresser l\'image'))
                return
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })

              resolve(compressedFile)
            },
            'image/jpeg',
            quality
          )
        }

        img.onerror = () => reject(new Error('Impossible de charger l\'image'))
        img.src = e.target?.result as string
      }

      reader.onerror = () => reject(new Error('Impossible de lire le fichier'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Formater la taille d'un fichier
   */
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  /**
   * Obtenir l'extension d'un fichier
   */
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  /**
   * Vérifier si un fichier est une image
   */
  isImage(filename: string): boolean {
    const ext = this.getFileExtension(filename)
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
  }

  /**
   * Vérifier si un fichier est une vidéo
   */
  isVideo(filename: string): boolean {
    const ext = this.getFileExtension(filename)
    return ['mp4', 'webm', 'ogg', 'mov'].includes(ext)
  }
}

// Instance singleton
export const fileManager = new FileManager()
